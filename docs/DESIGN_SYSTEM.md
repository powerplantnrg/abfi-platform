# ABFI Design System v2.1

> Hybrid Corporate + Modern design system for the ABFI Platform

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| Navy | `#1E3A5A` | Primary brand, headings, navigation |
| Gold | `#D4AF37` | CTAs, accents, highlights, premium features |
| Emerald | `#10B981` | Success states, positive indicators, eco themes |

### Secondary Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | `#FFFFFF` | Backgrounds, cards |
| Warm Gray 50 | `#FAFAF9` | Section backgrounds |
| Warm Gray 100 | `#F5F5F4` | Subtle backgrounds |
| Warm Gray 400 | `#A8A29E` | Muted text, borders |
| Warm Gray 700 | `#44403C` | Body text |
| Warm Gray 900 | `#1C1917` | Dark text |

### Status Colors
| Name | Hex | Usage |
|------|-----|-------|
| Red | `#EF4444` | Errors, critical alerts |
| Amber | `#F59E0B` | Warnings, pending states |
| Blue | `#3B82F6` | Information, links |

## Typography

### Font Families
- **Headings**: Space Grotesk (geometric sans-serif)
- **Body**: Inter (clean sans-serif)
- **Monospace**: JetBrains Mono (data, code, IDs)

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 48px / 3rem | 700 | 1.1 |
| H2 | 36px / 2.25rem | 600 | 1.2 |
| H3 | 24px / 1.5rem | 600 | 1.3 |
| H4 | 20px / 1.25rem | 600 | 1.4 |
| Body | 16px / 1rem | 400 | 1.6 |
| Small | 14px / 0.875rem | 400 | 1.5 |
| Caption | 12px / 0.75rem | 500 | 1.4 |

## Layout Principles

### Spacing
- Base unit: 4px
- Common spacings: 8, 16, 24, 32, 48, 64, 96px
- Section padding: 64px (desktop), 32px (mobile)
- Card padding: 24px
- Grid gap: 24px

### Grid System
- Max width: 1280px (content), 1440px (full-bleed)
- Columns: 12
- Gutter: 24px
- Asymmetrical layouts preferred for visual interest

### Whitespace
- Generous margins between sections
- Cards "breathe" with internal padding
- Headlines have extra top margin

## Components

### Buttons

**Primary (Gold CTA)**
```css
background: #D4AF37;
color: #1E3A5A;
font-weight: 600;
padding: 12px 24px;
border-radius: 8px;
box-shadow: 0 2px 4px rgba(212, 175, 55, 0.3);
```

**Secondary (Navy outline)**
```css
background: transparent;
border: 2px solid #1E3A5A;
color: #1E3A5A;
```

**Ghost**
```css
background: transparent;
color: #1E3A5A;
text-decoration: underline;
```

### Cards
- White background
- Subtle shadow: `0 1px 3px rgba(0,0,0,0.1)`
- Border radius: 12px
- Hover: lift with increased shadow

### Navigation
- Fixed header with Navy background
- White text, Gold accent for active state
- Mobile: slide-out drawer

### Forms
- Labels above inputs
- Navy focus ring
- Gold accent on active/selected
- Clear validation states

## Page Templates

### 1. Marketing Pages
- Full-width hero with asymmetric layout
- Card grid for features
- Trust section with logos
- Gold CTA sections

### 2. Dashboard Pages
- Sidebar navigation (Navy)
- White content area
- Stats cards at top
- Data tables with alternating rows

### 3. Form Pages
- Centered card layout
- Progress indicator for multi-step
- Clear section groupings

### 4. Detail Pages
- Two-column layout (main + sidebar)
- Breadcrumb navigation
- Action buttons in header

### 5. List/Browse Pages
- Filter sidebar
- Grid or list toggle
- Pagination at bottom

---

## Tailwind CSS Configuration

```javascript
// tailwind.config.js additions
module.exports = {
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1E3A5A',
          50: '#E8EDF2',
          100: '#D1DBE5',
          // ...
        },
        gold: {
          DEFAULT: '#D4AF37',
          50: '#FCF8EB',
          // ...
        },
      },
      fontFamily: {
        heading: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
}
```

---

## Page Redesign Checklist

### Public Pages (Priority 1)
- [ ] Home / Landing
- [ ] For Developers
- [ ] For Growers
- [ ] For Lenders
- [ ] Platform Features

### Core User Flows (Priority 2)
- [ ] Dashboard
- [ ] Browse / Marketplace
- [ ] Futures Marketplace
- [ ] Supplier Profile
- [ ] Buyer Profile

### Registration Flows (Priority 3)
- [ ] Supplier Registration
- [ ] Buyer Registration
- [ ] Producer Registration
- [ ] Project Registration

### Feature Pages (Priority 4)
- [ ] Bankability Assessment
- [ ] Compliance Dashboard
- [ ] Evidence Management
- [ ] Map View

### Admin (Priority 5)
- [ ] Admin Dashboard
- [ ] User Management
- [ ] Assessor Workflow

---

*Design system created for ABFI Platform v2.1 upgrade*
