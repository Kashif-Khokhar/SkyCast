import { useState, useEffect } from 'react';

const CACHE_KEY = "skycast_global_data";

export const useCountries = () => {
    const [countryData, setCountryData] = useState({});
    const [status, setStatus] = useState("Awaiting Context...");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initialize = async () => {
            // Attempt to load from cache
            const cached = localStorage.getItem(CACHE_KEY);
            if (cached) {
                try {
                    setCountryData(JSON.parse(cached));
                    setStatus("System Ready (Cached)");
                    setIsLoading(false);
                    return;
                } catch { localStorage.removeItem(CACHE_KEY); }
            }

            try {
                setStatus("Syncing global data...");
                const response = await fetch('https://countriesnow.space/api/v0.1/countries');
                const result = await response.json();

                if (result.error) throw new Error(result.msg);

                const data = {};
                result.data.forEach(item => {
                    data[item.country] = item.cities;
                });

                localStorage.setItem(CACHE_KEY, JSON.stringify(data));
                setCountryData(data);
                setStatus("System Ready");
            } catch (error) {
                console.error("Sync failed:", error);
                setStatus("Offline Mode Active");
                const fallback = {
                    "Pakistan": ["Lahore", "Karachi", "Islamabad"],
                    "United States": ["Washington, D.C.", "New York City", "Los Angeles"],
                    "United Kingdom": ["London", "Manchester", "Birmingham"],
                    "United Arab Emirates": ["Dubai", "Abu Dhabi"]
                };
                setCountryData(fallback);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
    }, []);

    return { countryData, status, setStatus, isLoading };
};
