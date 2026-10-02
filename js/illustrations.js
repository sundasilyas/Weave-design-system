/* ==========================================================================
   illustrations.js: hand-drawn wireframes for the Overview cards
   --------------------------------------------------------------------------
   Each component card on the Overview page has an empty box like:
     <div class="overview-card-art" data-illustration="Accordion"></div>
   This file draws a simple sketch of that component inside it, using
   Rough.js (https://roughjs.com) for the hand-drawn look.

   It also draws the spacing examples on the Spacing page
   (<div data-spacing-example="16">) and the breakpoint illustration on the Typography page
   (<div data-breakpoint-art>), see the end of this file.

   main.js loads Rough.js and then this file, only on pages that need it.

   HOW THE DRAWINGS WORK
   - Every drawing uses the same 240 × 120 canvas. The numbers below are
     positions on that canvas (x across, y down), not sizes on screen; the
     drawing scales to fit the card.
   - Keep the content roughly inside x 40–200 and y 15–105 so every card
     looks balanced.
   - Colours come from tokens.css:
       --pink-600 for outlines and strong text,
       --pink-200 for placeholder text lines,
       --grey-0   for white fills (e.g. a modal sitting on an overlay).
     The pale pink card background (--pink-50) is set in docs.css.

   TO ADD A DRAWING: add an entry to DRAWINGS below, named exactly as the
   component is named in NAV (main.js).
   ========================================================================== */

