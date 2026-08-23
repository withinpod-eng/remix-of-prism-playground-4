import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { categories, products } from "@/data/products";
import shopHero from "@/assets/shop-hero-ecosystem.jpg";


export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Shop Digital Products — Jays Vault" },
      {
        name: "description",
        content:
          "Explore the Vault: premium AI prompts, ebooks, Canva and Notion templates, courses, design assets and UI kits with instant download.",
      },
      { property: "og:title", content: "Shop Digital Products — Jays Vault" },
      {
        property: "og:description",
        content:
          "Browse premium prompts, templates, ebooks, courses and design assets built to help you create faster.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShopPage,
});

const priceRanges: { label: string; test: (n: number) => boolean }[] = [
  { label: "Under $30", test: (n) => n < 30 },
  { label: "$30 - $60", test: (n) => n >= 30 && n <= 60 },
  { label: "$60+", test: (n) => n > 60 },
];

const allTags = Array.from(new Set(products.flatMap((p) => p.tags))).sort();

const priceValue = (v: string) => Number(v.replace(/[^0-9.]/g, ""));

const sortOptions = ["Featured", "Newest", "Price: Low to High", "Price: High to Low"];

const PER_PAGE = 9;

function ShopPage() {
  const [active, setActive] = useState<string>("All Products");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState(sortOptions[0]!);
  const [page, setPage] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);

  const toggleTag = (t: string) => {
    setPage(1);
    setTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const clearAll = () => {
    setActive("All Products");
    setQuery("");
    setPrice(null);
    setTags([]);
    setPage(1);
  };
  const recRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const range = priceRanges.find((r) => r.label === price);
    let list = products.filter(
      (p) =>
        (active === "All Products" || p.category === active) &&
        (!range || range.test(priceValue(p.price))) &&
        (tags.length === 0 || tags.every((t) => p.tags.includes(t))) &&
        (q === "" ||
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)),
    );
    const num = priceValue;
    if (sort === "Price: Low to High") list = [...list].sort((a, b) => num(a.price) - num(b.price));
    if (sort === "Price: High to Low") list = [...list].sort((a, b) => num(b.price) - num(a.price));
    if (sort === "Newest") list = [...list].reverse();
    return list;
  }, [active, query, sort, price, tags]);

  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const scrollRecs = (dir: 1 | -1) =>
    recRef.current?.scrollBy({ left: dir * 324, behavior: "smooth" });

  const sidebar = (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/50">Explore</p>
        <ul className="mt-4 space-y-1">
          {categories.map((c) => {
            const isActive = c === active;
            return (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => {
                    setActive(c);
                    setPage(1);
                    setFiltersOpen(false);
                  }}
                  aria-current={isActive ? "true" : undefined}
                  className={
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm transition-colors " +
                    (isActive
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:text-foreground")
                  }
                >
                  <span
                    className={
                      "size-1.5 rounded-full transition-colors " +
                      (isActive ? "bg-primary" : "bg-transparent")
                    }
                  />
                  {c}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/50">Price</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {priceRanges.map((r) => {
            const on = price === r.label;
            return (
              <button
                key={r.label}
                type="button"
                aria-pressed={on}
                onClick={() => {
                  setPrice(on ? null : r.label);
                  setPage(1);
                }}
                className={
                  "rounded-full border px-3 py-1.5 text-[11px] transition-colors " +
                  (on
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary")
                }
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[11px] uppercase tracking-[0.28em] text-foreground/50">Tags</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {allTags.map((t) => {
            const on = tags.includes(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={on}
                onClick={() => toggleTag(t)}
                className={
                  "rounded-full border px-3 py-1.5 text-[11px] transition-colors " +
                  (on
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border text-muted-foreground hover:border-primary hover:text-primary")
                }
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 pb-16 pt-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-16 lg:px-10 lg:pb-24 lg:pt-20">
          <div>
            <Reveal>
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-foreground/70">
                <span className="h-px w-8 bg-primary" />
                The Vault
              </p>
              <h1 className="mt-6 max-w-3xl font-display text-5xl font-light leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
                Explore the <span className="font-medium text-primary">Vault</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                Discover premium prompts, templates, ebooks, courses, design assets and digital tools
                built to help you create and move faster.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="mt-10 flex max-w-xl items-center gap-3 rounded-full border border-border bg-secondary/60 px-5 py-3 backdrop-blur transition-colors focus-within:border-primary focus-within:shadow-[0_0_0_4px_oklch(0.68_0.19_48/12%)]">
                <Search className="size-4 text-muted-foreground" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Search products"
                  placeholder="Search prompts, templates, ebooks..."
                  className="h-6 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                />
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,oklch(0.68_0.19_48/26%),transparent_70%)] blur-2xl" />
              <img
                src={shopHero}
                alt="Floating collection of Jays Vault digital products: ebook, AI prompt interface, dashboards and UI kits"
                width={1280}
                height={1024}
                className="w-full [mask-image:radial-gradient(ellipse_at_center,black_58%,transparent_88%)]"
              />
            </div>
          </Reveal>
        </div>
      </section>


      {/* SHOP */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-28">{sidebar}</div>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <p className="text-sm text-muted-foreground">
                <span className="text-foreground">{filtered.length}</span> digital products
              </p>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-expanded={filtersOpen}
                  className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-xs text-foreground/80 transition-colors hover:border-primary hover:text-primary lg:hidden"
                >
                  <SlidersHorizontal className="size-3.5" />
                  Filter &amp; Sort
                </button>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="hidden sm:inline">Sort:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    aria-label="Sort products"
                    className="rounded-full border border-border bg-secondary/60 px-3 py-2 text-xs text-foreground outline-none transition-colors hover:border-primary"
                  >
                    {sortOptions.map((o) => (
                      <option key={o} value={o} className="bg-background">
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {filtersOpen && (
              <div className="mt-6 rounded-3xl border border-border bg-secondary/40 p-6 lg:hidden">
                {sidebar}
              </div>
            )}

            {(active !== "All Products" || price || tags.length > 0 || query) && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {[
                  ...(active !== "All Products" ? [{ k: "cat", label: active, clear: () => setActive("All Products") }] : []),
                  ...(price ? [{ k: "price", label: price, clear: () => setPrice(null) }] : []),
                  ...tags.map((t) => ({ k: "tag-" + t, label: t, clear: () => toggleTag(t) })),
                  ...(query ? [{ k: "q", label: `"${query}"`, clear: () => setQuery("") }] : []),
                ].map((chip) => (
                  <button
                    key={chip.k}
                    type="button"
                    onClick={() => {
                      chip.clear();
                      setPage(1);
                    }}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-[11px] text-foreground transition-colors hover:border-primary"
                  >
                    {chip.label}
                    <X className="size-3" />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={clearAll}
                  className="ml-1 text-[11px] text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}

            <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((p, i) => (
                <Reveal key={p.title} delay={i * 40}>
                  <ProductCard product={p} className="!w-full" />
                </Reveal>
              ))}
            </div>

            {visible.length === 0 && (
              <p className="mt-16 text-sm text-muted-foreground">
                No products match that search yet. Try another keyword or category.
              </p>
            )}

            {pages > 1 && (
              <nav
                aria-label="Pagination"
                className="mt-16 flex items-center justify-center gap-2 text-sm"
              >
                <button
                  type="button"
                  onClick={() => setPage(Math.max(1, current - 1))}
                  disabled={current === 1}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="size-4" />
                </button>
                {Array.from({ length: pages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPage(i + 1)}
                    aria-current={current === i + 1 ? "page" : undefined}
                    className={
                      "size-10 rounded-full border text-xs transition-colors " +
                      (current === i + 1
                        ? "border-primary/60 bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground")
                    }
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setPage(Math.min(pages, current + 1))}
                  disabled={current === pages}
                  className="flex size-10 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="size-4" />
                </button>
              </nav>
            )}
          </div>
        </div>
      </section>

      {/* RECOMMENDATIONS */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-display text-3xl font-light text-foreground sm:text-4xl">
            You might also <span className="font-medium">like</span>
          </h2>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              aria-label="Scroll recommendations left"
              onClick={() => scrollRecs(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Scroll recommendations right"
              onClick={() => scrollRecs(1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>

        <div
          ref={recRef}
          className="mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {products.slice(6).map((p) => (
            <ProductCard key={p.title} product={p} className="snap-start" />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-24 lg:px-10">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-secondary/60 px-8 py-14 text-center sm:px-14">
            <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(circle_at_center,oklch(0.68_0.19_48/28%),transparent_70%)]" />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-light leading-tight text-foreground sm:text-5xl">
                Find your next <span className="font-medium text-primary">useful resource</span>
              </h2>
              <p className="mx-auto mt-5 max-w-lg text-sm text-muted-foreground sm:text-base">
                Explore the vault and discover tools, templates and resources built to help you move
                faster.
              </p>
              <Link
                to="/products"
                className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform hover:-translate-y-0.5"
              >
                Explore the Vault
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </main>
  );
}
