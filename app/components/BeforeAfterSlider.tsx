"use client";

import { useCallback, useRef, useState } from "react";

export type BeforeAfterItem = {
  before: string;
  after: string;
  alt?: string;
};

type Props = {
  beforeImage: string;
  afterImage: string;
  beforeLabel: string;
  afterLabel: string;
  alt?: string;
  large?: boolean;
  /** El hizalaması için – before görselinde el daha aşağıdaysa Y değerini artırın (örn. "50% 72%") */
  beforeObjectPosition?: string;
  afterObjectPosition?: string;
};

export function BeforeAfterSlider({
  beforeImage,
  afterImage,
  beforeLabel,
  afterLabel,
  alt = "Before and after nail",
  large = false,
  beforeObjectPosition = "50% 72%",
  afterObjectPosition = "50% 48%",
}: Props) {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const clamp = (n: number) => Math.max(0, Math.min(100, n));

  const updatePosition = useCallback(
    (clientX: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const pct = (x / rect.width) * 100;
      setPosition(clamp(pct));
    },
    []
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden bg-[var(--border)] ${large ? "aspect-[16/9] rounded-2xl sm:rounded-3xl" : "aspect-[4/3] rounded-2xl sm:rounded-3xl"} ring-1 ring-[var(--border)]/80`}
      style={{
        boxShadow:
          "0 4px 12px rgba(0,0,0,0.4), 0 0 0 1px rgba(201, 169, 98, 0.2)",
      }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* After (full image, shown on the right side via clip) */}
      <div className="absolute inset-0">
        <img
          src={afterImage}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ objectPosition: afterObjectPosition }}
        />
      </div>
      {/* Before (clipped to left of divider) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <img
          src={beforeImage}
          alt={alt}
          className="h-full w-full object-cover"
          style={{ objectPosition: beforeObjectPosition }}
        />
      </div>
      {/* Alt gradient – etiketler elin üstünde kalmadan okunabilir */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent"
        aria-hidden
      />
      {/* Draggable divider – premium handle */}
      <div
        className={`absolute top-0 bottom-0 cursor-ew-resize touch-none ${large ? "w-2 sm:w-2.5" : "w-1.5 sm:w-2"}`}
        style={{ left: `${position}%`, transform: "translateX(-50%)" }}
        onPointerDown={onPointerDown}
        role="slider"
        aria-label={`${beforeLabel} / ${afterLabel}`}
        aria-valuenow={position}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center">
          <div
            className={`rounded-full border-2 border-white/90 bg-white/95 shadow-[0_2px_12px_rgba(0,0,0,0.4),0_0_0_1px_rgba(201,169,98,0.5)] backdrop-blur-sm ${large ? "h-16 w-8 sm:h-20 sm:w-10" : "h-14 w-7 sm:h-16 sm:w-8"}`}
          />
        </div>
      </div>
      {/* Label – altta, gradient üzerinde; sıra: solda after, sağda before */}
      <span
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 tracking-[0.2em] text-[11px] sm:text-xs font-medium uppercase text-white transition-opacity duration-300 ${position < 50 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        aria-hidden
      >
        {afterLabel}
      </span>
      <span
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 tracking-[0.2em] text-[11px] sm:text-xs font-medium uppercase text-white transition-opacity duration-300 ${position >= 50 ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
        aria-hidden
      >
        {beforeLabel}
      </span>
    </div>
  );
}
