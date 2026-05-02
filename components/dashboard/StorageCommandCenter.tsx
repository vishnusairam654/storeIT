"use client";

import { motion } from "framer-motion";
import { calculatePercentage, convertFileSize } from "@/lib/utils";
import { useEffect, useState } from "react";

interface StorageUsage {
    used: number;
    document?: { size: number };
    image?: { size: number };
    video?: { size: number };
    audio?: { size: number };
    other?: { size: number };
}

interface StorageCommandCenterProps {
    usage: StorageUsage;
}

export const StorageCommandCenter = ({ usage }: StorageCommandCenterProps) => {
    const totalUsed = usage.used || 0;
    const totalCapacity = 2 * 1024 * 1024 * 1024; // 2GB
    const percentage = calculatePercentage(totalUsed);
    
    // Categories for breakdown
    const categories = [
        { name: "Documents", size: usage.document?.size || 0, color: "bg-green-500", text: "text-green-500", icon: "📄" },
        { name: "Images", size: usage.image?.size || 0, color: "bg-blue-500", text: "text-blue-500", icon: "🖼️" },
        { name: "Media", size: (usage.video?.size || 0) + (usage.audio?.size || 0), color: "bg-orange-500", text: "text-orange-500", icon: "🎬" },
        { name: "Others", size: usage.other?.size || 0, color: "bg-pink-500", text: "text-pink-500", icon: "📦" },
    ];

    // Animation state
    const [animatedPercentage, setAnimatedPercentage] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => setAnimatedPercentage(percentage), 500);
        return () => clearTimeout(timer);
    }, [percentage]);

    // Simple Chart Logic
    const size = 200;
    const strokeWidth = 24;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (animatedPercentage / 100) * circumference;

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[32px] bg-brand text-white p-8 md:p-10 shadow-elevation-2"
        >
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                
                {/* Left: Main Chart Area */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative mb-6">
                         {/* Chart SVG */}
                        <svg width={size} height={size} className="transform -rotate-90 filter drop-shadow-2xl">
                             {/* Track */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="rgba(255,255,255,0.1)"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                             {/* Indicator */}
                            <motion.circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="url(#gradient)"
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                animate={{ strokeDashoffset }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                            />
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#FA7275" />
                                    <stop offset="100%" stopColor="#FA7275" stopOpacity="0.8" />
                                </linearGradient>
                            </defs>
                        </svg>
                        
                        {/* Center Text */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                             <span className="text-5xl font-bold tracking-tighter">{animatedPercentage.toFixed(0)}<span className="text-3xl text-white/50">%</span></span>
                             <span className="text-sm font-medium text-white/50 uppercase tracking-widest mt-1">Used</span>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-3xl font-bold">{convertFileSize(totalUsed)} <span className="text-lg text-white/50 font-medium">/ 2 GB</span></p>
                        <p className="text-white/40 text-sm mt-1">Available Storage</p>
                    </div>
                </div>

                {/* Right: Detailed Breakdown */}
                <div className="flex flex-col gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">Storage Details</h2>
                        <p className="text-white/50">Your storage distribution by usage.</p>
                    </div>

                    <div className="space-y-5">
                        {categories.map((cat, i) => (
                            <div key={cat.name} className="group">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg shadow-inner ${cat.text}`}>
                                            {cat.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-lg">{cat.name}</p>
                                            <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors">{cat.size > 0 ? ((cat.size / totalUsed) * 100).toFixed(1) : 0}% of usage</p>
                                        </div>
                                    </div>
                                    <p className="font-bold text-lg">{convertFileSize(cat.size)}</p>
                                </div>
                                {/* Bar */}
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(cat.size / totalCapacity) * 100 * 3}%` }} // Adjusted scale for visualization
                                        transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                                        className={`h-full ${cat.color} glow-sm`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};
