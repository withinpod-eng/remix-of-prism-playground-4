import { useNavigate } from "@tanstack/react-router";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Download, ShieldCheck, ShoppingBag, Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { getProductBySlug, getRelatedProducts, products } from "@/data/products";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProductBySlug(params.slug);
    if (!product) throw notFound();
    return { product, related: getRelatedProducts(product) };
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

const includes = [
  "Instant download after checkout",
  "Commercial licence for one brand",
  "Free lifetime updates",
  "Organised source files",
];

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
  const { product, related } = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        <section className="relative overflow-hidden px-6 pb-20 pt-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[140px]"
          />

          <div className="relative mx-auto max-w-6xl">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-4" /> Back to shop
            </Link>

            <div className="mt-10 grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
              <Reveal>
                <div className="glass-panel overflow-hidden rounded-[2rem]">
                  <img
                    src={product.image}
                    alt={`${product.title} preview`}
                    width={1200}
                    height={900}
                    className="h-[420px] w-full object-cover"
                  />
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                    {product.category}
                  </span>
                  <h1 className="mt-4 font-display text-4xl leading-tight text-foreground sm:text-5xl">
                    {product.title}
                  </h1>
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    {product.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border bg-background/40 px-3 py-1.5 text-[11px] text-foreground/80 backdrop-blur"
                      >
                        {t}
                      </span>
                    ))}
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Star className="size-3.5 fill-primary text-primary" /> 4.9 average rating
                    </span>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <span className="font-display text-4xl text-foreground">{product.price}</span>
                    <span className="text-sm text-muted-foreground">one-time payment</span>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <button className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 font-medium text-primary-foreground transition-opacity hover:opacity-90">
                      <Download className="size-4" /> Buy Now
                    </button>
                    <Link
                      to="/contact"
                      className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-border px-7 font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                    >
                      Ask a question
                    </Link>
                  </div>

                  <p className="mt-4 inline-flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="size-4 text-primary" /> Secure checkout · 14-day support
                    guarantee
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        <section className="px-6 pb-24">
          <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2">
            <Reveal>
              <div className="glass-panel h-full rounded-[1.75rem] p-8">
                <h2 className="font-display text-2xl text-foreground">What's inside</h2>
                <ul className="mt-6 space-y-3">
                  {includes.map((i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="glass-panel h-full rounded-[1.75rem] p-8">
                <h2 className="font-display text-2xl text-foreground">Details</h2>
                <dl className="mt-6 space-y-4 text-sm">
                  {[
                    ["Category", product.category],
                    ["Delivery", "Instant digital download"],
                    ["Licence", "Commercial, single brand"],
                    ["Updates", "Included for life"],
                  ].map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between border-b border-border/60 pb-3">
                      <dt className="text-muted-foreground">{k}</dt>
                      <dd className="text-foreground">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-6 pb-28">
          <div className="mx-auto max-w-6xl">
            <div className="flex items-end justify-between gap-6">
              <h2 className="font-display text-3xl text-foreground">You might also like</h2>
              <Link to="/products" className="text-sm text-muted-foreground hover:text-primary">
                View all {products.length} products
              </Link>
            </div>
            <div className="mt-8 flex gap-6 overflow-x-auto pb-4">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
