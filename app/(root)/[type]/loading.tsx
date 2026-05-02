import { Skeleton, FileListSkeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="page-container">
      <section className="w-full">
        {/* Page Title Skeleton */}
        <Skeleton className="h-10 w-32 mb-4" />

        <div className="total-size-section">
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>

          <div className="sort-container">
            <Skeleton className="h-5 w-16 hidden sm:block" />
            <Skeleton className="h-11 w-[210px] rounded-lg" />
          </div>
        </div>
      </section>

      {/* File Cards Grid Skeleton */}
      <FileListSkeleton count={8} />
    </div>
  );
};

export default Loading;
