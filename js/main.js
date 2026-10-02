/* ==========================================================================
   main.js — shared behaviour for every page
   --------------------------------------------------------------------------
   1. NAV: the list of every page on the site (the single source of truth)
   2. Builds the sidebar and highlights the current page
   2b. Builds the top bar (logo, menu, page search)
   3. Builds the component card grid on the Overview page
   4. Shows token values on the Foundations pages
   5. Click a colour swatch to copy its hex code
   6. Builds the contrast matrix on the Colours page
   7. "Download PDF" buttons that print one part of a page
   8. Icons: loads Lucide and builds the Icons page
   9. Hand-drawn illustrations on the Overview cards
  10. "Copy CSS" buttons on the Colours page
  11. Typography page: type scale table, copy buttons
  12. Typography page: accessibility examples
  13. Spacing page: token table, copy button

   To ADD A NEW COMPONENT:
   - copy any page in /components, rename it and change its title/text
   - add one line for it in NAV below (name, file, purpose)
   The sidebar and the Overview cards update automatically.
   ========================================================================== */


/* The site name shown at the top of the sidebar */
const SITE_NAME = 'Weave';

/* Work out where the site's root folder is, based on where this script lives
   (root/js/main.js → root/). This lets links work from any folder depth,
   whether the site is opened as a local file or served from a web server. */
const ROOT = new URL('../', document.currentScript.src);


/* 1. NAV ===================================================================
   Each section has a title and a list of items.
   - name:    text shown in the sidebar and on the Overview card
   - file:    path to the page, relative to the site root
   - purpose: one sentence, shown on the Overview card (components only)
   A section with hideTitle: true shows its items without a label.
   ========================================================================== */
const NAV = [
  {
    title: 'Get started',
    hideTitle: true,   // no label in the sidebar: "Overview" sits at the top on its own
    items: [
      { name: 'Overview', file: 'index.html' },
    ],
  },
  {
    title: 'Foundations',
    items: [
      { name: 'Colours',    file: 'foundations/colours.html' },
      { name: 'Typography', file: 'foundations/typography.html' },
      { name: 'Spacing',    file: 'foundations/spacing.html' },
      { name: 'Icons',      file: 'foundations/icons.html' },
    ],
  },
  {
    title: 'Components',
    items: [
      { name: 'Accordion',       file: 'components/accordion.html',       purpose: 'Shows and hides sections of related content so people can expand only what they need.' },
      { name: 'Alert',           file: 'components/alert.html',           purpose: 'Displays an important message about the current page or task that stays until it is resolved.' },
      { name: 'Avatar',          file: 'components/avatar.html',          purpose: 'Represents a person or organisation with an image, initials or an icon.' },
      { name: 'Badge',           file: 'components/badge.html',           purpose: 'Highlights a count or short status next to another element.' },
      { name: 'Breadcrumb',      file: 'components/breadcrumb.html',      purpose: 'Shows where the current page sits in the site and lets people move back up a level.' },
      { name: 'Button',          file: 'components/button.html',          purpose: 'Triggers an action, such as submitting a form or opening a dialog.' },
      { name: 'Card',            file: 'components/card.html',            purpose: 'Groups content and actions about a single subject into one contained block.' },
      { name: 'Drawer',          file: 'components/drawer.html',          purpose: 'Slides a panel in from the edge of the screen for supporting content or tasks.' },
      { name: 'Dropdown',        file: 'components/dropdown.html',        purpose: 'Reveals a list of actions or options from a trigger button.' },
      { name: 'Label',           file: 'components/label.html',           purpose: 'Names a form field so people know what information to enter.' },
      { name: 'Link',            file: 'components/link.html',            purpose: 'Takes people to another page or another place on the same page.' },
      { name: 'Modal',           file: 'components/modal.html',           purpose: 'Focuses attention on a task or message in a dialog that blocks the page behind it.' },
      { name: 'Pagination',      file: 'components/pagination.html',      purpose: 'Splits long lists across pages and lets people move between them.' },
      { name: 'Popover',         file: 'components/popover.html',         purpose: 'Shows rich, interactive content in a small overlay attached to a trigger.' },
      { name: 'Progress bar',    file: 'components/progress-bar.html',    purpose: 'Shows how much of a task or process is complete.' },
      { name: 'Skeleton loader', file: 'components/skeleton-loader.html', purpose: 'Shows a grey outline of the layout while the real content is loading.' },
      { name: 'Spinner',         file: 'components/spinner.html',         purpose: 'Shows that something is loading when progress cannot be measured.' },
      { name: 'Table',           file: 'components/table.html',           purpose: 'Organises data into rows and columns so it can be scanned and compared.' },
      { name: 'Tabs',            file: 'components/tabs.html',            purpose: 'Switches between related views on the same page.' },
      { name: 'Toast',           file: 'components/toast.html',           purpose: 'Briefly confirms the result of an action with a message that disappears on its own.' },
      { name: 'Toggle',          file: 'components/toggle.html',          purpose: 'Turns a single setting on or off with immediate effect.' },
      { name: 'Tooltip',         file: 'components/tooltip.html',         purpose: 'Shows a short text hint when someone hovers over or focuses an element.' },
    ],
  },
  {
    title: 'Form inputs',
    items: [
      { name: 'Checkbox',     file: 'components/checkbox.html',     purpose: 'Lets people select any number of options, or confirm a single choice.' },
      { name: 'Date picker',  file: 'components/date-picker.html',  purpose: 'Helps people enter a date by typing it or choosing it from a calendar.' },
      { name: 'Radio button', file: 'components/radio-button.html', purpose: 'Lets people choose exactly one option from a short list.' },
      { name: 'Search',       file: 'components/search.html',       purpose: 'Lets people find content by typing keywords.' },
      { name: 'Select',       file: 'components/select.html',       purpose: 'Lets people choose one option from a long list in a compact menu.' },
      { name: 'Text input',   file: 'components/text-input.html',   purpose: 'Lets people enter a single line of text.' },
      { name: 'Textarea',     file: 'components/textarea.html',     purpose: 'Lets people enter several lines of text.' },
    ],
  },
];


