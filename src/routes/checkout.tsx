import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Download, Lock, Mail } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { accessLabel, formatPrice, useCart } from "@/lib/cart";
import { useSession } from "@/hooks/useSession";
import { useOwnedProducts } from "@/hooks/useOwnedProducts";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | Jays Vault" },
      {
        name: "description",
        content:
          "Complete your Jays Vault order — review your digital products, confirm your delivery email and get instant access after payment.",
      },
      { property: "og:title", content: "Secure Checkout | Jays Vault" },
      {
        property: "og:description",
        content: "Review your order and unlock instant digital delivery from Jays Vault.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items, subtotal, discount, coupon, hydrated, clear, removeMany } = useCart();
  const { user } = useSession();
  const { isOwned, refresh: refreshOwned } = useOwnedProducts();

  const ownedInCart = items.filter((line) => isOwned(line.slug));
  const payable = items.filter((line) => !isOwned(line.slug));
  const subtotalDue = payable.reduce((sum, line) => sum + line.unitPrice, 0);
  const discountDue =
    subtotal > 0 ? Math.round((subtotalDue / subtotal) * discount * 100) / 100 : 0;
  const total = Math.max(0, Math.round((subtotalDue - discountDue) * 100) / 100);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState<{ reference: string; email: string } | null>(null);

  useEffect(() => {
    if (user?.email && !email) setEmail(user.email);
  }, [user, email]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email so we can deliver your files.");
      return;
    }
    if (payable.length === 0) {
      setError("You already own everything in this cart.");
      return;
    }
    setError(null);
    setPlacing(true);
    const reference = `JV-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    if (user) {
      const { error: insertError } = await supabase.from("purchases").insert(
        payable.map((line) => ({
          user_id: user.id,
          product_slug: line.slug,
          product_title: line.product.title,
          product_category: line.product.category,
          unit_price: line.unitPrice,
          status: "available",
          order_reference: reference,
        })),
      );
      if (insertError) {
        setPlacing(false);
        setError("We couldn't confirm your order. Please try again.");
        return;
      }
      await refreshOwned();
    }

    setPlaced({ reference, email: email.trim() });
    setPlacing(false);
    clear();
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-48 size-[46rem] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_26%,transparent),transparent_68%)] blur-3xl" />
        <div className="absolute left-1/2 top-[55%] size-[34rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary-glow)_12%,transparent),transparent_70%)] blur-3xl" />
      </div>

      <div className="relative">
        <SiteNav />

        <main className="mx-auto max-w-6xl px-6 pb-28 pt-14 lg:px-8 lg:pt-20">
          {placed ? (
            <OrderPlaced reference={placed.reference} email={placed.email} />
          ) : !hydrated ? (
            <div className="h-64" />
          ) : items.length === 0 ? (
            <EmptyCheckout />
          ) : (
            <>
              <Reveal>
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-6 sm:flex sm:items-end sm:justify-between">
                  <div className="min-w-0">
                    <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                      Step 2 of 2
                    </span>
                    <h1 className="mt-4 font-display text-[44px] leading-[1.05] text-foreground sm:text-6xl">
                      Checkout
                    </h1>
                    <p className="mt-4 text-[15px] text-muted-foreground sm:text-base">
                      No shipping, no waiting — just your delivery email and one confirmation.
                    </p>
                  </div>
                  <Link
                    to="/cart"
                    className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full border border-border px-5 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
                  >
                    <ArrowLeft className="size-4" /> Back to Vault
                  </Link>
                </div>
              </Reveal>

              <form
                onSubmit={onSubmit}
                className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-start"
              >
                <Reveal delay={80}>
                  <section className="glass-panel rounded-3xl p-7">
                    <h2 className="font-display text-[22px] text-foreground">Delivery details</h2>
                    <p className="mt-2 text-[13px] text-muted-foreground">
                      Your download links and licence keys are sent here instantly.
                    </p>

                    <div className="mt-6 space-y-5">
                      <div>
                        <label
                          htmlFor="name"
                          className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
                        >
                          Full name
                        </label>
                        <input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          autoComplete="name"
                          placeholder="Jordan Vale"
                          className="mt-2 h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="email"
                          className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground"
                        >
                          Delivery email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          autoComplete="email"
                          placeholder="you@studio.com"
                          className="mt-2 h-12 w-full rounded-xl border border-border bg-background/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
                        />
                        {error && <p className="mt-2 text-[13px] text-destructive">{error}</p>}
                      </div>
                    </div>

                    <div className="mt-8 border-t border-white/[0.07] pt-7">
                      <h3 className="font-display text-[20px] text-foreground">Your order</h3>
                      {ownedInCart.length > 0 ? (
                        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-[13px] text-foreground/90">
                            {ownedInCart.length} item{ownedInCart.length === 1 ? "" : "s"} already in
                            your vault {ownedInCart.length === 1 ? "was" : "were"} excluded — you
                            can\u2019t buy the same product twice.
                          </p>
                          <button
                            type="button"
                            onClick={() => removeMany(ownedInCart.map((l) => l.slug))}
                            className="h-10 shrink-0 rounded-xl border border-destructive/50 px-4 text-[13px] font-medium text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground"
                          >
                            Remove them
                          </button>
                        </div>
                      ) : null}
                      <ul className="mt-5 space-y-4">
                        {payable.map((line) => (
                          <li key={line.slug} className="flex items-start gap-4">
                            <img
                              src={line.product.image}
                              alt=""
                              width={72}
                              height={72}
                              loading="lazy"
                              className="size-14 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-foreground">{line.product.title}</p>
                              <p className="mt-1 text-[12px] text-muted-foreground">
                                {accessLabel(line.product)}
                              </p>
                            </div>
                            <span className="font-mono text-sm text-foreground/90">
                              {formatPrice(line.unitPrice)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </section>
                </Reveal>

                <Reveal delay={140}>
                  <aside className="glass-panel rounded-3xl p-7 lg:sticky lg:top-28">
                    <h2 className="font-display text-[22px] text-foreground">Order Summary</h2>

                    <dl className="mt-6 space-y-4 text-[15px]">
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Items ({payable.length})</dt>
                        <dd className="text-[13px] text-muted-foreground">Single licence each</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Subtotal</dt>
                        <dd className="font-mono text-foreground/90">{formatPrice(subtotalDue)}</dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">
                          Discount{coupon ? ` (${coupon.code})` : ""}
                        </dt>
                        <dd className="font-mono text-primary">
                          {discountDue > 0 ? `− ${formatPrice(discountDue)}` : "—"}
                        </dd>
                      </div>
                      <div className="flex items-center justify-between">
                        <dt className="text-muted-foreground">Delivery</dt>
                        <dd className="text-[13px] text-muted-foreground">Instant · digital</dd>
                      </div>
                    </dl>

                    <div className="mt-6 border-t border-white/[0.07] pt-6">
                      <div className="flex items-end justify-between gap-4">
                        <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                          Total due
                        </span>
                        <span className="font-display text-[32px] leading-none text-foreground">
                          {formatPrice(total)}
                        </span>
                      </div>
                      <div className="mt-3 h-px w-16 bg-primary/70" />
                    </div>

                    <button
                      type="submit"
                      disabled={placing || payable.length === 0}
                      className="group mt-7 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-primary text-[15px] font-medium text-primary-foreground shadow-[0_12px_40px_-14px_color-mix(in_oklab,var(--primary)_75%,transparent)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_52px_-12px_color-mix(in_oklab,var(--primary)_85%,transparent)] disabled:opacity-70"
                    >
                      {placing ? "Confirming…" : `Pay ${formatPrice(total)}`}
                      {!placing && (
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      )}
                    </button>

                    <ul className="mt-5 space-y-2 text-xs text-muted-foreground">
                      <li className="inline-flex items-center gap-2">
                        <Lock className="size-3.5 text-primary" /> Encrypted, secure checkout
                      </li>
                      <li className="inline-flex items-center gap-2">
                        <Download className="size-3.5 text-primary" /> Files unlocked immediately
                      </li>
                    </ul>
                  </aside>
                </Reveal>
              </form>
            </>
          )}
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function OrderPlaced({ reference, email }: { reference: string; email: string }) {
  return (
    <Reveal>
      <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-white/[0.07] px-6 py-16 text-center sm:py-20">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-primary/50 text-primary">
          <CheckCircle2 className="size-6" />
        </span>
        <h1 className="mt-8 font-display text-4xl text-foreground sm:text-5xl">Vault unlocked.</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
          Order <span className="font-mono text-foreground/90">{reference}</span> is confirmed. Your
          download links are on the way.
        </p>
        <p className="mt-5 inline-flex items-center gap-2 text-[13px] text-foreground/80">
          <Mail className="size-4 text-primary" /> {email}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/account"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-7 font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            View my access <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/products"
            className="inline-flex h-12 items-center rounded-2xl border border-border px-7 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            Keep exploring
          </Link>
        </div>
      </div>
    </Reveal>
  );
}

function EmptyCheckout() {
  return (
    <Reveal>
      <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-white/[0.07] px-6 py-16 text-center">
        <h1 className="font-display text-3xl text-foreground sm:text-4xl">Nothing to check out.</h1>
        <p className="mx-auto mt-4 max-w-md text-[15px] text-muted-foreground">
          Add a product to your Vault and come back to complete your order.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-7 font-medium text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
        >
          Explore the Vault <ArrowRight className="size-4" />
        </Link>
      </div>
    </Reveal>
  );
}
