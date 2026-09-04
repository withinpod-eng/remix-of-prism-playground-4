import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Download, ShieldCheck, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import type { ProductDetails } from "@/data/productDetails";
import { useCart } from "@/lib/cart";

export type PurchaseState = "available" | "owned" | "unavailable" | "pending";

/** Badge / category / title / price / description / highlights / licence / CTAs. */
export function PurchasePanel({
  product,
  details,
  state,
}: {
  product: Product;
  details: ProductDetails;
  state: PurchaseState;
}) {
  const { addItem, has } = useCart();
  const navigate = useNavigate();
  const inCart = has(product.slug);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        {details.badge && (
          <span
            className="rounded-full border border-primary/50 bg-primary/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-primary"
            style={{ boxShadow: "0 0 30px -12px oklch(0.68 0.19 48 / 70%)" }}
          >
            {details.badge}
          </span>
        )}
        <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          {product.category}
        </span>
      </div>

      <h1 className="mt-5 font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl">
        {product.title}
      </h1>

      <p className="mt-3 text-xs text-muted-foreground">
        New release · no customer reviews yet
      </p>

      <div className="mt-6 flex flex-wrap items-baseline gap-3">
        <span className="font-display text-4xl text-foreground">{product.price}</span>
        <span className="text-sm text-muted-foreground">one-time payment · lifetime access</span>
      </div>

      <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
        {product.description}
      </p>

      {/* Product highlights */}
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {details.highlights.map((h) => (
          <div
            key={h.title}
            className="rounded-2xl border border-border bg-card/40 p-4 backdrop-blur"
          >
            <p className="text-sm font-medium text-foreground">{h.title}</p>
            <p className="mt-1 text-xs leading-snug text-muted-foreground">{h.detail}</p>
          </div>
        ))}
      </div>

      {/* Quick "what's inside" checklist */}
      <ul className="mt-8 space-y-2.5 border-t border-border/60 pt-8">
        {details.includes.slice(0, 4).map((item) => (
          <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
            {item}
          </li>
        ))}
      </ul>

      {/* Licence */}
      <div className="mt-8 rounded-2xl border border-border bg-card/40 p-5 backdrop-blur">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Licence
        </p>
        <p className="mt-2 text-sm font-medium text-foreground">{details.license.title}</p>
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {details.license.summary}
        </p>
        <Link
          to="/terms-and-conditions"
          className="mt-3 inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
        >
          View licence details <ArrowRight className="size-3.5" />
        </Link>
      </div>

      {/* CTA hierarchy */}
      <div className="mt-8">
        {state === "owned" && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/my-products"
              className="inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="size-4" /> View in My Purchases
            </Link>
            <span className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-7 py-4 text-sm text-foreground">
              <Check className="size-4 text-primary" /> You own this product
            </span>
          </div>
        )}

        {state === "pending" && (
          <div className="rounded-full border border-border bg-card/60 px-7 py-4 text-center text-sm text-muted-foreground">
            Access pending — we're preparing your files
          </div>
        )}

        {state === "unavailable" && (
          <div className="rounded-full border border-border bg-card/60 px-7 py-4 text-center text-sm text-muted-foreground">
            Currently unavailable
          </div>
        )}

        {state === "available" && (
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => addItem(product.slug)}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              <ShoppingBag className="size-4" />
              {inCart ? "In your cart" : "Add to Cart"}
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                addItem(product.slug);
                navigate({ to: "/checkout" });
              }}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-border px-7 py-4 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>

      <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 text-primary" /> Secure checkout · access linked to your
        account
      </p>

      {/* File / access metadata */}
      <dl className="mt-8 grid gap-x-8 gap-y-3 border-t border-border/60 pt-8 sm:grid-cols-2">
        {details.meta.map((m) => (
          <div key={m.label} className="flex items-center justify-between gap-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{m.label}</dt>
            <dd className="text-right text-sm text-foreground">{m.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
