import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryShot } from "@/data/productDetails";

/** Cinematic dark-studio gallery: large spotlighted visual + thumbnail strip. */
export function ProductGallery({ shots, title }: { shots: GalleryShot[]; title: string }) {
  const [index, setIndex] = useState(0);
  const active = shots[index] ?? shots[0]!;
  const move = (dir: number) => setIndex((i) => (i + dir + shots.length) % shots.length);

  return (
    <div>
      <div
        className="glass-panel relative overflow-hidden rounded-[2rem]"
        style={{ boxShadow: "var(--shadow-card), var(--shadow-glow)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/25 blur-[120px]"
        />
        <img
          src={active.src}
          alt={`${title} — ${active.caption}`}
          width={1200}
          height={900}
          className="relative aspect-[4/3] w-full object-cover"
        />
        {/* copper rim light + controlled depth */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[2rem]"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 110%, oklch(0.13 0.012 60 / 85%) 0%, transparent 65%)",
            boxShadow: "inset 0 1px 0 0 oklch(0.78 0.16 62 / 25%)",
          }}
        />

        <span className="absolute bottom-4 left-4 rounded-full bg-background/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground backdrop-blur">
          {active.caption}
        </span>

        {shots.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={() => move(-1)}
              className="absolute left-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={() => move(1)}
              className="absolute right-4 top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background/70 text-foreground/80 backdrop-blur transition-colors hover:border-primary/60 hover:text-primary"
            >
              <ChevronRight className="size-4" />
            </button>
          </>
        )}
      </div>

      <div className="mt-4 grid grid-cols-4 gap-3">
        {shots.map((shot, i) => (
          <button
            key={shot.caption}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`View ${shot.caption}`}
            aria-current={i === index}
            className={`overflow-hidden rounded-2xl border transition-all ${
              i === index
                ? "border-primary/70 opacity-100"
                : "border-border opacity-60 hover:opacity-90"
            }`}
          >
            <img
              src={shot.src}
              alt={`${title} ${shot.caption} thumbnail`}
              loading="lazy"
              width={300}
              height={220}
              className="aspect-[4/3] w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