/* Helpers ================================================================== */

/* Turn a path like "components/button.html" into a full link from the root */
function urlFor(file) {
  return new URL(file, ROOT).href;
}

/* Is this nav item the page we're currently on? */
function isCurrentPage(file) {
  // A web server may show "/" instead of "/index.html", so treat them the same
  let here = window.location.pathname;
  if (here.endsWith('/')) here += 'index.html';
  return new URL(file, ROOT).pathname === here;
}

/* Build one <li><a>…</a></li> for the sidebar */
function navLinkHTML(item) {
  const current = isCurrentPage(item.file) ? ' aria-current="page"' : '';
  return `<li><a class="nav-link" href="${urlFor(item.file)}"${current}>${item.name}</a></li>`;
}


/* 2. Sidebar =============================================================== */

function buildSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  // (The logo and site name live in the top bar, section 2b.)
  let html = '';

  NAV.forEach(function (section) {
    html += `<div class="nav-section">`;
    if (!section.hideTitle) html += `<p class="nav-heading">${section.title}</p>`;
    html += `<ul class="nav-list">`;

    section.items.forEach(function (item) {
      html += navLinkHTML(item);
    });

    html += `</ul></div>`;
  });

  sidebar.innerHTML = html;

  // If the current page is far down the list, scroll the sidebar to show it
  const active = sidebar.querySelector('[aria-current="page"]');
  if (active) {
    sidebar.scrollTop = active.offsetTop - sidebar.clientHeight / 2;
  }
}


/* 2b. Top bar ==============================================================
   A white bar across the top of every page, above the sidebar:
   - left:   logo + site name, linking to the Overview
   - centre: "Get started" and "Components" (Components is always underlined
             for now; Get started will get its own section later)
   - right:  a search box that lists matching pages as you type
   On phones the centre menu is hidden and the search box shrinks to an
   icon; tapping it opens the search across the bar.
   ========================================================================== */

/* Every foundation and component page, for the search:
   [{ name: 'Colours', file: 'foundations/colours.html', group: 'Foundations' }, …] */
function searchablePages() {
  const pages = [];
  NAV.forEach(function (section) {
    if (section.title === 'Get started') return;
    section.items.forEach(function (item) {
      pages.push({ name: item.name, file: item.file, group: section.title });
    });
  });
  return pages;
}

function buildTopbar() {
  const pages = searchablePages();
  const firstComponent = pages.find(function (p) { return p.group === 'Components'; });


  const topbar = document.createElement('header');
  topbar.className = 'topbar';
  topbar.innerHTML = `
    <a class="topbar-brand" href="${urlFor('index.html')}">
      <img class="topbar-logo" src="${urlFor('assets/logo.svg')}" alt="" width="32" height="32">
      ${SITE_NAME}
    </a>

    <nav class="topbar-menu" aria-label="Main">
      <!-- "Components" is always the selected item for now. "Get started"
           is a placeholder until that section is built. -->
      <a class="topbar-link" href="${urlFor('index.html')}">Get started</a>
      <a class="topbar-link" href="${urlFor(firstComponent.file)}" aria-current="true">Components</a>
    </nav>

    <div class="topbar-search">
      <!-- Phones only: tap to open the search -->
      <button class="topbar-icon-button topbar-search-open" type="button" aria-label="Open search">
        <i data-lucide="search" aria-hidden="true"></i>
      </button>

      <div class="site-search" role="search">
        <label class="visually-hidden" for="site-search-input">Search pages</label>
        <i data-lucide="search" class="site-search-icon" aria-hidden="true"></i>
        <input id="site-search-input" type="search" placeholder="Search" autocomplete="off"
               role="combobox" aria-expanded="false" aria-controls="site-search-results" aria-autocomplete="list">
        <!-- Phones only: close the open search -->
        <button class="topbar-icon-button site-search-close" type="button" aria-label="Close search">
          <i data-lucide="x" aria-hidden="true"></i>
        </button>
        <ul class="site-search-results" id="site-search-results" role="listbox" aria-label="Matching pages" hidden></ul>
      </div>
    </div>`;

  // Put it at the very top of the page, just after the "Skip to content" link
  const skipLink = document.querySelector('.skip-link');
  if (skipLink) skipLink.after(topbar);
  else document.body.prepend(topbar);

  setUpSiteSearch(topbar, pages);
}

