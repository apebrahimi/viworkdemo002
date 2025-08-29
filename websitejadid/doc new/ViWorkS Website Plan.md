ViWorkS Website Plan 

Author: Website Solution Architect & UX Strategist
Goal: Production-quality, enterprise-ready website that builds trust, drives qualified demos, and showcases world-class Support & Services—without exposing sensitive implementation details.

⸻

1) Goals & Audiences

Primary Goals
	•	Trust: Demonstrate high-assurance posture (stealth ingress, device identity, in-memory bootstrap, SIEM visibility) without revealing exploitable specifics.
	•	Conversion: Drive Request Demo and Talk to Sales as primary CTAs; Contact Support for existing customers.
	•	Enablement: Provide enough clarity for stakeholders to progress to NDA briefings/PoCs.
	•	Education: Explain the problem/approach, deployment (On-Prem / Cloud), Support & Services (SLAs, onboarding, training, PS).

Support-Specific Goals
	•	Set clear expectations on support tiers, SLAs, severity definitions, escalation paths, status visibility, and customer success.
	•	Provide a frictionless Support Portal entry, Knowledge Base, and Status page.
	•	Showcase Onboarding, Training, and Professional Services.

KPIs
	•	Demo requests, sales calls, PoC requests, enterprise contact forms.
	•	Support: Time-to-First-Response (TTFR), Time-to-Resolve (TTR), CSAT, % tickets via KB deflection.

Audiences

Primary: CISOs, Security Architects, IT Admins/NetOps/DevOps/SREs, GRC/Compliance.
Secondary: Procurement/Legal, SOC Managers, MSSP partners, Analysts/Candidates, Customer Support/Helpdesk leads.

⸻

2) Page Map / Site Structure

Top Navigation (Header)
	•	Home /
	•	Product 
	•	Solutions 
	•	Security /security
	•	Plans & SLAs /support/plans (8×5 / 24×7, response & resolution targets)
	•	Knowledge Base /support/kb (public & customer-only sections)
	•	Customer Portal (Login) /support/portal (SSO)
	•	Company /company (About, Careers, Newsroom)
	•	Contact /contact
	•	CTA Buttons: Request Demo, Talk to Sales, Contact Support (for logged-in customers)

Footer
	•	Repeated primary links & CTAs
	•	Legal: Privacy, Terms, DPA, Security Statement, Responsible Disclosure
	•	Status /status
	•	Language: FA / EN
	•	© ViWorkS

Page Roles (high-level)
	•	Support: Enterprise-grade support commitment; SLA matrix, severity levels, escalations, portal access, KB, status, onboarding/training/PS offers.

⸻

3) Homepage Strategy

Why the Homepage Matters

Earn trust quickly; explain what ViWorkS does and why it’s different; guide to Demo/Sales and clearly surface Support credibility for enterprises.

Core Sections & Purpose
	1.	Hero: Value prop + primary CTAs (Demo/Sales).
	2.	Trust Bar: Logos/testimonials/analyst quotes (when available); compliance readiness.
	3.	How It Works (sanitized): “Gate → Harden → Authorize → Observe.”
	4.	Key Capabilities: Stealth ingress, device binding, in-memory bootstrap, policy/sessions, SIEM integration.
	5.	Security Highlights: Principles & controls; link to Security & NDA Briefing.
	6.	Use-Cases & Industries: Pain → outcome.
	7.	Deployment: On-Prem/Cloud.
	8.	Integrations: SIEM, IdP/SSO, monitoring.
	9.	Pricing Teaser: Enterprise motion.
	10.	FAQ: Address common security/ops questions.
	11.	Support & Services (NEW):

	•	Support tiers (8×5 / 24×7), severity definitions, SLA targets, customer portal, status page, onboarding & training, PS.
	•	CTA: Visit Support, Contact Support (if logged in).

	12.	Closing CTA: Request Demo / Talk to Sales.

All visuals remain conceptual—no ports/IPs/configs exposed.

⸻

4) Content Principles
	•	Security by design, not by disclosure: No sensitive technical parameters in public content.
	•	Two-layer detail model:
	•	Public: conceptual + outcomes + proof.
	•	Gated/NDA: deep technicals (threat models, configs).
	•	Tone: professional, measured, security-first.
	•	Support clarity without ops leakage: Publish SLAs, severity definitions, escalation ladder, and coverage hours; keep runbooks and internal SRE playbooks private.
	•	Bilingual parity: FA primary, EN secondary.

