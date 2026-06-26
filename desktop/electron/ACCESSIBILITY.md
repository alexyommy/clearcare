# CareConnect Desktop — Accessibility Notes

## Target Users

CareConnect is designed for caregivers supporting elderly individuals with low vision. Desktop accessibility focuses on keyboard navigation, screen reader support, and visual customization for users who may have difficulty with small text, low contrast, or complex interfaces.

## WCAG 2.1 Level AA Compliance

### 1. Perceivable

| Criterion | Implementation |
|-----------|---------------|
| **1.4.3 Contrast (Minimum)** | Primary text uses `#212121` on `#F8FAFB` (contrast ratio 14.5:1). All interactive elements exceed 4.5:1 ratio. High contrast mode provides `#FFFFFF` on `#000000` (21:1). |
| **1.4.8 Visual Presentation** | Dyslexia-friendly font (Atkinson Hyperlegible), left-aligned text, line-height 1.6, letter-spacing 0.012em, word-spacing 0.16em. No justified text. |
| **1.4.11 Non-text Contrast** | UI components (buttons, inputs, toggles) have borders and fill colors that meet 3:1 contrast against adjacent colors. |
| **1.4.12 Text Spacing** | Line-height 1.6×, paragraph spacing via layout gaps, letter-spacing 0.012em, word-spacing 0.16em — all without clipping. |
| **1.4.1 Use of Color** | Status badges pair color with text labels ("✓ Completed", "⏳ Pending"). Priority uses both color and position. Category uses color dots alongside text labels. |

### 2. Operable

| Criterion | Implementation |
|-----------|---------------|
| **2.1.1 Keyboard** | All primary actions reachable via keyboard shortcuts (see KEYBOARD_SHORTCUTS.md). All interactive elements have `tabIndex` and keyboard event handlers. |
| **2.4.3 Focus Order** | Logical tab order: Sidebar → Toolbar → Main content → Detail panel. Tab flows left-to-right, top-to-bottom within each region. |
| **2.4.7 Focus Visible** | Global `:focus-visible` style: 3px solid `#2E86C1` outline with 2px offset. Visible on all interactive elements. |
| **2.4.6 Headings and Labels** | All sections use semantic headings (`<h1>` through `<h3>`). Form inputs have associated `<label>` elements. ARIA labels on navigation and toolbar regions. |

### 3. Understandable

| Criterion | Implementation |
|-----------|---------------|
| **3.1.5 Reading Level** | Microcopy uses short, plain sentences. Button labels are action verbs ("Sign In", "Mark as Complete", "Delete"). |
| **3.2.3 Consistent Navigation** | Sidebar navigation and toolbar remain in the same position across all screens. Menu bar order is consistent (File, Edit, View, Help). |
| **3.3.1 Error Identification** | Login form shows inline error messages with `role="alert"` for screen reader announcement. Error banner has red left border and distinct background for visual identification. |

### 4. Robust

| Criterion | Implementation |
|-----------|---------------|
| **4.1.2 Name, Role, Value** | ARIA roles on navigation (`role="navigation"`), toolbar (`role="toolbar"`), main content (`role="main"`), and detail panel (`role="region"`). ARIA labels on all interactive elements. `aria-current="page"` on active sidebar item. |

## Focus Order Diagram

```
┌──────────────────────────────────────────────────────────┐
│  Menu Bar (File → Edit → View → Help)                     │
├──────────┬───────────────────────────────────────────────┤
│          │  Toolbar: Title → Search → Action buttons      │
│  Sidebar │───────────────────────────────────────────────│
│          │                                               │
│  Nav     │  Main Content Area                            │
│  Items   │  (screen-specific focus order)                │
│  ↓       │                                               │
│  User    │                              Detail Panel     │
│  Footer  │                              (if visible)     │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘

Tab order: Sidebar items → Toolbar search → Toolbar actions → Main content → Detail panel
```

## Focus Indicators

- **Default**: 3px solid `#2E86C1`, offset 2px, border-radius 4px
- **High contrast mode**: 3px solid `#FFFFFF` on black background
- **Buttons**: Focus ring plus slight background change
- **Inputs**: Focus ring plus border color change to `#1A5276`
- **Sidebar items**: Focus ring plus background highlight

## Adjustable Settings

| Setting | Range | Shortcut |
|---------|-------|----------|
| Font size | 12px – 32px | `Ctrl+=` / `Ctrl+-` |
| High contrast | On / Off | `Ctrl+Shift+H` |
| Dark mode | On / Off | `Ctrl+Shift+D` |

---

SWEN 661 · UMGC Team 2 · Spring 2026