/* The search box: filter pages as you type, arrow keys to move, Enter to open */
function setUpSiteSearch(topbar, pages) {
  const input = topbar.querySelector('#site-search-input');
  const results = topbar.querySelector('#site-search-results');
  const openButton = topbar.querySelector('.topbar-search-open');
  let matches = [];
  let active = -1;   // which result is highlighted (-1 = none)

  function showResults() {
    results.hidden = false;
    input.setAttribute('aria-expanded', 'true');
  }

  function hideResults() {
    results.hidden = true;
    input.setAttribute('aria-expanded', 'false');
    input.removeAttribute('aria-activedescendant');
    active = -1;
  }

  function render() {
    const query = input.value.trim().toLowerCase();
    if (!query) { hideResults(); return; }

    // Names containing the text; names that START with it come first
    matches = pages.filter(function (p) {
      return p.name.toLowerCase().indexOf(query) !== -1;
    }).sort(function (a, b) {
      return (b.name.toLowerCase().indexOf(query) === 0) - (a.name.toLowerCase().indexOf(query) === 0);
    });
    active = -1;
    input.removeAttribute('aria-activedescendant');

    if (!matches.length) {
      results.innerHTML = '<li class="site-search-empty" role="presentation">No pages match "' +
        input.value.trim().replace(/</g, '&lt;') + '"</li>';
    } else {
      results.innerHTML = matches.map(function (p, i) {
        return '<li role="presentation">' +
          '<a class="site-search-option" role="option" id="site-search-option-' + i + '" aria-selected="false" href="' + urlFor(p.file) + '">' +
            '<span>' + p.name + '</span>' +
            '<span class="site-search-group">' + p.group + '</span>' +
          '</a></li>';
      }).join('');
    }
    showResults();
  }

  // Highlight result number i (used by the arrow keys)
  function highlight(i) {
    const options = results.querySelectorAll('.site-search-option');
    if (!options.length) return;
    active = (i + options.length) % options.length;   // wrap around
    options.forEach(function (option, n) {
      option.setAttribute('aria-selected', n === active ? 'true' : 'false');
    });
    input.setAttribute('aria-activedescendant', options[active].id);
    options[active].scrollIntoView({ block: 'nearest' });
  }

  // Phones: close the search that was opened across the bar
  function closeMobileSearch() {
    if (!topbar.classList.contains('is-search-open')) return;
    topbar.classList.remove('is-search-open');
    input.value = '';
    hideResults();
    openButton.focus();
  }

  input.addEventListener('input', render);
  input.addEventListener('focus', function () { if (input.value.trim()) render(); });

  input.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (results.hidden) render();
      highlight(active + 1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlight(active - 1);
    } else if (event.key === 'Enter' && matches.length && !results.hidden) {
      event.preventDefault();
      window.location.href = urlFor(matches[Math.max(active, 0)].file);
    } else if (event.key === 'Escape') {
      hideResults();
      closeMobileSearch();
    }
  });

  // Click anywhere outside the search to close the results
  document.addEventListener('click', function (event) {
    if (!event.target.closest('.topbar-search')) hideResults();
  });

  // Phones: the search icon opens the search across the whole bar
  openButton.addEventListener('click', function () {
    topbar.classList.add('is-search-open');
    input.focus();
  });
  topbar.querySelector('.site-search-close').addEventListener('click', closeMobileSearch);
}


/* 3. Overview cards ========================================================
   On index.html, an element with data-component-grid="Components" gets one
   card per item in that NAV section; "Form inputs" works the same way.
   ========================================================================== */

function cardHTML(item) {
  return `
    <a class="overview-card" href="${urlFor(item.file)}">
      <div class="overview-card-art" data-illustration="${item.name}"></div>
      <div class="overview-card-body">
        <h3>${item.name}</h3>
        <p>${item.purpose}</p>
      </div>
    </a>`;
}

function buildOverviewGrids() {
  document.querySelectorAll('[data-component-grid]').forEach(function (grid) {
    const section = NAV.find(function (s) { return s.title === grid.getAttribute('data-component-grid'); });
    if (section) grid.innerHTML = section.items.map(cardHTML).join('');
  });
}


/* 4. Token values ==========================================================
   Any element with data-token="--some-token" gets filled with that token's
   current value from tokens.css, so the Foundations pages never go stale.
   ========================================================================== */

/* Text sizes are stored in rem (so they follow the browser's text size).
   For people reading the docs, show them in px: "2.5rem" → "40px".
   Anything that isn't rem (hex colours, px spacing) is shown as it is. */
function remToPx(value) {
  if (!/rem$/.test(value)) return value;
  const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
  return parseFloat(value) * rootSize + 'px';
}

function showTokenValues() {
  const styles = getComputedStyle(document.documentElement);
  document.querySelectorAll('[data-token]').forEach(function (el) {
    const value = remToPx(styles.getPropertyValue(el.getAttribute('data-token')).trim());
    // data-unitless shows just the number, e.g. the "32" in "32–48px"
    el.textContent = el.hasAttribute('data-unitless') ? parseFloat(value) : value;
  });
}


/* 5. Click a swatch to copy its hex code ===================================
   Any button with data-copy-token="--some-token" copies that token's value
   when clicked, then briefly shows a check icon. How long the check shows
   is set by --duration-feedback in tokens.css (see .swatch in docs.css).
   ========================================================================== */

/* Read out a short message to screen reader users, e.g. "Copied #C8186A".
   Uses one invisible "live" area, created the first time it's needed. */
let announcer = null;
function announce(message) {
  if (!announcer) {
    announcer = document.createElement('p');
    announcer.className = 'visually-hidden';
    announcer.setAttribute('aria-live', 'polite');
    document.body.appendChild(announcer);
  }
  announcer.textContent = message;
}

