import {
  WelcomeHeaderSkeleton,
  QuickStatsSkeleton,
  ChartSkeleton,
  StorageBreakdownSkeleton,
  SummaryCardsSkeleton,
  ActivityTimelineSkeleton,
} from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Welcome Header Skeleton */}
      <WelcomeHeaderSkeleton />

      {/* Quick Stats Skeleton */}
      <QuickStatsSkeleton />

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Chart Skeleton */}
          <ChartSkeleton />

          {/* Storage Breakdown Skeleton */}
          <StorageBreakdownSkeleton />

          {/* Summary Cards Skeleton */}
          <SummaryCardsSkeleton />
        </div>

        {/* Right Column - Activity Timeline */}
        <ActivityTimelineSkeleton />
      </div>
    </div>
  );
};

export default Loading;
