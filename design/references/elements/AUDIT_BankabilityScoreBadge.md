# Nano Banana Audit — BankabilityScoreBadge

**Task ID:** `m9Q86N72eYggNfWch4qnNL`
**Element Study:** #1
**Component:** `Domain/BankabilityScoreBadge`
**Audit Date:** 2025-12-23

---

## Task Output Summary

5 variations generated:
1. Vertical table format with grid structure
2. Horizontal stacked sections with grayscale shading
3. 2x2 matrix layout with bordered boxes
4. Numbered list format (memo style)
5. Definition-list layout with indented descriptors

All variations show 4 ratings: Excellent, Good, Medium, Risk
All include score bands with plain-English meanings

---

## A. Structural Conformance (Hard Gate)

**Schema requires:**
- Variants: `grade`, `size`, `context`
- Props: `label`, `gradeText`, `descriptor`, `showDescriptor`, `confidence`, `showScore`

| Check | V1 | V2 | V3 | V4 | V5 |
|-------|----|----|----|----|-----|
| Single grade per badge | ✅ | ✅ | ✅ | ✅ | ✅ |
| Label present | ✅ | ✅ | ✅ | ✅ | ✅ |
| Descriptor (plain English) | ✅ | ✅ | ✅ | ✅ | ✅ |
| No numeric score required | ✅ | ✅ | ✅ | ✅ | ✅ |
| No circular gauges | ✅ | ✅ | ✅ | ✅ | ✅ |
| No progress rings | ✅ | ✅ | ✅ | ✅ | ✅ |

**Result:** ✅ ALL PASS

---

## B. Semantic Purity (Hard Gate)

**Must NOT show:** Confidence mixed in, trend arrows, metrics, multiple descriptors

| Check | V1 | V2 | V3 | V4 | V5 |
|-------|----|----|----|----|-----|
| No confidence mixed in | ✅ | ✅ | ✅ | ✅ | ✅ |
| No trend arrows | ✅ | ✅ | ✅ | ✅ | ✅ |
| No extraneous metrics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Single descriptor per grade | ✅ | ✅ | ✅ | ✅ | ✅ |

**Result:** ✅ ALL PASS

---

## C. Role Context Consistency

| Check | V1 | V2 | V3 | V4 | V5 |
|-------|----|----|----|----|-----|
| Plain language (grower-safe) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Structured labels (developer) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Audit-safe phrasing (lender) | ✅ | ✅ | ✅ | ✅ | ✅ |
| No colour dependency (export) | ✅ | ✅ | ✅ | ✅ | ✅ |

**Result:** ✅ ALL PASS

---

## D. Variant Completeness

**Schema variants:** `excellent`, `good`, `medium`, `risk`

| Check | V1 | V2 | V3 | V4 | V5 |
|-------|----|----|----|----|-----|
| All 4 grades shown | ✅ | ✅ | ✅ | ✅ | ✅ |
| No extra grades implied | ✅ | ✅ | ✅ | ✅ | ✅ |
| Uses exact terminology | ✅ | ✅ | ✅ | ✅ | ✅ |

**Result:** ✅ ALL PASS

---

## E. Export Survivability Check

**Test:** "Printed in black & white, reviewed in Senate Estimates"

| Check | V1 | V2 | V3 | V4 | V5 |
|-------|----|----|----|----|-----|
| No hue reliance | ✅ | ✅ | ✅ | ✅ | ✅ |
| No small grey text | ✅ | ✅ | ✅ | ✅ | ✅ |
| No icons without labels | ✅ | ✅ | ✅ | ✅ | ✅ |
| No decorative affordances | ✅ | ✅ | ✅ | ✅ | ✅ |
| Text-first hierarchy | ✅ | ✅ | ✅ | ✅ | ✅ |

**Result:** ✅ ALL PASS

---

## Audit Decision

| Variation | Outcome | Action |
|-----------|---------|--------|
| V1 (Vertical table) | ✅ Conformant | Consider for export context |
| V2 (Horizontal stacked) | ✅ Conformant | Consider for UI context |
| V3 (2x2 matrix) | ⚠️ Adaptable | Shows all 4, less suitable for single badge |
| V4 (Numbered list) | ✅ Conformant | Best for memo/export style |
| V5 (Definition-list) | ✅ Conformant | Good for documentation |

---

## Winner Selection

**Selected:** Variation 4 (Numbered list / memo style)

**Reason:**
- Text-first hierarchy is clearest
- Survives grayscale without adjustment
- Most suitable for credit memo integration
- Professional memo style matches institutional tone
- Single-badge extraction possible

---

## Figma Implementation Notes

```
Component: Domain/BankabilityScoreBadge
Implements: FIGMA_BANKABILITY_AUTHORITY_SCHEMA.md
Task ID: m9Q86N72eYggNfWch4qnNL
Selected: Variation 4

Variants:
  grade: excellent | good | medium | risk
  size: sm | md
  context: grower | developer | lender | export

Properties:
  label: "Bankability" (default)
  gradeText: Auto-mapped
  descriptor: Max 80 chars
  showDescriptor: true (default)
  confidence: high | medium | low (optional)
  showScore: false (default)
  exportSafe: true
```

**No semantic changes from schema.**
