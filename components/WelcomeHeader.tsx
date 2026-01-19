"use client";

import { useState, useEffect } from "react";

interface WelcomeHeaderProps {
    fullName: string;
    storageUsed: number;
    storageTotal: number;
}

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
};

const WelcomeHeader = ({ fullName, storageUsed, storageTotal }: WelcomeHeaderProps) => {
    const [greeting, setGreeting] = useState("Welcome");
    const firstName = fullName.split(" ")[0];
    const storagePercentage = Math.round((storageUsed / storageTotal) * 100);

    // Set greeting on client side only to avoid hydration mismatch
    useEffect(() => {
        setGreeting(getGreeting());
    }, []);

    return (
        <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-brand via-brand/90 to-brand-100/50 p-6 text-white shadow-elevation-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
                <h1 className="h1 animate-fade-in-up">
                    {greeting}, <span className="text-brand-100">{firstName}</span>! 👋
                </h1>
                <p className="body-1 text-white/80">
                    Here&apos;s what&apos;s happening with your files today.
                </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
                <div className="relative size-16">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                        <path
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="rgba(255,255,255,0.2)"
                            strokeWidth="3"
                        />
                        <path
                            d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="white"
                            strokeWidth="3"
                            strokeDasharray={`${storagePercentage}, 100`}
                            className="transition-all duration-1000"
                        />
                    </svg>
                    <span className="absolute inset-0 flex-center text-sm font-bold">
                        {storagePercentage}%
                    </span>
                </div>
                <div>
                    <p className="subtitle-2">Storage</p>
                    <p className="body-2 text-white/70">
                        {((storageUsed / 1024 / 1024 / 1024) || 0).toFixed(1)}GB of 2GB
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WelcomeHeader;
