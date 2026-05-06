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
    subgraph SETUP["⚙️ Phase 0 — One-Time Setup (HubSpot UI)"]
        S1["Create custom contact properties<br/>guusto_email_body_1 / _2 / _3<br/>+ guusto_funded_12mo, unclaimed_value, segment_tier"]:::setup
        S2["Build 3 sequence shells<br/>High Value · Mid Value · Low Value<br/>Email body = contact.guusto_email_body_N"]:::setup
    end

    A(["📊 Metabase SQL Export<br/>~1,100+ rows — CSV"]):::start --> B

    subgraph SCRIPT["🐍 Python Script — runs locally, one time"]
        B["Claude API<br/>1 call per contact<br/>Inputs: name, funding, unclaimed value,<br/>team size, account age, currency<br/>Output: 3 email body variants as JSON<br/>~$10–15 total · ~10 min"]:::ai
        B --> C["Write back to CSV<br/>Appends guusto_email_body_1 / _2 / _3"]:::step
    end

    C --> E(["📄 Final CSV<br/>Ready for HubSpot import"]):::output

    subgraph MANUAL["👤 Manual Steps — Liam"]
        F["Import CSV into HubSpot<br/>Maps columns to contact properties"]:::manual
        F --> G["Filter contacts by guusto_segment_tier<br/>High / Mid / Low Value"]:::manual
        G --> H["Bulk enrol into sequences<br/>High Value → Seq A<br/>Mid Value → Seq B · Low Value → Seq C"]:::manual
    end

    E --> F

    H --> I["📧 Sequences send from Liam's inbox<br/>Email 1 (Day 0) · Email 2 (Day 3) · Email 3 (Day 7)<br/>Auto-unenrol on reply or meeting booked"]:::send

    classDef start fill:#FED7AA,stroke:#C2410C,color:#7C2D12
    classDef setup fill:#EDE9FE,stroke:#6D28D9,color:#3B0764
    classDef step fill:#DBEAFE,stroke:#1E40AF,color:#1E3A5F
    classDef ai fill:#DDD6FE,stroke:#6D28D9,color:#3B0764
    classDef output fill:#A7F3D0,stroke:#047857,color:#064E3B
    classDef manual fill:#FEF3C7,stroke:#B45309,color:#78350F
    classDef send fill:#A7F3D0,stroke:#047857,color:#064E3B`

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
    CLAUDE["Claude API<br/>Personalised opening line<br/>per company"]:::ai --> HS
    HS["HubSpot<br/>Contact import<br/>+ sequence enrollment"]:::hubspot --> SEQ
    SEQ["Email Sequences<br/>Axonify: integration hook<br/>UKG Pro: intent-driven pitch"]:::output

    classDef source fill:#FED7AA,stroke:#C2410C,color:#7C2D12
    classDef tool fill:#EDE9FE,stroke:#6D28D9,color:#3B0764
    classDef ai fill:#FEF3C7,stroke:#D97706,color:#78350F
    classDef hubspot fill:#DBEAFE,stroke:#1D4ED8,color:#1E3A5F
    classDef output fill:#D1FAE5,stroke:#059669,color:#064E3B`

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
      'Automated upsell pipeline targeting free-tier accounts with meaningful funding activity. Python script pulls a Metabase CSV export, passes each contact to Claude API to generate 3 personalised email body variants, writes them back to CSV, then Liam bulk-imports to HubSpot and enrolls in one of three sequences by segment tier (High / Mid / Low Value).',
    status: 'in-progress',
    progress: 65,
    currentMilestone: 'Pipeline built — HubSpot import + sequence enrollment pending',
    lastUpdated: '2026-04-27',
    tech: ['Metabase', 'Python', 'Claude API', 'HubSpot'],
    diagram: DIAGRAM_FREE_TIER,
    actionItems: [
      { text: 'Build 3 HubSpot custom contact properties (guusto_email_body_1/2/3 + supporting)', done: true, owner: 'Liam' },
      { text: 'Build 3 sequence shells in HubSpot (High / Mid / Low Value)', done: true, owner: 'Liam' },
      { text: 'Pull Metabase SQL export (~1,100 contacts)', done: true, owner: 'Liam' },
      { text: 'Run Python + Claude API script to generate email bodies', done: true, owner: 'Liam' },
      { text: 'Import final CSV into HubSpot', done: false, owner: 'Liam' },
      { text: 'Filter contacts by guusto_segment_tier in HubSpot', done: false, owner: 'Liam' },
      { text: 'Bulk enroll into sequences A / B / C', done: false, owner: 'Liam' },
    ],
    roadmap: [
      {
        label: 'V1',
        status: 'current',
        description: 'Manual CSV pipeline — one-time run',
        features: [
          'Metabase SQL export → local CSV',
          'Python + Claude API: 1 call/contact, 3 email variants',
          'Manual HubSpot import + sequence enrollment',
          '~$10–15 API cost · ~10 min to run',
        ],
      },
      {
        label: 'V2',
        status: 'planned',
        description: 'Automated HubSpot API push',
        features: [
          'Replace manual CSV import with HubSpot API write',
          'Auto-enroll via HubSpot workflow trigger',
          'Scheduled re-runs (weekly/monthly) for new contacts',
        ],
      },
      {
        label: 'V3',
        status: 'planned',
        description: 'Real-time trigger on activity threshold',
        features: [
          'Trigger enrollment on funding activity event',
          'Dynamic angle selection based on latest data',
          'Unclaimed value monitoring + expiry alerts',
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
    currentMilestone: 'Decide lead play (Axonify-first vs. parallel) → write sequence copy',
    lastUpdated: '2026-05-06',
    tech: ['TheirStack', 'Explorium', 'Bombora', 'Clay', 'HubSpot', 'Claude API'],
    diagram: DIAGRAM_INTEGRATION,
    actionItems: [
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
          'HubSpot sequence: Axonify integration hook',
        ],
      },
      {
        label: 'V2',
        status: 'planned',
        description: 'UKG Pro + intent play — 880 companies',
        features: [
          '880 UKG Pro + Bombora intent companies from Explorium',
          'Same Clay + Claude API pipeline',
          'HubSpot sequence: UKG Pro intent-driven pitch',
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
