// Starter artwork for the free trial.
//
// They exist so a visitor can try the converter without hunting for a file
// first. Each one uses only shapes, paths and plain fills, with no filters and
// no text, so the renderer draws them exactly as intended — a trial that showed
// something the converter silently dropped would be misleading.
//
// The page does not convert these into bundled assets; they are markup, kept
// short enough to read.

export const STARTERS = [
  {
    id: "rocket-badge",
    name: "Rocket badge",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" rx="28" fill="#101a38"/>
  <circle cx="100" cy="96" r="62" fill="#1d2b52"/>
  <path d="M100 34c18 16 28 38 28 62 0 14-4 27-11 38H83c-7-11-11-24-11-38 0-24 10-46 28-62z" fill="#e8f0ff"/>
  <circle cx="100" cy="86" r="12" fill="#5aa9ff"/>
  <path d="M72 118l-16 30 26-8z" fill="#ff8c5a"/>
  <path d="M128 118l16 30-26-8z" fill="#ff8c5a"/>
  <path d="M92 140h16l-8 26z" fill="#ffd166"/>
  <circle cx="46" cy="52" r="5" fill="#ffd166"/>
  <circle cx="156" cy="66" r="4" fill="#ffb36b"/>
  <circle cx="150" cy="38" r="6" fill="#ff6b9d"/>
</svg>`,
  },
  {
    id: "leaf-mark",
    name: "Leaf mark",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <circle cx="100" cy="100" r="96" fill="#0d252b"/>
  <circle cx="100" cy="100" r="74" fill="#12333a"/>
  <path d="M100 34c34 0 62 28 62 62-34 0-62-28-62-62z" fill="#7ee2b8"/>
  <path d="M100 166c-34 0-62-28-62-62 34 0 62 28 62 62z" fill="#42c7ad"/>
  <path d="M100 34c0 34-28 62-62 62 0-34 28-62 62-62z" fill="#d4ffe8"/>
  <path d="M100 166c0-34 28-62 62-62 0 34-28 62-62 62z" fill="#83e2bf"/>
  <circle cx="100" cy="100" r="16" fill="#0d252b"/>
</svg>`,
  },
  {
    id: "folder-tag",
    name: "Folder tag",
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">
  <rect width="200" height="200" rx="28" fill="#2b1a0c"/>
  <path d="M30 62h52l14 18h74a8 8 0 0 1 8 8v72a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8V70a8 8 0 0 1 8-8z" fill="#f5d76e"/>
  <path d="M22 92h164v68a8 8 0 0 1-8 8H30a8 8 0 0 1-8-8z" fill="#ff9f43"/>
  <path d="M62 128l16 16 34-34" fill="none" stroke="#ffe6a0" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,
  },
];
