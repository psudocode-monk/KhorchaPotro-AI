export default function Input({ label, error, rightElement, ...props }) {
  return (
    <div className="flex flex-col space-y-1">
      {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>}
      <div className="relative group">
        <input
          className={`w-full px-4 py-2.5 bg-white/40 dark:bg-black/20 backdrop-blur-md border border-gray-200/50 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 focus:bg-white/60 dark:focus:bg-black/40 outline-none transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500/70 dark:placeholder-gray-400/70 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] ${rightElement ? 'pr-10' : ''}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-xs text-red-400">{error}</span>}
    </div>
  );
}
