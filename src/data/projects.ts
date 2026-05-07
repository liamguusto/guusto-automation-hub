export type Status = 'planning' | 'in-progress' | 'research-complete' | 'live'

export type ActionItem = {
  text: string
  done: boolean
  owner?: string
}

export type VersionPhase = {
  label: string
  status: 'done' | 'current' | 'planned'
  description: string
  features: string[]
}

export type Roadblock = {
  title: string
  impact: string
  owner: string
  workaround?: string
}

export type Project = {
  slug: string
  title: string
  shortTitle: string
  description: string
  status: Status
  progress: number
  currentMilestone: string
  lastUpdated: string
  owner?: string
  highlights?: string[]
  tech: string[]
  diagram?: string
  actionItems: ActionItem[]
  roadmap: VersionPhase[]
  roadblocks?: Roadblock[]
}

// ─────────────────────────────────────────────────────
// DIAGRAMS
// ─────────────────────────────────────────────────────

const DIAGRAM_AUTO_RENEWAL = `flowchart TD
    CRON["🕐 Railway Cron Job<br/>Runs on schedule (weekly)"]:::infra --> QUERY
    QUERY["Query HubSpot<br/>Auto-renewal tier accounts<br/>next_renewal_date ≤ 30 days"]:::hubspot --> CHECK
    CHECK{Accounts due?}:::decision
    CHECK -->|None found| DONE["✓ No action needed"]:::done
    CHECK -->|Accounts found| FOR
    FOR["For each account<br/>Look up Google Sheet<br/>Metabase usage data"]:::step --> DRAFT
    DRAFT["Generate email draft<br/>Renewal notice + soft CTA<br/>Book call with Konrad"]:::ai --> WRITE
    WRITE["Write draft to HubSpot<br/>Konrad reviews → presses send"]:::hubspot --> INV
    INV["~10 days before renewal<br/>Post invoice request<br/>Slack #triage-invoice-request"]:::slack --> BOOKED
    BOOKED{Call booked?}:::decision
    BOOKED -->|Yes| UNENROLL["Auto-unenroll from sequence"]:::done
    BOOKED -->|No| MONITOR["Continue monitoring<br/>until renewal date"]:::step

    classDef infra fill:#EDE9FE,stroke:#7C3AED,color:#3B0764
    classDef hubspot fill:#DBEAFE,stroke:#1D4ED8,color:#1E3A5F
    classDef step fill:#F0FDF4,stroke:#15803D,color:#14532D
    classDef ai fill:#FEF3C7,stroke:#D97706,color:#78350F
    classDef slack fill:#F0FDF4,stroke:#15803D,color:#14532D
    classDef decision fill:#FFF7ED,stroke:#C2410C,color:#7C2D12
    classDef done fill:#D1FAE5,stroke:#059669,color:#064E3B`

