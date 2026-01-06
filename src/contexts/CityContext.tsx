"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CityContextType {
    selectedCity: string;
    setSelectedCity: (city: string) => void;
    isDetectingLocation: boolean;
}

const CityContext = createContext<CityContextType | undefined>(undefined);

const CITIES = [
    "Amsterdam",
    "Rotterdam",
    "The Hague",
    "Utrecht",
    "Eindhoven",
    "Enschede",
    "Groningen"
];

// City coordinates (approximate centers)
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
    "Amsterdam": { lat: 52.3676, lon: 4.9041 },
    "Rotterdam": { lat: 51.9225, lon: 4.47917 },
    "The Hague": { lat: 52.0705, lon: 4.3007 },
    "Utrecht": { lat: 52.0907, lon: 5.1214 },
    "Eindhoven": { lat: 51.4416, lon: 5.4697 },
    "Enschede": { lat: 52.2215, lon: 6.8937 },
    "Groningen": { lat: 53.2194, lon: 6.5665 }
};

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Find nearest city based on coordinates
function findNearestCity(userLat: number, userLon: number): string {
    let nearestCity = "Amsterdam"; // Default fallback
    let minDistance = Infinity;

    for (const [city, coords] of Object.entries(CITY_COORDS)) {
        const distance = calculateDistance(userLat, userLon, coords.lat, coords.lon);
        if (distance < minDistance) {
            minDistance = distance;
            nearestCity = city;
        }
    }

    return nearestCity;
}

export function CityProvider({ children }: { children: ReactNode }) {
    const [selectedCity, setSelectedCity] = useState("Amsterdam");
    const [isDetectingLocation, setIsDetectingLocation] = useState(true);

    useEffect(() => {
        // Try to detect user's location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const nearestCity = findNearestCity(latitude, longitude);
                    console.log(`📍 Detected location: ${latitude}, ${longitude}`);
                    console.log(`🏙️ Nearest city: ${nearestCity}`);
                    setSelectedCity(nearestCity);
                    setIsDetectingLocation(false);
                },
                (error) => {
                    console.log("Geolocation not available, using default city (Amsterdam)");
                    setIsDetectingLocation(false);
                },
                {
                    timeout: 5000,
                    maximumAge: 300000, // Cache for 5 minutes
                }
            );
        } else {
            console.log("Geolocation not supported");
            setIsDetectingLocation(false);
        }
    }, []);

    return (
        <CityContext.Provider value={{ selectedCity, setSelectedCity, isDetectingLocation }}>
            {children}
        </CityContext.Provider>
    );
}

export function useCity() {
    const context = useContext(CityContext);
    if (context === undefined) {
        throw new Error('useCity must be used within a CityProvider');
    }
    return context;
}
