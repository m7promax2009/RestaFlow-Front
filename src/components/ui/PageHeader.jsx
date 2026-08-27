export default function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4 dark:border-gray-800">
      <div>
        <h1 className="font-display text-2xl font-bold bg-gradient-to-r from-[#111827] via-[#F97316] to-[#EA580C] bg-clip-text text-transparent dark:from-white dark:via-orange-400 dark:to-amber-400">
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-xs font-medium text-[#6B7280] dark:text-gray-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}
