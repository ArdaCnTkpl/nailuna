"use client";

import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Canvas, PencilBrush } from "fabric";

const DEFAULT_BRUSH_SIZE = 16;
const MIN_BRUSH = 4;
const MAX_BRUSH = 48;
/** Mask/çizim için maksimum kenar; oran fotoğrafa göre ayarlanır. */
const MASK_MAX = 1024;

/**
 * OpenAI Edit API: transparent = edit (nails), opaque = preserve (hand, background).
 * Canvas has transparent bg; undrawn areas would stay transparent (= edit all) if we didn't fix.
 * We start with opaque white (= preserve all), then make only drawn pixels transparent (= edit nails only).
 */
function maskForEdit(
  sourceCanvas: HTMLCanvasElement,
  w: number,
  h: number
): string {
  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d");
  if (!ctx) return "";

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(sourceCanvas, 0, 0);
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;

  // Sadece fırça (turkuaz) pikselleri transparan yap = sadece tırnak bölgesi düzenlenecek.
  // Beyaz = korunacak. Transparan = düzenlenecek (OpenAI convention).
  const WHITE_THRESHOLD = 245;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i];
    const g = d[i + 1];
    const b = d[i + 2];
    const isWhite = r >= WHITE_THRESHOLD && g >= WHITE_THRESHOLD && b >= WHITE_THRESHOLD;
    if (!isWhite) {
      d[i + 3] = 0; // Fırça pikseli = transparan = sadece bu alan edit edilecek
    }
  }

  ctx.putImageData(id, 0, 0);
  return off.toDataURL("image/png");
}

/** Mask canvas içeriğini hedef boyuta ölçekleyip PNG data URL döner (API için aynı boyut). */
function scaleMaskToSize(
  sourceCanvas: HTMLCanvasElement,
  targetW: number,
  targetH: number
): string {
  const off = document.createElement("canvas");
  off.width = targetW;
  off.height = targetH;
  const ctx = off.getContext("2d");
  if (!ctx) return "";
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(sourceCanvas, 0, 0, targetW, targetH);
  return maskForEdit(off, targetW, targetH);
}

export type NailCanvasRef = {
  getMaskForEdit: () => Promise<Blob | null>;
  hasImage: () => boolean;
  hasDrawnPaths: () => boolean;
  clearPaths: () => void;
  undoLastPath: () => void;
};

type NailCanvasProps = {
  imageObjectUrl: string | null;
  disabled?: boolean;
  brushLabel?: string;
  hintText?: string;
  undoLabel?: string;
  clearLabel?: string;
};

