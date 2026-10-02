# My Design System

## Stack
- Plain HTML, CSS and JavaScript only. No frameworks, no build tools.
- Open index.html directly in a browser. No server needed, so all links must be relative.

## Structure
- index.html = overview. foundations/ = foundation pages (colours, typography, spacing, icons). components/ = one page per component, including form elements.
- css/tokens.css = all design values. css/components.css = component styles. css/docs.css = site layout.
- The top bar (logo, Get started / Components menu, page search) and the sidebar are both built once in js/main.js and shared by every page. The top bar search lists pages from `NAV`, so new pages are searchable automatically.
- Stacking order uses the `--layer-*` tokens, never raw z-index numbers.
- The `NAV` list in js/main.js is the single source for the sidebar AND the overview cards (name, file, one-sentence purpose).
- Overview card illustrations: hand-drawn wireframes in js/illustrations.js, drawn with Rough.js (CDN, pinned as `ROUGH_VERSION` in js/main.js, loaded only on pages that use it: the Overview and Typography pages). They use pink-50 background, pink-600 strokes and pink-200 placeholder lines, all on the same 240 × 120 canvas. The Typography page breakpoint illustration is drawn in the same file.
- Icons: Lucide from the jsDelivr CDN, pinned to one version (`LUCIDE_VERSION` in js/main.js). main.js is the only place the script is loaded. Write `<i data-lucide="name">` to use an icon. Don't add local icon files or hand-written SVGs.

## Colour
- Two layers: base palette (ramps like blue-50 to blue-900) and semantic tokens (primary, text, surface, border, success, warning, error, info).
- Components only use semantic tokens, never base palette colours directly.
- Base palette names have no `color-` prefix (`--pink-600`, `--grey-200`, `--green-50`). Semantic tokens do (`--color-primary`, `--color-surface-muted`, `--color-error-bg`).
- Ramps: pink (brand) and grey, 50–900. Green, amber, red and blue have only 50 / 200 / 600, for alerts.
- Data visualisation colours are `--dataviz-1` to `--dataviz-6`. Use them in that order.
- Focus ring uses `--color-primary`.
- Pink (primary) is for actions only: buttons, links, focus, and interactive hover states. Don't use it for "you are here" states, labels or decoration. The exception is the Overview illustrations, which were requested in pink.
- Sidebar: the current page is a 12px-rounded rectangle (`--radius-lg`), `--grey-200` background with `--grey-900` semi-bold text. Hover is `--grey-100` with the same radius.
- The Colours page shows base palette colours only, with friendly names ("Pink 50"). It doesn't show semantic tokens, but they stay in tokens.css for components.
- Colours page contrast matrix: the colours are listed in foundations/colours.html (`data-contrast-colours`). js/main.js calculates the ratios from tokens.css, so never type ratios in by hand.

## Typography
- Inter is the only typeface, loaded from Google Fonts (weights 400, 500, 600, 700) in the <head> of every page.
- Use the responsive type scale: `--type-<style>-size` and `--type-<style>-line-height` (plus `-weight` and `-letter-spacing`), or the `.ds-text-<style>` classes in components.css. Styles: display, h1, h2, h3, h4, subheadline, body-large, body, body-small, caption, label.
- Per-breakpoint values live in tokens.css as `-mobile/-tablet/-desktop/-xl` tokens; media queries at the bottom of tokens.css switch them. Breakpoints: tablet 768px, desktop 1024px, xl 1440px (phones up to 767px). If a breakpoint changes, update both the `--breakpoint-*` token and the media queries.
- Keep lines to 60–75 characters (`--layout-measure`).
- Font sizes and line heights are in rem (in tokens.css), so text follows the browser's text size (WCAG 1.4.4). The docs show them in px by converting.
- Never put a fixed height on anything that contains text; use min-height or let it grow (WCAG 1.4.4 and 1.4.12). The only fixed-height text boxes are the deliberate "Don't" examples on the Typography page.

## Rules
- Never hardcode colours, sizes or spacing. Use tokens from css/tokens.css.
  - One exception: breakpoint numbers in @media rules (767px in docs.css, 768/1024/1440px in tokens.css), because CSS doesn't allow var() inside @media.
- 4px spacing system: `--space-0` to `--space-24`, in rem (`--space-1` = 0.25rem = 4px, `--space-4` = 1rem = 16px; the number × 4 = px). Guidelines: 4px inside a component, 8px between related elements, 16px between unrelated elements and for component padding, 24px between sub-sections, 32–48px between sections, 64px+ between major page sections.
- Use `gap` for space between items and padding on containers, not margins on each child. The `--space-example-*` tokens are off-scale values for the Spacing page's Don't examples only.
- Prefix component classes in components.css with `ds-` so they don't clash with docs.css.
- Every component page follows the same template: title and description, examples, anatomy, when to use / when not to use (one "Usage" section), variants, states, do / don't, accessibility.
- When adding a component: copy an existing page in components/, then add one entry to `NAV` in js/main.js. That entry adds it to both the sidebar and the overview cards. Then add a matching drawing in js/illustrations.js; without one, the card shows an empty pink box. Keep the page's one-line description the same as its `purpose` in `NAV`.

## Working with me
- I'm a designer. Explain changes in simple language.
- Keep code simple and well commented.
