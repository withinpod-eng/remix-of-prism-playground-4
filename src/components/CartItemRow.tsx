import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { accessLabel, formatPrice, type CartLine } from "@/lib/cart";

/**
 * Compact cart-row variant of the Jays Vault product language.
 * Shares artwork, typography and badge styling with ProductCard,
 * but is a functional row rather than a marketing card.
 */
export function CartItemRow({
  line,
  onRemove,
}: {
  line: CartLine;
  onRemove: (slug: string) => void;
}) {
  const { product, quantity, unitPrice } = line;
  const lineTotal = unitPrice * quantity;

  return (
    <li className="border-b border-white/[0.07] py-6 last:border-b-0 sm:py-8">
      {/* Desktop: product | price | qty | total */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 md:grid-cols-[minmax(0,1fr)_7rem_5rem_7rem_2.5rem] md:items-center md:gap-6">
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
            {product.tags[0] ? (
              <span className="mt-2 inline-flex rounded-full border border-border bg-background/40 px-2.5 py-1 text-[11px] text-foreground/75">
                {product.tags[0]}
              </span>
            ) : null}

            {/* Mobile price line */}
            <p className="mt-3 font-mono text-[15px] text-foreground md:hidden">
              {formatPrice(lineTotal)}
              <span className="ml-2 text-[12px] text-muted-foreground">1 licence</span>
            </p>
          </div>
        </div>

        <div className="hidden text-right font-mono text-[15px] text-foreground/80 md:block">
          {formatPrice(unitPrice)}
        </div>

        <div className="hidden text-center text-[13px] text-muted-foreground md:block">
          {quantity}
        </div>

        <div className="hidden text-right font-mono text-[17px] text-foreground md:block">
          {formatPrice(lineTotal)}
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
