'use client'

import { useEffect, useRef, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
  title?: string
}

let mermaidInitialized = false

export function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)
  const idRef = useRef(`mermaid-${Math.random().toString(36).slice(2, 9)}`)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default

        if (!mermaidInitialized) {
          mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            fontFamily: 'Outfit, system-ui, sans-serif',
            fontSize: 13,
            flowchart: { curve: 'basis', padding: 20 },
          })
          mermaidInitialized = true
        }

        const { svg: rendered } = await mermaid.render(idRef.current, chart)
        if (!cancelled) setSvg(rendered)
      } catch {
        if (!cancelled) setError(true)
      }
    }

    render()
    return () => { cancelled = true }
  }, [chart])

  if (error) {
    return (
      <div className="rounded-lg bg-warm-100 border border-warm-200 p-4 text-sm text-gray-500 text-center">
        Diagram rendering unavailable
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white border border-warm-200 overflow-hidden">
      {title && (
        <div className="px-5 py-3 border-b border-warm-200 bg-warm-50">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
        </div>
      )}
      {svg ? (
        <div
          className="p-4 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div className="p-8 flex items-center justify-center">
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
      )}
    </div>
  )
}
