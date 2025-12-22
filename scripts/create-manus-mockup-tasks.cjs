/**
 * Create Manus AI tasks for ABFI Figma mockup generation
 * Uses Nana Banana Pro for visual asset generation
 */

require('dotenv').config();

const MANUS_API_URL = process.env.MANUS_API_URL || 'https://api.manus.ai/v1';
const MANUS_API_KEY = process.env.MANUS_API_KEY;
const PROJECT_ID = 'TRVnNPfjGBpknA5nSGuo4C';

async function createTask(title, prompt) {
  const response = await fetch(`${MANUS_API_URL}/tasks`, {
    method: 'POST',
    headers: {
      'API_KEY': MANUS_API_KEY,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      title,
      prompt,
      project_id: PROJECT_ID
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Manus API error (${response.status}): ${error}`);
  }

  return response.json();
}

async function main() {
  if (!MANUS_API_KEY) {
    console.error('MANUS_API_KEY not configured in .env');
    process.exit(1);
  }

  console.log('Creating Manus tasks for ABFI Figma mockups...\n');

  const tasks = [
    {
      title: 'ABFI Dashboard Background Visuals - Nana Banana Pro',
      prompt: `Use Nana Banana Pro to generate visual background elements for ABFI platform dashboards.

Requirements:
1. Style: Enterprise-clean, institutional, subtle
2. Color palette: Navy (#1E3A5A), Gold (#D4AF37), neutral grays
3. Purpose: Background textures and visual accents for role-based dashboards

Generate 4 sets of background visuals:
- Grower Dashboard: Agricultural/farm themes (wheat, biomass, fields) - subtle, professional
- Developer Dashboard: Industrial/infrastructure themes (facilities, processing) - clean
- Lender Dashboard: Financial/trust themes (abstract, geometric) - conservative
- Deal Room: Partnership/negotiation themes (connection, agreement) - neutral

Each set should include:
- Hero section background (1920x600) - very subtle, low opacity
- Card accent pattern (400x300) - for highlighting sections
- Section divider element (1920x100) - horizontal accent

Style guidance:
- Conservative institutional aesthetic
- Not startup/consumer - think bank/government quality
- Subtle enough to have text overlay without distraction
- Works in both light and dark themes
- Grayscale-safe (information should not rely on color alone)

Deliver as high-resolution PNG files with transparent backgrounds where appropriate.`
    },
    {
      title: 'ABFI Icon & Illustration Set - Nana Banana Pro',
      prompt: `Use Nana Banana Pro to generate icons and illustrations for ABFI platform.

Requirements:
1. Style: Monochrome with optional gold (#D4AF37) accent, clean lines
2. Size: Vector-friendly, scalable (deliver as SVG or high-res PNG)
3. Theme: Bioenergy, feedstock, verification, finance

ILLUSTRATIONS NEEDED (6-panel explainer style):

Set 1: Grower Onboarding Journey
1. Property registration (map/boundary)
2. Production profile setup
3. Evidence upload
4. Verification process
5. Buyer visibility
6. First inquiry received

Set 2: Bankability Assessment Process
1. Data collection
2. Evidence verification
3. Risk analysis
4. Score calculation
5. Report generation
6. Lender review

Set 3: Deal Room Workflow
1. Draft (initial terms)
2. Shared (invitation sent)
3. Negotiation (discussions)
4. Agreed (terms locked)
5. Contracted (signed)
6. Monitoring (ongoing)

ICON SET NEEDED:

Feedstock types (12 icons):
- Sugarcane bagasse
- Wheat stubble
- Cotton gin trash
- Forestry residues
- Bamboo biomass
- Canola straw
- Barley straw
- Sorghum stubble
- Rice hulls
- Sawmill residues
- Urban green waste
- Agricultural waste (generic)

Status indicators (6 icons):
- Verified (checkmark style)
- Pending (clock/waiting)
- Attention (warning)
- Risk (alert)
- Expired (calendar/warning)
- Processing (loading)

Role indicators (4 icons):
- Grower/Producer
- Developer/Buyer
- Lender/Financier
- Administrator

Action icons (8 icons):
- Upload document
- Verify/approve
- Reject/decline
- Export/download
- Share/send
- Edit/modify
- Archive
- Delete

Style: Enterprise software iconography - professional, not playful. Consistent stroke weight.`
    },
    {
      title: 'ABFI Assurance Pack Cover Designs - Nana Banana Pro',
      prompt: `Use Nana Banana Pro to generate cover page designs for ABFI Assurance Pack PDF exports.

Requirements:
1. Style: Conservative institutional (bank/government document quality)
2. Format: A4 portrait (210mm x 297mm)
3. Print-safe: Must work in black & white printing

COVER VARIANTS NEEDED:

1. Institutional Assurance Pack (for lenders)
   - Title: "ABFI Assurance Summary"
   - Subtitle area for project name
   - Professional, trust-building aesthetic
   - Subtle background pattern or watermark
   - Space for: ABFI logo, Contract ID, Issue date, Parties

2. Government Reporting Summary (for ARENA/CEFC)
   - Title: "ABFI Government Reporting Summary"
   - Subtitle: "Feedstock supply assurance for funded energy projects"
   - Even more conservative than institutional
   - Minimal visual elements
   - Space for: Grant reference, Reporting period, Agency logo area

3. Covenant Monitoring Summary (periodic reports)
   - Title: "Covenant Monitoring Summary"
   - Subtitle: Reporting period
   - Concise, utilitarian design
   - Focus on clarity over decoration
   - Space for: Contract ID, Monitoring period, Status indicator

DESIGN ELEMENTS TO INCLUDE:
- ABFI logo placeholder (top or bottom, appropriately sized)
- Document title area (prominent, professional typography)
- Project/contract information section
- Subtle background pattern (optional, very light)
- Professional footer area for legal text
- Page number placeholder

COLOR CONSTRAINTS:
- Primary: Near-black text (#111111)
- Accent: Muted institutional green (optional, for "verified" status only)
- Background: White with optional very light gray pattern
- NO gradients
- NO complex graphics
- Must be fully legible in grayscale photocopy

REFERENCE STYLE:
Think credit memos, government reports, audit summaries - not marketing materials.
The cover should signal "serious institutional document" not "product brochure".

Deliver as high-resolution PNG (300 DPI) suitable for PDF embedding.`
    },
    {
      title: 'ABFI Role Dashboard Mockups - Nana Banana Pro',
      prompt: `Use Nana Banana Pro to generate visual mockup references for ABFI role-based dashboards.

Create stylized mockup visuals (not wireframes) showing the overall look and feel for:

1. GROWER DASHBOARD
   - Warm, approachable but professional
   - Shows: Progress indicator, Next step card, 3 KPI tiles, Listings section
   - Tone: "We're here to help you succeed"
   - Agricultural undertones without being folksy

2. DEVELOPER DASHBOARD
   - Action-oriented, data-informed
   - Shows: Supply coverage metrics, Shortlist cards, Risk signals
   - Tone: "Everything you need to reach financial close"
   - Industrial/infrastructure subtle visual cues

3. LENDER DASHBOARD
   - Conservative, analytical, confidence-building
   - Shows: Portfolio overview, Bankability assessments, Risk monitoring
   - Tone: "Institutional-grade oversight"
   - Financial services visual language

4. DEAL ROOM
   - Collaborative, neutral, progress-focused
   - Shows: Stage stepper, Party cards, Terms discussion, Activity feed
   - Tone: "Shared workspace for serious negotiations"
   - Clean, minimal, focused on content

5. CONTRACTED DASHBOARD
   - Monitoring, assurance, stability
   - Shows: Contract summary, Delivery timeline, Evidence status, Signals
   - Tone: "Ongoing confidence in your supply chain"
   - Calm, monitoring-focused visual treatment

Requirements:
- Each mockup should be 1440x900 (desktop viewport)
- Use the ABFI color palette: Navy (#1E3A5A), Gold (#D4AF37), neutrals
- Show realistic UI density (not too sparse, not too crowded)
- Include placeholder charts/graphs where appropriate
- Sidebar navigation should be visible
- Professional typography (Space Grotesk or similar)

Purpose: These are visual references for Figma implementation, showing the intended aesthetic before detailed component work begins.`
    }
  ];

  for (const task of tasks) {
    try {
      const result = await createTask(task.title, task.prompt);
      console.log(`✓ Created: ${result.id}`);
      console.log(`  Title: ${task.title}`);
      console.log(`  URL: ${result.url || 'pending'}\n`);
    } catch (error) {
      console.error(`✗ Failed: ${task.title}`);
      console.error(`  Error: ${error.message}\n`);
    }
  }

  console.log('Done! Check Manus dashboard for task progress.');
}

main();
