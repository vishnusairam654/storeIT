import Link from "next/link";
import { FileText, Image as ImageIcon, Video, Archive } from "lucide-react";

import { Chart } from "@/components/Chart";
import WelcomeHeader from "@/components/WelcomeHeader";
import QuickStats from "@/components/QuickStats";
import ActivityTimeline from "@/components/ActivityTimeline";
import StorageBreakdown from "@/components/StorageBreakdown";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { convertFileSize, getUsageSummary } from "@/lib/utils";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { TOTAL_STORAGE_SPACE } from "@/constants";

const Dashboard = async () => {
  // Parallel requests
  const [files, totalSpace, currentUser] = await Promise.all([
    getFiles({ types: [], limit: 10 }),
    getTotalSpaceUsed(),
    getCurrentUser(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  // Helper to get icon for summary
  const getSummaryIcon = (title: string) => {
    switch (title) {
      case "Documents": return FileText;
      case "Images": return ImageIcon;
      case "Media": return Video;
      case "Others": return Archive;
      default: return FileText;
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* ... Welcome Header & Quick Stats ... */}
      <WelcomeHeader
        fullName={currentUser?.fullName || "User"}
        storageUsed={totalSpace.used}
        storageTotal={TOTAL_STORAGE_SPACE}
      />

      <QuickStats
        totalFiles={files.documents.length}
        storageUsed={totalSpace.used}
        storageTotal={TOTAL_STORAGE_SPACE}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Chart used={totalSpace.used} />

          <StorageBreakdown
            document={totalSpace.document?.size || 0}
            image={totalSpace.image?.size || 0}
            video={totalSpace.video?.size || 0}
            audio={totalSpace.audio?.size || 0}
            other={totalSpace.other?.size || 0}
            total={totalSpace.used}
          />

          <div className="grid grid-cols-2 gap-4">
            {usageSummary.map((summary, index) => {
              const Icon = getSummaryIcon(summary.title);

              return (
                <Link
                  href={summary.url}
                  key={summary.title}
                  className="group relative overflow-hidden rounded-2xl bg-surface-container-high p-4 shadow-elevation-1 transition-all hover:-translate-y-1 hover:shadow-elevation-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`absolute -right-4 -top-4 size-20 rounded-full ${summary.color} opacity-10 transition-all group-hover:scale-150 group-hover:opacity-20`} />
                  <div className="relative z-10 flex items-center gap-3">
                    <div className={`flex-center size-12 rounded-full ${summary.color} bg-opacity-10 transition-transform group-hover:scale-110`}>
                      <Icon className={`size-6 ${summary.hoverColor.replace('group-hover:', '')}`} />
                    </div>
                    <div>
                      <p className={`subtitle-2 text-light-100 transition-colors ${summary.hoverColor}`}>{summary.title}</p>
                      <p className="h4">
                        {convertFileSize(summary.size) || "0 B"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ... Right Column components ... */}
        <div className="rounded-2xl bg-white p-5 shadow-elevation-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="h3 text-light-100">Recent Activity</h2>
            <span className="caption rounded-full bg-brand/10 px-3 py-1 text-brand">
              {files.documents.length} files
            </span>
          </div>

          <ActivityTimeline files={files.documents} />

          {files.documents.length === 0 && (
            <div className="flex-center h-40 rounded-xl bg-surface-container">
              <div className="text-center">
                <p className="text-4xl">📁</p>
                <p className="body-1 mt-2 text-light-200">No files uploaded yet</p>
                <p className="caption mt-1 text-light-200">
                  Upload your first file to get started!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
