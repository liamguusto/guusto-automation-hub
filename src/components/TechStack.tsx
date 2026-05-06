export function TechStack({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.map((t) => (
        <span
          key={t}
          className="px-2 py-0.5 rounded text-xs font-medium bg-warm-100 text-warm-700 border border-warm-200"
        >
          {t}
        </span>
      ))}
    </div>
  )
}
