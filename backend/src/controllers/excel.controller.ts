import { Request, Response } from 'express';
import ExcelJS from 'exceljs';
import { Podcast } from '../models/Podcast';

/**
 * Export all podcasts to Excel with comprehensive dashboard
 */
export const exportPodcastsToExcel = async (req: Request, res: Response) => {
    try {
        // Fetch all podcasts from database
        const podcasts = await Podcast.find({})
            .sort({ episodeNumber: -1 })
            .lean();

        console.log(`[Excel Export] Fetched ${podcasts.length} podcasts from database`);

        if (podcasts.length === 0) {
            console.warn('[Excel Export] No podcasts found in database');
            res.status(404).json({ message: 'No podcasts found to export' });
            return;
        }

        // Create a new workbook
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'Business Talk';
        workbook.created = new Date();
        workbook.modified = new Date();

        // ===== SHEET 1: Dashboard Summary =====
        const dashboardSheet = workbook.addWorksheet('Dashboard', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 3 }]
        });

        // Dashboard Title
        dashboardSheet.mergeCells('A1:H1');
        const titleCell = dashboardSheet.getCell('A1');
        titleCell.value = 'BUSINESS TALK PODCAST DASHBOARD';
        titleCell.font = { size: 20, bold: true, color: { argb: 'FFFFFFFF' } };
        titleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF8B0000' } // Maroon
        };
        titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        dashboardSheet.getRow(1).height = 40;

        // Statistics Row
        const totalPodcasts = podcasts.length;
        const upcomingPodcasts = podcasts.filter(p => p.category === 'upcoming').length;
        const pastPodcasts = podcasts.filter(p => p.category === 'past').length;
        const withYouTube = podcasts.filter(p => p.youtubeUrl).length;
        const withSpotify = podcasts.filter(p => p.spotifyUrl).length;
        const withApple = podcasts.filter(p => p.applePodcastUrl).length;

        dashboardSheet.getRow(3).values = [
            'Total Podcasts',
            'Past Podcasts',
            'Upcoming Podcasts',
            'YouTube Links',
            'Spotify Links',
            'Apple Podcast Links',
            'Amazon Music',
            'Audible'
        ];

        dashboardSheet.getRow(4).values = [
            totalPodcasts,
            pastPodcasts,
            upcomingPodcasts,
            withYouTube,
            withSpotify,
            withApple,
            podcasts.filter(p => p.amazonMusicUrl).length,
            podcasts.filter(p => p.audibleUrl).length
        ];

        // Style statistics
        [3, 4].forEach(rowNum => {
            const row = dashboardSheet.getRow(rowNum);
            row.eachCell((cell) => {
                cell.font = { bold: true };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                if (rowNum === 3) {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFD3D3D3' }
                    };
                } else {
                    cell.fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FFF0F0F0' }
                    };
                    cell.font = { bold: true, size: 14, color: { argb: 'FF8B0000' } };
                }
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
            row.height = 25;
        });

        // Set column widths for dashboard
        dashboardSheet.columns = [
            { width: 18 }, { width: 18 }, { width: 20 }, { width: 18 },
            { width: 18 }, { width: 22 }, { width: 18 }, { width: 18 }
        ];

        // ===== SHEET 2: All Podcasts =====
        const allPodcastsSheet = workbook.addWorksheet('All Podcasts', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        });

        // Headers
        const headers = [
            'Episode #',
            'Title',
            'Category',
            'Status',
            'Guest Name(s)',
            'Guest Title(s)',
            'Institution(s)',
            'Scheduled Date',
            'Scheduled Time',
            'YouTube',
            'Spotify',
            'Apple Podcasts',
            'Amazon Music',
            'Audible',
            'SoundCloud',
            'Earth',
            'Tags',
            'Rescheduled',
            'Created At',
            'Updated At'
        ];

        allPodcastsSheet.getRow(1).values = headers;

        // Style headers
        const headerRow = allPodcastsSheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF8B0000' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 30;

        // Add data rows
        console.log(`[Excel Export] Adding ${podcasts.length} podcasts to All Podcasts sheet`);
        podcasts.forEach((podcast, index) => {
            // Get guest information
            let guestNames = '';
            let guestTitles = '';
            let institutions = '';

            if (podcast.guests && podcast.guests.length > 0) {
                guestNames = podcast.guests.map(g => g.name).join(', ');
                guestTitles = podcast.guests.map(g => g.title).join(', ');
                institutions = podcast.guests.map(g => g.institution || '').filter(i => i).join(', ');
            } else if (podcast.guestName) {
                guestNames = podcast.guestName;
                guestTitles = podcast.guestTitle || '';
                institutions = podcast.guestInstitution || '';
            }

            const row = allPodcastsSheet.addRow([
                podcast.episodeNumber || '',
                podcast.title || '',
                podcast.category || '',
                podcast.category === 'upcoming' ? 'Upcoming' : 'Published',
                guestNames,
                guestTitles,
                institutions,
                podcast.scheduledDate ? new Date(podcast.scheduledDate).toLocaleDateString('en-US') : '',
                podcast.scheduledTime || '',
                podcast.youtubeUrl || '',
                podcast.spotifyUrl || '',
                podcast.applePodcastUrl || '',
                podcast.amazonMusicUrl || '',
                podcast.audibleUrl || '',
                podcast.soundcloudUrl || '',
                podcast.earthUrl || '',
                podcast.tags ? podcast.tags.join(', ') : '',
                podcast.isRescheduled ? 'Yes' : 'No',
                podcast.createdAt ? new Date(podcast.createdAt).toLocaleDateString('en-US') : '',
                podcast.updatedAt ? new Date(podcast.updatedAt).toLocaleDateString('en-US') : ''
            ]);

            // Alternate row colors
            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF9F9F9' }
                };
            }

            // Add borders
            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', wrapText: true };
            });

            // Color code status
            const statusCell = row.getCell(4);
            if (podcast.category === 'upcoming') {
                statusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFD700' } // Gold
                };
                statusCell.font = { bold: true };
            } else {
                statusCell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FF90EE90' } // Light green
                };
                statusCell.font = { bold: true };
            }
        });

        // Set column widths
        allPodcastsSheet.columns = [
            { width: 12 }, { width: 40 }, { width: 12 }, { width: 12 },
            { width: 25 }, { width: 30 }, { width: 25 }, { width: 15 },
            { width: 15 }, { width: 10 }, { width: 10 }, { width: 15 },
            { width: 15 }, { width: 10 }, { width: 12 }, { width: 10 },
            { width: 30 }, { width: 12 }, { width: 15 }, { width: 15 }
        ];

        // ===== SHEET 3: Upcoming Podcasts =====
        const upcomingSheet = workbook.addWorksheet('Upcoming Podcasts', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        });

        upcomingSheet.getRow(1).values = headers;
        const upcomingHeaderRow = upcomingSheet.getRow(1);
        upcomingHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        upcomingHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF8C00' } // Dark orange
        };
        upcomingHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
        upcomingHeaderRow.height = 30;

        const upcomingPodcastsList = podcasts.filter(p => p.category === 'upcoming');
        console.log(`[Excel Export] Adding ${upcomingPodcastsList.length} upcoming podcasts to Upcoming Podcasts sheet`);
        upcomingPodcastsList.forEach((podcast, index) => {
            let guestNames = '';
            let guestTitles = '';
            let institutions = '';

            if (podcast.guests && podcast.guests.length > 0) {
                guestNames = podcast.guests.map(g => g.name).join(', ');
                guestTitles = podcast.guests.map(g => g.title).join(', ');
                institutions = podcast.guests.map(g => g.institution || '').filter(i => i).join(', ');
            } else if (podcast.guestName) {
                guestNames = podcast.guestName;
                guestTitles = podcast.guestTitle || '';
                institutions = podcast.guestInstitution || '';
            }

            const row = upcomingSheet.addRow([
                podcast.episodeNumber || '',
                podcast.title || '',
                podcast.category || '',
                'Upcoming',
                guestNames,
                guestTitles,
                institutions,
                podcast.scheduledDate ? new Date(podcast.scheduledDate).toLocaleDateString('en-US') : '',
                podcast.scheduledTime || '',
                podcast.youtubeUrl || '',
                podcast.spotifyUrl || '',
                podcast.applePodcastUrl || '',
                podcast.amazonMusicUrl || '',
                podcast.audibleUrl || '',
                podcast.soundcloudUrl || '',
                podcast.earthUrl || '',
                podcast.tags ? podcast.tags.join(', ') : '',
                podcast.isRescheduled ? 'Yes' : 'No',
                podcast.createdAt ? new Date(podcast.createdAt).toLocaleDateString('en-US') : '',
                podcast.updatedAt ? new Date(podcast.updatedAt).toLocaleDateString('en-US') : ''
            ]);

            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFFF8DC' }
                };
            }

            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', wrapText: true };
            });
        });

        upcomingSheet.columns = allPodcastsSheet.columns;

        // ===== SHEET 4: Past Podcasts =====
        const pastSheet = workbook.addWorksheet('Past Podcasts', {
            views: [{ state: 'frozen', xSplit: 0, ySplit: 1 }]
        });

        pastSheet.getRow(1).values = headers;
        const pastHeaderRow = pastSheet.getRow(1);
        pastHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        pastHeaderRow.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF228B22' } // Forest green
        };
        pastHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
        pastHeaderRow.height = 30;

        const pastPodcastsList = podcasts.filter(p => p.category === 'past');
        console.log(`[Excel Export] Adding ${pastPodcastsList.length} past podcasts to Past Podcasts sheet`);
        pastPodcastsList.forEach((podcast, index) => {
            let guestNames = '';
            let guestTitles = '';
            let institutions = '';

            if (podcast.guests && podcast.guests.length > 0) {
                guestNames = podcast.guests.map(g => g.name).join(', ');
                guestTitles = podcast.guests.map(g => g.title).join(', ');
                institutions = podcast.guests.map(g => g.institution || '').filter(i => i).join(', ');
            } else if (podcast.guestName) {
                guestNames = podcast.guestName;
                guestTitles = podcast.guestTitle || '';
                institutions = podcast.guestInstitution || '';
            }

            const row = pastSheet.addRow([
                podcast.episodeNumber || '',
                podcast.title || '',
                podcast.category || '',
                'Published',
                guestNames,
                guestTitles,
                institutions,
                podcast.scheduledDate ? new Date(podcast.scheduledDate).toLocaleDateString('en-US') : '',
                podcast.scheduledTime || '',
                podcast.youtubeUrl || '',
                podcast.spotifyUrl || '',
                podcast.applePodcastUrl || '',
                podcast.amazonMusicUrl || '',
                podcast.audibleUrl || '',
                podcast.soundcloudUrl || '',
                podcast.earthUrl || '',
                podcast.tags ? podcast.tags.join(', ') : '',
                podcast.isRescheduled ? 'Yes' : 'No',
                podcast.createdAt ? new Date(podcast.createdAt).toLocaleDateString('en-US') : '',
                podcast.updatedAt ? new Date(podcast.updatedAt).toLocaleDateString('en-US') : ''
            ]);

            if (index % 2 === 0) {
                row.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFF0FFF0' }
                };
            }

            row.eachCell((cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', wrapText: true };
            });
        });

        pastSheet.columns = allPodcastsSheet.columns;

        // Set response headers for file download
        const fileName = `Business_Talk_Podcasts_${new Date().toISOString().split('T')[0]}.xlsx`;
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Write to response
        await workbook.xlsx.write(res);
        res.end();

        console.log(`[Excel Export] ✅ Successfully generated and sent ${fileName}`);

    } catch (error) {
        console.error('Error exporting podcasts to Excel:', error);
        res.status(500).json({
            message: 'Error exporting podcasts to Excel',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
