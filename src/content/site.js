// Product copy and public configuration for the XIX-SVGConverter desktop page.

export const SITE = Object.freeze({
  name: "XIXLabs",
  product: "XIX SVGConverter",
  shortName: "SVGConverter",
  path: "/svgconverter/",
  byline: "by XIXLabs.net",
  title: "Convert SVG files cleanly",
  accentTitle: "for every destination",
});

// The desktop app is the source of these engines: the id it uses, the name it
// shows, and the mode suffix it prints beside that name. The page must not
// invent its own labels, because the preview exists to mirror the real window.
export const ENGINES = Object.freeze([
  { id: "svg-converter", name: "SVG Converter", mode: "" },
]);

// One engine printed the way the app prints it: name and mode, so a mode suffix
// that is already part of the name is never written twice.
export function engineLabel(engine) {
  return engine ? [engine.name, engine.mode].filter(Boolean).join(" ") : "";
}

export const CATALOG = Object.freeze({
  productId: "xix-svgconverter",
  mayarProductId: "e3ad3713-2483-460d-ab77-34b53bcb8273",
  durationDays: 30,
  trialQuota: 10,
  maxActiveDevices: 1,
  engines: ENGINES.map(engineLabel),
});

// Coolify supplies VITE_CHECKOUT_URL after the production Mayar product exists.
export const CHECKOUT_URL = (import.meta.env?.VITE_CHECKOUT_URL || "https://xix-apps.myr.id/pl/xix-svgconverter-monthly-license").trim();
export const DOWNLOAD_URL = (
  import.meta.env?.VITE_DOWNLOAD_URL ||
  "https://github.com/mfahryf/XIX-SVGConverter-release/releases/latest/download/SVGConverter-latest-x64-setup.exe"
).trim();

export const PLAN_LABEL = "Price shown at checkout";
export const PLAN_POINTS = [
  `${CATALOG.trialQuota} successful files total before a licence is required`,
  `Valid for ${CATALOG.durationDays} days from payment`,
  `One licence active on ${CATALOG.maxActiveDevices} device`,
  "Local SVG conversion with a portable Inkscape engine",
];

export const HERO_HIGHLIGHTS = [
  "Convert SVG artwork for print, web, and production workflows",
  "Use a portable Inkscape engine without a browser upload",
  "Keep source files on your own computer during conversion",
  "Batch-convert a playlist and choose the output format you need",
  "A compact desktop workflow with clear progress and repeatable output",
];

// No sample file is shipped as an asset: the starters are markup in
// `content/starters.js`, and a visitor's own file can be used instead.
export const DEMO_LIMITS = {
  fileBytes: 5 * 1024 * 1024,
  accepted: "SVG",
};

export const PREVIEW = Object.freeze({
  palette: { accent: "#7ee2b8", accent2: "#42c7ad", accent3: "#d4ffe8", bgOne: "#31aa91", bgTwo: "#245a69", bgThree: "#83e2bf", bgBase: "#0d252b" },
  brand: "SVGCONVERTER",
  count: "7/9",
  totalFiles: 9,
  format: "EPS",
  fit: "Keep",
  timer: "0:48",
  status: "CONVERTING 71%",
  progress: 71,
  selectedEngine: "svg-converter",
  engines: ENGINES,
  advancedRows: [{ id: "format", label: "FORMAT", value: "EPS", percent: 40 }, { id: "quality", label: "SCALE", value: "100", percent: 60 }],
  files: [
    ["brand-mark.svg", "done", "OK"], ["packaging-label.svg", "done", "OK"], ["poster-layout.svg", "done", "OK"],
    ["icon-set.svg", "done", "OK"], ["product-card.svg", "done", "OK"], ["map-outline.svg", "done", "OK"],
    ["logo-system.svg", "processing", "71%"], ["social-template.svg", "queued", "EPS"], ["stamp-art.svg", "queued", "EPS"],
  ],
});

export const FOOTER_LINKS = Object.freeze({
  social: [],
  main: [{ href: "#download", label: "Download" }, { href: "mailto:hello@xixlabs.net", label: "Support" }],
  legal: [{ href: "/healthz", label: "Service status" }, { href: "https://xixlabs.net", label: "XIXLabs" }],
});

export const COPYRIGHT = Object.freeze({ text: "© " + new Date().getFullYear() + " XIXLabs", license: "All rights reserved" });
