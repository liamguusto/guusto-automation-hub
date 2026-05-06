'use client'

import dynamic from 'next/dynamic'

const MermaidDiagram = dynamic(
  () => import('@/components/MermaidDiagram').then((m) => ({ default: m.MermaidDiagram })),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-xl bg-white border border-warm-200 p-8 flex items-center justify-center">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-warm-200 animate-pulse"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    ),
  }
)

export function DiagramWrapper({ chart, title }: { chart: string; title?: string }) {
  return <MermaidDiagram chart={chart} title={title} />
}
