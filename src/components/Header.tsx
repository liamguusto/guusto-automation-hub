import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-warm-200">
      <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm transition-transform group-hover:scale-105"
               style={{ background: 'linear-gradient(135deg, #53C2BE, #6DCFCC)' }}>
            <span className="text-white font-bold text-sm tracking-tight">G</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-warm-900 tracking-tight">guusto</span>
            <span className="text-warm-200 font-light">·</span>
            <span className="text-gray-500 text-sm">GTM Automation Hub</span>
          </div>
        </Link>
        <div className="text-sm text-gray-400 hidden sm:block">
          Liam Shandro · Strategic SDR
        </div>
      </div>
    </header>
  )
}
