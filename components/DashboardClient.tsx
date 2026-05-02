"use client";

import { SmartHeader } from "@/components/dashboard/SmartHeader";
import { StorageCommandCenter } from "@/components/dashboard/StorageCommandCenter";
import { BentoStats } from "@/components/dashboard/BentoStats";
import { FileStream } from "@/components/dashboard/FileStream";
import { Models } from "node-appwrite";

interface StorageUsage {
  used: number;
  document?: { size: number };
  image?: { size: number };
  video?: { size: number };
  audio?: { size: number };
  other?: { size: number };
}

interface CurrentUser {
  $id: string;
  accountId: string;
  fullName: string;
  email: string;
  avatar: string;
}

interface DashboardClientProps {
  totalSpace: StorageUsage;
  recentFiles: Models.DocumentList<Models.Document>;
  currentUser: CurrentUser;
  allFilesTotal: number;
}

const DashboardClient = ({
  totalSpace,
  recentFiles,
  currentUser,
  allFilesTotal,
}: DashboardClientProps) => {
  
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 px-4 sm:px-6 lg:px-8 pb-10">
      {/* 1. Smart Header (Welcome + Search) */}
      <SmartHeader 
        fullName={currentUser?.fullName || "User"}
      />

      {/* 2. Main Bento Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Storage Center & Stats (2/3 width) */}
        <div className="xl:col-span-2 flex flex-col gap-8">
            {/* Storage Health Module */}
            <StorageCommandCenter usage={totalSpace} />
            
            {/* Quick Access Stats Bento */}
            <BentoStats 
                totalFiles={allFilesTotal}
                totalSpace={totalSpace.used}
            />
        </div>

        {/* Right Column: Activity Stream (1/3 width) */}
        <div className="xl:col-span-1 h-full">
            <FileStream files={recentFiles.documents} />
        </div>
      </div>
    </div>
  );
};

export default DashboardClient;
