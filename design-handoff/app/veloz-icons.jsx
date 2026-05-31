/* VelozHub line icons. Stroke-based, 24x24, inherit currentColor. */
(function () {
  const React = window.React;
  const h = React.createElement;
  const svg = (paths, extra) => (props) =>
    h('svg', Object.assign({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
      strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }, props),
      ...paths.map((d, i) => (typeof d === 'string'
        ? h('path', { key: i, d })
        : h(d.t, Object.assign({ key: i }, d.p)))));

  const Icons = {
    Home: svg(['M3 10.5 12 3l9 7.5', 'M5 9.5V21h14V9.5', { t: 'path', p: { d: 'M9.5 21v-6h5v6' } }]),
    Calendar: svg(['M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z',
      'M4 9.5h16', 'M8 3v4', 'M16 3v4']),
    Plus: svg(['M12 5v14', 'M5 12h14']),
    Car: svg(['M5 11l1.6-4.2A2 2 0 0 1 8.5 5.5h7a2 2 0 0 1 1.9 1.3L19 11',
      'M4 11h16v5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1v-1H7.5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z',
      { t: 'circle', p: { cx: 7.5, cy: 14, r: 0.6 } }, { t: 'circle', p: { cx: 16.5, cy: 14, r: 0.6 } }]),
    Users: svg(['M16 19v-1.5a3.5 3.5 0 0 0-3.5-3.5h-5A3.5 3.5 0 0 0 4 17.5V19',
      { t: 'circle', p: { cx: 10, cy: 8, r: 3.2 } }, 'M18 13.2a3 3 0 0 0 0-5.7', 'M21 19v-1.4a3.4 3.4 0 0 0-2.4-3.2']),
    Note: svg(['M6 3h8l4 4v14a0 0 0 0 1 0 0H6a0 0 0 0 1 0 0z', 'M14 3v4h4', 'M9 12h6', 'M9 16h4']),
    Clock: svg([{ t: 'circle', p: { cx: 12, cy: 12, r: 8.2 } }, 'M12 7.5V12l3 2']),
    Sun: svg([{ t: 'circle', p: { cx: 12, cy: 12, r: 4 } }, 'M12 2v2.5', 'M12 19.5V22', 'M2 12h2.5', 'M19.5 12H22',
      'M4.9 4.9l1.8 1.8', 'M17.3 17.3l1.8 1.8', 'M19.1 4.9l-1.8 1.8', 'M6.7 17.3l-1.8 1.8']),
    Moon: svg(['M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z']),
    Chevron: svg(['M9 6l6 6-6 6']),
    ChevronL: svg(['M15 6l-6 6 6 6']),
    Back: svg(['M15 6l-6 6 6 6']),
    Close: svg(['M6 6l12 12', 'M18 6 6 18']),
    Edit: svg(['M4 20h4L19 9a2 2 0 0 0-3-3L5 16v4z', 'M14.5 7.5l3 3']),
    Trash: svg(['M4 7h16', 'M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2', 'M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13', 'M10 11v6', 'M14 11v6']),
    Alert: svg(['M12 3.5 21 19H3z', 'M12 10v4', { t: 'circle', p: { cx: 12, cy: 16.6, r: 0.6 } }]),
    Check: svg(['M5 12.5 10 17.5 19 7']),
    CheckCircle: svg([{ t: 'circle', p: { cx: 12, cy: 12, r: 8.5 } }, 'M8.5 12.2 11 14.7 15.6 9.5']),
    Lock: svg([{ t: 'rect', p: { x: 5, y: 11, width: 14, height: 9, rx: 2 } }, 'M8 11V8a4 4 0 0 1 8 0v3']),
    Dots: svg([{ t: 'circle', p: { cx: 5, cy: 12, r: 1 } }, { t: 'circle', p: { cx: 12, cy: 12, r: 1 } }, { t: 'circle', p: { cx: 19, cy: 12, r: 1 } }]),
    Arrow: svg(['M5 12h14', 'M13 6l6 6-6 6']),
  };

  // Brand mark — a stylized speed "V" inside a rounded square.
  Icons.Mark = (props) => h('svg', Object.assign({ viewBox: '0 0 32 32', fill: 'none' }, props),
    h('rect', { x: 1, y: 1, width: 30, height: 30, rx: 9, fill: 'var(--primary)' }),
    h('path', { d: 'M9 10.5l4.6 11a1.2 1.2 0 0 0 2.2 0l4.6-11', stroke: 'var(--primary-ink)', strokeWidth: 2.6, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }),
    h('path', { d: 'M21.5 10.5h2.2', stroke: 'var(--accent)', strokeWidth: 2.6, strokeLinecap: 'round' }));

  // Toyota Veloz — flat side-profile illustration of the actual car: compact-MPV
  // proportions (short nose, tall greenhouse, long flat roof, three side windows
  // with a kicked-up rear quarter glass). Themed via CSS (.carart .* classes pick
  // up --bar / --accent / --ink from the banner) so the Veloz wears the color of
  // whoever currently has it.
  Icons.CarArt = ({ className, ...props }) => (
    <svg viewBox="0 0 250 120" className={'carart ' + (className || '')} fill="none" {...props} aria-hidden="true">
      <ellipse className="shadow" cx="125" cy="110" rx="116" ry="6" />
      {/* body shell — boxy MPV silhouette */}
      <path className="body" d="M10,90 L10,73 C10,67 13,63 20,61 L49,56 L64,38 L70,32 C72,30 74,29 78,29 L170,29 C176,29 180,31 182,36 L189,55 L216,59 C229,61 237,65 237,77 L237,90 L207,90 A20,20 0 0 1 167,90 L83,90 A20,20 0 0 1 43,90 Z" />
      {/* lower black cladding + sill (crossover trim) */}
      <path className="clad" d="M10,84 L237,84 L237,90 L207,90 A20,20 0 0 1 167,90 L83,90 A20,20 0 0 1 43,90 L10,90 Z" />
      {/* greenhouse glass band */}
      <path className="glass" d="M66,54 L72,37 C73,35 75,34 78,34 L167,34 C170,34 173,35 174,38 L181,54 Z" />
      {/* B and C pillars split the band into 3 windows */}
      <path className="body" d="M104,34 L111,34 L111,54 L104,54 Z" />
      <path className="body" d="M145,34 L153,34 L150,54 L143,54 Z" />
      {/* blacked-out rear quarter pillar (Veloz floating-roof look) */}
      <path className="clad" d="M174,38 L181,54 L172,54 L168,40 Z" />
      {/* body character line */}
      <path className="accent" d="M22,62 L184,57 L184,59 L22,64 Z" />
      {/* head & tail lamps */}
      <path className="light" d="M11,65 L21,63 L21,69 L11,70 Z" />
      <path className="light" d="M237,68 L230,67 L230,73 L237,74 Z" />
      {/* wheels — alloy + dark arch trim */}
      <path className="clad" d="M43,90 A20,20 0 0 1 83,90 L77,90 A14,14 0 0 0 49,90 Z" />
      <path className="clad" d="M167,90 A20,20 0 0 1 207,90 L201,90 A14,14 0 0 0 173,90 Z" />
      <circle className="tire" cx="63" cy="90" r="19" />
      <circle className="tire" cx="187" cy="90" r="19" />
      <circle className="rim" cx="63" cy="90" r="9" />
      <circle className="rim" cx="187" cy="90" r="9" />
      <circle className="hub" cx="63" cy="90" r="3.2" />
      <circle className="hub" cx="187" cy="90" r="3.2" />
    </svg>
  );

  window.VelozIcons = Icons;
})();
