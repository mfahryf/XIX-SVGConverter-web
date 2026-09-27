// Renders an SVG to a PNG in the visitor's browser with resvg compiled to WASM.
//
// resvg is the renderer the page uses because it is a real SVG renderer rather
// than a browser canvas: it draws the file the way a conversion tool would,
// without needing a <canvas> to rasterise through an <img> first.
//
// The engine is loaded on demand. It carries a 2.5 MB WASM binary, so nobody who
// is only reading the page pays for it.

let enginePromise = null;

function loadEngine() {
  if (!enginePromise) {
    enginePromise = (async () => {
      const [{ initWasm, Resvg }, wasmUrl] = await Promise.all([
        import("@resvg/resvg-wasm"),
        import("@resvg/resvg-wasm/index_bg.wasm?url"),
      ]);
      await initWasm(fetch(wasmUrl.default));
      return { Resvg };
    })().catch((error) => {
      // A failed load must not be remembered, or every later attempt would fail
      // the same way without trying again.
      enginePromise = null;
      throw error;
    });
  }
  return enginePromise;
}

// The sizes offered for conversion. They are pixel widths, which is what a
// raster output is defined by.
export const OUTPUT_WIDTHS = [512, 1024, 2048];

export async function renderSvgToPng(svgText, { width = 1024 } = {}) {
  const text = String(svgText || "");
  if (!text.trim()) throw new Error("The SVG file is empty.");

  const { Resvg } = await loadEngine();
  const renderer = new Resvg(text, {
    fitTo: { mode: "width", value: width },
    // A rendered PNG with a transparent background is what a conversion tool
    // produces by default, so no background is painted here either.
  });
  const rendered = renderer.render();
  const png = rendered.asPng();
  const size = { width: rendered.width, height: rendered.height };
  renderer.free();
  return { png, ...size };
}

export function pngToBlobUrl(png) {
  return URL.createObjectURL(new Blob([png], { type: "image/png" }));
}

// The source side of the comparison is shown as an image rather than injected
// as markup: a visitor's file can carry event handlers, and an SVG loaded
// through <img> is not allowed to run anything. The starter artwork is still
// injected inline, because it is markup this repository owns.
export function svgToBlobUrl(svgText) {
  return URL.createObjectURL(new Blob([String(svgText || "")], { type: "image/svg+xml;charset=utf-8" }));
}

// What the SVG says it should be, so the converted size can be compared against
// it. The renderer above reports the size it produced, which is authoritative.
export function readSvgSize(svgText) {
  const text = String(svgText || "");
  const viewBox = text.match(/viewBox\s*=\s*["']([^"']*)["']/i);
  if (viewBox) {
    const parts = viewBox[1].trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts.every((value) => Number.isFinite(value))) {
      return { width: parts[2], height: parts[3] };
    }
  }
  const width = Number.parseFloat(text.match(/\swidth\s*=\s*["']([^"']*)["']/i)?.[1] ?? "");
  const height = Number.parseFloat(text.match(/\sheight\s*=\s*["']([^"']*)["']/i)?.[1] ?? "");
  if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) {
    return { width, height };
  }
  return null;
}

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return "";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
