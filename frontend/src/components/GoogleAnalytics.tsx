
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { settingsAPI } from '../services/api';

// Validate Google Analytics Measurement ID format (G-XXXXXXXXXX)
const isValidGAId = (id: string): boolean => {
    if (!id || typeof id !== 'string') return false;
    // GA4 Measurement ID format: G-XXXXXXXXXX (letters and numbers after G-)
    const ga4Pattern = /^G-[A-Z0-9]{10,}$/i;
    return ga4Pattern.test(id.trim());
};

export default function GoogleAnalytics() {
    const location = useLocation();
    const [initialized, setInitialized] = useState(false);
    const [gaId, setGaId] = useState<string | null>(null);
    const initAttempted = useRef(false);

    useEffect(() => {
        // Only attempt initialization once
        if (initAttempted.current) return;
        initAttempted.current = true;

        const initGA = async () => {
            try {
                // Fetch settings from your backend
                const response = await settingsAPI.get();
                const fetchedGaId = response.data?.googleAnalyticsId;

                // Validate the GA ID before attempting to initialize
                if (fetchedGaId && isValidGAId(fetchedGaId)) {
                    try {
                        ReactGA.initialize(fetchedGaId, {
                            gaOptions: {
                                debug_mode: false,
                            },
                        });
                        setGaId(fetchedGaId);
                        setInitialized(true);
                        console.log('Google Analytics Initialized with ID:', fetchedGaId);
                    } catch (gaError) {
                        console.error('ReactGA.initialize failed:', gaError);
                    }
                } else if (fetchedGaId) {
                    console.warn('Invalid Google Analytics ID format:', fetchedGaId);
                }
            } catch (error) {
                console.error('Failed to fetch settings for Google Analytics:', error);
            }
        };

        initGA();
    }, []);

    useEffect(() => {
        if (initialized && gaId) {
            try {
                // Track page view on route change
                ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
            } catch (error) {
                console.error('Failed to send pageview:', error);
            }
        }
    }, [initialized, gaId, location]);

    return null; // This component doesn't render anything
}
