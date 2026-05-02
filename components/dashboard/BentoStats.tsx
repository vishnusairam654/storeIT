"use client";

import { calculatePercentage, convertFileSize } from "@/lib/utils";
import { FileText, HardDrive, PlaySquare, Clock } from "lucide-react";

export const BentoStats = ({ totalFiles, totalSpace }: { totalFiles: number, totalSpace: number }) => {
  const percentage = calculatePercentage(totalSpace);

  const stats = [
      {
          label: "Total Files",
          value: totalFiles.toString(),
          icon: FileText,
          color: "bg-blue-500",
          desc: "All types included"
      },
      {
          label: "Used Space",
          value: convertFileSize(totalSpace),
          icon: HardDrive,
          color: "bg-brand",
          desc: `${percentage}% of 2GB`
      },
      {
          label: "Media Files",
          value: "Video & Audio", // Placeholder, ideally specific count
          icon: PlaySquare,
          color: "bg-orange-500",
          desc: "Multimedia content"
      },
      {
          label: "Last Activity",
          value: "Just now", 
          icon: Clock,
          color: "bg-green-500",
          desc: "System updated"
      }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
          <div key={stat.label} className="group relative overflow-hidden rounded-[24px] bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-light-400/50">
              <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color}/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-opacity-20 transition-all`} />
              
              <div className="relative z-10">
                  <div className={`w-12 h-12 rounded-full ${stat.color}/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <stat.icon size={24} className={stat.color.replace('bg-', 'text-')} />
                  </div>
                  
                  <p className="text-light-200 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-light-100">{stat.value}</p>
                  <p className="text-xs text-light-200 mt-2">{stat.desc}</p>
              </div>
          </div>
      ))}
    </div>
  );
};
