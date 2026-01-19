import React from "react";

const Loading = () => {
    return (
        <div className="dashboard-container animate-pulse">
            {/* Chart Skeleton */}
            <section>
                <div className="chart bg-brand/50 h-[200px] rounded-[20px]" />

                {/* Summary Cards Skeleton */}
                <ul className="dashboard-summary-list">
                    {[1, 2, 3, 4].map((i) => (
                        <li
                            key={i}
                            className="dashboard-summary-card bg-surface-container-high/50"
                        >
                            <div className="space-y-4">
                                <div className="flex justify-between gap-3">
                                    <div className="w-[100px] h-[100px] bg-brand/20 rounded-full" />
                                    <div className="h-6 w-16 bg-surface-container-highest rounded" />
                                </div>
                                <div className="h-5 w-24 bg-surface-container-highest rounded mx-auto" />
                                <div className="h-4 w-32 bg-surface-container-highest rounded mx-auto" />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Recent Files Skeleton */}
            <section className="dashboard-recent-files bg-white/50">
                <div className="h-8 w-48 bg-surface-container-highest rounded mb-5" />
                <ul className="flex flex-col gap-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <li key={i} className="flex items-center gap-3">
                            <div className="size-[50px] rounded-full bg-brand/10" />
                            <div className="flex-1">
                                <div className="h-4 w-full max-w-[200px] bg-surface-container-highest rounded mb-2" />
                                <div className="h-3 w-24 bg-surface-container-highest rounded" />
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Loading;
