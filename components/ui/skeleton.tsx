"use client";

import { cn } from "@/lib/utils";

type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-surface-container-highest", className)}
      {...props}
    />
  );
}

// Dashboard-specific skeletons

export function WelcomeHeaderSkeleton() {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-gradient-to-r from-brand/50 via-brand/40 to-brand-100/30 p-6 shadow-elevation-2 md:flex-row md:items-center md:justify-between animate-pulse">
      <div className="space-y-3">
        <Skeleton className="h-10 w-64 bg-white/20" />
        <Skeleton className="h-5 w-80 bg-white/15" />
      </div>
      <div className="flex items-center gap-4 rounded-2xl bg-white/10 p-4">
        <Skeleton className="size-16 rounded-full bg-white/20" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-16 bg-white/20" />
          <Skeleton className="h-3 w-24 bg-white/15" />
        </div>
      </div>
    </div>
  );
}

export function QuickStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-white p-4 shadow-elevation-1 animate-pulse"
        >
          <Skeleton className="absolute -right-4 -top-4 size-24 rounded-full opacity-20" />
          <div className="relative z-10 flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-5 w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="flex items-center rounded-[20px] bg-brand/50 p-5 text-white md:flex-col xl:flex-row animate-pulse">
      <div className="flex-1 flex justify-center">
        <Skeleton className="size-[180px] rounded-full bg-white/20 xl:size-[250px]" />
      </div>
      <div className="flex-1 px-3 py-0 sm:px-5 lg:p-3 xl:pr-5 space-y-3">
        <Skeleton className="h-6 w-40 bg-white/20" />
        <Skeleton className="h-4 w-28 bg-white/15" />
      </div>
    </div>
  );
}

export function StorageBreakdownSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-elevation-1 animate-pulse">
      <Skeleton className="h-5 w-40 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-4 rounded" />
            <Skeleton className="h-2 flex-1 rounded-full" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SummaryCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-2xl bg-surface-container-high p-4 shadow-elevation-1 animate-pulse"
        >
          <Skeleton className="absolute -right-4 -top-4 size-20 rounded-full opacity-20" />
          <div className="relative z-10 flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-14" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ActivityTimelineSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-elevation-1 animate-pulse">
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full max-w-[200px]" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FileCardSkeleton() {
  return (
    <div className="flex flex-col gap-6 rounded-[20px] bg-surface-container-high/50 p-5 border border-outline-variant/20 shadow-elevation-1 animate-pulse">
      <div className="flex justify-between">
        <Skeleton className="size-20 rounded-full" />
        <div className="flex flex-col items-end justify-between gap-2">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-full max-w-[180px]" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export function FileListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <FileCardSkeleton key={i} />
      ))}
    </div>
  );
}