/* Older copy method: put the text in a hidden field, select it, copy it */
function copyTextFallback(text) {
  const field = document.createElement('textarea');
  field.value = text;
  document.body.appendChild(field);
  field.select();
  document.execCommand('copy');
  field.remove();
}

/* Copy text to the clipboard. Tries the modern clipboard API first, and
   falls back to the older method if the browser blocks it
   (e.g. some local-file setups). */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).catch(function () {
      copyTextFallback(text);
    });
  }
  copyTextFallback(text);
  return Promise.resolve();
}

function setUpCopySwatches() {
  const swatches = document.querySelectorAll('[data-copy-token]');
  if (!swatches.length) return;

  const styles = getComputedStyle(document.documentElement);

  swatches.forEach(function (swatch) {
    // Add the (hidden) check icon on top of the colour.
    // Lucide turns <i data-lucide="check"> into the icon (see section 8).
    // (added, not replaced, so tags like "Primary" stay in place)
    swatch.querySelector('.swatch-color').insertAdjacentHTML('beforeend',
      '<span class="swatch-check"><i data-lucide="check" aria-hidden="true"></i></span>');
    swatch.title = 'Click to copy hex code';

    swatch.addEventListener('click', function () {
      const hex = styles.getPropertyValue(swatch.getAttribute('data-copy-token')).trim();
      copyText(hex).then(function () {
        // Restart the check animation, even if it's already showing
        swatch.classList.remove('is-copied');
        void swatch.offsetWidth;
        swatch.classList.add('is-copied');
        announce('Copied ' + hex);
      });
    });

    // Hide the check again when its animation finishes
    swatch.addEventListener('animationend', function () {
      swatch.classList.remove('is-copied');
    });
  });
}


/* 6. Contrast matrix =======================================================
   Reads the colour list from [data-contrast-colours], works out the contrast
   ratio of every text colour on every background, and builds the table in
   [data-contrast-matrix]. Uses the WCAG 2 contrast formula.
   ========================================================================== */

/* Turn a token like "--pink-600" into [red, green, blue] numbers (0–255).
   We let the browser do the work: colour a hidden element with the token,
   then read back the colour it actually used. */
function tokenToRGB(token) {
  const probe = document.createElement('span');
  probe.style.color = 'var(' + token + ')';
  document.body.appendChild(probe);
  const rgb = getComputedStyle(probe).color.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number);
  probe.remove();
  return rgb;
}

/* How bright a colour looks to the eye, from 0 (black) to 1 (white).
   This is the "relative luminance" formula from WCAG. */
function luminance(rgb) {
  const [r, g, b] = rgb.map(function (value) {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/* Contrast ratio between two colours, from 1 (same) to 21 (black on white) */
function contrastRatio(rgbA, rgbB) {
  const lighter = Math.max(luminance(rgbA), luminance(rgbB));
  const darker = Math.min(luminance(rgbA), luminance(rgbB));
  return (lighter + 0.05) / (darker + 0.05);
}

/* Which WCAG level a ratio reaches. These limits come from WCAG itself. */
function contrastBadge(ratio) {
  if (ratio >= 7) return { label: 'AAA', modifier: 'aaa' };
  if (ratio >= 4.5) return { label: 'AA', modifier: 'aa' };
  if (ratio >= 3) return { label: 'AA18', modifier: 'aa18' };
  return { label: 'DNP', modifier: 'dnp' };
}

function buildContrastMatrix() {
  const table = document.querySelector('[data-contrast-matrix]');
  const list = document.querySelectorAll('[data-contrast-colours] li');
  if (!table || !list.length) return;

  // [{ token: '--grey-0', label: 'White', rgb: [255, 255, 255] }, …]
  const colours = Array.from(list).map(function (li) {
    const token = li.getAttribute('data-colour');
    return { token: token, label: li.textContent.trim(), rgb: tokenToRGB(token) };
  });

  // Caption (for screen readers) and column headings: one per text colour
  let html = '<caption class="visually-hidden">Contrast ratio of each text colour (columns) on each background colour (rows)</caption>';
  html += '<thead><tr><th scope="col" class="contrast-corner">Background ↓ Text →</th>';
  colours.forEach(function (text) {
    html += '<th scope="col">' + text.label + '</th>';
  });
  html += '</tr></thead><tbody>';

  // One row per background colour
  colours.forEach(function (bg) {
    html += '<tr><th scope="row">' +
      '<span class="contrast-chip" style="background: var(' + bg.token + ')"></span>' +
      bg.label + '</th>';

    colours.forEach(function (text) {
      const ratio = contrastRatio(bg.rgb, text.rgb);
      const badge = contrastBadge(ratio);
      html += '<td>' +
        '<span class="contrast-sample" style="background: var(' + bg.token + '); color: var(' + text.token + ')">Text</span>' +
        '<span class="contrast-ratio">' + ratio.toFixed(2) + ':1</span>' +
        '<span class="badge badge--' + badge.modifier + '">' + badge.label + '</span>' +
        '</td>';
    });

    html += '</tr>';
  });

  table.innerHTML = html + '</tbody>';
}


/* 7. Download part of a page as a PDF ======================================
   A button with data-print-target="some-id" prints only the element with
   that id, using the browser's print dialog (choose "Save as PDF").
   While printing, the body gets .is-printing-section and the element gets
   .is-print-target; the print styles in docs.css hide everything else.
   data-print-title becomes the suggested file name.
   ========================================================================== */

function setUpPrintButtons() {
  const buttons = document.querySelectorAll('[data-print-target]');
  if (!buttons.length) return;

  const pageTitle = document.title;
  let target = null;

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      target = document.getElementById(button.getAttribute('data-print-target'));
      if (!target) return;

      target.classList.add('is-print-target');
      document.body.classList.add('is-printing-section');
      if (button.hasAttribute('data-print-title')) {
        document.title = button.getAttribute('data-print-title') + ' · ' + SITE_NAME;
      }

      window.print();
    });
  });

  // When the print dialog closes, put the page back to normal
  window.addEventListener('afterprint', function () {
    document.body.classList.remove('is-printing-section');
    if (target) target.classList.remove('is-print-target');
    document.title = pageTitle;
  });
}


