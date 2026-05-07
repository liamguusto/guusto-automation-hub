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

const STATUS_BAR: Record<string, string> = {
  'planning':            'bg-gray-300',
  'in-progress':         'bg-gradient-to-r from-[#53C2BE] to-[#6DCFCC]',
  'research-complete':   'bg-blue-500',
  'live':                'bg-emerald-500',
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const doneCount    = project.actionItems.filter((i) => i.done).length
  const pendingItems = project.actionItems.filter((i) => !i.done)
  const isNearLaunch = project.progress >= 80 && pendingItems.length > 0 && pendingItems.length <= 5

  const initials = (project.owner ?? 'Liam Shandro')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen flex flex-col bg-warm-50">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-8">

        {/* Breadcrumb */}
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-[#53C2BE] transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
              <path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Projects
          </Link>
        </div>

        {/* ── Hero card ── */}
        <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-sm mb-6">
          <div className={`h-1.5 ${STATUS_BAR[project.status]}`} />
          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-6 mb-5">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-bold text-warm-900 tracking-tight leading-snug mb-3">
                  {project.title}
                </h1>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={project.status} />
                  {project.highlights?.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warm-100 text-warm-700 border border-warm-200"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-3xl font-black text-warm-900 tabular-nums leading-none">
                  {project.progress}
                  <span className="text-base font-semibold text-gray-400 ml-0.5">%</span>
                </div>
                <div className="text-xs text-gray-400 mt-0.5">complete</div>
              </div>
            </div>
            <ProgressBar progress={project.progress} milestone={project.currentMilestone} />
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_288px] gap-5">

          {/* Left column */}
          <div className="space-y-5 min-w-0">

            {/* Blockers */}
            {project.roadblocks && project.roadblocks.length > 0 && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                    <path d="M8 2L14 13H2L8 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                    <path d="M8 7v3M8 11.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  <h2 className="text-sm font-semibold text-amber-800">
                    {project.roadblocks.length} Active Blocker{project.roadblocks.length > 1 ? 's' : ''}
                  </h2>
                </div>
                <div className="space-y-4">
                  {project.roadblocks.map((r, i) => (
                    <div key={i} className="border-t border-amber-200 first:border-0 pt-3 first:pt-0">
                      <p className="text-sm font-semibold text-amber-900">{r.title}</p>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">{r.impact}</p>
                      {r.workaround && (
                        <p className="text-xs text-amber-600 mt-1">
                          <span className="font-semibold">Workaround:</span> {r.workaround}
                        </p>
                      )}
                      <p className="text-xs text-amber-500 mt-1">
                        <span className="font-semibold">Owner:</span> {r.owner}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-warm-200 p-5">
              <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Overview</h2>
              <p className="text-sm text-warm-700 leading-relaxed">{project.description}</p>
            </div>

            {/* Architecture diagram */}
            {project.diagram && (
              <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-warm-100 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 14 14">
                    <rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                    <rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                    <rect x="4.5" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.3"/>
                    <path d="M3.5 6v1.5a2 2 0 002 2M10.5 6v1.5a2 2 0 01-2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
                  </svg>
                  <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">Architecture</h2>
                </div>
                <div className="p-5 bg-warm-50/50">
                  <DiagramWrapper chart={project.diagram} />
                </div>
              </div>
            )}

            {/* Action items */}
            <div className="bg-white rounded-2xl border border-warm-200 p-5">
              <ActionItemList items={project.actionItems} projectSlug={project.slug} />
            </div>

          </div>

          {/* ── Right sidebar ── */}
          <aside className="space-y-4 lg:sticky lg:top-[72px] lg:self-start">

            {/* Project info */}
            <div className="bg-white rounded-2xl border border-warm-200 p-5">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Project Info
              </h3>
              <div className="space-y-4">

                {/* Owner */}
                <div>
                  <div className="text-[11px] text-gray-400 mb-1.5">Owner</div>
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #53C2BE, #6DCFCC)' }}
                    >
                      <span className="text-[11px] font-bold text-white leading-none">{initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-warm-900">{project.owner ?? 'Liam Shandro'}</div>
                      <div className="text-[11px] text-gray-400">Strategic SDR</div>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-warm-100" />

                {/* Status + tasks + date */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Status</span>
                    <StatusBadge status={project.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Tasks</span>
                    <span className="text-xs font-medium text-warm-900">
                      {doneCount}/{project.actionItems.length} done
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">Updated</span>
                    <span className="text-xs text-warm-900">{formatDate(project.lastUpdated)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="bg-white rounded-2xl border border-warm-200 p-5">
              <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Stack</h3>
              <TechStack tech={project.tech} />
            </div>

            {/* Launch readiness callout */}
            {isNearLaunch && (
              <div className="rounded-2xl border border-[#53C2BE]/40 bg-[#EAF8F7] p-5">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#53C2BE] animate-pulse flex-shrink-0" />
                  <h3 className="text-sm font-semibold text-[#1A8A86]">Ready to launch</h3>
                </div>
                <p className="text-xs text-[#229E9A] mb-3">
                  {pendingItems.length} item{pendingItems.length > 1 ? 's' : ''} remaining before go-live
                </p>
                <div className="space-y-2">
                  {pendingItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-[#1A8A86]">
                      <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 12 12">
                        <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
                      </svg>
                      <span className="leading-snug">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </aside>
        </div>

        {/* ── Roadmap — full width ── */}
        <div className="mt-5 bg-white rounded-2xl border border-warm-200 p-5">
          <VersionRoadmap phases={project.roadmap} />
        </div>

      </main>

      <footer className="border-t border-warm-200 py-5 mt-4">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <Link href="/" className="hover:text-[#53C2BE] transition-colors">← All Projects</Link>
          <span>Internal use only</span>
        </div>
      </footer>
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-CA', { month: 'long', day: 'numeric', year: 'numeric' })
}
