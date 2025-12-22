# Nano Banana Pro — ABFI Mockup Generation Guide

**Purpose:** Reference visuals only · Design Authority compliant

---

## 1. Purpose of Nano Banana Mockups (Important)

Nano Banana outputs are **reference artefacts**, not source-of-truth designs.

### They Are Used To

| Purpose | Context |
|---------|---------|
| Sanity-check visual tone | Validate aesthetic direction |
| Align stakeholders quickly | Fast visual communication |
| Communicate intent | Engineers and reviewers |
| Support Figma execution | Reference for detailed work |

### They Must Not

| Prohibition | Reason |
|-------------|--------|
| Introduce new components | Design Authority governs |
| Invent layout patterns | Must follow system |
| Override the Design Authority | Authority is binding |

---

## 2. Global Prompt Header (Use Every Time)

Paste this at the top of every Nano Banana prompt:

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system
```

> This dramatically improves output quality.

---

## 3. Locked Visual Style (From Design Authority)

### Typography

| Rule | Specification |
|------|---------------|
| Font family | Sans-serif, neutral (Inter-style) |
| Body text | Larger than typical SaaS |
| Headings | No stylised treatments |

### Colour

| Rule | Specification |
|------|---------------|
| Background | White only |
| Text | Neutral greys, near-black |
| Accent | One muted institutional accent only |
| States | All labelled (no colour-only meaning) |

### Layout

| Rule | Specification |
|------|---------------|
| Alignment | Left-aligned content |
| Sections | Clear separation |
| Spacing | Generous |
| Chrome | Minimal |

---

## 4. Allowed Components (Only These)

Explicitly tell Nano Banana it may only use:

| Component | Purpose |
|-----------|---------|
| `PageHeader` | Page title and actions |
| `RoleHeader` | Role-specific header with progress |
| `Card` | Content containers |
| `StatsGrid` | KPI tiles (max 3) |
| `ListingSummaryCard` | List items |
| `EvidenceProgressCard` | Evidence status |
| `ScoreCard` | Bankability/confidence display |
| `Tabs` | Underline style only |
| `Table` | Simple data tables |
| `Alert` | Boxed text notifications |
| `Drawer` | Right side panels |
| `EmptyState` | No data states |

### Do Not Allow

| Prohibited | Reason |
|------------|--------|
| Charts (unless defined) | Not in component system |
| Decorative icons | Enterprise style |
| Hero imagery | Not institutional |
| Animations | Print-safe requirement |

---

## 5. Canonical Prompts (Copy/Paste)

### A. Grower Dashboard (Reference Mockup)

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system

Generate a reference UI mockup of a Grower Dashboard for an institutional bioenergy platform.

Layout:
- Left navigation sidebar (expanded)
- Top header with role indicator
- Main content column

Include sections in this order:
1. RoleHeader with progress indicator and primary action "Continue setup"
2. A prominent card titled "Your next best step" with checklist items
3. Three KPI tiles: Visibility, Confidence, Buyer inquiries
4. A section titled "Your listings" showing 2 listing summary cards
5. A card titled "Evidence & certificates" with progress bar
6. Optional map card at the bottom

Style:
- Calm, neutral, audit-safe
- No gradients or illustrations
- Clear labels for all statuses
- Large readable text
```

---

### B. Developer Dashboard (Reference Mockup)

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system

Generate a reference UI mockup of a Developer Dashboard for a bioenergy supply platform.

Include:
- RoleHeader showing "Supply pipeline active"
- KPI tiles: Supply coverage, Bankable supply, Active suppliers
- A card titled "Key supply gap identified"
- A section titled "Shortlisted suppliers" with listing cards
- A card titled "Key risks & signals"

Design tone:
- Professional, analytical
- Slightly denser than grower view
- No decorative elements
```

---

### C. Lender Dashboard (Reference Mockup)

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system

Generate a reference UI mockup of a Lender Dashboard for an institutional energy platform.

Include:
- RoleHeader showing "Projects under review"
- KPI tiles: Projects monitored, Bankable projects, Open risks
- A table titled "Projects under review"
- A card titled "Portfolio risk signals"

Design tone:
- Conservative, credit-committee safe
- No colour emphasis without labels
- Minimal interaction cues
```

