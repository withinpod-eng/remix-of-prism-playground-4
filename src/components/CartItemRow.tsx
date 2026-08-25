import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { accessLabel, formatPrice, type CartLine } from "@/lib/cart";

/**
 * Compact cart-row variant of the Jays Vault product language.
 * Digital licences are one-per-account, so there is no quantity control.
 */
export function CartItemRow({
  line,
  owned = false,
  onRemove,
}: {
  line: CartLine;
  owned?: boolean;
  onRemove: (slug: string) => void;
}) {
  const { product, unitPrice } = line;

  return (
    <li className="border-b border-white/[0.07] py-6 last:border-b-0 sm:py-8">
      {/* Desktop: product | access | price */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 md:grid-cols-[minmax(0,1fr)_10rem_8rem_2.5rem] md:items-center md:gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/products/$slug"
            params={{ slug: product.slug }}
            className="shrink-0 overflow-hidden rounded-2xl border border-border"
          >
            <img
              src={product.image}
              alt={`${product.title} preview`}
              loading="lazy"
              width={160}
              height={160}
              className="size-[72px] object-cover sm:size-20"
            />
          </Link>

          <div className="min-w-0">
            <Link
              to="/products/$slug"
              params={{ slug: product.slug }}
              className="block truncate font-display text-[17px] text-foreground transition-colors hover:text-primary"
            >
              {product.title}
            </Link>
            <p className="mt-1 truncate text-[13px] text-muted-foreground">
              {accessLabel(product)}
            </p>

            {owned ? (
              <span className="mt-2 inline-flex rounded-full border border-destructive/40 bg-destructive/10 px-2.5 py-1 text-[11px] text-destructive">
                Already in your vault
              </span>
            ) : product.tags[0] ? (
              <span className="mt-2 inline-flex rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] text-foreground/75">
                {product.tags[0]}
              </span>
            ) : null}

            {/* Mobile price line */}
            <p className="mt-3 font-mono text-[15px] text-foreground md:hidden">
              {formatPrice(unitPrice)}
              <span className="ml-2 text-[12px] text-muted-foreground">Single licence</span>
            </p>
          </div>
        </div>

        <div className="hidden text-center text-[12px] text-muted-foreground md:block">
          Single licence
        </div>

        <div className="hidden text-right font-mono text-[17px] text-foreground md:block">
          {formatPrice(unitPrice)}
        </div>

        <button
          type="button"
          onClick={() => onRemove(product.slug)}
          aria-label={`Remove ${product.title} from your vault`}
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <X className="size-4" />
        </button>
      </div>
    </li>
  );
}