const NailCanvas = forwardRef<NailCanvasRef, NailCanvasProps>(
  function NailCanvas(
    { imageObjectUrl, disabled, brushLabel = "Fırça", hintText = "Tırnakları fırçayla işaretle. Bu alan AI tarafından düzenlenecek.", undoLabel = "Geri al", clearLabel = "İşaretleri sil" },
    ref
  ) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<Canvas | null>(null);
    const imageSizeRef = useRef<{ w: number; h: number } | null>(null);
    const [brushSize, setBrushSize] = useState(DEFAULT_BRUSH_SIZE);
    const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);
    const [pathCount, setPathCount] = useState(0);
    /** Fırça önizlemesi: canvas üzerinde görünen daire (brushSize değişince güncellenir) */
    const [cursorPreview, setCursorPreview] = useState<{ x: number; y: number; diameter: number } | null>(null);
    const hasImageRef = useRef(false);

    /** Canvas boyutunu fotoğraf oranına göre ayarla (kayma olmasın). */
    const syncCanvasToImageRatio = useCallback(
      (imgW: number, imgH: number) => {
        const c = canvasRef.current;
        if (!c || !imgW || !imgH) return;
        const ratio = imgW / imgH;
        const w = ratio >= 1 ? MASK_MAX : Math.round(MASK_MAX * ratio);
        const h = ratio >= 1 ? Math.round(MASK_MAX / ratio) : MASK_MAX;
        c.setDimensions({ width: w, height: h });
        c.renderAll();
      },
      []
    );

    useEffect(() => {
      hasImageRef.current = !!imageObjectUrl;
      if (!imageObjectUrl) {
        setImageAspectRatio(null);
        imageSizeRef.current = null;
        setPathCount(0);
      }
      const c = canvasRef.current;
      if (!c) return;
      if (!imageObjectUrl) {
        c.clear();
        c.setDimensions({ width: MASK_MAX, height: MASK_MAX });
        c.renderAll();
      }
    }, [imageObjectUrl]);

    useEffect(() => {
      if (!wrapperRef.current || typeof window === "undefined") return;

      const el = document.createElement("canvas");
      el.width = MASK_MAX;
      el.height = MASK_MAX;
      el.style.width = "100%";
      el.style.height = "100%";
      el.style.display = "block";
      wrapperRef.current.appendChild(el);

      const c = new Canvas(el, {
        width: MASK_MAX,
        height: MASK_MAX,
        backgroundColor: "transparent",
        isDrawingMode: true,
        selection: false,
      });

      const brush = new PencilBrush(c);
      // Yumuşak turkuaz – görünür, luminance yüksek (mask için), rahat çizim
      brush.color = "rgba(120, 210, 230, 0.92)";
      brush.width = brushSize;
      brush.strokeLineCap = "round";
      brush.strokeLineJoin = "round";
      brush.decimate = 0.2;
      c.freeDrawingBrush = brush;

      c.on("path:created", () => {
        setPathCount(c.getObjects().length);
      });

      canvasRef.current = c;

      return () => {
        c.dispose();
        canvasRef.current = null;
        hasImageRef.current = false;
        if (wrapperRef.current) wrapperRef.current.innerHTML = "";
      };
    }, []);

    useEffect(() => {
      const b = canvasRef.current?.freeDrawingBrush;
      if (b) b.width = brushSize;
    }, [brushSize]);

    /* Fırça boyutu değişince işaretleyici çapını da güncelle (imleç hareket etmeden) */
    useEffect(() => {
      if (!cursorPreview) return;
      const wrapper = wrapperRef.current;
      const c = canvasRef.current;
      if (!wrapper || !c) return;
      const canvasW = c.getWidth() || MASK_MAX;
      const scale = wrapper.offsetWidth / canvasW;
      setCursorPreview((prev) =>
        prev ? { ...prev, diameter: brushSize * scale } : null
      );
    }, [brushSize]);

    useImperativeHandle(
      ref,
      () => ({
        async getMaskForEdit(): Promise<Blob | null> {
          const c = canvasRef.current;
          if (!c || !hasImageRef.current) return null;
          if (c.getObjects().length === 0) return null;

          const source = c.toCanvasElement(1);
          const size = imageSizeRef.current;
          const dataUrl =
            size && size.w > 0 && size.h > 0
              ? scaleMaskToSize(source, size.w, size.h)
              : maskForEdit(source, c.width ?? MASK_MAX, c.height ?? MASK_MAX);
          if (!dataUrl) return null;
          const res = await fetch(dataUrl);
          return res.blob();
        },
        hasImage() {
          return hasImageRef.current;
        },
        hasDrawnPaths() {
          const c = canvasRef.current;
          return !!(c && c.getObjects().length > 0);
        },
        clearPaths() {
          const c = canvasRef.current;
          if (!c) return;
          c.remove(...c.getObjects());
          c.renderAll();
        },
        undoLastPath() {
          const c = canvasRef.current;
          if (!c) return;
          const objs = c.getObjects();
          if (objs.length > 0) {
            c.remove(objs[objs.length - 1]);
            c.renderAll();
          }
        },
      }),
      []
    );

    const handleUndo = useCallback(() => {
      const c = canvasRef.current;
      if (!c || disabled) return;
      const objs = c.getObjects();
      if (objs.length > 0) {
        c.remove(objs[objs.length - 1]);
        c.renderAll();
        setPathCount(c.getObjects().length);
      }
    }, [disabled]);

    const handleClear = useCallback(() => {
      const c = canvasRef.current;
      if (!c || disabled) return;
      c.remove(...c.getObjects());
      c.renderAll();
      setPathCount(0);
    }, [disabled]);

    return (
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-[var(--text-muted)] shrink-0">
              {brushLabel}
            </span>
            <input
              type="range"
              min={MIN_BRUSH}
              max={MAX_BRUSH}
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              disabled={disabled}
              className="w-20 sm:w-24 h-2 accent-[var(--primary)] disabled:opacity-50 touch-none"
            />
            <span className="text-sm tabular-nums w-8 shrink-0">{brushSize}px</span>
          </label>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={handleUndo}
              disabled={disabled || pathCount === 0}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs font-medium text-[var(--text)] shadow-[var(--shadow-sm)] transition hover:border-[var(--border-hover)] hover:bg-[var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              title={undoLabel}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span className="hidden sm:inline">{undoLabel}</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={disabled || pathCount === 0}
              className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] px-3 py-2 text-xs font-medium text-[var(--text)] shadow-[var(--shadow-sm)] transition hover:border-[var(--border-hover)] hover:bg-[var(--primary-light)] disabled:cursor-not-allowed disabled:opacity-50"
              title={clearLabel}
            >
              <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline">{clearLabel}</span>
            </button>
          </div>
        </div>

        {/* Fotoğraf tam gösterilir, kırpılmaz */}
<div
            className="relative w-full max-w-full overflow-auto rounded-xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] min-h-[200px] ring-1 ring-[var(--border)]/50"
        >
          <div
            className="relative w-full"
            style={{ aspectRatio: imageAspectRatio ?? 1, minHeight: 200 }}
            onMouseMove={(e) => {
              const wrapper = wrapperRef.current;
              const c = canvasRef.current;
              if (!wrapper || !c || disabled) return;
              const rect = wrapper.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              const canvasW = c.getWidth() || MASK_MAX;
              const scale = rect.width / canvasW;
              const diameter = brushSize * scale;
              setCursorPreview({ x, y, diameter });
            }}
            onMouseLeave={() => setCursorPreview(null)}
          >
            {imageObjectUrl && (
              <img
                src={imageObjectUrl}
                alt="Tırnak fotoğrafı"
                decoding="async"
                fetchPriority="high"
                onLoad={(e) => {
                  const img = e.currentTarget;
                  if (img.naturalWidth && img.naturalHeight) {
                    const w = img.naturalWidth;
                    const h = img.naturalHeight;
                    imageSizeRef.current = { w, h };
                    setImageAspectRatio(w / h);
                    syncCanvasToImageRatio(w, h);
                  }
                }}
                className="absolute inset-0 block h-full w-full object-contain object-center"
                style={{ imageRendering: "auto" }}
              />
            )}
            <div
              ref={wrapperRef}
              className="absolute inset-0 h-full w-full [&_>div]:!absolute [&_>div]:!inset-0 [&_>div]:!h-full [&_>div]:!w-full [&_>div]:!m-0 [&_canvas]:!h-full [&_canvas]:!w-full [&_canvas]:!object-contain [&_canvas]:!object-center"
            />
            {/* Fırça boyutuna göre güncellenen işaretleyici – brushSize değişince diameter da güncellenir */}
            {cursorPreview && (
              <div
                className="pointer-events-none absolute rounded-full border-2 border-[var(--primary)] bg-[rgba(120,210,230,0.25)]"
                style={{
                  left: cursorPreview.x - cursorPreview.diameter / 2,
                  top: cursorPreview.y - cursorPreview.diameter / 2,
                  width: cursorPreview.diameter,
                  height: cursorPreview.diameter,
                }}
                aria-hidden
              />
            )}
          </div>
        </div>

        <p className="text-xs text-[var(--text-muted)]">{hintText}</p>
      </div>
    );
  }
);

export default NailCanvas;
