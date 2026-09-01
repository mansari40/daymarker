"use client";

export function SkeletonTask() {
  return (
    <div className="flex items-start gap-4 rounded-[--radius-lg] border border-border-subtle bg-bg-panel p-4">
      <div className="skeleton mt-0.5 h-5 w-5 flex-shrink-0 rounded-full" />
      <div className="flex-1 space-y-2.5">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="flex items-center gap-1.5">
          <div className="skeleton h-2.5 w-2.5 rounded-full" />
          <div className="skeleton h-2.5 w-12 rounded" />
          <div className="skeleton h-2.5 w-1.5 rounded" />
          <div className="skeleton h-2.5 w-14 rounded" />
          <div className="skeleton h-2.5 w-1.5 rounded" />
          <div className="skeleton h-2.5 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGreeting() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-3">
        <div className="skeleton h-3 w-40 rounded" />
        <div className="skeleton h-8 w-64 rounded" />
        <div className="skeleton h-4 w-52 rounded" />
      </div>
      <div className="skeleton h-11 w-32 rounded-full" />
    </div>
  );
}

export function SkeletonStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-32 rounded-[--radius-lg] bg-bg-panel border border-border-subtle p-5"
        >
          <div className="skeleton h-3 w-20 rounded" />
          <div className="skeleton mt-3 h-4 w-28 rounded" />
          <div className="skeleton mt-2 h-3 w-36 rounded" />
        </div>
      ))}
    </div>
  );
}