/* 8. Icons (Lucide) ========================================================
   Icons come from Lucide (https://lucide.dev), loaded from a CDN. This is
   the ONLY place the Lucide script is added, and it runs on every page.

   To use an icon anywhere, write:   <i data-lucide="arrow-right"></i>
   Lucide swaps it for the SVG. Icons use currentColor, so they take the
   text colour of whatever they sit in. Size them with CSS width/height.

   The version is pinned so icons never change without us knowing.
   To upgrade, change LUCIDE_VERSION and check the Icons page.
   ========================================================================== */

const LUCIDE_VERSION = '1.49.0';
const LUCIDE_SCRIPT = 'https://cdn.jsdelivr.net/npm/lucide@' + LUCIDE_VERSION + '/dist/umd/lucide.min.js';
// The official list of icon names + search keywords, same version
const LUCIDE_TAGS = 'https://cdn.jsdelivr.net/npm/lucide-static@' + LUCIDE_VERSION + '/tags.json';

/* "arrow-right" → "ArrowRight" (how the Lucide script names its icons) */
function toPascalCase(name) {
  return name.split('-').map(function (part) {
    return part.charAt(0).toUpperCase() + part.slice(1);
  }).join('');
}

/* Build the SVG code for an icon, written out neatly so it can be copied
   or downloaded. The sizes and stroke here are Lucide's own defaults,
   part of the icon file itself rather than our design tokens. */
function iconSVG(name) {
  const shapes = window.lucide.icons[toPascalCase(name)];
  const children = shapes.map(function (shape) {
    const attrs = Object.keys(shape[1]).map(function (key) {
      return ' ' + key + '="' + shape[1][key] + '"';
    }).join('');
    return '  <' + shape[0] + attrs + ' />';
  }).join('\n');

  return '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
    'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
    'stroke-linejoin="round" class="lucide lucide-' + name + '">\n' + children + '\n</svg>';
}

/* Save some text as a file, e.g. "arrow-right.svg" */
function downloadFile(fileName, text, type) {
  const url = URL.createObjectURL(new Blob([text], { type: type }));
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(function () { URL.revokeObjectURL(url); });
}

/* How long the "copied" check shows, read from --duration-feedback */
function feedbackDuration() {
  return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--duration-feedback'));
}

/* Icons page: build a tile for every icon in the library, with search.
   Runs only on pages that have [data-icon-gallery]. */