⸻

5) Design & UX Guidelines

Visual Language

Modern, high-trust aesthetic; subtle motion via Framer Motion; accessible color/contrast.

UX Principles
	•	Mobile-first, responsive; CWV targets (LCP < 2.5s, INP < 200ms, CLS < 0.1).
	•	Clear CTAs; persistent header CTAs; progressive disclosure.

Components (shadcn/ui + Tailwind)
	•	Shared: Header, Footer, NavMenu, LanguageSwitcher, ThemeToggle, CTASection.
	•	Marketing: Hero, TrustBar, FeatureGrid, HowItWorks, SecurityHighlights, UseCaseGrid, IntegrationList, FAQAccordion.
	•	Support:
	•	SupportOverview (cards: Tiers, SLAs, Escalation, Portal, Status, Onboarding, Training, PS)
	•	SLATable (sev levels, TTFR, TTR targets)
	•	EscalationLadder (L1→L2→Duty Manager→Exec Sponsor)
	•	KBSearch (typeahead) + KBCategoryList
	•	PortalLoginButton (SSO)
	•	StatusEmbed (iframe/link)
	•	ContactSupportForm (authenticated)
	•	ServiceCards (Onboarding/Training/PS)

Accessibility (WCAG 2.1 AA)

High contrast, focus outlines, keyboard navigation, ARIA roles, respect prefers-reduced-motion.

SEO & Performance
	•	Semantic HTML, Next SEO, OG/Twitter cards.
	•	Sitemap, robots, canonical URLs.
	•	Optimized images/SVG, ISR for content.
	•	CSP, HSTS, Referrer-Policy.

Privacy & Analytics
	•	Plausible or GA4 with IP anonymization.
	•	Track: demo_request, sales_contact, support_portal_click, kb_search, kb_view, support_ticket_submit, status_view.

⸻

6) Stack & Dev Notes

Tech Stack
	•	Next.js 15 (App Router) + TypeScript
	•	pnpm
	•	Tailwind + shadcn/ui
	•	Framer Motion
	•	MDX (blog/docs/KB)
	•	ESLint + Prettier; Husky + lint-staged
	•	Hosting: Vercel (primary) or containerized alternative

Project Structure (excerpt)

/app
  /(marketing)
    page.tsx
    product/page.tsx
    solutions/[slug]/page.tsx
    security/page.tsx
    deployment/page.tsx
    pricing/page.tsx
    resources/page.tsx
    faq/page.tsx
    company/about/page.tsx
    contact/page.tsx
  /(support)
    support/page.tsx                 # Support Overview
    support/plans/page.tsx           # Plans & SLAs
    support/kb/page.tsx              # KB landing
    support/kb/[slug]/page.tsx       # KB article (MDX)
    support/portal/page.tsx          # SSO handoff
    support/onboarding/page.tsx
    support/training/page.tsx
    support/professional-services/page.tsx
  /status/page.tsx                   # Embed or redirect
