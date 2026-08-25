import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Download, Lock, PackageCheck } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CartItemRow } from "@/components/CartItemRow";
import { formatPrice, useCart } from "@/lib/cart";
import emptyVault from "@/assets/empty-vault.jpg";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Vault — Cart | Jays Vault" },
      {
        name: "description",
        content:
          "Review the digital products in your Jays Vault cart, apply a coupon and continue to secure checkout with instant digital delivery.",
      },
      { property: "og:title", content: "Your Vault — Cart | Jays Vault" },
      {
        property: "og:description",
        content:
          "Review your digital products, apply a coupon and head to secure checkout.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const {
    items,
    subtotal,
    discount,
    total,
    coupon,
    removeItem,
    removeMany,
    applyCoupon,
    removeCoupon,
    hydrated,
  } = useCart();
  const { isOwned, loading: ownedLoading } = useOwnedProducts();
  const ownedInCart = items.filter((line) => isOwned(line.slug));
  const payable = items.filter((line) => !isOwned(line.slug));
  const payableSubtotal = payable.reduce((sum, line) => sum + line.unitPrice, 0);
  const payableDiscount =
    subtotal > 0 ? Math.round(((payableSubtotal / subtotal) * discount + Number.EPSILON) * 100) / 100 : 0;
  const payableTotal = Math.max(0, Math.round((payableSubtotal - payableDiscount) * 100) / 100);
  const blocked = ownedInCart.length > 0;
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<{ ok: boolean; message: string } | null>(null);

  const onApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    const result = applyCoupon(code);
    setStatus(result);
    if (result.ok) setCode("");
  };

  return (
    <div className="relative min-h-screen bg-background">
      {/* Restrained cinematic lighting: warm glow upper-right, faint copper below */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-48 size-[46rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_68%)] blur-3xl" />
        <div className="absolute left-1/2 top-[52%] size-[36rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary-glow)_12%,transparent),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative">
        <SiteNav />

        <main className="mx-auto max-w-7xl px-6 pb-24 pt-14 lg:px-8 lg:pt-20">
          <Reveal>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 sm:flex sm:items-end sm:justify-between">
              <div className="min-w-0">
                <h1 className="font-display text-[44px] leading-[1.05] text-foreground sm:text-6xl lg:text-[68px]">
                  Your Vault
                </h1>
                <p className="mt-4 text-[15px] text-muted-foreground sm:text-base">
                  Review your digital products before checkout.
                </p>
              </div>
              <Link
                to="/products"
                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border px-5 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                <ArrowLeft className="size-4" /> Continue Shopping
              </Link>
            </div>
          </Reveal>

          {!hydrated ? (
            <div className="mt-16 h-40" />
          ) : items.length === 0 ? (
            <EmptyVault />
          ) : (
            <>
              <Reveal delay={80}>
                <div className="mt-14">
                  <div className="hidden grid-cols-[minmax(0,1fr)_7rem_5rem_7rem_2.5rem] gap-6 border-b border-white/[0.07] pb-4 font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground md:grid">
                    <span>Product</span>
                    <span className="text-right">Price</span>
                    <span className="text-center">Qty</span>
                    <span className="text-right">Total</span>
                    <span />
                  </div>

                  <ul>
                    {items.map((line) => (
                      <CartItemRow key={line.slug} line={line} onRemove={removeItem} />
                    ))}
                  </ul>
                </div>
              </Reveal>

              <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start">
                <Reveal delay={120}>
                  <div className="space-y-6">
                    <section className="glass-panel rounded-3xl p-7">
                      <h2 className="font-display text-[22px] text-foreground">Have a coupon?</h2>
                      <form onSubmit={onApply} className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <label htmlFor="coupon" className="sr-only">
                          Coupon code
                        </label>
                        <input
                          id="coupon"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder="Enter code"
                          className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-background/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        />
                        <button
                          type="submit"
                          className="h-12 shrink-0 rounded-xl border border-primary/60 px-6 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                        >
                          Apply
                        </button>
                      </form>

                      {coupon ? (
                        <p className="mt-4 flex flex-wrap items-center gap-2 text-[13px] text-primary">
                          {coupon.code} applied — {coupon.percentOff}% off.
                          <button
                            type="button"
                            onClick={() => {
                              removeCoupon();
                              setStatus(null);
                            }}
                            className="text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
                          >
                            Remove
                          </button>
                        </p>
                      ) : status && !status.ok ? (
                        <p className="mt-4 text-[13px] text-destructive">{status.message}</p>
                      ) : null}
                    </section>

                    <section className="rounded-3xl border border-white/[0.07] p-7">
                      <h2 className="font-display text-[22px] text-foreground">Digital access</h2>
                      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                        Your products will be delivered according to their listed access method
                        after successful payment.
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[13px] text-foreground/80">
                        <li className="inline-flex items-center gap-2">
                          <Lock className="size-4 text-primary" /> Secure checkout
                        </li>
                        <li className="inline-flex items-center gap-2">
                          <Download className="size-4 text-primary" /> Digital delivery
                        </li>
                        <li className="inline-flex items-center gap-2">
                          <PackageCheck className="size-4 text-primary" /> Order tracking
                        </li>
                      </ul>
                    </section>
                  </div>
                </Reveal>

                <Reveal delay={160}>
                  <aside className="glass-panel rounded-3xl p-7 lg:sticky lg:top-28">
                    <h2 className="font-display text-[22px] text-foreground">Order Summary</h2>

                    <dl className="mt-6 space-y-4 text-[15px]">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Subtotal</dt>
                        <dd className="font-mono text-foreground/90">{formatPrice(subtotal)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Discount</dt>
                        <dd className="font-mono text-primary">
                          {discount > 0 ? `− ${formatPrice(discount)}` : "—"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Tax</dt>
                        <dd className="text-[13px] text-muted-foreground">
                          Calculated at checkout
                        </dd>
                      </div>
                    </dl>

                    <div className="mt-6 border-t border-white/[0.07] pt-6">
                      <div className="flex items-end justify-between gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                          Total
                        </span>
                        <span className="font-display text-[32px] leading-none text-foreground transition-all duration-300">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <div className="mt-3 h-px w-16 bg-primary/70" />
                    </div>

                    <Link
                      to="/checkout"
                      className="group mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-medium text-primary-foreground shadow-[0_12px_40px_-14px_color-mix(in_oklab,var(--primary)_75%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_52px_-12px_color-mix(in_oklab,var(--primary)_85%,transparent)]"
                    >
                      Proceed to Checkout
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                      <Lock className="size-3.5 text-primary" /> Secure checkout
                    </p>
                  </aside>
                </Reveal>
              </div>
            </>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function EmptyVault() {
  return (
    <Reveal delay={80}>
      <div className="mt-16 flex flex-col items-center gap-10 rounded-[2rem] border border-white/[0.07] px-6 py-16 text-center sm:py-20">
        <img
          src={emptyVault}
          alt="An open vault glowing with warm copper light"
          loading="lazy"
          width={1024}
          height={768}
          className="w-full max-w-[380px] rounded-3xl opacity-90"
        />
        <div>
          <h2 className="font-display text-3xl text-foreground sm:text-4xl">Your Vault is empty.</h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
            Looks like you haven't added anything yet.
          </p>
          <Link
            to="/products"
            className="group mt-8 inline-flex h-[52px] items-center gap-2 rounded-2xl bg-primary px-8 font-medium text-primary-foreground shadow-[0_12px_40px_-14px_color-mix(in_oklab,var(--primary)_75%,transparent)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Explore the Vault
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
