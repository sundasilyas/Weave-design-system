# sundas-design-system

Design system documentation site in plain HTML, CSS and JavaScript. It has no frameworks and no build step.

## View it

Double-click `index.html` to open it in a browser. You don't need a server, but you do need an internet connection for the icons.

## Where things live

| Path | What it is |
| --- | --- |
| `index.html` | Overview page |
| `foundations/` | Colours, Typography, Spacing, Icons |
| `components/` | One page per component, all using the same template |
| `css/tokens.css` | **Every design value.** This is the only file with raw values. |
| `css/components.css` | Component styles, using tokens only |
| `css/docs.css` | Site layout (sidebar, page sections, cards), using tokens only |
| `js/main.js` | Builds the sidebar and Overview cards from one list (`NAV`), and loads the Lucide icons |
| `js/illustrations.js` | Hand-drawn sketches on the Overview cards (uses Rough.js) |
| `assets/icons/` | Empty. Icons come from [Lucide](https://lucide.dev) via a CDN. |

## Adding a component

1. Copy any file in `components/`, rename it, and change the title and description.
2. Add a line for it to `NAV` in `js/main.js`.
3. Add a drawing for its Overview card in `js/illustrations.js`.

The sidebar and the Overview cards update automatically.
