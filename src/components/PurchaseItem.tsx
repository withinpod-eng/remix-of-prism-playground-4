import { useState } from "react";
import { ArrowUpRight, Check, Download, Loader2 } from "lucide-react";
import {
  deliveryAction,
  deliveryType,
  formatPurchaseDate,
  type Purchase,
} from "@/lib/purchases";

/** Compact, functional row for the account area — deliberately not a marketing ProductCard. */
export function PurchaseItem({ purchase }: { purchase: Purchase }) {
  const action = deliveryAction(purchase.product_category);
  const [state, setState] = useState<"idle" | "preparing" | "done">("idle");

  const start = () => {
    if (state !== "idle") return;
    setState("preparing");
    // Authorised access check happens before delivery; storage URLs are never exposed here.
    window.setTimeout(() => {
      setState("done");
      window.setTimeout(() => setState("idle"), 2500);
    }, 1100);
  };

  const disabled = purchase.status !== "available";

  return (
    <li className="group grid gap-4 px-5 py-5 transition-colors hover:bg-primary/[0.03] sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6 sm:px-7">
      <div className="flex items-center gap-4">
        <div className="size-16 shrink-0 overflow-hidden rounded-xl border border-border bg-secondary sm:size-14">
          {purchase.product?.image && (
            <img
              src={purchase.product.image}
              alt=""
              loading="lazy"
              className="size-full object-cover"
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] text-foreground">{purchase.product_title}</p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {deliveryType(purchase.product_category)} • {purchase.product_category}
          </p>
          <p className="mt-1 text-xs text-muted-foreground/80 sm:hidden">
            Purchased {formatPurchaseDate(purchase.purchased_at)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-6 sm:justify-end">
        <span className="hidden text-xs text-muted-foreground sm:block">
          {formatPurchaseDate(purchase.purchased_at)}
        </span>

        {disabled ? (
          <span className="rounded-full border border-border px-4 py-2 text-xs text-muted-foreground">
            {purchase.status === "pending"
              ? "Access pending"
              : purchase.status === "processing"
                ? "Preparing access…"
                : "Contact support"}
          </span>
        ) : (
          <button
            type="button"
            onClick={start}
            className="inline-flex items-center gap-2 rounded-full border border-primary/50 bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary transition-all hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground motion-reduce:transform-none"
          >
            {state === "preparing" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Preparing…
              </>
            ) : state === "done" ? (
              <>
                <Check className="size-4" />
                Ready
              </>
            ) : (
              <>
                {action.kind === "download" ? (
                  <Download className="size-4" />
                ) : (
                  <ArrowUpRight className="size-4" />
                )}
                {action.label}
              </>
            )}
          </button>
        )}
      </div>
    </li>
  );
}
