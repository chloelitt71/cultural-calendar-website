export function Spinner({ label }: { label: string }) {
  return (
    <div className="saas-panel-soft flex items-center gap-3 rounded-2xl p-4 text-sm text-zinc-300">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-[#e8d5a3]" />
      <span>{label}</span>
    </div>
  );
}