(function () {

  /* Read a colour token from tokens.css, e.g. "--pink-600" → "#C8186A".
     (Rough.js needs real colour values, not var(--…).) */
  const styles = getComputedStyle(document.documentElement);
  function token(name) {
    return styles.getPropertyValue(name).trim();
  }

  const STROKE = token('--pink-600');  // outlines, strong text
  const LINE   = token('--pink-200');  // placeholder text lines
  const WHITE  = token('--grey-0');    // white fills

  /* A set of simple drawing tools for one card's <svg>.
     "seed" fixes the randomness, so each sketch looks the same every visit. */
  function makePen(svg) {
    const rc = rough.svg(svg);
    let seed = 1;

    // Settings shared by every shape
    function opts(extra) {
      return Object.assign({ stroke: STROKE, strokeWidth: 1.5, roughness: 1.1, bowing: 1, seed: seed++ }, extra);
    }
    function add(node) { svg.appendChild(node); }

    // Rounded-rectangle outline as an SVG path (used for pills and toggles)
    function pillPath(x, y, w, h) {
      const r = h / 2;
      return 'M' + (x + r) + ' ' + y + ' H' + (x + w - r) +
        ' A' + r + ' ' + r + ' 0 0 1 ' + (x + w - r) + ' ' + (y + h) +
        ' H' + (x + r) + ' A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + ' Z';
    }

    return {
      /* Outlined rectangle */
      box: function (x, y, w, h, extra) { add(rc.rectangle(x, y, w, h, opts(extra))); },

      /* Solid pink rectangle (buttons, selected items) */
      filled: function (x, y, w, h) { add(rc.rectangle(x, y, w, h, opts({ fill: STROKE, fillStyle: 'solid' }))); },

      /* Rectangle with white fill (sits on top of other shapes) */
      white: function (x, y, w, h) { add(rc.rectangle(x, y, w, h, opts({ fill: WHITE, fillStyle: 'solid' }))); },

      /* Rectangle shaded with sketchy diagonal lines (images, overlays) */
      hatched: function (x, y, w, h, extra) {
        add(rc.rectangle(x, y, w, h, opts(Object.assign({ fill: LINE, fillStyle: 'hachure', hachureGap: 6 }, extra))));
      },

      /* Rounded pill shape, outlined or filled */
      pill: function (x, y, w, h, isFilled) {
        const extra = isFilled ? { fill: STROKE, fillStyle: 'solid' } : {};
        extra.roughness = 0.5;  // pills are small, so keep them neat
        add(rc.path(pillPath(x, y, w, h), opts(extra)));
      },

      /* Placeholder text line. style: undefined = pale pink,
         'strong' = dark pink (titles, links), 'white' = on dark fills */
      text: function (x, y, w, style) {
        const colour = style === 'strong' ? STROKE : style === 'white' ? WHITE : LINE;
        add(rc.line(x, y, x + w, y, opts({ stroke: colour, strokeWidth: style ? 4 : 5, roughness: 0.5 })));
      },

      /* Straight line */
      line: function (x1, y1, x2, y2, extra) { add(rc.line(x1, y1, x2, y2, opts(extra))); },

      /* Circle (cx, cy = centre, d = diameter).
         style: undefined = outline, 'filled', 'white', 'pale' (solid pale pink),
         'ring' (thick pale pink outline) */
      circle: function (cx, cy, d, style) {
        const extra = style === 'filled' ? { fill: STROKE, fillStyle: 'solid' }
          : style === 'white' ? { fill: WHITE, fillStyle: 'solid' }
          : style === 'pale' ? { stroke: LINE, fill: LINE, fillStyle: 'solid' }
          : style === 'ring' ? { stroke: LINE, strokeWidth: 4 } : {};
        // Small circles get less wobble, otherwise they look like blobs
        if (d < 30) extra.roughness = 0.4;
        add(rc.circle(cx, cy, d, opts(extra)));
      },

      /* Part of a circle, from angle start to stop (in radians) */
      arc: function (cx, cy, d, start, stop, extra) { add(rc.arc(cx, cy, d, d, start, stop, false, opts(extra))); },

      /* Small chevron pointing 'down', 'right' or 'left' */
      chevron: function (cx, cy, direction) {
        const s = 5;
        const points = direction === 'down' ? [[cx - s, cy - s / 2], [cx, cy + s / 2], [cx + s, cy - s / 2]]
          : direction === 'left' ? [[cx + s / 2, cy - s], [cx - s / 2, cy], [cx + s / 2, cy + s]]
          : [[cx - s / 2, cy - s], [cx + s / 2, cy], [cx - s / 2, cy + s]];
        add(rc.linearPath(points, opts({ roughness: 0.6 })));
      },

      /* Tick mark */
      check: function (x, y, colour) {
        add(rc.linearPath([[x - 5, y], [x - 1, y + 4], [x + 6, y - 5]], opts({ stroke: colour || STROKE, strokeWidth: 2, roughness: 0.5 })));
      },

      /* Small × (close button) */
      cross: function (cx, cy) {
        const s = 4;
        add(rc.line(cx - s, cy - s, cx + s, cy + s, opts({ roughness: 0.5 })));
        add(rc.line(cx + s, cy - s, cx - s, cy + s, opts({ roughness: 0.5 })));
      },

      /* Filled triangle (pointers on popovers and tooltips) */
      triangle: function (points, isFilled) {
        add(rc.polygon(points, opts(isFilled ? { fill: STROKE, fillStyle: 'solid' } : { fill: WHITE, fillStyle: 'solid' })));
      },
    };
  }


  /* One recipe per component ============================================== */

  const DRAWINGS = {

    'Accordion': function (p) {
      // Three stacked rows, each with a title and a chevron
      [16, 48, 80].forEach(function (y) {
        p.box(50, y, 140, 24);
        p.text(60, y + 12, 70);
        p.chevron(176, y + 12, 'down');
      });
    },

    'Alert': function (p) {
      // A box with an info icon, title, message and close button
      p.box(40, 30, 160, 60);
      p.circle(62, 52, 16);
      p.line(62, 50, 62, 57, { roughness: 0.3 });
      p.text(80, 48, 70, 'strong');
      p.text(80, 62, 95);
      p.text(80, 74, 65);
      p.cross(186, 42);
    },

    'Avatar': function (p) {
      // A person in a circle, a circle with initials, and a small circle
      p.circle(80, 60, 56);
      p.circle(80, 52, 18);
      p.arc(80, 84, 34, Math.PI, Math.PI * 2);
      p.circle(138, 60, 40);
      p.text(130, 60, 16, 'strong');
      p.circle(178, 60, 26, 'pale');
    },

    'Badge': function (p) {
      // Text lines with small pills beside them
      p.text(50, 40, 90);
      p.pill(152, 32, 38, 16, true);
      p.text(50, 62, 120);
      p.text(50, 84, 70);
      p.pill(132, 76, 30, 16, false);
    },

    'Breadcrumb': function (p) {
      // Page › Page › Current page
      p.text(40, 60, 34);
      p.chevron(86, 60, 'right');
      p.text(98, 60, 34);
      p.chevron(144, 60, 'right');
      p.text(156, 60, 44, 'strong');
    },

    'Button': function (p) {
      // A filled button and an outlined button
      p.filled(45, 46, 70, 28);
      p.text(62, 60, 36, 'white');
      p.box(125, 46, 70, 28);
      p.text(142, 60, 36, 'strong');
    },

    'Card': function (p) {
      // Image on top, title and text below
      p.box(70, 14, 100, 92);
      p.hatched(70, 14, 100, 40);
      p.text(80, 66, 64, 'strong');
      p.text(80, 80, 70);
      p.text(80, 92, 46);
    },

    'Drawer': function (p) {
      // A screen with a panel sliding in from the right
      p.box(30, 14, 180, 92);
      p.hatched(30, 14, 100, 92, { stroke: 'none', hachureGap: 9 });
      p.white(130, 14, 80, 92);
      p.text(140, 30, 40, 'strong');
      p.cross(198, 30);
      p.text(140, 48, 56);
      p.text(140, 60, 50);
      p.text(140, 72, 40);
    },

    'Dropdown': function (p) {
      // A trigger button with an open menu underneath
      p.box(70, 14, 100, 24);
      p.text(80, 26, 50);
      p.chevron(158, 26, 'down');
      p.box(70, 44, 100, 62);
      p.hatched(74, 49, 92, 17, { stroke: 'none' });
      p.text(82, 58, 60, 'strong');
      p.text(82, 76, 70);
      p.text(82, 94, 50);
    },

    'Label': function (p) {
      // A label above a text field, with hint text below
      p.text(60, 34, 46, 'strong');
      p.box(60, 44, 120, 28);
      p.text(70, 58, 60);
      p.text(60, 86, 84);
    },

    'Link': function (p) {
      // A paragraph with one underlined link in it
      p.text(40, 42, 160);
      p.text(40, 60, 40);
      p.text(90, 60, 56, 'strong');
      p.line(90, 67, 146, 67, { roughness: 0.6 });
      p.text(156, 60, 44);
      p.text(40, 78, 120);
    },

    'Modal': function (p) {
      // A dialog box on top of a shaded page
      p.box(25, 8, 190, 104);
      p.hatched(25, 8, 190, 104, { stroke: 'none', hachureGap: 9 });
      p.white(60, 20, 120, 80);
      p.text(70, 34, 50, 'strong');
      p.cross(168, 34);
      p.text(70, 50, 95);
      p.text(70, 62, 78);
      p.filled(128, 76, 42, 16);
    },

    'Pagination': function (p) {
      // ‹ 1 2 3 4 ›
      p.chevron(46, 60, 'left');
      [60, 92, 124, 156].forEach(function (x, i) {
        if (i === 1) {
          p.filled(x, 49, 24, 22);
          p.text(x + 9, 60, 6, 'white');
        } else {
          p.box(x, 49, 24, 22);
          p.text(x + 9, 60, 6, 'strong');
        }
      });
      p.chevron(194, 60, 'right');
    },

    'Popover': function (p) {
      // A box with a pointer, attached to a button below it
      p.box(70, 12, 100, 58);
      p.text(80, 26, 50, 'strong');
      p.text(80, 40, 76);
      p.text(80, 54, 60);
      p.triangle([[112, 69], [120, 78], [128, 69]]);
      p.box(94, 86, 52, 20);
      p.text(104, 96, 32, 'strong');
    },

    'Progress bar': function (p) {
      // Two labelled bars, partly filled
      p.text(40, 30, 50);
      p.box(40, 38, 160, 12);
      p.filled(40, 38, 104, 12);
      p.text(40, 70, 64);
      p.box(40, 78, 160, 12);
      p.filled(40, 78, 46, 12);
    },

    'Skeleton loader': function (p) {
      // Grey placeholder shapes standing in for content
      p.circle(58, 38, 28, 'pale');
      p.text(82, 32, 100);
      p.text(82, 46, 70);
      p.hatched(40, 62, 160, 40, { stroke: LINE });
    },

    'Spinner': function (p) {
      // A pale ring with a dark arc going round it
      p.circle(120, 60, 60, 'ring');
      p.arc(120, 60, 60, -Math.PI / 2, Math.PI / 3, { strokeWidth: 4 });
    },

    'Table': function (p) {
      // A grid with a shaded header row
      p.box(35, 18, 170, 84);
      p.hatched(35, 18, 170, 20, { stroke: 'none' });
      p.line(35, 38, 205, 38);
      p.line(35, 60, 205, 60);
      p.line(35, 81, 205, 81);
      p.line(92, 18, 92, 102);
      p.line(149, 18, 149, 102);
      [28, 49, 70, 91].forEach(function (y, row) {
        [43, 100, 157].forEach(function (x) {
          p.text(x, y, 34, row === 0 ? 'strong' : undefined);
        });
      });
    },

    'Tabs': function (p) {
      // Three tab labels, the first one selected, with content below
      p.text(45, 30, 36, 'strong');
      p.text(97, 30, 36);
      p.text(149, 30, 36);
      p.line(35, 42, 205, 42);
      p.line(40, 42, 86, 42, { strokeWidth: 4, roughness: 0.4 });
      p.text(45, 62, 140);
      p.text(45, 76, 120);
      p.text(45, 90, 90);
    },

    'Toast': function (p) {
      // A small message with a tick and a close button
      p.white(48, 40, 144, 44);
      p.circle(70, 62, 18);
      p.check(70, 62);
      p.text(88, 56, 70, 'strong');
      p.text(88, 70, 50);
      p.cross(180, 52);
    },

    'Toggle': function (p) {
      // One switch on, one switch off
      p.pill(70, 28, 48, 24, true);
      p.circle(106, 40, 18, 'white');
      p.text(132, 40, 56);
      p.pill(70, 68, 48, 24, false);
      p.circle(82, 80, 18);
      p.text(132, 80, 44);
    },

    'Tooltip': function (p) {
      // A dark label with a pointer, above an icon
      p.filled(70, 20, 100, 32);
      p.text(82, 36, 76, 'white');
      p.triangle([[112, 51], [120, 60], [128, 51]], true);
      p.circle(120, 84, 22);
      p.line(120, 82, 120, 89, { roughness: 0.3 });
    },

    /* Form inputs ---------------------------------------------------------- */

    'Checkbox': function (p) {
      // Three options: two ticked, one not
      [32, 60, 88].forEach(function (y, i) {
        if (i === 1) {
          p.box(60, y - 8, 16, 16);
        } else {
          p.filled(60, y - 8, 16, 16);
          p.check(68, y, WHITE);
        }
        p.text(88, y, i === 1 ? 70 : 90);
      });
    },

    'Date picker': function (p) {
      // A date field with a calendar open below it
      p.box(55, 8, 130, 22);
      p.text(64, 19, 60);
      p.box(165, 13, 12, 12, { roughness: 0.6 });
      p.box(55, 36, 130, 76);
      [0, 1, 2, 3].forEach(function (row) {
        [0, 1, 2, 3, 4].forEach(function (col) {
          const x = 72 + col * 24, y = 52 + row * 16;
          if (row === 1 && col === 2) {
            p.circle(x + 3, y, 14, 'filled');
            p.text(x, y, 6, 'white');
          } else {
            p.text(x, y, 6);
          }
        });
      });
    },

    'Radio button': function (p) {
      // Three options, the middle one selected
      [32, 60, 88].forEach(function (y, i) {
        p.circle(68, y, 16);
        if (i === 1) p.circle(68, y, 7, 'filled');
        p.text(86, y, i === 1 ? 90 : 75);
      });
    },

    'Search': function (p) {
      // A rounded field with a magnifying glass
      p.pill(45, 44, 150, 32, false);
      p.circle(66, 58, 12);
      p.line(70, 63, 76, 69, { strokeWidth: 2, roughness: 0.4 });
      p.text(86, 60, 70);
    },

    'Select': function (p) {
      // A label and a field with a down chevron
      p.text(55, 34, 40, 'strong');
      p.box(55, 44, 130, 28);
      p.text(65, 58, 60);
      p.chevron(170, 58, 'down');
    },

    'Text input': function (p) {
      // A label and a field with text and a cursor
      p.text(55, 34, 40, 'strong');
      p.box(55, 44, 130, 28);
      p.text(65, 58, 64);
      p.line(138, 50, 138, 66, { roughness: 0.3 });
    },

    'Textarea': function (p) {
      // A label and a tall field with a few lines of text
      p.text(55, 22, 40, 'strong');
      p.box(55, 32, 130, 72);
      p.text(65, 46, 100);
      p.text(65, 58, 106);
      p.text(65, 70, 80);
      p.line(170, 99, 180, 89, { roughness: 0.3 });
      p.line(176, 99, 180, 95, { roughness: 0.3 });
    },
  };


  /* Breakpoint illustration (Typography page) ===========================
     Four screens side by side: Mobile, Tablet, Desktop, XL desktop.
     - Each is drawn to scale (real screen size ÷ SCALE). Each drawing is
       exactly as wide as its screen, and all four are shown at the same
       on-screen scale (fitBreakpoints), so they compare fairly and share
       one bottom line.
     - Inside each: a heading bar, a subheading bar and text lines. The
       heading bar is as thick as that screen's H1 size ÷ SCALE (read from
       the type tokens), so it visibly grows on bigger screens.
     - The screen matching the current window width is drawn in pink-600,
       the others in pink-200. It redraws when you cross a breakpoint.
     ======================================================================== */

  const SCALE = 8;                    // 1 drawing unit = 8 real pixels
  const MARGIN = 3;                   // room around each drawing for sketchy strokes
  const BOX_HEIGHT = 152;             // same drawing height for all four
  const FRAME_BOTTOM = 130;           // all screens sit on the same line
  const ARROW_Y = 146;                // the width arrow under each screen

  // Example screen sizes for the drawing (width × height, in real px)
  const SCREENS = [
    { name: 'Mobile',     suffix: 'mobile',  width: 375,  height: 812 },
    { name: 'Tablet',     suffix: 'tablet',  width: 768,  height: 1024, token: '--breakpoint-tablet' },
    { name: 'Desktop',    suffix: 'desktop', width: 1024, height: 768,  token: '--breakpoint-desktop' },
    { name: 'XL desktop', suffix: 'xl',      width: 1440, height: 900,  token: '--breakpoint-xl' },
  ];

  /* A token as a number of px. Text sizes are in rem, so convert those
     using the page's base text size (usually 16px). */
  function px(name) {
    const value = token(name);
    if (/rem$/.test(value)) return parseFloat(value) * parseFloat(getComputedStyle(document.documentElement).fontSize);
    return parseFloat(value);
  }

  /* "up to 767px", "768–1023px", "1024–1439px", "1440px+" from the tokens */
  function rangeLabel(i) {
    const start = SCREENS[i].token ? px(SCREENS[i].token) : 0;
    const next = SCREENS[i + 1];
    if (!start) return 'up to ' + (px(next.token) - 1) + 'px';
    if (!next) return start + 'px+';
    return start + '–' + (px(next.token) - 1) + 'px';
  }

  /* Which screen matches the window right now (0–3) */
  function currentScreen() {
    let index = 0;
    SCREENS.forEach(function (s, i) {
      if (s.token && window.innerWidth >= px(s.token)) index = i;
    });
    return index;
  }

  function drawScreen(svg, screen, i, isCurrent) {
    const rc = rough.svg(svg);
    let seed = 100 + i * 20;          // fixed, so each sketch looks the same every time
    const colour = isCurrent ? STROKE : LINE;
    function o(extra) {
      return Object.assign({ stroke: colour, strokeWidth: 1.5, roughness: 0.9, bowing: 0.8, seed: seed++ }, extra);
    }

    // The screen, sitting on the shared bottom line
    const w = screen.width / SCALE, h = screen.height / SCALE;
    const x = 0, y = FRAME_BOTTOM - h;
    svg.appendChild(rc.rectangle(x, y, w, h, o(isCurrent ? { fill: WHITE, fillStyle: 'solid' } : {})));

    // Page sketch inside: heading, subheading, text lines
    const pad = 6;
    const inner = w - pad * 2;
    const headingThickness = px('--type-h1-size-' + screen.suffix) / SCALE;
    const subThickness = px('--type-subheadline-size-' + screen.suffix) / SCALE;
    let lineY = y + pad + headingThickness / 2;
    svg.appendChild(rc.line(x + pad, lineY, x + pad + inner * 0.7, lineY,
      o({ strokeWidth: headingThickness, roughness: 0.4 })));
    lineY += headingThickness / 2 + 5 + subThickness / 2;
    svg.appendChild(rc.line(x + pad, lineY, x + pad + inner * 0.5, lineY,
      o({ strokeWidth: subThickness, roughness: 0.4 })));
    lineY += 9;
    const lengths = [1, 0.9, 0.95, 0.6, 1, 0.85, 0.7, 0.95, 0.5];
    for (let n = 0; lineY < FRAME_BOTTOM - pad && n < lengths.length; n++) {
      svg.appendChild(rc.line(x + pad, lineY, x + pad + inner * lengths[n], lineY,
        o({ stroke: LINE, strokeWidth: 1.5, roughness: 0.4 })));
      lineY += 6;
    }

    // Sketchy arrow under the screen showing its width
    svg.appendChild(rc.line(x, ARROW_Y, x + w, ARROW_Y, o({ roughness: 0.8 })));
    svg.appendChild(rc.linearPath([[x + 4, ARROW_Y - 3], [x, ARROW_Y], [x + 4, ARROW_Y + 3]], o({ roughness: 0.3 })));
    svg.appendChild(rc.linearPath([[x + w - 4, ARROW_Y - 3], [x + w, ARROW_Y], [x + w - 4, ARROW_Y + 3]], o({ roughness: 0.3 })));
  }

  const breakpointArt = document.querySelector('[data-breakpoint-art]');
  let drawnFor = -1;

  function drawBreakpoints() {
    const current = currentScreen();
    if (current === drawnFor) return;   // only redraw when the breakpoint changes
    drawnFor = current;

    breakpointArt.innerHTML = SCREENS.map(function (screen, i) {
      return '<figure class="breakpoint-figure' + (i === current ? ' is-current' : '') + '">' +
        '<svg viewBox="' + (-MARGIN) + ' 0 ' + drawingWidth(screen) + ' ' + BOX_HEIGHT + '" aria-hidden="true"></svg>' +
        '<figcaption>' +
          '<span class="breakpoint-name">' + screen.name +
            (i === current ? '<span class="visually-hidden"> (your current screen size)</span>' : '') + '</span>' +
          '<span class="breakpoint-range">' + rangeLabel(i) + '</span>' +
        '</figcaption>' +
      '</figure>';
    }).join('');

    breakpointArt.querySelectorAll('svg').forEach(function (svg, i) {
      drawScreen(svg, SCREENS[i], i, i === current);
    });
    fitBreakpoints();
  }

  /* Width of one drawing, in drawing units: the screen plus a little margin */
  function drawingWidth(screen) {
    return screen.width / SCALE + MARGIN * 2;
  }

  /* Size the four drawings so they fill the space available at one shared
     scale. In a single row (desktop), all four plus the gaps must fit. On
     phones the CSS makes a 2 × 2 grid, so the widest row (Desktop + XL)
     must fit. The gap comes from the CSS (a spacing token). */
  function fitBreakpoints() {
    const styles = getComputedStyle(breakpointArt);
    const available = breakpointArt.clientWidth -
      parseFloat(styles.paddingLeft) - parseFloat(styles.paddingRight);
    const gap = parseFloat(styles.columnGap);
    const twoByTwo = styles.display === 'grid';

    const rowUnits = twoByTwo
      ? drawingWidth(SCREENS[2]) + drawingWidth(SCREENS[3])
      : SCREENS.reduce(function (sum, s) { return sum + drawingWidth(s); }, 0);
    const gaps = twoByTwo ? gap : gap * (SCREENS.length - 1);
    const scale = (available - gaps) / rowUnits;

    breakpointArt.querySelectorAll('.breakpoint-figure').forEach(function (figure, i) {
      figure.style.width = drawingWidth(SCREENS[i]) * scale + 'px';
    });
  }

  if (breakpointArt) {
    drawBreakpoints();
    window.addEventListener('resize', function () {
      drawBreakpoints();   // redraws only if the breakpoint changed
      fitBreakpoints();
    });
  }


  /* Spacing examples (Spacing page) ======================================
     One small sketch per spacing guideline, on the same 240 × 120 canvas as
     the Overview cards. The pale pink hatched band is the space being
     described. Bands aren't to exact scale; they grow as the spacing does.
     ======================================================================== */

  const SPACING_DRAWINGS = {
    // 4px: inside a component, e.g. icon to label
    '4': function (p) {
      p.pill(66, 44, 108, 32, false);
      p.circle(90, 60, 16);
      band(p, 98, 48, 7, 24);
      p.text(108, 60, 50, 'strong');
    },
    // 8px: related elements, e.g. label to input
    '8': function (p) {
      p.text(60, 32, 48, 'strong');
      band(p, 60, 38, 120, 10);
      p.box(60, 50, 120, 30);
      p.text(70, 65, 60);
    },
    // 16px: unrelated elements, and padding inside a card
    '16': function (p) {
      p.box(52, 16, 136, 88);
      band(p, 53, 17, 134, 16);
      band(p, 53, 33, 16, 70);
      p.text(70, 42, 70, 'strong');
      p.text(70, 56, 100);
      p.text(70, 68, 80);
      p.text(70, 86, 60);
    },
    // 24px: sub-sections inside a section
    '24': function (p) {
      p.box(48, 8, 144, 104);
      p.text(58, 20, 50, 'strong');
      p.text(58, 32, 110);
      p.text(58, 42, 90);
      band(p, 49, 48, 142, 22);
      p.text(58, 78, 50, 'strong');
      p.text(58, 90, 110);
      p.text(58, 100, 80);
    },
    // 32–48px: between sections
    '32': function (p) {
      p.box(48, 8, 144, 34);
      p.text(58, 20, 56, 'strong');
      p.text(58, 32, 100);
      band(p, 48, 44, 144, 30);
      p.box(48, 76, 144, 34);
      p.text(58, 88, 56, 'strong');
      p.text(58, 100, 100);
    },
    // 64px+: between major page sections, e.g. a hero and the content below
    '64': function (p) {
      p.hatched(40, 6, 160, 34);
      p.text(56, 18, 70, 'strong');
      p.text(56, 30, 50);
      band(p, 40, 42, 160, 44);
      p.text(56, 94, 60, 'strong');
      p.text(56, 106, 120);
    },
  };

  /* The highlighted space: a pale pink hatched band with no outline */
  function band(p, x, y, w, h) {
    p.hatched(x, y, w, h, { stroke: 'none', hachureGap: 3, fill: STROKE, fillWeight: 0.6 });
  }

  document.querySelectorAll('[data-spacing-example]').forEach(function (box) {
    const draw = SPACING_DRAWINGS[box.getAttribute('data-spacing-example')];
    if (!draw) return;
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 240 120');
    svg.setAttribute('aria-hidden', 'true');
    draw(makePen(svg));
    box.appendChild(svg);
  });


  /* Draw every illustration on the page =================================== */

  document.querySelectorAll('[data-illustration]').forEach(function (box) {
    const draw = DRAWINGS[box.getAttribute('data-illustration')];
    if (!draw) return;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 240 120');
    svg.setAttribute('aria-hidden', 'true');   // decorative: the card text says what it is
    draw(makePen(svg));
    box.appendChild(svg);
  });

})();
