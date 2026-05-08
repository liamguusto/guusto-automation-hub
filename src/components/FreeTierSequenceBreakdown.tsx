'use client'

import { useState } from 'react'

type Email = {
  day: number
  angle: string
  subject: string
  body: string[]
}

type TierDef = {
  id: string
  label: string
  tagline: string
  count: number
  criteria: string
  who: string
  angles: string
  example: {
    name: string
    company: string
    stats: string[]
  }
  colors: {
    dot: string
    badge: string
    badgeText: string
    cardBg: string
    cardBorder: string
    dayBg: string
    dayText: string
  }
  emails: Email[]
}

const TIERS: TierDef[] = [
  {
    id: 'A',
    label: 'Tier A',
    tagline: 'Recovery Angle',
    count: 192,
    criteria: 'Unclaimed gifts ≥ $500 (any funding level)',
    who: 'Accounts with significant unclaimed balances they cannot recover on the free plan. Could be high-frequency funders or historically heavy users who have slowed down recently. The unclaimed balance is the hook regardless of recent funding level.',
    angles: 'Unclaimed Money Hook → Old Abandonment (oldest > 6 months) → Power User (high all-time volume) → Scale Problem',
    example: {
      name: 'Mary Barber',
      company: 'Jarlette Health Services',
      stats: ['$10,000 funded in 12mo', '$27,890 unclaimed (7.5%)', '32 members', 'Oldest unclaimed: June 2018'],
    },
    colors: {
      dot: 'bg-purple-500',
      badge: 'bg-purple-100',
      badgeText: 'text-purple-700',
      cardBg: 'bg-purple-50',
      cardBorder: 'border-purple-200',
      dayBg: 'bg-purple-100',
      dayText: 'text-purple-700',
    },
    emails: [
      {
        day: 0,
        angle: 'Unclaimed Money Hook',
        subject: 'Your $27,890 sitting unclaimed',
        body: [
          "$27,890 CAD in gifts sent through your Guusto account has never been claimed.",
          "On the free plan, there's no way to cancel those gifts and recover the balance. If recipients never redeem, that money is gone permanently.",
          "A paid plan adds the ability to cancel any unclaimed gift and pull the funds back into your account. It also lets you set automatic expiry windows so unspent balances return to you instead of expiring.",
          "Worth a quick conversation to see what's actually recoverable?",
          "Konrad",
        ],
      },
      {
        day: 3,
        angle: 'Old Abandonment',
        subject: 'Unclaimed gift from June 2018',
        body: [
          "Your oldest unclaimed gift on the account dates back to June 6, 2018.",
          "That's nearly 7 years sitting unredeemed with no way to cancel it or recover a cent. On the free plan, every gift in that position is a permanent write-off.",
          "Paid plans let you cancel unclaimed rewards and return the balance to your account. For an account with $27,890 sitting out there, even partial recovery changes the math significantly.",
          "Does it make sense to look at what that could mean for Jarlette?",
          "Konrad",
        ],
      },
      {
        day: 7,
        angle: 'Power User',
        subject: '8,022 gifts, no spend visibility',
        body: [
          "I've reached out twice, so I'll keep this short.",
          "You've sent 8,022 gifts and $370,085 CAD through Guusto. At that volume, no reporting and no way to cancel unclaimed rewards is a real gap, not a minor inconvenience.",
          "If recovering a portion of the $27,890 unclaimed balance isn't a priority right now, no problem at all. Happy to revisit whenever the timing is better.",
          "If it is worth 20 minutes, I'm easy to reach.",
          "Konrad",
        ],
      },
    ],
  },
  {
    id: 'B',
    label: 'Tier B',
    tagline: 'Infrastructure Angle',
    count: 277,
    criteria: 'Funded $1,000+/yr and unclaimed < $500',
    who: "Active, high-funding accounts clearly committed to recognition but with little unclaimed balance — they're good at getting gifts claimed. The unclaimed hook is weak. The angle is they've built a real program on a plan with no reporting, one sender seat, and no automation.",
    angles: 'Frequency Signal → Scale Problem → Power User → Feature Gap Close → Unclaimed Hook (only if unclaimed > $200)',
    example: {
      name: 'Jamie Williamson',
      company: 'Canada Life',
      stats: ['$2,600 funded in 12mo', '$499 unclaimed (8.9%)', '1 member', '37 gifts in 12mo', 'On Guusto since 2022'],
    },
    colors: {
      dot: 'bg-[#53C2BE]',
      badge: 'bg-[#EAF8F7]',
      badgeText: 'text-[#1A8A86]',
      cardBg: 'bg-[#EAF8F7]',
      cardBorder: 'border-[#53C2BE]/30',
      dayBg: 'bg-[#EAF8F7]',
      dayText: 'text-[#1A8A86]',
    },
    emails: [
      {
        day: 0,
        angle: 'Frequency Signal',
        subject: '37 gifts, one sender seat',
        body: [
          "37 gifts sent in the last 12 months is a real recognition program, Jamie. That's not someone testing the waters.",
          "The free plan caps all of that through a single sender. No one else at Canada Life can send recognition without going through you. No reporting to show what's landing. No way to schedule or bulk-send when things get busy.",
          "That's a lot of manual lift for a program running at that volume.",
          "Worth a quick conversation about what the next level looks like?",
          "Konrad",
        ],
      },
      {
        day: 3,
        angle: 'Unclaimed Money Hook',
        subject: 'Quick question on $499 in unclaimed gifts',
        body: [
          "Noticed you have $499 CAD sitting in unclaimed gifts right now, with the oldest going back to April.",
          "On the free plan, if those don't get claimed, that money is gone permanently. There's no way to cancel and recover the balance.",
          "Paid plans let you cancel unclaimed gifts and pull the funds straight back into your account. You can also set automatic expiry windows so unspent balances return on their own.",
          "For a program sending at your pace, that's a meaningful difference.",
          "Does it make sense to at least see what recovery would look like?",
          "Konrad",
        ],
      },
      {
        day: 7,
        angle: 'Power User',
        subject: 'Last note, Jamie',
        body: [
          "I've reached out twice, so I'll keep this short.",
          "You've been on Guusto since 2022 and sent $5,624 CAD across 38 gifts. That's four years of consistent recognition without access to reporting, automation, or the ability to recover unclaimed balances.",
          "If upgrading isn't the right conversation right now, no pressure at all. But if the program is growing and the free plan is starting to feel like a ceiling, I'm happy to show you what changes.",
          "Is the timing just off, or is this worth a look?",
          "Konrad",
        ],
      },
    ],
  },
  {
    id: 'C',
    label: 'Tier C',
    tagline: 'Feature Gap Angle',
    count: 410,
    criteria: 'Funded $200–$999/yr and unclaimed < $500',
    who: "Mid-range accounts using Guusto occasionally without running a high-frequency program. Unclaimed balances are generally small. The hook is what they're missing rather than what they've lost: no reporting, no automation, recognition bottlenecked through one sender.",
    angles: 'Feature Gap → Frequency Signal (if funded 3+ times) → Scale Problem (if 5+ members) → Unclaimed Hook (only if unclaimed > $300)',
    example: {
      name: 'Rachael',
      company: 'Diakonia Group',
      stats: ['$500 funded in 12mo', '$480 unclaimed (5.5%)', '22 members', '371 all-time gifts', '$8,730 sent all-time'],
    },
    colors: {
      dot: 'bg-blue-500',
      badge: 'bg-blue-100',
      badgeText: 'text-blue-700',
      cardBg: 'bg-blue-50',
      cardBorder: 'border-blue-200',
      dayBg: 'bg-blue-100',
      dayText: 'text-blue-700',
    },
    emails: [
      {
        day: 0,
        angle: 'Unclaimed Money Hook',
        subject: 'Rachael, $480 may not come back',
        body: [
          "$480 of the $500 you funded this year is still sitting unclaimed in Guusto.",
          "On the free plan, if those gifts are never claimed, that money is gone permanently. There is no way to cancel them and recover the balance.",
          "Paid plans let you cancel unclaimed gifts and return funds to your account. One gift recovered can cover a meaningful chunk of what it costs to upgrade.",
          "Worth a quick conversation to see if this makes sense for Diakonia?",
          "Konrad",
        ],
      },
      {
        day: 3,
        angle: 'Scale Problem',
        subject: '16 gifts, 22 people, one sender',
        body: [
          "You sent 16 gifts across a 22-person team this year, all through a single sender seat.",
          "That means recognition at Diakonia only moves when one person initiates it. If that person is out, busy, or just doesn't see the moment, it doesn't happen.",
          "Paid plans add multiple sender seats so managers closest to the work can send recognition directly, without routing everything through one account.",
          "Does that bottleneck sound familiar?",
          "Konrad",
        ],
      },
      {
        day: 7,
        angle: 'Feature Gap',
        subject: "Last note, then I'll leave it",
        body: [
          "I've reached out twice. I won't keep at it after this.",
          "One thing worth leaving you with: Diakonia has 371 gifts and $8,730 sent through Guusto over time. That's a real program, built without any reporting, no scheduled or bulk sends, and no milestone automation.",
          "Paid plans add all of that. Most teams at this stage find it changes how consistently recognition actually lands.",
          "If the timing is off right now, no problem at all. Happy to revisit whenever it makes sense.",
          "Konrad",
        ],
      },
    ],
  },
]