/components/marketing
/components/support                   # NEW support components
/content/kb/*.mdx                     # KB content
/lib/analytics.ts /lib/seo.ts /lib/i18n.ts

Support Integrations
	•	Customer Portal: SSO (OIDC/SAML) to ticketing (Zendesk or Jira Service Management).
	•	KB: MDX + search (client-side or Algolia).
	•	Status: statuspage embed or custom.
	•	Forms: Server Actions/API routes → ticket creation via backend proxy (no secrets in client).

Internationalization
	•	Next.js i18n (FA/EN) + RTL support for FA.
	•	KB content per locale; mirrored structure.

⸻

Appendix A — Support Information Architecture

Support Overview (why customers trust our support; coverage; how to engage).
Plans & SLAs
	•	Tiers: Standard (8×5), Premium (12×5), Enterprise (24×7).
	•	Severity levels & targets:
	•	Sev-1 (Critical): TTFR 15m, TTR target 4h, 24×7.
	•	Sev-2 (High): TTFR 1h, TTR target 1 business day.
	•	Sev-3 (Normal): TTFR 4h, TTR target 3 business days.
	•	Sev-4 (Low): TTFR 1 business day, TTR best-effort.
	•	Channels: portal (primary), email (secondary), phone (Enterprise).
	•	Escalation: L1 → L2 → Duty Manager → Exec Sponsor; documented timelines.

Knowledge Base
	•	Getting Started (Onboarding, PoC)
	•	Operations (Admin Panel basics, common tasks)
	•	Troubleshooting (connectivity, policy, telemetry)
	•	Security & Compliance (high-level statements)
	•	Release Notes (public-safe)

No sensitive configs or internal playbooks.

Customer Portal (Login)
	•	SSO; view tickets, SLAs, assets, contacts; submit requests (templates).

Status
	•	Uptime, incidents, maintenance, history; subscribe via email/RSS.

Onboarding
	•	PoC steps, success criteria, timeline, roles (customer & ViWorkS).

Training
	•	Admin training, SOC integration workshop, update processes.

Professional Services
	•	Architecture advisory, SIEM rule authoring, compliance mapping workshops, migration planning.

⸻

Appendix B — SLA Matrix (Public-Facing)

Severity	Example	Coverage	First Response	Update Cadence	Target Resolution
Sev-1 Critical	Wide outage, auth broken	24×7 (Enterprise)	≤ 15 min	≤ 60 min	4h target
Sev-2 High	Major feature degraded	Business hours (tier-based)	≤ 1h	≤ 4h	1 biz day
Sev-3 Normal	Non-blocking issue	Business hours	≤ 4h	Daily	3 biz days
Sev-4 Low	Question/How-to	Business hours	≤ 1 biz day	Every 2–3 days	Best-effort

Exact SLAs per contracted tier; public page shows representative targets.

⸻

Appendix C — Escalation Ladder (Public-Facing)
	1.	L1 Support Engineer → triage, workarounds.
	2.	L2 Support/Platform Engineer → deeper diagnostics, logs.
	3.	Duty Manager / Incident Commander → coordination, comms, ETA.
	4.	Executive Sponsor (for sustained Sev-1 or strategic accounts).

Status Communication: status page + incident updates; final post-mortem for Sev-1 (under NDA if needed).

⸻

Appendix D — Support UX & Forms
	•	Contact Support (logged-in): prefilled account, environment, severity selection with guardrails.
	•	KB Search: typahead with category facets; show related articles before ticket submit (deflection).
	•	Ticket Templates: Onboarding, Incident, Change Request, Feature Request, Compliance Question.
	•	Accessibility: ARIA for forms; clear error states; phone fallback (Enterprise).

⸻

7) Content Principles for Support
	•	Be concrete on process and commitments (SLAs, severity, hours, escalation).
	•	Avoid exposing internal runbooks, infrastructure details, or security configs.
	•	Offer NDA-bound post-incident reports and security briefings.
	•	Emphasize partnership: onboarding, training, PS, and success checkpoints.

⸻

8) Design & UX for Support (Additions)
	•	Prominent Support link in header & footer.
	•	Status indicator badge (green/amber/red) near Support link (optional).
	•	Clear visual hierarchy for Plans & SLAs; readable tables.
	•	Inline links from KB to Contact Support if unresolved.

⸻

9) Stack & Dev Notes for Support
	•	Ticketing: Integrate Jira Service Management or Zendesk via backend proxy (server-side secrets).
	•	Portal SSO: OIDC/SAML; per-tenant roles & permissions.
	•	KB: MDX content repo; simple editorial workflow + preview.
	•	Status: Embed third-party statuspage or build minimal internal with uptime data.
	•	Analytics: Track KB deflection (view-before-ticket), TTFR/TTR via ticketing API.

⸻

Appendix E — Performance, SEO, Analytics (Support Additions)
	•	KB pages: schema.org FAQPage where appropriate.
	•	Lazy-load heavy embeds (status/portal previews).
	•	Events: kb_search, kb_article_view, support_portal_click, support_ticket_submit, status_view.

⸻

Appendix F — Content Safety & Disclosure Policy (Support)
	•	Publish SLA commitments, severity definitions, escalation, coverage windows.
	•	Do not publish internal IPs, ports, logs, stack traces, runbooks, detection rules, or credentials.
	•	For incident comms: scope and remediation without exploitable detail; detailed RCA under NDA.

⸻

Appendix G — Roadmap (Support Rollout)
	•	Phase 1: Support Overview, Plans & SLAs, KB shell, Status link, Contact Support form (routes to email/ticketing).
	•	Phase 2: Portal SSO integration, KB search, localization (FA/EN), PS offerings.
	•	Phase 3: Customer analytics dashboard (ticket trends, CSAT), proactive health-checks feed.