const DIAGRAM_FREE_TIER = `flowchart TD
    A(["📊 Metabase Export<br/>1,131 free-tier accounts<br/>actively funding Guusto"]):::source --> B

    B["Tier Segmentation<br/>Split by 12-month funding<br/>and unclaimed balance"]:::step --> C & D & E & F

    C["Tier A — 156 contacts<br/>High Value · \\$500+ unclaimed<br/>3-email sequence"]:::tierA
    D["Tier B — 277 contacts<br/>High Value · low unclaimed<br/>3-email sequence"]:::tierB
    E["Tier C — 442 contacts<br/>Mid Value<br/>2-email sequence"]:::tierC
    F["Tier D — 256 contacts<br/>Low Value<br/>Skipped"]:::skip

    C & D & E --> G

    G["HubSpot Contact Lookup<br/>Match by email address<br/>Company domain as fallback"]:::step --> H

    H["Claude API — Sonnet<br/>Reads each account's data<br/>Selects best angles per tier<br/>Writes 3 personalised emails as JSON<br/>~\\$18 total for all 875 contacts"]:::ai --> I

    I["Write directly to HubSpot<br/>ft_upsell_email_body_1 / 2 / 3<br/>ft_upsell_email_subject_1 / 2 / 3<br/>ft_upsell_tier"]:::hubspot

    I --> J & K

    J["⏳ Konrad's details<br/>Last name + Calendly link<br/>Add to pipeline config"]:::pending
    K["⏳ Sequence shells<br/>Build 2 sequences in HubSpot UI<br/>Tier A/B (3 emails · Day 0/3/7)<br/>Tier C (2 emails · Day 0/5)"]:::pending

    J & K --> L

    L["Bulk Enrol<br/>Filter contacts by ft_upsell_tier<br/>in HubSpot contact list view"]:::step --> M

    M(["📧 Sequences send from Konrad's inbox<br/>Calendly CTA in every email<br/>Auto-unenrol on reply or meeting booked"]):::send

    classDef source fill:#FED7AA,stroke:#C2410C,color:#7C2D12
    classDef step fill:#DBEAFE,stroke:#1E40AF,color:#1E3A5F
    classDef tierA fill:#DDD6FE,stroke:#6D28D9,color:#3B0764
    classDef tierB fill:#EDE9FE,stroke:#7C3AED,color:#4C1D95
    classDef tierC fill:#E0E7FF,stroke:#4338CA,color:#1E1B4B
    classDef skip fill:#F3F4F6,stroke:#9CA3AF,color:#6B7280
    classDef ai fill:#FEF3C7,stroke:#D97706,color:#78350F
    classDef hubspot fill:#DBEAFE,stroke:#1D4ED8,color:#1E3A5F
    classDef pending fill:#FEF9C3,stroke:#CA8A04,color:#713F12
    classDef send fill:#D1FAE5,stroke:#059669,color:#064E3B`

const DIAGRAM_PRE_DEMO = `flowchart TD
    CALL["Fathom<br/>Are We A Fit call ends"]:::trigger --> TRANS
    WEB["Firecrawl<br/>Scrape prospect website"]:::tool --> RESEARCH
    TRANS["Extract transcript<br/>summary + intent signals"]:::step --> RESEARCH
    RESEARCH["Compile brief<br/>Company profile + call summary<br/>+ fit signals"]:::step --> CLAUDE
    CLAUDE["Claude API<br/>Generate pre-demo brief PDF<br/>+ draft follow-up email"]:::ai --> HUBSPOT
    HUBSPOT["Upload brief to HubSpot<br/>Attach to deal record<br/>Draft email ready to send"]:::hubspot --> CHECK
    CHECK{Demo already booked?}:::decision
    CHECK -->|Yes| PREP["Send prep checklist<br/>+ Guusto slides to prospect"]:::done
    CHECK -->|No| SEQ["Enroll in follow-up sequence<br/>CTA: book demo call"]:::step

    classDef trigger fill:#FED7AA,stroke:#C2410C,color:#7C2D12
    classDef tool fill:#EDE9FE,stroke:#6D28D9,color:#3B0764
    classDef step fill:#DBEAFE,stroke:#1E40AF,color:#1E3A5F
    classDef ai fill:#FEF3C7,stroke:#D97706,color:#78350F
    classDef hubspot fill:#DBEAFE,stroke:#1D4ED8,color:#1E3A5F
    classDef decision fill:#FFF7ED,stroke:#C2410C,color:#7C2D12
    classDef done fill:#D1FAE5,stroke:#059669,color:#064E3B`

