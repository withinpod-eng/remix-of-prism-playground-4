import { useEffect, useState, type RefObject } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/lib/cart";
import type { PurchaseState } from "./PurchasePanel";

/** Compact purchase bar that appears once the main buy panel scrolls away. */
export function StickyPurchaseBar({
  product,
  state,
  watch,
}: {
  product: Product;
  state: PurchaseState;
  watch: RefObject<HTMLDivElement | null>;
}) {
  const [visible, setVisible] = useState(false);
  const { addItem, has } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const el = watch.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry?.isIntersecting), {
      rootMargin: "-120px 0px 0px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [watch]);

  if (state === "unavailable" || state === "pending") return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-3 sm:px-6">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">{product.title}</p>
          <p className="font-display text-lg text-foreground">{product.price}</p>
        </div>

        {state === "owned" ? (
          <Link
            to="/my-products"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
          >
            My Purchases <ArrowRight className="size-4" />
          </Link>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => addItem(product.slug)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
            >
              {has(product.slug) ? "In cart" : "Add to Cart"}
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                addItem(product.slug);
                navigate({ to: "/checkout" });
              }}
              className="hidden items-center rounded-full border border-border px-5 py-3 text-sm text-foreground transition-colors hover:border-primary hover:text-primary sm:inline-flex"
            >
              Buy Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