function buildIconGallery() {
  const gallery = document.querySelector('[data-icon-gallery]');
  if (!gallery) return;

  const search = document.querySelector('[data-icon-search]');
  const count = document.querySelector('[data-icon-count]');

  fetch(LUCIDE_TAGS)
    .then(function (response) { return response.json(); })
    .then(function (tags) {
      const names = Object.keys(tags);   // e.g. ["a-arrow-down", …]

      // The small action icons, built once and reused on every tile
      const copyIcon = iconSVG('copy').replace('class="', 'class="icon-copy ');
      const checkIcon = iconSVG('check').replace('class="', 'class="icon-check ');
      const downloadIcon = iconSVG('download');

      gallery.innerHTML = names.map(function (name) {
        // Words to search by: the name plus Lucide's keywords
        const keywords = (name + ' ' + tags[name].join(' ')).toLowerCase();
        return '' +
          '<div class="icon-tile" data-name="' + name + '" data-keywords="' + keywords.replace(/"/g, '') + '">' +
            '<span class="icon-tile-glyph" aria-hidden="true">' + iconSVG(name) + '</span>' +
            '<span class="icon-tile-name">' + name + '</span>' +
            '<span class="icon-tile-actions">' +
              '<button type="button" class="icon-action" data-action="copy" title="Copy SVG" aria-label="Copy SVG code for ' + name + '">' + copyIcon + checkIcon + '</button>' +
              '<button type="button" class="icon-action" data-action="download" title="Download SVG" aria-label="Download ' + name + '.svg">' + downloadIcon + '</button>' +
            '</span>' +
          '</div>';
      }).join('');

      updateCount(names.length);

      // Search: hide tiles whose name and keywords don't include the text
      search.addEventListener('input', function () {
        const query = search.value.trim().toLowerCase();
        let shown = 0;
        gallery.querySelectorAll('.icon-tile').forEach(function (tile) {
          const match = tile.getAttribute('data-keywords').indexOf(query) !== -1;
          tile.hidden = !match;
          if (match) shown++;
        });
        updateCount(shown, query);
      });
    })
    .catch(function () {
      gallery.innerHTML = '<p class="placeholder">Couldn\'t load the icons. Check your internet connection and refresh the page.</p>';
    });

  function updateCount(shown, query) {
    if (query && shown === 0) count.textContent = 'No icons match "' + query + '".';
    else count.textContent = 'Showing ' + shown.toLocaleString() + ' icons';
  }

  // One click listener for every tile's buttons
  gallery.addEventListener('click', function (event) {
    const button = event.target.closest('.icon-action');
    if (!button) return;
    const name = button.closest('.icon-tile').getAttribute('data-name');
    const svg = iconSVG(name);

    if (button.getAttribute('data-action') === 'download') {
      downloadFile(name + '.svg', svg, 'image/svg+xml');
      announce('Downloaded ' + name + '.svg');
      return;
    }

    copyText(svg).then(function () {
      // Swap the copy icon for a check, then swap back
      button.classList.add('is-copied');
      announce('Copied SVG code for ' + name);
      clearTimeout(button.copiedTimer);
      button.copiedTimer = setTimeout(function () {
        button.classList.remove('is-copied');
      }, feedbackDuration());
    });
  });
}

/* Load the Lucide script, then draw icons */
function loadLucide() {
  const script = document.createElement('script');
  script.src = LUCIDE_SCRIPT;
  script.onload = function () {
    window.lucide.createIcons();   // every <i data-lucide="…"> on the page
    buildIconGallery();            // the Icons page grid (if on that page)
  };
  script.onerror = function () {
    const gallery = document.querySelector('[data-icon-gallery]');
    if (gallery) gallery.innerHTML = '<p class="placeholder">Couldn\'t load the icons. Check your internet connection and refresh the page.</p>';
  };
  document.head.appendChild(script);
}


/* 9. Overview illustrations (Rough.js) ======================================
   On the Overview page, each card gets a hand-drawn wireframe of its
   component, and the Typography page gets a breakpoint illustration. Rough.js (https://roughjs.com) draws the sketchy lines; the
   drawings themselves are in js/illustrations.js. Both load only on pages
   with cards, after Rough.js has loaded. The version is pinned.
   ========================================================================== */

const ROUGH_VERSION = '4.6.6';
const ROUGH_SCRIPT = 'https://cdn.jsdelivr.net/npm/roughjs@' + ROUGH_VERSION + '/bundled/rough.js';

/* Add a <script> to the page and run "then" once it has loaded */
function loadScript(src, then) {
  const script = document.createElement('script');
  script.src = src;
  if (then) script.onload = then;
  document.head.appendChild(script);
}

function loadIllustrations() {
  if (!document.querySelector('[data-illustration], [data-breakpoint-art], [data-spacing-example]')) return;
  loadScript(ROUGH_SCRIPT, function () {
    loadScript(urlFor('js/illustrations.js'));
  });
}


/* 10. "Copy CSS" buttons ===================================================
   A button with data-copy-css copies every colour token in its section as
   CSS lines, ready to paste into a :root { } block:
       --pink-50: #FDF0F5;
       --pink-100: #FBD9E6;
   The tokens come from the section's swatches (data-copy-token), and the
   values are read live from tokens.css, so they're always up to date.
   ========================================================================== */

/* Switch a copy button to "Copied" with a check for a moment, then back.
   (The button has a .copy-idle and a .copy-done part; see docs.css.) */
function flashCopied(button, message) {
  button.classList.add('is-copied');
  announce(message);
  clearTimeout(button.copiedTimer);
  button.copiedTimer = setTimeout(function () {
    button.classList.remove('is-copied');
  }, feedbackDuration());
}

function setUpCopyCSSButtons() {
  const styles = getComputedStyle(document.documentElement);

  document.querySelectorAll('[data-copy-css]').forEach(function (button) {
    button.addEventListener('click', function () {
      const section = button.closest('section');

      // Every swatch's token, in page order, without repeats
      const tokens = [];
      section.querySelectorAll('[data-copy-token]').forEach(function (swatch) {
        const token = swatch.getAttribute('data-copy-token');
        if (tokens.indexOf(token) === -1) tokens.push(token);
      });

      const css = tokens.map(function (token) {
        return '  ' + token + ': ' + styles.getPropertyValue(token).trim() + ';';
      }).join('\n');

      copyText(css).then(function () {
        flashCopied(button, 'Copied ' + tokens.length + ' colour variables');
      });
    });
  });
}


/* 11. Typography page ======================================================
   - Copy buttons on code samples (data-copy-code)
   - The table of sizes at each breakpoint (data-type-scale-table)
   - "Copy CSS" for the whole responsive type scale (data-copy-type-scale)
   All values are read from tokens.css, so nothing here goes out of date.
   ========================================================================== */

/* The four breakpoints and the token ending each one uses */
const TYPE_BREAKPOINTS = [
  { name: 'Mobile',     suffix: 'mobile' },
  { name: 'Tablet',     suffix: 'tablet',  token: '--breakpoint-tablet' },
  { name: 'Desktop',    suffix: 'desktop', token: '--breakpoint-desktop' },
  { name: 'XL desktop', suffix: 'xl',      token: '--breakpoint-xl' },
];

function tokenValue(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

/* A style's value at one breakpoint, e.g. typeValue('h1', 'size', 'tablet').
   Styles that don't change (like Body) only have one value. */
function typeValue(style, property, suffix) {
  return tokenValue('--type-' + style + '-' + property + '-' + suffix) ||
         tokenValue('--type-' + style + '-' + property);
}

/* The text styles shown on the page: [{ key: 'h1', name: 'H1' }, …] */
function pageTypeStyles() {
  return Array.from(document.querySelectorAll('[data-type-style]')).map(function (el) {
    return { key: el.getAttribute('data-type-style'), name: el.getAttribute('data-type-name') };
  });
}

/* "Mobile", "up to 767px" / "Tablet", "768px and up" … */
function breakpointRange(i) {
  const bp = TYPE_BREAKPOINTS[i];
  if (!bp.token) return 'up to ' + (parseFloat(tokenValue(TYPE_BREAKPOINTS[1].token)) - 1) + 'px';
  return tokenValue(bp.token) + ' and up';
}

function buildTypeScaleTable() {
  const table = document.querySelector('[data-type-scale-table]');
  if (!table) return;

  let html = '<thead><tr><th scope="col">Style</th>';
  TYPE_BREAKPOINTS.forEach(function (bp, i) {
    html += '<th scope="col">' + bp.name + '<br><span class="token-value">' + breakpointRange(i) + '</span></th>';
  });
  html += '</tr></thead><tbody>';

  pageTypeStyles().forEach(function (style) {
    html += '<tr><th scope="row">' + style.name + '</th>';
    TYPE_BREAKPOINTS.forEach(function (bp) {
      // "40px / 48px" (size / line height), straight from the tokens
      html += '<td>' + remToPx(typeValue(style.key, 'size', bp.suffix)) + ' / ' +
        remToPx(typeValue(style.key, 'line-height', bp.suffix)) + '</td>';
    });
    html += '</tr>';
  });

  table.innerHTML = html + '</tbody>';
}

/* The whole type scale as ready-to-paste CSS: mobile values in :root, then
   one media query per breakpoint with only the values that change */
function typeScaleCSS() {
  const styles = pageTypeStyles();
  const lines = [':root {'];
  styles.forEach(function (s) {
    lines.push('  /* ' + s.name + ' */');
    lines.push('  --type-' + s.key + '-size: ' + typeValue(s.key, 'size', 'mobile') + ';');
    lines.push('  --type-' + s.key + '-line-height: ' + typeValue(s.key, 'line-height', 'mobile') + ';');
    lines.push('  --type-' + s.key + '-weight: ' + tokenValue('--type-' + s.key + '-weight') + ';');
    lines.push('  --type-' + s.key + '-letter-spacing: ' + tokenValue('--type-' + s.key + '-letter-spacing') + ';');
  });
  lines.push('}');

  TYPE_BREAKPOINTS.slice(1).forEach(function (bp, i) {
    const previous = TYPE_BREAKPOINTS[i].suffix;
    const changes = [];
    styles.forEach(function (s) {
      ['size', 'line-height'].forEach(function (property) {
        const value = typeValue(s.key, property, bp.suffix);
        if (value !== typeValue(s.key, property, previous)) {
          changes.push('    --type-' + s.key + '-' + property + ': ' + value + ';');
        }
      });
    });
    if (!changes.length) return;
    lines.push('', '/* ' + bp.name + ' */', '@media (min-width: ' + tokenValue(bp.token) + ') {', '  :root {');
    lines.push.apply(lines, changes);
    lines.push('  }', '}');
  });

  return lines.join('\n');
}

function setUpTypographyPage() {
  buildTypeScaleTable();

  document.querySelectorAll('[data-copy-type-scale]').forEach(function (button) {
    button.addEventListener('click', function () {
      copyText(typeScaleCSS()).then(function () {
        flashCopied(button, 'Copied the type scale CSS');
      });
    });
  });

  // Code samples: copy the text of the code block
  document.querySelectorAll('[data-copy-code]').forEach(function (button) {
    button.addEventListener('click', function () {
      const code = button.closest('.code-sample').querySelector('code').textContent;
      copyText(code).then(function () {
        flashCopied(button, 'Copied code');
      });
    });
  });

  // Keep the live "Now: 40px / 48px" sizes right as the window is resized
  let pending = false;
  window.addEventListener('resize', function () {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () {
      showTokenValues();
      pending = false;
    });
  });
}


/* 12. Accessibility examples (Typography page) =============================
   - The "Text size" slider scales the text in both resizing examples
   - "Test text spacing" switches the WCAG 1.4.12 spacing on and off
   - Contrast ratios under the samples, worked out from tokens.css
   ========================================================================== */

function setUpAccessibilityExamples() {
  // Text size slider: sets --text-scale (1 to 2) on the example pair
  const slider = document.querySelector('[data-text-scale-input]');
  if (slider) {
    const output = document.querySelector('[data-text-scale-output]');
    const target = document.getElementById(slider.getAttribute('aria-controls'));
    slider.addEventListener('input', function () {
      target.style.setProperty('--text-scale', slider.value / 100);
      output.textContent = slider.value + '%';
    });
  }

  // Text spacing toggle
  document.querySelectorAll('[data-text-spacing-toggle]').forEach(function (button) {
    const target = document.getElementById(button.getAttribute('aria-controls'));
    button.addEventListener('click', function () {
      const on = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', on ? 'true' : 'false');
      target.classList.toggle('is-spaced', on);
    });
  });

  // Contrast ratio + badge (uses the same maths as the contrast matrix)
  document.querySelectorAll('[data-contrast-text]').forEach(function (el) {
    const ratio = contrastRatio(
      tokenToRGB(el.getAttribute('data-contrast-text')),
      tokenToRGB(el.getAttribute('data-contrast-bg'))
    );
    const badge = contrastBadge(ratio);
    el.innerHTML = '<span class="contrast-ratio">' + ratio.toFixed(2) + ':1</span>' +
      '<span class="badge badge--' + badge.modifier + '">' + badge.label + '</span>';
  });
}


/* 13. Spacing page ==========================================================
   The annotated sample card, the table of spacing tokens (with a bar for
   each) and its "Copy CSS" button. Values are read from tokens.css.
   ========================================================================== */

function spaceSteps() {
  const table = document.querySelector('[data-space-table]');
  return table ? table.getAttribute('data-space-steps').split(' ') : [];
}

/* "0.25rem" → "4px"; "0" → "0px" */
function spacePx(value) {
  return value === '0' ? '0px' : remToPx(value);
}

/* Draw the spacing on the annotated card (Spacing system section).
   Everything is measured from the card as the browser actually lays it
   out, so the bands and numbers always match the real CSS. */
function annotateSpacingCards() {
  document.querySelectorAll('[data-annotate-spacing]').forEach(function (card) {
    card.querySelectorAll('.spacing-annotation').forEach(function (old) { old.remove(); });

    const box = card.getBoundingClientRect();
    const styles = getComputedStyle(card);
    const pad = {
      top: parseFloat(styles.paddingTop), right: parseFloat(styles.paddingRight),
      bottom: parseFloat(styles.paddingBottom), left: parseFloat(styles.paddingLeft),
    };
    const rect = function (selector) {
      const r = card.querySelector(selector).getBoundingClientRect();
      return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, bottom: r.bottom - box.top };
    };
    const avatar = rect('.grid-demo-avatar');
    const text = rect('.grid-demo-text');
    const title = rect('.grid-demo-text > :first-child');
    const description = rect('.grid-demo-text > :last-child');
    const button = rect('.grid-demo-button');
    const innerHeight = box.height - pad.top - pad.bottom;

    // band(left, top, width, height, size shown on the label, style)
    function band(x, y, w, h, size, style) {
      const el = document.createElement('span');
      el.className = 'spacing-annotation' + (style ? ' spacing-annotation--' + style : '');
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      el.style.width = w + 'px';
      el.style.height = h + 'px';
      el.innerHTML = '<span class="spacing-annotation-label">' + Math.round(size) + 'px</span>';
      card.appendChild(el);
    }

    // Padding on all four sides
    band(0, 0, box.width, pad.top, pad.top);
    band(0, box.height - pad.bottom, box.width, pad.bottom, pad.bottom);
    band(0, pad.top, pad.left, innerHeight, pad.left, 'vertical');
    band(box.width - pad.right, pad.top, pad.right, innerHeight, pad.right, 'vertical');
    // Avatar to text, and text to button
    band(avatar.right, pad.top, text.left - avatar.right, innerHeight, text.left - avatar.right, 'vertical');
    band(text.right, pad.top, button.left - text.right, innerHeight, button.left - text.right, 'vertical');
    // Title to description
    band(text.left, title.bottom, text.right - text.left, description.top - title.bottom, description.top - title.bottom, 'thin');
  });
}

