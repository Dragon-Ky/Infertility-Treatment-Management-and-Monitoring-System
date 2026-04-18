export const BlogSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-2xl border border-slate-100 bg-white">
    <div className="h-52 w-full bg-slate-200" />
    <div className="space-y-4 p-6">
      <div className="flex gap-4">
        <div className="h-3 w-20 rounded bg-slate-200" />
        <div className="h-3 w-20 rounded bg-slate-200" />
      </div>
      <div className="h-6 w-3/4 rounded bg-slate-200" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-slate-200" />
        <div className="h-3 w-5/6 rounded bg-slate-200" />
      </div>
      <div className="h-10 w-full rounded-xl bg-slate-100" />
    </div>
  </div>
);
