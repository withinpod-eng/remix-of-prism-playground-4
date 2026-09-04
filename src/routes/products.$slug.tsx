import { useRef } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useOwnedProducts } from "@/hooks/useOwnedProducts";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { AnnouncementBar } from "@/components/product/AnnouncementBar";
import { ProductGallery } from "@/components/product/ProductGallery";
import { PurchasePanel, type PurchaseState } from "@/components/product/PurchasePanel";
import { StickyPurchaseBar } from "@/components/product/StickyPurchaseBar";
import {
  HowItWorks,
  ProductFaq,
  WhatsIncluded,
  WhoItsFor,
} from "@/components/product/ProductSections";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";
import { getProductDetails } from "@/data/productDetails";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product, related: getRelatedProducts(product), details: getProductDetails(product) };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Product unavailable — Jays Vault" }, { name: "robots", content: "noindex" }],
      };
    }
    const { product } = loaderData;
    const title = `${product.title} — Jays Vault`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  notFoundComponent: ProductMissing,
  component: ProductDetail,
});

function ProductMissing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />
      <main className="mx-auto flex max-w-3xl flex-col items-center px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-foreground">This product isn't in the Vault</h1>
        <p className="mt-4 text-muted-foreground">
          The item you're looking for may have been renamed or retired.
        </p>
        <Link
          to="/products"
          className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-7 font-medium text-primary-foreground"
        >
          Browse the Vault
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProductDetail() {
  const { product, related, details } = Route.useLoaderData();
  const { isOwned } = useOwnedProducts();
  const panelRef = useRef<HTMLDivElement>(null);

  const state: PurchaseState = isOwned(product.slug) ? "owned" : "available";

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <SiteNav />
      <AnnouncementBar />

      <main>
        {/* Product hero */}
        <section className="relative overflow-hidden px-5 pb-20 pt-12 sm:px-6 lg:pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-0 h-[560px] w-[560px] rounded-full bg-primary/20 blur-[150px]"
          />

          <div className="relative mx-auto max-w-6xl">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" /> Back to shop
            </Link>

            <div
              ref={panelRef}
              className="mt-10 grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start lg:gap-16"
            >
              <Reveal>
                <ProductGallery shots={details.gallery} title={product.title} />
              </Reveal>

              <Reveal delay={120}>
                <PurchasePanel product={product} details={details} state={state} />
              </Reveal>
            </div>
          </div>
        </section>

        <WhatsIncluded details={details} />
        <HowItWorks />
        <WhoItsFor audience={details.audience} />
        <ProductFaq faq={details.faq} />

        {/* Related products — same ProductCard language as home + shop */}
        <section
          className="px-5 py-24 sm:px-6 lg:py-32"
          style={{ backgroundColor: "oklch(0.155 0.016 55)" }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">
                Complete your toolkit
              </h2>
              <Link
                to="/products"
                className="shrink-0 text-sm text-muted-foreground hover:text-primary"
              >
                View all {products.length}
              </Link>
            </div>
            <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 pb-28 sm:px-6">
          <div className="glass-panel mx-auto flex max-w-4xl flex-col items-center rounded-[2rem] px-6 py-16 text-center">
            <h2 className="max-w-xl font-display text-3xl leading-tight text-foreground sm:text-4xl">
              Everything you need, one payment, instant access.
            </h2>
            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
              style={{ boxShadow: "var(--shadow-glow)" }}
            >
              Explore the Vault <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
      <StickyPurchaseBar product={product} state={state} watch={panelRef} />
    </div>
  );
}
