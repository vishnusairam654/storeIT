"use client";

import { useEffect, useState } from "react";

interface StatsCardProps {
    title: string;
    value: number;
    suffix?: string;
    icon: string;
    color: string;
    delay?: number;
}

const StatsCard = ({ title, value, suffix = "", icon, color, delay = 0 }: StatsCardProps) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            const duration = 1500;
            const steps = 60;
            const increment = value / steps;
            let current = 0;

            const counter = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setCount(value);
                    clearInterval(counter);
                } else {
                    setCount(Math.floor(current));
                }
            }, duration / steps);

            return () => clearInterval(counter);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return (
        <div className="group relative overflow-hidden rounded-2xl bg-white p-4 shadow-elevation-1 transition-all hover:shadow-elevation-2 hover:-translate-y-1">
            <div className={`absolute -right-4 -top-4 size-24 rounded-full opacity-10 ${color}`} />
            <div className="relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`flex-center size-10 rounded-xl ${color} bg-opacity-10`}>
                        <span className="text-xl">{icon}</span>
                    </div>
                    <div>
                        <p className="body-2 text-light-200">{title}</p>
                        <p className="h3 text-light-100">
                            {count.toLocaleString()}{suffix}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface QuickStatsProps {
    totalFiles: number;
    storageUsed: number;
    storageTotal: number;
}

const QuickStats = ({ totalFiles, storageUsed, storageTotal }: QuickStatsProps) => {
    const storagePercentage = Math.round((storageUsed / storageTotal) * 100);

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatsCard
                title="Total Files"
                value={totalFiles}
                icon="📁"
                color="bg-brand"
                delay={0}
            />
            <StatsCard
                title="Storage Used"
                value={storagePercentage}
                suffix="%"
                icon="💾"
                color="bg-blue"
                delay={100}
            />
            <StatsCard
                title="Documents"
                value={Math.floor(totalFiles * 0.4)}
                icon="📄"
                color="bg-green"
                delay={200}
            />
            <StatsCard
                title="Media Files"
                value={Math.floor(totalFiles * 0.3)}
                icon="🎬"
                color="bg-orange"
                delay={300}
            />
        </div>
    );
};

export default QuickStats;
