import DashboardClient from "@/components/DashboardClient";
import { getFiles, getTotalSpaceUsed } from "@/lib/actions/file.actions";
import { getCurrentUser } from "@/lib/actions/user.actions";
import { TOTAL_STORAGE_SPACE } from "@/constants";

const Dashboard = async () => {
  // Parallel requests
  const [recentFiles, allFiles, totalSpace, currentUser] = await Promise.all([
    getFiles({ types: [], limit: 10 }), // Recent files for activity timeline
    getFiles({ types: [] }), // All files for accurate count
    getTotalSpaceUsed(),
    getCurrentUser(),
  ]);

  return (
    <DashboardClient
      totalSpace={totalSpace}
      recentFiles={recentFiles}
      currentUser={currentUser}
      allFilesTotal={allFiles.total}
    />
  );
};

export default Dashboard;