function setUpSpacingPage() {
  if (document.querySelector('[data-annotate-spacing]')) {
    annotateSpacingCards();
    window.addEventListener('resize', annotateSpacingCards);
    // Inter changes the text widths once it loads, so measure again then
    if (document.fonts) document.fonts.ready.then(annotateSpacingCards);
  }

  const table = document.querySelector('[data-space-table]');
  if (!table) return;

  let html = '<thead><tr><th scope="col">Name</th><th scope="col">Value (rem)</th>' +
    '<th scope="col">Pixel size</th><th scope="col"><span class="visually-hidden">Size shown as a bar</span></th></tr></thead><tbody>';
  spaceSteps().forEach(function (step) {
    const token = '--space-' + step;
    const value = tokenValue(token);
    // Friendly name for people ("Spacing 4"); the real token stays --space-4
    html += '<tr><th scope="row">Spacing ' + step + '</th>' +
      '<td>' + value + '</td>' +
      '<td>' + spacePx(value) + '</td>' +
      '<td><span class="spacing-bar" style="width: var(' + token + ')"></span></td></tr>';
  });
  table.innerHTML = html + '</tbody>';

  document.querySelectorAll('[data-copy-space-scale]').forEach(function (button) {
    button.addEventListener('click', function () {
      const lines = spaceSteps().map(function (step) {
        const value = tokenValue('--space-' + step);
        return '  --space-' + step + ': ' + value + ';  /* ' + spacePx(value) + ' */';
      });
      copyText(':root {\n' + lines.join('\n') + '\n}').then(function () {
        flashCopied(button, 'Copied ' + lines.length + ' spacing tokens');
      });
    });
  });
}


/* Run everything once the page has loaded ================================= */
buildTopbar();
buildSidebar();
buildOverviewGrids();
showTokenValues();
setUpCopySwatches();
buildContrastMatrix();
setUpPrintButtons();
setUpCopyCSSButtons();
setUpTypographyPage();
setUpAccessibilityExamples();
setUpSpacingPage();
loadLucide();
loadIllustrations();
