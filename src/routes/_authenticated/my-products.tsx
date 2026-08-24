import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { PurchaseItem } from "@/components/PurchaseItem";
import { fetchPurchases } from "@/lib/purchases";

const TITLE = "My Products | Jays Vault";
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
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-56 size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_68%)] blur-3xl" />
      </div>

      <div className="relative">
        <SiteNav />

        <main className="mx-auto max-w-4xl px-6 pb-28 pt-12 lg:px-8 lg:pt-16">
          <Reveal>
            <Link
              to="/account"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Account
            </Link>

            <h1 className="mt-6 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              My Products
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Everything you own, ready whenever you need it. Access never expires.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="mt-10 overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur">
              {isLoading ? (
                <p className="px-7 py-14 text-center text-sm text-muted-foreground">
                  Loading your products…
                </p>
              ) : purchases && purchases.length > 0 ? (
                <ul className="divide-y divide-border/70">
                  {purchases.map((purchase) => (
                    <PurchaseItem key={purchase.id} purchase={purchase} />
                  ))}
                </ul>
              ) : (
                <div className="px-7 py-16 text-center">
                  <p className="font-display text-2xl tracking-tight text-foreground">
                    Your vault is empty
                  </p>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Once you purchase a product it will appear here instantly.
                  </p>
                  <Link
                    to="/products"
                    className="mt-8 inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
                  >
                    Browse products
                  </Link>
                </div>
              )}
            </div>
          </Reveal>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}
