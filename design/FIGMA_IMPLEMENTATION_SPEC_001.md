# Figma Implementation Spec #001

## Component: BF/BankabilityScoreBadge

**Audit Status:** ✅ Passed
**Task ID:** `m9Q86N72eYggNfWch4qnNL`
**Selected Variation:** #4 (Numbered list / memo style)

---

## Figma Component Setup

### 1. Component Name
```
Domain / BankabilityScoreBadge
```

### 2. Variant Properties

| Property | Type | Values |
|----------|------|--------|
| `grade` | Variant | `excellent`, `good`, `medium`, `risk` |
| `size` | Variant | `sm`, `md` |
| `context` | Variant | `grower`, `developer`, `lender`, `export` |

**Total variants:** 4 × 2 × 4 = 32 combinations

### 3. Text Properties

| Property | Type | Default | Max Length |
|----------|------|---------|------------|
| `label` | Text | "Bankability" | 20 chars |
| `gradeText` | Text | Auto from grade | 12 chars |
| `descriptor` | Text | See defaults below | 80 chars |

### 4. Boolean Properties

| Property | Default |
|----------|---------|
| `showDescriptor` | true |
| `showScore` | false |
| `exportSafe` | true |

---

## Grade Text Mapping (Locked)

| Grade | gradeText | Default Descriptor |
|-------|-----------|-------------------|
| `excellent` | "Excellent" | "Strong bankability indicators across all dimensions" |
| `good` | "Good" | "Positive bankability with minor gaps" |
| `medium` | "Medium" | "Moderate bankability requiring attention" |
| `risk` | "Risk" | "Elevated risk factors identified" |

---

## Visual Specifications

### Typography

| Element | Size (md) | Size (sm) | Weight | Color |
|---------|-----------|-----------|--------|-------|
| Label | 12px | 10px | Medium | `#666666` |
| Grade | 18px | 14px | Semibold | `#1A1A1A` |
| Descriptor | 14px | 12px | Regular | `#333333` |

### Spacing

| Property | Value (md) | Value (sm) |
|----------|------------|------------|
| Padding | 16px | 12px |
| Gap (label → grade) | 4px | 2px |
| Gap (grade → descriptor) | 8px | 6px |

### Border

| Context | Border |
|---------|--------|
| `grower` | 1px solid `#E0E0E0` |
| `developer` | 1px solid `#D0D0D0` |
| `lender` | 1px solid `#C0C0C0` |
| `export` | 1px solid `#000000` |

### Background

| Context | Background |
|---------|------------|
| All UI contexts | `#FFFFFF` |
| `export` | `#FFFFFF` (no grey) |

---

## Layout Structure

```
┌─────────────────────────────────┐
│ [Label]                         │
│ [Grade]                         │
│ [Descriptor]                    │
└─────────────────────────────────┘
```

**Auto Layout:**
- Direction: Vertical
- Alignment: Left
- Spacing: See table above

---

## Context-Specific Adjustments

### grower
- Plain language descriptor
- Larger text for readability
- Softer border

### developer
- Technical descriptor acceptable
- Standard density
- Neutral border

### lender
- Conservative phrasing
- Slightly denser
- Stronger border

### export
- Maximum contrast
- No grey backgrounds
- Black borders only
- Must print cleanly in B&W

---

## Component Annotation (Required)

Add text annotation inside component:

```
Implements: FIGMA_BANKABILITY_AUTHORITY_SCHEMA.md
Derived from: Element Study Task m9Q86N72eYggNfWch4qnNL
No semantic changes permitted
```

---

## Validation Checklist

Before publishing:

- [ ] All 32 variants created
- [ ] Text properties have defaults
- [ ] Export context has no grey
- [ ] Prints cleanly in grayscale
- [ ] Annotation added
- [ ] Component locked

---

## React Prop Mapping

```typescript
interface BankabilityScoreBadgeProps {
  grade: 'excellent' | 'good' | 'medium' | 'risk';
  size?: 'sm' | 'md';
  context?: 'grower' | 'developer' | 'lender' | 'export';
  label?: string;
  gradeText?: string;
  descriptor?: string;
  showDescriptor?: boolean;
  showScore?: boolean;
}
```

---

## Files

- **Audit:** `design/references/elements/AUDIT_BankabilityScoreBadge.md`
- **Schema:** `FIGMA_BANKABILITY_AUTHORITY_SCHEMA.md`
- **Reference Images:** Download from Manus task
