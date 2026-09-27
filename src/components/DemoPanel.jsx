
import { useCallback, useEffect, useRef, useState } from "react";
import { Download, RotateCcw, Upload } from "lucide-react";
import { STARTERS } from "../content/starters";
import { DEMO_LIMITS } from "../content/site";
import {
  OUTPUT_WIDTHS,
  formatBytes,
  pngToBlobUrl,
  readSvgSize,
  renderSvgToPng,
  svgToBlobUrl,
} from "../lib/renderSvg";

function outputName(sourceName, width) {
  const base = String(sourceName || "artwork").replace(/\.[^.]+$/, "") || "artwork";
  return base + "-" + width + ".png";
}

// Free trial panel: render an SVG to a PNG on the visitor's own computer.
//
// This shows the conversion half of the desktop app. The desktop engine turns
// SVG into EPS and raster through a portable Inkscape build; the page cannot
// carry Inkscape, so it offers the raster output and says so plainly rather than
// implying it produces EPS.
//
// There is no before-and-after slider here. A slider compares two versions of the
// same picture; this compares an editable source against a fixed raster, and a
// side-by-side pair reads far more clearly than a divider over one image.
export function DemoPanel({
  authenticated = true,
  authChecking = false,
  onRequireLogin = () => {},
}) {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState("");
  const [selected, setSelected] = useState(STARTERS[0].id);
  const [file, setFile] = useState(null);
  const [width, setWidth] = useState(1024);
  const [result, setResult] = useState(null);
  const [dropping, setDropping] = useState(false);
  const inputRef = useRef(null);
  const runRef = useRef(0);
  const resultRef = useRef(null);

  // Both blob URLs below belong to the component instance, so they are revoked
  // when it unmounts or when a new conversion starts; a long session of trying
  // files would otherwise hold every one of them in memory.
  useEffect(() => () => {
    runRef.current += 1;
    if (resultRef.current?.blobUrl) URL.revokeObjectURL(resultRef.current.blobUrl);
    if (resultRef.current?.sourceUrl) URL.revokeObjectURL(resultRef.current.sourceUrl);
  }, []);

  const clearResult = useCallback(() => {
    if (resultRef.current?.blobUrl) URL.revokeObjectURL(resultRef.current.blobUrl);
    if (resultRef.current?.sourceUrl) URL.revokeObjectURL(resultRef.current.sourceUrl);
    resultRef.current = null;
    setResult(null);
  }, []);

  const reset = useCallback(() => {
    runRef.current += 1;
    clearResult();
    setState("idle");
    setMessage("");
    setStage("");
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, [clearResult]);

  const starter = STARTERS.find((entry) => entry.id === selected);

  const convert = useCallback(
    async (source, chosenWidth) => {
      const run = (runRef.current += 1);
      const alive = () => run === runRef.current;
      clearResult();
      setMessage("");
      setResult(null);

      try {
        setState("processing");
        setStage("Loading renderer");
        // Let the browser paint the progress state before the renderer is
        // fetched and the render blocks the thread.
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (!alive()) return;

        setStage("Rendering PNG at " + chosenWidth + "px");
        const output = await renderSvgToPng(source.text, { width: chosenWidth });
        if (!alive()) return;

        const blobUrl = pngToBlobUrl(output.png);
        const next = {
          blobUrl,
          // A starter is markup this repository owns, so it is injected as an
          // element. An uploaded file is drawn as an image instead, which is
          // what the blank source panel used to hide: that branch only had
          // markup for the starter, so a file left the panel empty.
          sourceUrl: source.isStarter ? null : svgToBlobUrl(source.text),
          declared: readSvgSize(source.text),
          width: output.width,
          height: output.height,
          bytes: output.png.length,
          sourceName: source.name,
          outputWidth: chosenWidth,
        };
        resultRef.current = next;
        setResult(next);
        setState("done");
      } catch (error) {
        if (!alive()) return;
        setMessage(
          typeof error?.message === "string" ? error.message : "The file could not be converted."
        );
        setState("error");
      }
    },
    [clearResult]
  );

  const chooseStarter = useCallback(
    (entry) => {
      if (authChecking) return;
      if (!authenticated) {
        onRequireLogin();
        return;
      }
      setSelected(entry.id);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      convert({ text: entry.svg, name: entry.id + ".svg", isStarter: true }, width);
    },
    [authChecking, authenticated, convert, onRequireLogin, width]
  );

  const acceptFile = useCallback(
    async (picked) => {
      if (!picked) return;
      if (picked.size > DEMO_LIMITS.fileBytes) {
        clearResult();
        setMessage(
          "The file is " + formatBytes(picked.size) + ", above the " +
          formatBytes(DEMO_LIMITS.fileBytes) + " limit. Choose a smaller file."
        );
        setState("error");
        return;
      }
      if (!/\.svg$/i.test(picked.name) && picked.type !== "image/svg+xml") {
        clearResult();
        setMessage("Choose an SVG file. This tool renders SVG to PNG.");
        setState("error");
        return;
      }
      const text = await picked.text();
      setSelected(null);
      setFile(picked.name);
      convert({ text, name: picked.name }, width);
    },
    [clearResult, convert, width]
  );

  const openFilePicker = useCallback(() => {
    if (authChecking) return;
    if (!authenticated) {
      onRequireLogin();
      return;
    }
    inputRef.current?.click();
  }, [authChecking, authenticated, onRequireLogin]);

  const activeSource = file || starter?.name || "";
  const busy = state === "processing";

  return (
    <section className="panel demo" id="try" aria-labelledby="demo-title">
      {/* No visible heading of its own: the page heading above already explains
          the contents. */}
      <h2 id="demo-title" className="visually-hidden">
        Convert one SVG to PNG
      </h2>

      <input
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/svg+xml,.svg"
        onChange={(event) => {
          const picked = event.target.files?.[0];
          if (!picked) return;
          if (authChecking) {
            event.target.value = "";
            return;
          }
          if (!authenticated) {
            event.target.value = "";
            onRequireLogin();
            return;
          }
          acceptFile(picked);
        }}
      />

      <p className="demo-lead">
        Pick one of the samples, or drop in your own SVG. It is rendered to a PNG in your browser —
        nothing is uploaded.
      </p>

      <div className="demo-starters">
        {STARTERS.map((entry) => (
          <button
            key={entry.id}
            type="button"
            className={"demo-starter" + (entry.id === selected ? " demo-starter-selected" : "")}
            aria-pressed={entry.id === selected}
            onClick={() => chooseStarter(entry)}
          >
            {/* The starter is shown by rendering its own markup, so what a
                visitor clicks is exactly what gets converted. */}
            <span
              className="demo-starter-art"
              aria-hidden="true"
              dangerouslySetInnerHTML={{ __html: entry.svg }}
            />
            <span className="demo-starter-name">{entry.name}</span>
          </button>
        ))}
      </div>

      <div
        className="dropzone dropzone-compact"
        data-dropping={dropping ? "true" : "false"}
        onDragOver={(event) => {
          event.preventDefault();
          setDropping(true);
        }}
        onDragLeave={() => setDropping(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDropping(false);
          const picked = event.dataTransfer?.files?.[0];
          if (!picked) return;
          if (authChecking) return;
          if (!authenticated) {
            onRequireLogin();
            return;
          }
          acceptFile(picked);
        }}
      >
        <p className="dropzone-title">Drop an SVG here</p>
        <p className="dropzone-detail">
          Up to {formatBytes(DEMO_LIMITS.fileBytes)}. {activeSource ? "Current source: " + activeSource : ""}
        </p>
        <button type="button" className="button button-secondary button-compact" onClick={openFilePicker}>
          <Upload className="nav-icon" aria-hidden="true" />
          Choose SVG
        </button>
      </div>

      <div className="demo-scale" role="group" aria-label="Output width">
        <span className="demo-scale-label">Width</span>
        {OUTPUT_WIDTHS.map((value) => (
          <button
            key={value}
            type="button"
            className={"button button-compact " + (value === width ? "button-primary" : "button-secondary")}
            aria-pressed={value === width}
            onClick={() => setWidth(value)}
            disabled={busy}
          >
            {value}px
          </button>
        ))}
      </div>

      {busy && (
        <div className="progress" role="status" aria-live="polite">
          <div className="progress-head">
            <span className="progress-stage">{stage}</span>
            <span className="progress-value" />
          </div>
          <div className="progress-track">
            <div className="progress-bar" data-indeterminate="true" />
          </div>
          <p className="progress-note">
            The first run downloads the renderer, about 2.5 MB, and your browser caches it
            afterwards.
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="alert" role="alert">
          <strong>The file could not be converted.</strong>
          <p>{message}</p>
          <button type="button" className="button button-secondary" onClick={reset}>
            <RotateCcw className="nav-icon" aria-hidden="true" />
            Try again
          </button>
        </div>
      )}

      {state === "done" && result && (starter || file) && (
        <div className="result">
          <div className="convert-pair">
            <figure className="convert-panel">
              {result.sourceUrl ? (
                <img className="convert-panel-art" src={result.sourceUrl} alt={"Source SVG: " + result.sourceName} />
              ) : (
                <span className="convert-panel-art convert-panel-vector" aria-hidden="true"
                  dangerouslySetInnerHTML={{ __html: starter ? starter.svg : "" }} />
              )}
              <figcaption className="convert-panel-label">
                <strong>Source</strong>
                <span>{result.sourceName}</span>
              </figcaption>
            </figure>
            <figure className="convert-panel">
              <img className="convert-panel-art" src={result.blobUrl} alt={"PNG rendered at " + result.width + " by " + result.height + " pixels"} />
              <figcaption className="convert-panel-label">
                <strong>PNG</strong>
                <span>{result.width} x {result.height} · {formatBytes(result.bytes)}</span>
              </figcaption>
            </figure>
          </div>

          <p className="result-note">
            {result.declared
              ? "The source declares a " + result.declared.width + " x " + result.declared.height +
                " view; PNG output is a fixed grid of pixels and cannot be scaled back without loss."
              : "PNG output is a fixed grid of pixels and cannot be scaled back without loss."}{" "}
            The desktop app also writes EPS, which stays scalable.
          </p>

          <div className="result-actions">
            <a
              className="button button-primary"
              href={result.blobUrl}
              download={outputName(result.sourceName, result.outputWidth)}
            >
              <Download className="nav-icon" aria-hidden="true" />
              Save PNG
            </a>
            <button type="button" className="button button-secondary" onClick={reset}>
              <RotateCcw className="nav-icon" aria-hidden="true" />
              Start over
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default DemoPanel;
