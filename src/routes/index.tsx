import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Globe, Instagram, Twitter, Shield, Zap } from "lucide-react";
import heroVault from "@/assets/hero-vault.jpg";
import { SiteNav } from "@/components/SiteNav";
import { CategorySlider } from "@/components/CategorySlider";
import { ProductSlider } from "@/components/ProductSlider";
import { FaqSection } from "@/components/FaqSection";
import { SiteFooter } from "@/components/SiteFooter";



export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jays Vault — Premium Digital Products Marketplace" },
      {
        name: "description",
        content:
          "Jays Vault is a curated marketplace for premium digital products. Instant downloads, secure checkout and trusted creators.",
      },
      { property: "og:title", content: "Jays Vault — Premium Digital Products Marketplace" },
      {
        property: "og:description",
        content:
          "Curated premium digital products with instant access, secure checkout and trusted creators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "Drops", to: "/" },
  { label: "Creators", to: "/" },
  { label: "Contact", to: "/" },
];

const stats = [
  { value: "86K+", label: "Products Sold" },
  { value: "98%", label: "Customer Rating" },
  { value: "223m", label: "Instant Downloads" },
];

const partners = ["visa", "stripe", "paypal", "apple pay", "klarna", "amex"];

function IconPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex size-9 items-center justify-center rounded-full border border-border bg-secondary/60 text-muted-foreground">
      {children}
    </span>
  );
}

function Index() {
  return (
    <main className="min-h-screen bg-background">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="hero-glow pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute left-0 top-0 grid grid-cols-3 opacity-[0.06]">
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className="size-24 border border-foreground/40" />
          ))}
        </div>

        <SiteNav />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-10">

          {/* HERO BODY */}
          <div className="relative grid gap-10 pb-24 pt-10 lg:grid-cols-12 lg:pb-32">
            <div className="relative z-20 lg:col-span-5">
              <p className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-foreground/70">
                <span className="h-px w-8 bg-primary" />
                Digital Marketplace
              </p>
              <h1 className="mt-7 font-display text-6xl font-light leading-[0.92] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
                Digital
                <br />
                assets that
                <br />
                <span className="font-medium">pay off</span>
              </h1>
              <p className="mt-7 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Jays Vault is a curated marketplace for templates, presets and toolkits crafted by
                elite creators. Buy once, download instantly, own it forever.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/products"
                  className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-shadow hover:shadow-[var(--shadow-glow)]"
                >
                  Browse Vault
                </Link>
                <button className="flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-foreground transition-colors hover:border-primary">
                  How it works
                  <ArrowRight className="size-4" />
                </button>
              </div>

              <div className="mt-20">
                <p className="text-xs text-muted-foreground">Trusted by creators from</p>
                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4 text-sm text-foreground/50">
                  {partners.slice(0, 4).map((p) => (
                    <span key={p} className="lowercase tracking-wide">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* HERO IMAGE */}
            <div className="relative z-10 -mt-10 lg:col-span-4 lg:-ml-16">
              <img
                src={heroVault}
                alt="Premium digital vault surrounded by glowing product files"
                width={1200}
                height={1408}
                className="mx-auto w-full max-w-lg"
                style={{
                  WebkitMaskImage:
                    "radial-gradient(ellipse 60% 58% at 50% 48%, #000 50%, transparent 88%)",
                  maskImage:
                    "radial-gradient(ellipse 60% 58% at 50% 48%, #000 50%, transparent 88%)",
                }}

              />
            </div>

            {/* RIGHT WIDGETS */}
            <div className="relative z-20 space-y-5 self-center lg:col-span-3">
              <div className="glass-panel rounded-3xl p-5">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <p className="font-mono text-3xl text-foreground">400+</p>
                    <p className="mt-1 text-xs text-muted-foreground">Curated products</p>
                    <div className="mt-4 space-y-2">
                      {["Templates", "Presets", "Toolkits"].map((t) => (
                        <p key={t} className="text-[11px] text-foreground/60">
                          {t}
                        </p>
                      ))}
                    </div>
                    <button className="mt-4 w-full rounded-full bg-foreground px-3 py-2 text-[11px] font-medium text-background">
                      New Drops
                    </button>
                  </div>
                  <div className="flex-1 rounded-2xl border border-border bg-secondary/50 p-3">
                    <p className="text-[10px] text-muted-foreground">Best Sellers</p>
                    <div className="mt-3 h-16 rounded-xl bg-[var(--gradient-ember)] opacity-80" />
                    <p className="mt-3 font-mono text-2xl text-foreground">230+</p>
                    <p className="text-[10px] leading-snug text-muted-foreground">
                      Products sold every week
                    </p>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-5">
                <h2 className="font-display text-lg text-foreground">Instant Access</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Drop your email and get the vault key sent instantly.
                </p>
                <div className="mt-4 flex gap-2">
                  <IconPill>
                    <Zap className="size-4 text-primary" />
                  </IconPill>
                  <IconPill>
                    <Shield className="size-4" />
                  </IconPill>
                  <IconPill>
                    <Globe className="size-4" />
                  </IconPill>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-full border border-border bg-background/40 py-1.5 pl-4 pr-1.5">
                  <input
                    type="email"
                    placeholder="Your email"
                    aria-label="Your email"
                    className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    aria-label="Submit email"
                    className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <CategorySlider />

      {/* PROOF */}

      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="rounded-[2rem] border border-border bg-card p-8 sm:p-14">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Globe className="size-5 text-foreground/70" />
                <p className="max-w-[10rem] text-xs leading-snug text-muted-foreground">
                  Serving buyers in over 90 countries
                </p>
              </div>
              <div className="mt-5 flex gap-2">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Twitter className="size-4" />
                </span>
                <IconPill>
                  <Instagram className="size-4" />
                </IconPill>
                <IconPill>
                  <Github className="size-4" />
                </IconPill>
              </div>
            </div>
            <h2 className="max-w-2xl text-right font-display text-2xl font-light leading-snug text-muted-foreground sm:text-3xl">
              <span className="text-foreground">We're a creator-first marketplace</span> obsessed
              with digital products that actually move the needle for your work
            </h2>
          </div>

          <div className="mt-20 grid gap-10 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-mono text-6xl leading-none tracking-tight text-foreground">
                  {s.value}
                </p>
                <p className="mt-5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="size-1.5 rounded-full bg-primary" />
                  {s.label}
                </p>
                <div className="mt-3 h-px w-full bg-[var(--gradient-ember)] opacity-40" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <ProductSlider />

      {/* TRUST */}

      <section className="mx-auto max-w-7xl px-6 pb-32 lg:px-10">
        <div className="grid items-center gap-16 border-t border-border pt-24 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-6xl font-light leading-[0.95] text-foreground sm:text-7xl">
              Over <span className="font-medium text-primary">12k</span>
              <br />
              creators
            </h2>
            <p className="mt-6 text-sm text-muted-foreground">selling inside the vault</p>
          </div>
          <div className="flex flex-wrap justify-center gap-5 lg:justify-end">
            {partners.map((p, i) => (
              <span
                key={p}
                className="flex size-28 items-center justify-center rounded-full border border-border bg-card text-sm lowercase text-foreground/70"
                style={{ marginTop: i % 2 ? "2rem" : 0 }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FaqSection />

      {/* FOOTER */}
      <SiteFooter />
    </main>
  );
}