export function FreeTierSequenceBreakdown() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    'A-0': true,
    'B-0': true,
    'C-0': true,
  })

  function toggle(key: string) {
    setOpen(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const total = TIERS.reduce((s, t) => s + t.count, 0)

  return (
    <div className="bg-white rounded-2xl border border-warm-200 overflow-hidden">

      {/* Section header */}
      <div className="px-5 py-3.5 border-b border-warm-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 14 14">
            <path d="M2 4h10M2 7h7M2 10h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          </svg>
          <h2 className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
            Sequence Tiers & Example Copy
          </h2>
        </div>
        <span className="text-[11px] text-gray-400 tabular-nums">
          {total.toLocaleString()} contacts · 3 emails each · Day 0 / 3 / 7
        </span>
      </div>

      {/* Tier stat bar */}
      <div className="grid grid-cols-3 divide-x divide-warm-100 border-b border-warm-100">
        {TIERS.map(tier => (
          <div key={tier.id} className="px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${tier.colors.dot}`} />
              <span className="text-[11px] font-semibold text-gray-500">{tier.label}</span>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tier.colors.badge} ${tier.colors.badgeText}`}>
                {tier.tagline}
              </span>
            </div>
            <div className="text-2xl font-black text-warm-900 tabular-nums leading-none mb-1">
              {tier.count}
            </div>
            <div className="text-[11px] text-gray-400 leading-snug">{tier.criteria}</div>
          </div>
        ))}
      </div>

      {/* Tier detail sections */}
      <div className="divide-y divide-warm-100">
        {TIERS.map(tier => (
          <div key={tier.id} className="p-5">

            {/* Tier label + description */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${tier.colors.badge} ${tier.colors.badgeText}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${tier.colors.dot}`} />
                  {tier.label} — {tier.tagline}
                </span>
              </div>
              <p className="text-sm text-warm-700 leading-relaxed mb-2">{tier.who}</p>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                <span className="font-semibold text-gray-500">Angle priority: </span>
                {tier.angles}
              </p>
            </div>

            {/* Example contact card */}
            <div className={`rounded-xl border ${tier.colors.cardBorder} ${tier.colors.cardBg} p-3.5 mb-4`}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
                  Example contact
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2.5">
                <span className="text-sm font-semibold text-warm-900">{tier.example.name}</span>
                <span className="text-sm text-gray-400">/</span>
                <span className="text-sm text-warm-700">{tier.example.company}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {tier.example.stats.map((stat, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white border border-warm-200 text-warm-700"
                  >
                    {stat}
                  </span>
                ))}
              </div>
            </div>

            {/* Email accordions */}
            <div className="space-y-2">
              {tier.emails.map((email, i) => {
                const key = `${tier.id}-${i}`
                const isOpen = !!open[key]
                return (
                  <div key={i} className="rounded-xl border border-warm-200 overflow-hidden">
                    <button
                      onClick={() => toggle(key)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-warm-50/60 transition-colors"
                    >
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums flex-shrink-0 ${tier.colors.dayBg} ${tier.colors.dayText}`}>
                        Day {email.day}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-400 flex-shrink-0 hidden sm:inline">
                        {email.angle}
                      </span>
                      <span className="text-sm font-medium text-warm-800 truncate flex-1 min-w-0">
                        {email.subject}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" viewBox="0 0 16 16"
                      >
                        <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="border-t border-warm-100 bg-warm-50/40 px-4 py-4">
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                          Subject
                        </div>
                        <div className="text-sm font-semibold text-warm-900 mb-4">
                          {email.subject}
                        </div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                          Body
                        </div>
                        <div className="bg-white rounded-xl border border-warm-200 p-4 space-y-3">
                          {email.body.map((para, j) => (
                            <p
                              key={j}
                              className={`text-[13px] leading-relaxed ${
                                para === 'Konrad'
                                  ? 'font-semibold text-warm-900 pt-1'
                                  : 'text-warm-700'
                              }`}
                            >
                              {para}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
