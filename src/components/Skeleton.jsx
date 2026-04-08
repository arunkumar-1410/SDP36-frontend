import React from 'react';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={`bg-slate-200 animate-pulse rounded-md ${className}`}
      {...props}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
    <Skeleton className="h-48 w-full rounded-2xl" />
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-5/6" />
    <div className="flex justify-between items-center pt-4">
      <Skeleton className="h-10 w-24 rounded-xl" />
      <Skeleton className="h-5 w-16" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
      <Skeleton className="h-32 rounded-2xl" />
    </div>
    <div className="space-y-4">
      <Skeleton className="h-6 w-32" />
      <div className="space-y-2">
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
        <Skeleton className="h-16 w-full rounded-xl" />
      </div>
    </div>
  </div>
);