---

### D. Deal Room — Overview

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system

Generate a reference UI mockup of a Deal Room overview screen.

Include:
- PageHeader titled "Deal Room"
- A deal summary card with stage indicator
- Two side-by-side cards: Bankability Score and Evidence Status
- An alert indicating "Waiting on supplier response"
- Tabs: Overview, Evidence, Terms, Activity

Style:
- Neutral, shared workspace tone
- No branding emphasis
```

---

### E. Contracted Execution Dashboard

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system

Generate a reference UI mockup of a Contracted Supply Overview dashboard.

Include:
- Contract summary strip
- KPI tiles: Delivery status, Evidence freshness, Risk signals
- A card titled "Delivery & commitments"
- A card titled "Ongoing evidence & compliance"
- A card titled "Monitoring & signals"

Style:
- Read-only bias
- Status-focused, not metric-heavy
```

---

### F. Assurance Pack Cover (Export Reference)

```
You are generating reference UI mockups for an institutional infrastructure platform.
Design must follow:
- conservative, audit-safe enterprise style
- no gradients, no marketing visuals
- grayscale-safe, print-safe
- calm, neutral, professional tone
- no consumer SaaS aesthetics
- no new UI components beyond a defined system

Generate a reference cover page design for an institutional PDF export.

Format: A4 portrait
Title: "ABFI Assurance Summary"

Include:
- Document title (prominent, professional)
- Project name placeholder
- Contract ID placeholder
- Parties section (Supplier, Buyer, Lender)
- Issue date placeholder
- Status indicator (Active)
- Subtle background pattern (optional, very light)
- Footer with legal disclaimer placeholder

Style:
- Credit memo / government report aesthetic
- Must work in black & white print
- No gradients or complex graphics
- Near-black text on white background
```

---

## 6. Output Evaluation Checklist (Very Important)

For each Nano Banana output, quickly check:

| Check | Pass? |
|-------|-------|
| Does it look printable in black & white? | ☐ |
| Is every status labelled with text? | ☐ |
| Are there max 3 KPIs? | ☐ |
| Is there only one primary action? | ☐ |
| Does it avoid consumer SaaS styling? | ☐ |

> If any answer is "no" → regenerate.

---

## 7. How to Use the Outputs Properly

### Correct Usage

| Action | Context |
|--------|---------|
| Reference in Figma comments | Link to inspiration |
| Share with stakeholders | Alignment tool |
| "This is the direction" visuals | Intent communication |
| Validate hierarchy and spacing | Layout reference |

### Incorrect Usage

| Action | Why Wrong |
|--------|-----------|
| Copy/paste into Figma as final | Not source of truth |
| Let mockups override component specs | Authority governs |
| Use mockups to justify new components | System is locked |

---

## 8. File Naming & Traceability

### Naming Convention

```
ABFI_NanoBanana_[Screen]_ref_v[N].png
```

**Examples:**
```
ABFI_NanoBanana_GrowerDashboard_ref_v1.png
ABFI_NanoBanana_DealRoom_ref_v1.png
ABFI_NanoBanana_AssuranceCover_ref_v1.png
```

### Storage Location

```
/design/references/
```

### Traceability

Link to Design Authority baseline commit: `04f91fc`

---

## 9. Final Advice (Important)

> Nano Banana is best treated as: **"A fast sketching assistant with taste constraints."**

You've already done the hard work:
- Governance ✅
- System ✅
- Language ✅
- Exports ✅

The mockups are just validation of that work, not a replacement for it.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| `FIGMA_DESIGN_AUTHORITY_DOCUMENT.md` | Binding governance |
| `FIGMA_PLATFORM_DESIGN_BRIEF.md` | Module definitions |
| `FIGMA_GROWER_DASHBOARD_CONTENT.md` | Content specifications |
| `FIGMA_ASSURANCE_PACK_STYLE.md` | Export style rules |