const DIAGRAM_INTEGRATION = `flowchart TD
    TS["TheirStack<br/>97 Axonify companies<br/>deliberate install-base signal"]:::source --> ENRICH
    EXP["Explorium + Bombora<br/>880 UKG Pro companies<br/>recognition/rewards intent filter"]:::source --> ENRICH
    ENRICH["Clay<br/>Contact enrichment<br/>+ firmographics"]:::tool --> CLAUDE
    CLAUDE["Claude API<br/>Personalised opening line<br/>per company"]:::ai --> INST
    INST["Instantly<br/>Cold email delivery<br/>secondary domain + inbox warming"]:::send --> HS
    HS["HubSpot<br/>Engaged contacts sync back<br/>→ warm follow-up sequences"]:::hubspot

    classDef source fill:#FED7AA,stroke:#C2410C,color:#7C2D12
    classDef tool fill:#EDE9FE,stroke:#6D28D9,color:#3B0764
    classDef ai fill:#FEF3C7,stroke:#D97706,color:#78350F
    classDef send fill:#D1FAE5,stroke:#059669,color:#064E3B
    classDef hubspot fill:#DBEAFE,stroke:#1D4ED8,color:#1E3A5F`

// ─────────────────────────────────────────────────────
// PROJECTS
// ─────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: 'auto-renewal-upsell',
    title: 'Auto-renewal Upsell Sequence',
    shortTitle: 'Auto-renewal Upsell',
    description:
      'Automated renewal notification cadence for Light plan (Tier 4) auto-renewal accounts. V1 eliminates Konrad manually tracking and reaching out to every account pre-renewal. Automation runs on Railway, queries HubSpot weekly, creates email drafts for Konrad to review, and triggers Slack invoice requests.',
    status: 'in-progress',
    progress: 25,
    currentMilestone: 'V1 spec doc + HubSpot↔Metabase account mapping (Camille/Cam)',
    lastUpdated: '2026-05-06',
    owner: 'Liam Shandro',
    highlights: ['Light plan accounts', '30-day trigger window', 'Konrad reviews drafts'],
    tech: ['HubSpot', 'Railway', 'Claude API', 'Python', 'Slack', 'Google Sheets'],
    diagram: DIAGRAM_AUTO_RENEWAL,
    roadblocks: [
      {
        title: 'company_tier field not populated',
        impact: 'Cannot filter on company_tier = "Lite Subscription" — zero companies tagged. Must use subscription_tier = "Lite" + next_renewal_date as workaround.',
        owner: 'Camille / Mac — confirm when backfill is complete',
        workaround: 'Filter on subscription_tier = "Lite" + next_renewal_date is set — works today.',
      },
      {
        title: 'autorenews field is null for all accounts',
        impact: 'Cannot filter on autorenews = true. No data indicates which accounts auto-renew vs. require a manual call.',
        owner: 'Camille / Mac — needs data cleanup alongside company_tier backfill',
      },
      {
        title: 'HubSpot → Metabase account matching not built',
        impact: 'Metabase uses company ID only — no names. Cannot join Metabase enrichment data to HubSpot accounts without a manual mapping.',
        owner: 'Liam + Camille + Cam',
      },
    ],
    actionItems: [
      { text: 'Contact Camille + Cam — build Metabase company ID ↔ HubSpot account mapping', done: true, owner: 'Liam' },
      { text: 'Get added to #triage-invoice-request; review invoice template format', done: true, owner: 'Liam' },
      { text: 'Confirm exact HubSpot "auto-renewal" tier label with Camille or Mac', done: false, owner: 'Liam' },
      { text: 'Confirm with Cam how multi-workspace accounts appear in Metabase', done: false, owner: 'Liam' },
      { text: 'Audit Metabase — confirm available fields per company', done: false, owner: 'Liam' },
      { text: 'Research email sequence best practice (length + cadence)', done: false, owner: 'Liam' },
      { text: 'Connect with Konrad — align on email cadence, messaging, invoice format', done: false, owner: 'Liam + Konrad' },
      { text: 'Build V1 architecture diagram (this page)', done: false, owner: 'Liam' },
      { text: 'Confirm sender email on sequences', done: false, owner: 'Konrad' },
      { text: 'Schedule bi-weekly Automation Council — first meeting ~May 20', done: false, owner: 'Kwesi' },
    ],
    roadmap: [
      {
        label: 'V1',
        status: 'current',
        description: 'Automate the renewal notification cadence',
        features: [
          'Email cadence starting 30 days pre-renewal',
          'HubSpot drafts — Konrad reviews before sending',
          'Slack invoice trigger at ~10 days (pre-filled from HubSpot)',
          'Exit condition: call booked → auto-unenroll',
          'No Metabase enrichment — generic messaging',
        ],
      },
      {
        label: 'V1.5',
        status: 'planned',
        description: 'Add Tiers 2 + 3 (call-required accounts)',
        features: [
          'Same base cadence as V1',
          'Harder CTA: book renewal call with Konrad',
          'Earlier trigger window (60+ days)',
        ],
      },
      {
        label: 'V2',
        status: 'planned',
        description: 'Layer in Metabase usage signals',
        features: [
          'Personalised messaging based on gift reasons',
          'Sender count, recipient count, preloaded recipients',
          'Automated awards on/off flag',
          'Upsell angle selection per account',
        ],
      },
      {
        label: 'V3',
        status: 'planned',
        description: 'HRIS tech stack enrichment + frontline inference',
        features: [
          'Crossbeam / Explorium: Dayforce + UKG detection',
          'Integration pitch for Dayforce/UKG customers',
          'Frontline industry inference from company data',
          'Essential → Premium upsell sequence',
        ],
      },
    ],
  },

  {
    slug: 'free-tier-upsell',
    title: 'Free Tier Upsell: No Subscription + Funding Activity',
    shortTitle: 'Free Tier Upsell',
    description:
      'Personalised upsell campaign targeting 875 free-tier Guusto accounts that are actively funding recognition. A Python pipeline analyses each account\'s usage data, segments contacts into three tiers based on funding activity and unclaimed gift balance, then generates unique personalised emails via Claude API and writes them directly to HubSpot — no manual import required. Two items remain before launch: Konrad\'s sender details (last name + Calendly link) and building the HubSpot sequence shells. Once done, the full run is three commands.',
    status: 'in-progress',
    progress: 90,
    currentMilestone: 'Pipeline complete — waiting on Konrad\'s details + HubSpot sequence shells',
    lastUpdated: '2026-05-07',
    owner: 'Liam Shandro',
    highlights: ['875 contacts', '3 sequence tiers', '~$18 API cost'],
    tech: ['Metabase', 'Python', 'Claude API (Sonnet)', 'HubSpot', 'HubSpot Sequences'],
    diagram: DIAGRAM_FREE_TIER,
    actionItems: [
      { text: 'Pull Metabase SQL export (1,131 free-tier contacts)', done: true, owner: 'Liam' },
      { text: 'Analyse segment data — build 4-tier model by funding + unclaimed balance', done: true, owner: 'Liam' },
      { text: 'Split CSV into tier files (A: 156 · B: 277 · C: 442 · D: 256 skipped)', done: true, owner: 'Liam' },
      { text: 'Create 7 HubSpot custom contact properties (ft_upsell_*)', done: true, owner: 'Liam' },
      { text: 'Build pipeline — HubSpot contact lookup + Claude API + direct property write', done: true, owner: 'Liam' },
      { text: 'Build email copy ruleset (anti-AI-tell rules, saved as reusable workspace skill)', done: true, owner: 'Liam' },
      { text: 'Read internal pricing sheet + Guusto.com/pricing — encode accurate feature gaps into prompts', done: true, owner: 'Liam' },
      { text: 'Test end-to-end — email generation + HubSpot write verified on live contact', done: true, owner: 'Liam' },
      { text: 'Add Konrad\'s last name + Calendly link to pipeline config (prompts.py)', done: false, owner: 'Konrad' },
      { text: 'Build 2 HubSpot sequence shells (Tier A/B — 3 emails · Tier C — 2 emails) from Konrad\'s inbox', done: false, owner: 'Liam + Konrad' },
      { text: 'Run full pipeline (python3 pipeline.py --tier a/b/c)', done: false, owner: 'Liam' },
      { text: 'Bulk enroll contacts by ft_upsell_tier in HubSpot contact list view', done: false, owner: 'Liam' },
    ],
    roadmap: [
      {
        label: 'V1',
        status: 'current',
        description: 'One-time run — direct HubSpot API pipeline',
        features: [
          'Metabase CSV → 4-tier segmentation (875 contacts sequenced)',
          'Python + Claude Sonnet: 1 API call per contact, 3 personalised emails',
          'HubSpot contact lookup by email (domain fallback for non-matches)',
          'Writes directly to HubSpot — no CSV import step',
          'Email-copy ruleset skill: anti-AI-tell rules, upsell tone, feature gap framing',
          '~$18 total API cost for full run',
        ],
      },
      {
        label: 'V2',
        status: 'planned',
        description: 'Scheduled re-runs for new free-tier accounts',
        features: [
          'Monthly cron job on Railway — catches new accounts that clear the threshold',
          'Skip contacts already enrolled or previously sequenced',
          'Auto-enroll via HubSpot workflow trigger on ft_upsell_tier being set',
        ],
      },
      {
        label: 'V3',
        status: 'planned',
        description: 'Real-time trigger on activity threshold',
        features: [
          'Trigger on funding activity event (webhook or Metabase alert)',
          'Dynamic angle re-selection based on latest account data',
          'Unclaimed balance monitoring — re-surface to sales if balance crosses threshold',
        ],
      },
    ],
  },

  {
    slug: 'pre-demo-brief',
    title: 'Are We A Fit → Pre-Demo Brief Automation',
    shortTitle: 'Pre-Demo Brief',
    description:
      'Automation that triggers when an "Are We A Fit?" call ends in Fathom. Pulls the transcript, scrapes the prospect\'s website with Firecrawl, and feeds both into Claude API to generate a branded pre-demo brief PDF + a conditional follow-up email draft. If a demo was booked on the call, sends a prep checklist. If not, enrolls the prospect in a follow-up sequence.',
    status: 'planning',
    progress: 10,
    currentMilestone: 'Requirements defined — spec not yet started',
    lastUpdated: '2026-04-22',
    owner: 'Liam Shandro',
    highlights: ['Fathom webhook trigger', 'AI brief + follow-up', 'HubSpot deal sync'],
    tech: ['Fathom', 'Firecrawl', 'Claude API', 'HubSpot', 'Python', 'Railway'],
    diagram: DIAGRAM_PRE_DEMO,
    actionItems: [
      { text: 'Write spec doc — define triggers, data sources, output format', done: false, owner: 'Liam' },
      { text: 'Define brief PDF template and content structure', done: false, owner: 'Liam + Konrad' },
      { text: 'Build Fathom → transcript extraction script', done: false, owner: 'Liam' },
      { text: 'Set up Firecrawl scrape for prospect website', done: false, owner: 'Liam' },
      { text: 'Design Claude prompt for brief generation', done: false, owner: 'Liam' },
      { text: 'Build HubSpot upload + email draft creation', done: false, owner: 'Liam' },
    ],
    roadmap: [
      {
        label: 'V1',
        status: 'current',
        description: 'Fathom → brief PDF → HubSpot',
        features: [
          'Trigger on Fathom call completion (webhook or polling)',
          'Extract transcript + AI summary',
          'Generate pre-demo brief PDF via Claude API',
          'Upload brief to HubSpot deal record',
          'Draft follow-up email (conditional on demo booked)',
        ],
      },
      {
        label: 'V2',
        status: 'planned',
        description: 'Firecrawl prospect research + LinkedIn',
        features: [
          'Scrape prospect website for company context',
          'LinkedIn enrichment for buyer persona',
          'Deeper personalisation in brief',
        ],
      },
      {
        label: 'V3',
        status: 'planned',
        description: 'Conditional follow-up logic',
        features: [
          'If no demo booked: enroll in HubSpot follow-up sequence',
          'Sequence continues until demo booked (auto-unenroll)',
          'Escalation path if no response after N days',
        ],
      },
    ],
  },

  {
    slug: 'integration-partner-outbound',
    title: 'Integration Partner Outbound — UKG Pro & Axonify Campaign',
    shortTitle: 'Integration Partner Outbound',
    description:
      'Outbound campaign targeting companies already using Guusto\'s integration partners. Play 1: 97 Axonify companies (TheirStack) — deliberate, clean signal. Play 2: 880 UKG Pro companies with active recognition/rewards Bombora intent (Explorium). Messaging centres on the native integration: "Your managers can send recognition without leaving the tool they already use."',
    status: 'research-complete',
    progress: 40,
    currentMilestone: 'Resolve cold email tooling decision → write sequence copy',
    lastUpdated: '2026-05-07',
    owner: 'Liam Shandro',
    highlights: ['97 Axonify accounts', '880 UKG Pro accounts', 'Bombora intent-filtered'],
    tech: ['TheirStack', 'Explorium', 'Bombora', 'Clay', 'Instantly', 'HubSpot', 'Claude API'],
    diagram: DIAGRAM_INTEGRATION,
    roadblocks: [
      {
        title: 'HubSpot is not the right delivery layer for cold email',
        impact: 'Sending 1,000–3,000 net-new cold contacts through a primary @guusto.com inbox risks domain reputation damage for the whole team. HubSpot has no inbox warming, no email rotation, and no deliverability tooling — it is built for warm outreach, not cold lists.',
        owner: 'Liam + Konrad — team decision required',
        workaround: 'Use Instantly (dedicated cold email tool) with a secondary domain (e.g. higuusto.com). HubSpot handles warm follow-up after first reply, with activity synced back via integration.',
      },
      {
        title: 'Cold email tooling not yet confirmed',
        impact: 'Blocks sequence build, domain setup, and copy finalisation. Need to confirm whether Guusto already has a cold email tool in the stack before purchasing Instantly.',
        owner: 'Liam + Konrad',
      },
    ],
    actionItems: [
      { text: 'Confirm if Guusto already has a cold email sequencing tool (Outreach, Salesloft, Apollo, Smartlead, Instantly)', done: false, owner: 'Liam + Konrad' },
      { text: 'Confirm Axonify integration is live and functional for all customers', done: false, owner: 'Liam' },
      { text: 'Pull Axonify list from TheirStack (97 cos) — review ICP fit', done: false, owner: 'Liam' },
      { text: 'Pull sample from Explorium intent list (25–50 cos) — validate quality', done: false, owner: 'Liam' },
      { text: 'Decide lead play: Axonify-first or both in parallel', done: false, owner: 'Liam + Konrad' },
      { text: 'Define ICP industry filter (healthcare, retail, hospitality, manufacturing priority)', done: false, owner: 'Liam' },
      { text: 'Write sequence copy — Axonify angle', done: false, owner: 'Liam' },
      { text: 'Write sequence copy — UKG Pro + intent angle', done: false, owner: 'Liam' },
      { text: 'Set up Clay enrichment workflow', done: false, owner: 'Liam' },
      { text: 'Build HubSpot sequences + enrollment logic', done: false, owner: 'Liam' },
    ],
    roadmap: [
      {
        label: 'V1',
        status: 'current',
        description: 'Axonify play — 97 companies',
        features: [
          'Pull 97 Axonify companies from TheirStack',
          'Contact enrichment via Clay',
          'Claude API: personalised opening line per company',
          'Instantly: cold email send from secondary domain',
        ],
      },
      {
        label: 'V2',
        status: 'planned',
        description: 'UKG Pro + intent play — 880 companies',
        features: [
          '880 UKG Pro + Bombora intent companies from Explorium',
          'Same Clay + Claude API pipeline',
          'Instantly: cold email send from secondary domain',
          'Do not reference UKG Talk unless confirmed active',
        ],
      },
      {
        label: 'V3',
        status: 'planned',
        description: 'Automated enrichment pipeline',
        features: [
          'Automated Clay workflow on new list pulls',
          'Ongoing intent monitoring via Bombora',
          'Canadian coverage supplement via TheirStack',
          'Expand to other integration partners',
        ],
      },
    ],
  },
]
