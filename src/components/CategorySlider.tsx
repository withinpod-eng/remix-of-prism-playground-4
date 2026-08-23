import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart } from "lucide-react";

import catTemplates from "@/assets/cat-templates.jpg";
import catPresets from "@/assets/cat-presets.jpg";
import catToolkits from "@/assets/cat-toolkits.jpg";
import catFonts from "@/assets/cat-fonts.jpg";
import cat3d from "@/assets/cat-3d.jpg";
import catAudio from "@/assets/cat-audio.jpg";

const categories = [
  { name: "Templates", count: "128 products", image: catTemplates, dots: 4, active: 0 },
  { name: "Presets", count: "96 products", image: catPresets, dots: 4, active: 1 },
  { name: "Toolkits", count: "74 products", image: catToolkits, dots: 3, active: 2 },
  { name: "Fonts", count: "52 products", image: catFonts, dots: 4, active: 0 },
  { name: "3D Assets", count: "41 products", image: cat3d, dots: 3, active: 1 },
  { name: "Audio Packs", count: "38 products", image: catAudio, dots: 4, active: 2 },
];

export function CategorySlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-foreground/70">
            <span className="h-px w-8 bg-primary" />
            Categories
          </p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            Shop by <span className="font-medium">category</span>
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scrollBy(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scrollBy(1)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((cat) => (
          <article
            key={cat.name}
            className="glass-panel group relative w-[304px] shrink-0 snap-start rounded-[1.5rem] p-1 transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="relative h-[238px] overflow-hidden rounded-[1.25rem] border border-border">

              <img
                src={cat.image}
                alt={`${cat.name} category`}
                loading="lazy"
                width={768}
                height={640}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                type="button"
                aria-label={`Save ${cat.name}`}
                className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur-md transition-colors hover:text-primary"
              >
                <Heart className="size-4" />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {Array.from({ length: cat.dots }).map((_, i) => (
                  <span
                    key={i}
                    className={
                      i === cat.active
                        ? "size-1.5 rounded-full bg-primary"
                        : "size-1.5 rounded-full bg-foreground/40"
                    }
                  />
                ))}
              </div>
            </div>

            <div className="flex h-[80px] items-center justify-between gap-3 px-4">
              <div>
                <h3 className="font-display text-base text-foreground">{cat.name}</h3>
                <p className="mt-1 font-mono text-sm text-primary">{cat.count}</p>
              </div>
              <Link
                to="/products"
                aria-label={`Browse ${cat.name}`}
                className="flex size-11 shrink-0 items-center justify-center rounded-full border border-border bg-secondary/60 text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
