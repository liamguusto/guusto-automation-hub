import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { projects } from '@/data/projects'
import { StatusBadge } from '@/components/StatusBadge'
import { ProgressBar } from '@/components/ProgressBar'
import { TechStack } from '@/components/TechStack'
import { ActionItemList } from '@/components/ActionItemList'
import { VersionRoadmap } from '@/components/VersionRoadmap'
import { Header } from '@/components/Header'
import { DiagramWrapper } from '@/components/DiagramWrapper'

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  return {
    title: project ? `${project.shortTitle} · Guusto Automation Hub` : 'Project Not Found',
  }
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const doneCount = project.actionItems.filter((i) => i.done).length

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-coral transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Projects
          </Link>
        </div>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h1 className="text-xl font-bold text-warm-900 tracking-tight leading-snug">
            {project.title}
          </h1>
          <div className="flex-shrink-0 mt-0.5">
            <StatusBadge status={project.status} />
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-6">
          Last updated {formatDate(project.lastUpdated)} · {doneCount}/{project.actionItems.length} actions complete
        </p>

        {/* Progress */}
        <div className="bg-white rounded-2xl border border-warm-200 p-5 mb-4">
          <ProgressBar progress={project.progress} milestone={project.currentMilestone} />
        </div>

        {/* Description + Tech */}
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <div className="sm:col-span-2 bg-white rounded-2xl border border-warm-200 p-5">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overview</h2>
            <p className="text-sm text-warm-700 leading-relaxed">{project.description}</p>
          </div>
          <div className="bg-white rounded-2xl border border-warm-200 p-5 flex flex-col gap-4">
            <div>
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Tech Stack</h2>
              <TechStack tech={project.tech} />
            </div>
            <div className="mt-auto pt-3 border-t border-warm-100">
              <a
                href={project.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-coral hover:text-coral-dark transition-colors"
              >
                Full spec in Notion
                <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12">
                  <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Roadblocks */}
        {project.roadblocks && project.roadblocks.length > 0 && (
          <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-amber-600">⚠️</span>
              <h2 className="text-sm font-semibold text-amber-800">
                {project.roadblocks.length} Active Blocker{project.roadblocks.length > 1 ? 's' : ''}
              </h2>
            </div>
            <div className="space-y-3">
              {project.roadblocks.map((r, i) => (
                <div key={i} className="text-sm">
                  <p className="font-medium text-amber-900">{r.title}</p>
                  <p className="text-amber-700 text-xs mt-0.5">{r.impact}</p>
                  {r.workaround && (
                    <p className="text-amber-600 text-xs mt-0.5">
                      <span className="font-medium">Workaround:</span> {r.workaround}
                    </p>
                  )}
                  <p className="text-amber-500 text-xs mt-0.5">
                    <span className="font-medium">Owner:</span> {r.owner}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Architecture diagram */}
        {project.diagram && (
          <div className="mb-4">
            <DiagramWrapper chart={project.diagram} title="Architecture Diagram" />
          </div>
        )}

        {/* Action items */}
        <div className="bg-white rounded-2xl border border-warm-200 p-5 mb-4">
          <ActionItemList items={project.actionItems} />
        </div>

        {/* Roadmap */}
        <div className="bg-white rounded-2xl border border-warm-200 p-5 mb-8">
          <VersionRoadmap phases={project.roadmap} />
        </div>

        {/* Bottom CTA */}
        <div className="flex justify-center">
          <a
            href={project.notionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all hover:opacity-90 hover:shadow-md shadow-sm"
            style={{ background: 'linear-gradient(135deg, #E85D26, #F07D4A)' }}
          >
            Open full spec in Notion
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </main>

      <footer className="border-t border-warm-200 py-5 mt-4">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <Link href="/" className="hover:text-coral transition-colors">← All Projects</Link>
          <span>Internal use only</span>
        </div>
      </footer>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
}
