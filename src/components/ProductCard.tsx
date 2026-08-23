import { Link } from "@tanstack/react-router";
import type { Product } from "@/data/products";

/**
 * The single reusable Jays Vault product card.
 * Used on the homepage slider, the shop grid, recommendations and related products.
 */
export function ProductCard({ product, className = "" }: { product: Product; className?: string }) {
  return (
    <article
      className={
        "glass-panel group relative h-[470px] w-[300px] shrink-0 overflow-hidden rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1 " +
        className
      }
    >
      <img
        src={product.image}
        alt={`${product.title} product preview`}
        loading="lazy"
        width={768}
        height={640}
        className="absolute inset-x-0 top-0 h-[300px] w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-x-0 top-0 h-[300px] bg-gradient-to-b from-transparent via-background/25 to-background" />

      <div className="relative flex h-full flex-col justify-end p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="font-display text-xl text-foreground">{product.title}</h3>
          <span className="rounded-full bg-secondary/90 px-3 py-1 font-mono text-sm text-foreground">
            {product.price}
          </span>
        </div>

        <p className="mt-2 text-[13px] leading-snug text-muted-foreground">{product.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {product.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-[11px] text-foreground/80 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>

        <Link
          to="/products/$slug"
          params={{ slug: product.slug }}
          className="mt-5 flex h-11 w-full items-center justify-center rounded-full bg-secondary font-medium text-foreground transition-colors hover:bg-foreground hover:text-background"
        >
          Buy Now
        </Link>
      </div>
    </article>
  );
}
