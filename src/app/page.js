// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import { auth, analytics } from "@/firebase-config"; // Import auth and analytics
import { isSupported } from "firebase/analytics"; // Import isSupported
import Image from "next/image";
import AppRouter from "./Router"; // Import the Router component
import Loading from "@/app/components/Loading";


export default function Home() {
    const [isAnalyticsReady, setIsAnalyticsReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // New loading state
    const [user, setUser] = useState(null); // State to track user

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user); // Update user state when authentication state changes
        });

        return () => unsubscribe(); // Clean up subscription on unmount
    }, []);

    useEffect(() => {
        const checkAnalytics = async () => {
            const supported = await isSupported(); // Call isSupported after importing it
            setIsAnalyticsReady(supported);
            setIsLoading(false); // Stop loading in both cases
        };
        checkAnalytics();
    }, []);

    if (isLoading) {
        return <Loading />; // Show loading state while waiting for analytics
    }

    return (
        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
                    <AppRouter />
            </main>
        </div>
    );
}
