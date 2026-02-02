import { useState, useEffect } from 'react';

const CACHE_KEY = "skycast_global_v2_data";
const CITY_CACHE_PREFIX = "skycast_cities_";

export const useCountries = () => {
    const [countryData, setCountryData] = useState({});
    const [status, setStatus] = useState("Awaiting Context...");
    const [isLoading, setIsLoading] = useState(true);
    const [isCitiesSyncing, setIsCitiesSyncing] = useState(false);

    useEffect(() => {
        const initialize = async () => {
            const cachedBody = localStorage.getItem(CACHE_KEY);
            if (cachedBody) {
                try {
                    setCountryData(JSON.parse(cachedBody));
                    setStatus("System Ready (Elite)");
                    setIsLoading(false);
                    return;
                } catch { localStorage.removeItem(CACHE_KEY); }
            }

            try {
                setStatus("Initializing global nodes...");
                const response = await fetch('https://countriesnow.space/api/v0.1/countries');
                const result = await response.json();

                if (result.error) throw new Error(result.msg);

                const data = {};
                result.data.forEach(item => {
                    // Store empty array initially, will populate on-demand
                    data[item.country] = [];
                });

                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                setCountryData(data);
                setStatus("System Ready");
            } catch (error) {
                console.error("Global Sync failed:", error);
                setStatus("Local Mirror Active");
                setCountryData({
                    "Pakistan": [], "United States": [], "United Kingdom": [],
                    "UAE": [], "Germany": [], "France": [], "Canada": [], "Australia": []
                });
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, []);

    const syncCities = async (country) => {
        if (!country) return;

        // 1. Check persistent city cache
        const cacheKey = `${CITY_CACHE_PREFIX}${country.toLowerCase().replace(/\s+/g, '_')}`;
        const cachedCities = localStorage.getItem(cacheKey);

        if (cachedCities) {
            const parsed = JSON.parse(cachedCities);
            setCountryData(prev => ({ ...prev, [country]: parsed }));
            return;
        }

        // 2. Fetch full exhaustive list on-demand
        setIsCitiesSyncing(true);
        setStatus(`Syncing ${country} nodes...`);

        try {
            const response = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ country })
            });
            const result = await response.json();

            if (result.error) throw new Error(result.msg);

            const sortedCities = result.data.sort((a, b) => a.localeCompare(b));

            // Persist to local cache
            localStorage.setItem(cacheKey, JSON.stringify(sortedCities));

            setCountryData(prev => ({ ...prev, [country]: sortedCities }));
            setStatus("Sync Complete");
        } catch (error) {
            console.error(`City sync failed for ${country}:`, error);
            setStatus("Sync failed, retrying...");
        } finally {
            setIsCitiesSyncing(false);
        }
    };

    return { countryData, status, setStatus, isLoading, isCitiesSyncing, syncCities };
};
