/**
 * Google Analytics Data API (GA4) Service
 * Credentials stored entirely in environment variables.
 *
 * Required env vars:
 *   GA4_CLIENT_EMAIL  -- service account email from JSON key file
 *   GA4_PRIVATE_KEY   -- private key from JSON key file (\n escaped as \\n in .env)
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';

function createAnalyticsClient(): BetaAnalyticsDataClient {
    const clientEmail = process.env.GA4_CLIENT_EMAIL;
    const privateKey = process.env.GA4_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!clientEmail || !privateKey) {
        throw new Error(
            'GA4 credentials missing. Set GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY in your .env file.'
        );
    }

    return new BetaAnalyticsDataClient({
        credentials: {
            client_email: clientEmail,
            private_key: privateKey,
        },
    });
}

export interface GA4MetricRow {
    date: string;
    sessions: number;
    activeUsers: number;
    pageViews: number;
    eventCount: number;
}

export interface TopPage {
    pagePath: string;
    pageTitle: string;
    screenPageViews: number;
}

export interface CountryRow {
    country: string;
    activeUsers: number;
}

export interface GA4AnalyticsData {
    // Summary cards (last 30 days)
    totalSessions: number;
    totalUsers: number;
    totalPageViews: number;
    totalEventCount: number;
    avgSessionDuration: string;
    bounceRate: string;
    newUsers: number;

    // Real-time
    activeUsersRightNow: number;

    // 7-day trend (matches GA4 home chart)
    sevenDayTrend: GA4MetricRow[];

    // 28-day trend for detailed view
    dailyTrend: GA4MetricRow[];

    // Top 8 pages by views
    topPages: TopPage[];

    // Top countries by active users
    topCountries: CountryRow[];

    // Meta
    propertyId: string;
    fetchedAt: string;
}

function safeNum(value: string | null | undefined): number {
    const n = parseFloat(value ?? '0');
    return isNaN(n) ? 0 : Math.round(n);
}

function formatDuration(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return `${m}m ${s}s`;
}

function formatBounceRate(rate: number): string {
    return `${(rate * 100).toFixed(1)}%`;
}

function parseDate(dateRaw: string): string {
    return dateRaw.length === 8
        ? `${dateRaw.slice(0, 4)}-${dateRaw.slice(4, 6)}-${dateRaw.slice(6, 8)}`
        : dateRaw;
}

export async function fetchGA4Data(propertyId: string): Promise<GA4AnalyticsData> {
    if (!propertyId || !/^\d+$/.test(propertyId.trim())) {
        throw new Error(`Invalid GA4 Property ID: "${propertyId}". Must be numeric.`);
    }

    const client = createAnalyticsClient();
    const property = `properties/${propertyId.trim()}`;

    const [summaryRes, sevenDayRes, twentyEightDayRes, topPagesRes, countriesRes, realtimeRes] =
        await Promise.all([
            // 1. Summary metrics — last 30 days
            client.runReport({
                property,
                dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
                metrics: [
                    { name: 'sessions' },
                    { name: 'activeUsers' },
                    { name: 'screenPageViews' },
                    { name: 'eventCount' },
                    { name: 'averageSessionDuration' },
                    { name: 'bounceRate' },
                    { name: 'newUsers' },
                ],
            }),

            // 2. 7-day daily trend (matches GA4 home chart)
            client.runReport({
                property,
                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'date' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'eventCount' },
                    { name: 'screenPageViews' },
                    { name: 'sessions' },
                ],
                orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
            }),

            // 3. 28-day daily trend
            client.runReport({
                property,
                dateRanges: [{ startDate: '28daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'date' }],
                metrics: [
                    { name: 'activeUsers' },
                    { name: 'eventCount' },
                    { name: 'screenPageViews' },
                    { name: 'sessions' },
                ],
                orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
            }),

            // 4. Top 8 pages by views
            client.runReport({
                property,
                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
                metrics: [{ name: 'screenPageViews' }],
                orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
                limit: 8,
            }),

            // 5. Top countries
            client.runReport({
                property,
                dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
                dimensions: [{ name: 'country' }],
                metrics: [{ name: 'activeUsers' }],
                orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
                limit: 8,
            }),

            // 6. Real-time active users
            client.runRealtimeReport({
                property,
                metrics: [{ name: 'activeUsers' }],
            }),
        ]);

    // Parse summary
    const summaryRow = summaryRes[0]?.rows?.[0]?.metricValues ?? [];
    const totalSessions         = safeNum(summaryRow[0]?.value);
    const totalUsers            = safeNum(summaryRow[1]?.value);
    const totalPageViews        = safeNum(summaryRow[2]?.value);
    const totalEventCount       = safeNum(summaryRow[3]?.value);
    const avgSessionDurationSec = parseFloat(summaryRow[4]?.value ?? '0');
    const bounceRateRaw         = parseFloat(summaryRow[5]?.value ?? '0');
    const newUsers              = safeNum(summaryRow[6]?.value);

    // Parse 7-day trend
    const sevenDayTrend: GA4MetricRow[] = (sevenDayRes[0]?.rows ?? []).map((row) => ({
        date:        parseDate(row.dimensionValues?.[0]?.value ?? ''),
        activeUsers: safeNum(row.metricValues?.[0]?.value),
        eventCount:  safeNum(row.metricValues?.[1]?.value),
        pageViews:   safeNum(row.metricValues?.[2]?.value),
        sessions:    safeNum(row.metricValues?.[3]?.value),
    }));

    // Parse 28-day trend
    const dailyTrend: GA4MetricRow[] = (twentyEightDayRes[0]?.rows ?? []).map((row) => ({
        date:        parseDate(row.dimensionValues?.[0]?.value ?? ''),
        activeUsers: safeNum(row.metricValues?.[0]?.value),
        eventCount:  safeNum(row.metricValues?.[1]?.value),
        pageViews:   safeNum(row.metricValues?.[2]?.value),
        sessions:    safeNum(row.metricValues?.[3]?.value),
    }));

    // Parse top pages
    const topPages: TopPage[] = (topPagesRes[0]?.rows ?? []).map((row) => ({
        pagePath:        row.dimensionValues?.[0]?.value ?? '/',
        pageTitle:       row.dimensionValues?.[1]?.value ?? '(not set)',
        screenPageViews: safeNum(row.metricValues?.[0]?.value),
    }));

    // Parse countries
    const topCountries: CountryRow[] = (countriesRes[0]?.rows ?? []).map((row) => ({
        country:     row.dimensionValues?.[0]?.value ?? 'Unknown',
        activeUsers: safeNum(row.metricValues?.[0]?.value),
    }));

    // Parse real-time
    const activeUsersRightNow = safeNum(
        realtimeRes[0]?.rows?.[0]?.metricValues?.[0]?.value
    );

    return {
        totalSessions,
        totalUsers,
        totalPageViews,
        totalEventCount,
        avgSessionDuration: formatDuration(avgSessionDurationSec),
        bounceRate: formatBounceRate(bounceRateRaw),
        newUsers,
        activeUsersRightNow,
        sevenDayTrend,
        dailyTrend,
        topPages,
        topCountries,
        propertyId: propertyId.trim(),
        fetchedAt:  new Date().toISOString(),
    };
}