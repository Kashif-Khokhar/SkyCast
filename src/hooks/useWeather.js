import { useState } from 'react';

const API_KEY = "863242dc3885d51f2249e083c0f99793";
const WEATHER_CACHE_KEY = "skycast_weather_cache";

export const useWeather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [status, setStatus] = useState("Awaiting Selection");
    const [isSyncing, setIsSyncing] = useState(false);

    const fetchWeather = async (city, country) => {
        if (!city || !country) return;

        const cacheKey = `${city},${country}`.toLowerCase();
        const now = Date.now();

        // Persistent cache SWR
        const cachedStore = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || "{}");
        const cachedItem = cachedStore[cacheKey];

        if (cachedItem && (now - cachedItem.timestamp) < 300000) {
            setWeatherData(cachedItem.data);
            if ((now - cachedItem.timestamp) < 60000) {
                setStatus(`Update: ${cachedItem.data.updateTime}`);
                return;
            }
            setStatus("Refreshing data...");
        } else if (cachedItem) {
            setWeatherData(cachedItem.data);
            setStatus("Refreshing data...");
        }

        setIsSyncing(true);

        // --- SUB-REQUEST DEFINITIONS ---

        const geocode = async () => {
            const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)},${encodeURIComponent(country)}&limit=1&appid=${API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Geocoding Failed");
            const data = await res.json();
            if (!data.length) throw new Error("Location not found");
            return { lat: data[0].lat, lon: data[0].lon };
        };

        const owmFetch = async (coords) => {
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&units=metric&appid=${API_KEY}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("OWM Failed");
            const data = await res.json();
            return processWeatherData(data, city, country);
        };

        const wttrFetch = async (coords) => {
            const query = coords ? `${coords.lat},${coords.lon}` : `${city},${country}`;
            const url = `https://wttr.in/${encodeURIComponent(query)}?format=j1`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Wttr Failed");
            const data = await res.json();
            return processWttrData(data, city, country);
        };

        // --- HYPER-PARALLEL RACE ---

        try {
            const raceTargets = [];

            // 1. FAST PATH: Immediate name-based fetch (⚡ Speed focus)
            raceTargets.push(wttrFetch(null));

            // 2. DEEP PATH: Geocode then coordinate-fetch (🎯 Accuracy focus)
            const deepAccuracy = async () => {
                const coords = await geocode();
                // We race OWM-Coords and Wttr-Coords once we have the pin
                return await Promise.any([
                    owmFetch(coords),
                    wttrFetch(coords)
                ]);
            };
            raceTargets.push(deepAccuracy());

            // THE RACE: Whichever succeeds first wins.
            // If the fast path succeeds in 200ms, it renders instantly.
            // If it fails or is slow, the deep path provides the result.
            const fastestSuccessfulData = await Promise.any(raceTargets);

            saveToPersistentCache(cacheKey, fastestSuccessfulData);
            setWeatherData(fastestSuccessfulData);
            setStatus(`⚡ Accuracy Sync Active: ${fastestSuccessfulData.updateTime}`);

        } catch (error) {
            console.error("Critical failure in hyper-race:", error);
            setStatus("Data accuracy not found for this node");
        } finally {
            setIsSyncing(false);
        }
    };

    const saveToPersistentCache = (key, data) => {
        const store = JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || "{}");
        store[key] = { data, timestamp: Date.now() };
        store.last_viewed = data;
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(store));
    };

    const processWeatherData = (data, city, country) => ({
        name: data.name,
        country: country,
        tempC: Math.round(data.main.temp),
        tempF: Math.round((data.main.temp * 9 / 5) + 32),
        tempFeels: Math.round(data.main.feels_like),
        tempHigh: Math.round(data.main.temp_max),
        tempLow: Math.round(data.main.temp_min),
        condition: data.weather[0].description,
        icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        humidity: data.main.humidity,
        windSpeed: Math.round(data.wind.speed * 3.6),
        updateTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    const processWttrData = (data, city, country) => {
        const current = data.current_condition[0];
        const forecast = data.weather[0];
        return {
            name: city,
            country: country,
            tempC: parseInt(current.temp_C),
            tempF: parseInt(current.temp_F),
            tempFeels: parseInt(current.FeelsLikeC),
            tempHigh: parseInt(forecast.maxtempC),
            tempLow: parseInt(forecast.mintempC),
            condition: current.weatherDesc[0].value,
            icon: `https://openweathermap.org/img/wn/02d@2x.png`,
            humidity: current.humidity,
            windSpeed: parseInt(current.windspeedKmph),
            updateTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
    };

    const clearWeather = () => {
        setWeatherData(null);
        setStatus("Awaiting Selection");
    };

    return { weatherData, status, isSyncing, fetchWeather, clearWeather };
};
