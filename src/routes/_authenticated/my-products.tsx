import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { PurchaseItem } from "@/components/PurchaseItem";
import { fetchPurchases } from "@/lib/purchases";
import emptyVault from "@/assets/empty-vault.jpg";

const TITLE = "My Purchases | Jays Vault";
const DESCRIPTION =
  "Access and download every digital product you've purchased from Jays Vault.";

export const Route = createFileRoute("/_authenticated/my-products")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MyProductsPage,
});

function MyProductsPage() {
  const { user } = useSession();

  const { data: purchases, isLoading } = useQuery({
    queryKey: ["purchases", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchPurchases(user!.id),
  });

  return (
    <div className="relative min-h-screen bg-background">
      {/* Studio lighting behind the vault interior — ambient, never a visible gradient band. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-64 size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_15%,transparent),transparent_70%)] blur-3xl" />
        <div className="absolute left-1/2 top-10 size-[34rem] -translate-x-1/2 rounded-full border border-primary/[0.07]" />
        <div className="absolute left-1/2 top-28 size-[50rem] -translate-x-1/2 rounded-full border border-primary/[0.04]" />
      </div>

      <div className="relative">
        <SiteNav />

        <main className="mx-auto max-w-5xl px-6 pb-28 pt-12 lg:px-8 lg:pt-16">
          <Reveal>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-primary/80">
                  Your Vault
                </p>
                <h1 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                  My Purchases
                </h1>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                  Everything you've purchased from Jays Vault, ready when you need it.
                </p>
              </div>

              <Link
                to="/account"
                className="inline-flex items-center gap-2 pt-1 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="size-4" />
                Account
              </Link>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-12 overflow-hidden rounded-[28px] border border-border bg-card/70 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] backdrop-blur-sm">
              <span
                aria-hidden
                className="pointer-events-none absolute-none block h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
              />
              {isLoading ? (
                <p className="px-7 py-16 text-center text-sm text-muted-foreground">
                  Opening your vault…
                </p>
              ) : purchases && purchases.length > 0 ? (
                <>
                  <div className="hidden grid-cols-[1fr_auto] gap-6 border-b border-border/70 px-7 py-4 text-[11px] uppercase tracking-[0.24em] text-muted-foreground sm:grid">
                    <span>Product</span>
                    <span>Purchased / Action</span>
                  </div>
                  <ul className="divide-y divide-border/60">
                    {purchases.map((purchase) => (
                      <PurchaseItem key={purchase.id} purchase={purchase} />
                    ))}
                  </ul>
                </>
              ) : (
                <EmptyVault />
              )}
            </div>
          </Reveal>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

function EmptyVault() {
  return (
    <div className="px-7 py-16 text-center">
      <div className="mx-auto size-40 overflow-hidden rounded-2xl border border-border/70">
        <img
          src={emptyVault}
          alt="An empty vault lit by warm copper light"
          className="size-full object-cover opacity-80"
        />
      </div>
      <h2 className="mt-8 font-display text-2xl tracking-tight text-foreground">
        Your vault is waiting.
      </h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
        You haven't purchased any digital products yet.
      </p>
      <Link
        to="/products"
        className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_color-mix(in_oklab,var(--primary)_90%,transparent)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
      >
        Explore the Vault
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
      </Link>
    </div>
  );
}
