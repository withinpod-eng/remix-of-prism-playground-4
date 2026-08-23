import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/data/products";

export function ProductSlider() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: 1 | -1) => {
    trackRef.current?.scrollBy({ left: dir * 324, behavior: "smooth" });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 pb-8 lg:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-foreground/70">
            <span className="h-px w-8 bg-primary" />
            Products
          </p>
          <h2 className="mt-4 font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
            What we <span className="font-medium">sell</span>
          </h2>
        </div>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll products left"
            onClick={() => scrollBy(-1)}
            className="flex size-11 items-center justify-center rounded-full border border-border bg-background/40 text-foreground backdrop-blur transition-colors hover:border-primary hover:text-primary"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Scroll products right"
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
        {products.slice(0, 6).map((p) => (
          <ProductCard key={p.title} product={p} className="snap-start" />
        ))}
      </div>
    </section>
  );
}
