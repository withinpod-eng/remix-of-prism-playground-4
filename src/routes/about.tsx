import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Braces,
  Compass,
  CreditCard,
  Download,
  FileSpreadsheet,
  Globe,
  Layers,
  LayoutTemplate,
  Megaphone,
  MousePointerClick,
  Notebook,
  PlayCircle,
  Search,
  Shield,
  Sparkles,
  Wand2,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";

const TITLE = "About Jays Vault | Premium Digital Resources";
const DESCRIPTION =
  "Learn what Jays Vault stands for, why it exists, and how we're building a better place to discover useful digital products and resources.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/about" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

/* ---------------- shared atoms ---------------- */

const grain =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")";

function Grain() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
      style={{ backgroundImage: grain }}
    />
  );
}

function Glow({
  className = "",
  strength = 55,
}: {
  className?: string;
  strength?: number;
}) {
  return (
    <div
      aria-hidden
      className={"pointer-events-none absolute blur-[120px] " + className}
      style={{
        background: `radial-gradient(ellipse 55% 55% at 50% 50%, oklch(0.6 0.17 45 / ${strength}%) 0%, oklch(0.34 0.1 40 / ${Math.round(strength * 0.5)}%) 45%, transparent 76%)`,
      }}
    />
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-primary/85">
      <span className="h-px w-6 bg-primary/50" />
      {children}
    </p>
  );
}

function PrimaryCta({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:shadow-[0_0_45px_-8px_var(--primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      style={{ backgroundImage: "var(--gradient-ember)" }}
    >
      {children}
      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function GhostCta({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-full border border-border px-7 py-3.5 text-sm text-foreground/70 transition-colors hover:border-primary/60 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
    >
      {children}
    </Link>
  );
}

/* ---------------- hero visual (abstract, no people) ---------------- */

function VaultTile({
  Icon,
  label,
  className = "",
}: {
  Icon: typeof BookOpen;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={
        "glass-panel absolute flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-[11px] tracking-wide text-foreground/75 backdrop-blur-md " +
        className
      }
    >
      <Icon className="size-3.5 text-primary" />
      {label}
    </div>
  );
}

function HeroVisual() {
  return (
    <div aria-hidden className="relative mx-auto aspect-square w-full max-w-[520px]">
      <Glow className="inset-0" strength={60} />
      {/* rings */}
      {[0.55, 0.78, 1].map((s, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/12"
          style={{ width: `${s * 100}%`, height: `${s * 100}%` }}
        />
      ))}
      {/* central vault */}
      <div className="absolute left-1/2 top-1/2 flex size-[36%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[28px] border border-primary/25 bg-[oklch(0.15_0.02_50)] shadow-[var(--shadow-glow)]">
        <div
          className="absolute inset-0 rounded-[28px] opacity-70"
          style={{
            background:
              "linear-gradient(150deg, oklch(0.68 0.19 48 / 22%), transparent 55%, oklch(0.78 0.16 62 / 10%))",
          }}
        />
        <Shield className="relative size-7 text-primary" />
        <span className="relative mt-2 font-display text-[10px] uppercase tracking-[0.3em] text-foreground/70">
          Vault
        </span>
      </div>
      {/* orbiting product objects */}
      <VaultTile Icon={Wand2} label="AI Prompts" className="left-[4%] top-[14%]" />
      <VaultTile Icon={BookOpen} label="Ebooks" className="right-[2%] top-[24%]" />
      <VaultTile Icon={Notebook} label="Notion" className="left-[0%] bottom-[30%]" />
      <VaultTile Icon={PlayCircle} label="Courses" className="right-[4%] bottom-[20%]" />
      <VaultTile Icon={LayoutTemplate} label="Templates" className="left-1/2 bottom-[6%] -translate-x-1/2" />
      <VaultTile Icon={FileSpreadsheet} label="Spreadsheets" className="left-[12%] top-[48%]" />
    </div>
  );
}

/* ---------------- content data ---------------- */

const principles = [
  {
    n: "01",
    title: "Curated over crowded",
    body: "More products do not automatically mean more value. Discovery should feel intentional, not like scrolling an endless warehouse.",
    Icon: Compass,
  },
  {
    n: "02",
    title: "Useful over flashy",
    body: "A digital product should solve a real problem. If it only looks good in a preview, it doesn't belong in the vault.",
    Icon: Sparkles,
  },
  {
    n: "03",
    title: "Simple over complicated",
    body: "Buying and accessing digital resources should take minutes, not troubleshooting. Clarity beats clever.",
    Icon: MousePointerClick,
  },
  {
    n: "04",
    title: "Quality over noise",
    body: "We'd rather list fewer resources we'd actually recommend than pad the catalogue for the sake of numbers.",
    Icon: Layers,
  },
  {
    n: "05",
    title: "Progress over perfection",
    body: "Resources exist to move ideas forward. Something usable today usually beats something ideal later.",
    Icon: ArrowRight,
  },
];

const categories = [
  { label: "AI Prompts", Icon: Wand2 },
  { label: "Ebooks", Icon: BookOpen },
  { label: "Canva Templates", Icon: LayoutTemplate },
  { label: "Notion Templates", Icon: Notebook },
  { label: "Digital Courses", Icon: PlayCircle },
  { label: "Design Assets", Icon: Layers },
  { label: "Marketing Kits", Icon: Megaphone },
  { label: "Website Templates", Icon: Globe },
  { label: "UI Kits", Icon: LayoutTemplate },
  { label: "Spreadsheets", Icon: FileSpreadsheet },
  { label: "Software Resources", Icon: Braces },
];

const steps = [
  {
    n: "01",
    title: "Discover",
    body: "Explore categories and curated digital products built around real use cases.",
    Icon: Search,
  },
  {
    n: "02",
    title: "Choose",
    body: "Open a product page, review what's included, and understand its access and license terms.",
    Icon: MousePointerClick,
  },
  {
    n: "03",
    title: "Purchase",
    body: "Complete checkout securely through the available payment system.",
    Icon: CreditCard,
  },
  {
    n: "04",
    title: "Access",
    body: "Receive the applicable download or account-based access for that product.",
    Icon: Download,
  },
];

const reasons = [
  ["Curated selection", "Resources selected around practical use cases, not catalogue size."],
  ["Clear product information", "Know what's included and how access works before checkout."],
  ["Easy access", "Products delivered through the appropriate digital-access method."],
  ["One account", "Keep your purchases and product access organised in one place."],
  ["Useful categories", "Find resources by what you're actually trying to accomplish."],
  ["Ongoing growth", "The library can keep expanding with new products and resources."],
];

const stats = [
  ["[XXX]+", "Digital resources"],
  ["[XX]+", "Categories"],
  ["[XX]", "Creators & partners"],
  ["[XX]%", "Customer rating"],
];

const phases = [
  ["Today", "A curated set of digital products across the categories we know people need."],
  ["Next", "More creators, more categories, and better discovery inside the vault."],
  ["Later", "A larger ecosystem for digital learning, creation, and productivity."],
];

/* ---------------- page ---------------- */

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden pb-24 pt-16 lg:pb-40 lg:pt-24">
          <div aria-hidden className="hero-glow pointer-events-none absolute inset-0 opacity-60" />
          <Grain />
          <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 lg:px-10">
            <div>
              <Reveal>
                <Eyebrow>About Jays Vault</Eyebrow>
              </Reveal>
              <Reveal delay={80}>
                <h1 className="mt-7 font-display text-[13vw] font-semibold leading-[0.94] tracking-[-0.03em] sm:text-6xl lg:text-[84px]">
                  Everything useful,
                  <br />
                  <span className="text-ember">inside one vault.</span>
                </h1>
              </Reveal>
              <Reveal delay={160}>
                <p className="mt-8 max-w-xl text-base leading-relaxed text-foreground/65 lg:text-[17px]">
                  Jays Vault brings together premium digital products, practical resources, and
                  creative tools designed to help you create, learn, build, and grow faster.
                </p>
              </Reveal>
              <Reveal delay={240}>
                <div className="mt-10 flex flex-wrap gap-3">
                  <PrimaryCta to="/products">Explore the Vault</PrimaryCta>
                  <GhostCta to="/products">Browse Categories</GhostCta>
                </div>
              </Reveal>
              <Reveal delay={320}>
                <ul className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {["Curated digital resources", "Instant access", "Built for creators & builders"].map(
                    (t, i) => (
                      <li key={t} className="flex items-center gap-4">
                        {i > 0 && <span aria-hidden className="size-1 rounded-full bg-primary/60" />}
                        {t}
                      </li>
                    ),
                  )}
                </ul>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <HeroVisual />
            </Reveal>
          </div>
        </section>

        {/* BRAND STATEMENT */}
        <section className="relative overflow-hidden py-24 lg:py-36">
          <div className="relative mx-auto max-w-5xl px-6 text-center lg:px-10">
            <Reveal>
              <p className="font-display text-3xl font-light leading-[1.2] tracking-[-0.02em] text-foreground/90 sm:text-4xl lg:text-[52px]">
                We believe great digital resources should be easier to{" "}
                <span className="text-primary">discover</span>, easier to{" "}
                <span className="text-primary">access</span>, and actually{" "}
                <span className="text-primary">worth using</span>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* WHY WE EXIST */}
        <section
          className="relative overflow-hidden py-24 lg:py-32"
          style={{ backgroundColor: "oklch(0.155 0.016 55)" }}
        >
          <Glow className="-top-40 left-[70%] h-[420px] w-[700px] -translate-x-1/2" strength={26} />
          <Grain />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
              <Reveal>
                <Eyebrow>Why we exist</Eyebrow>
                <h2 className="mt-7 font-display text-3xl font-semibold leading-[1.08] tracking-[-0.02em] sm:text-4xl lg:text-[52px]">
                  The internet has no shortage of digital products. Finding the right ones is the hard
                  part.
                </h2>
              </Reveal>
              <Reveal delay={120} className="space-y-6 text-[15px] leading-relaxed text-foreground/65 lg:pt-4">
                <p>
                  Useful digital resources are scattered across dozens of stores, gumroad links,
                  newsletters, and forum threads. Quality varies dramatically, and it's rarely obvious
                  which files are worth paying for.
                </p>
                <p>
                  Buyers end up spending more time searching and comparing than actually using what
                  they bought. Delivery and access can be just as fragmented — a link here, a login
                  there, a file that expires somewhere else.
                </p>
                <p>
                  Jays Vault exists to make that part simpler: a single place where resources are
                  organised by what you're trying to do, described honestly, and delivered in a way
                  that makes sense.
                </p>
                <p className="text-foreground/45">
                  We're not claiming to have solved every problem in digital commerce. We're working on
                  the part that annoyed us most.
                </p>
              </Reveal>
            </div>

            {/* before / after visual */}
            <Reveal delay={160}>
              <div aria-hidden className="mt-20 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
                <div className="relative h-56 overflow-hidden rounded-3xl border border-border bg-background/50 p-4">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    Scattered
                  </span>
                  {[
                    "top-10 left-6 w-32 rotate-[-6deg]",
                    "top-16 left-28 w-36 rotate-[4deg]",
                    "top-28 left-10 w-40 rotate-[-2deg]",
                    "top-24 left-44 w-28 rotate-[8deg]",
                    "top-36 left-32 w-36 rotate-[-5deg]",
                  ].map((c, i) => (
                    <div
                      key={i}
                      className={"absolute h-10 rounded-lg border border-border bg-card/70 " + c}
                    >
                      <div className="mt-3 ml-3 h-1.5 w-1/2 rounded-full bg-foreground/15" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center">
                  <ArrowRight className="size-6 rotate-90 text-primary lg:rotate-0" />
                </div>
                <div className="relative h-56 overflow-hidden rounded-3xl border border-primary/20 bg-background/60 p-4 shadow-[var(--shadow-glow)]">
                  <Glow className="inset-x-0 -bottom-24 h-52" strength={40} />
                  <span className="relative text-[10px] uppercase tracking-[0.25em] text-primary/80">
                    Organised
                  </span>
                  <div className="relative mt-4 grid grid-cols-3 gap-2.5">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-11 rounded-lg border border-border bg-card/80"
                      >
                        <div className="mt-3 ml-2.5 h-1.5 w-2/3 rounded-full bg-primary/35" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="relative py-24 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow>What we believe</Eyebrow>
              <h2 className="mt-7 max-w-2xl font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                Five ideas that decide what goes in the vault.
              </h2>
            </Reveal>
            <ul className="mt-16 grid gap-x-14 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {principles.map((p, i) => (
                <Reveal as="li" key={p.n} delay={i * 70}>
                  <div className="group border-t border-border pt-7 transition-transform duration-500 hover:-translate-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs tracking-[0.2em] text-primary">{p.n}</span>
                      <p.Icon className="size-4 text-foreground/30 transition-colors group-hover:text-primary" />
                    </div>
                    <h3 className="mt-5 font-display text-xl tracking-[-0.01em]">{p.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/60">{p.body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* ECOSYSTEM */}
        <section
          className="relative overflow-hidden py-24 lg:py-36"
          style={{ backgroundColor: "oklch(0.155 0.016 55)" }}
        >
          <Glow className="left-1/2 top-1/3 h-[520px] w-[900px] -translate-x-1/2" strength={30} />
          <Grain />
          <div className="relative mx-auto max-w-7xl px-6 text-center lg:px-10">
            <Reveal className="flex flex-col items-center">
              <Eyebrow>The ecosystem</Eyebrow>
              <h2 className="mt-7 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                One vault. Many possibilities.
              </h2>
              <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-foreground/60">
                From ideas to execution, Jays Vault brings practical digital resources together in one
                place.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative mt-16 lg:mt-20">
                <div className="glass-panel mx-auto mb-10 inline-flex items-center gap-3 rounded-full px-6 py-3 shadow-[0_0_50px_-16px_var(--primary)]">
                  <Shield className="size-4 text-primary" />
                  <span className="font-display text-sm tracking-[0.16em] uppercase">Jays Vault</span>
                </div>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {categories.map((c, i) => (
                    <Reveal as="li" key={c.label} delay={i * 40}>
                      <div className="group flex h-full items-center gap-3 rounded-2xl border border-border bg-background/50 px-4 py-4 text-left transition-all hover:border-primary/45 hover:bg-background/80 hover:shadow-[0_0_35px_-14px_var(--primary)]">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-border bg-card/70">
                          <c.Icon className="size-4 text-primary" />
                        </span>
                        <span className="text-sm text-foreground/75 group-hover:text-foreground">
                          {c.label}
                        </span>
                      </div>
                    </Reveal>
                  ))}
                  <Reveal as="li" delay={categories.length * 40}>
                    <Link
                      to="/products"
                      className="flex h-full items-center justify-between gap-3 rounded-2xl border border-primary/25 bg-background/40 px-4 py-4 text-sm text-primary transition-colors hover:border-primary/60"
                    >
                      All categories
                      <ArrowRight className="size-4" />
                    </Link>
                  </Reveal>
                </ul>
              </div>
            </Reveal>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="relative py-24 lg:py-36">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-7 max-w-xl font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                From browsing to access, in four steps.
              </h2>
            </Reveal>
            <div className="relative mt-16">
              <div
                aria-hidden
                className="absolute left-0 right-0 top-9 hidden h-px lg:block"
                style={{
                  background:
                    "linear-gradient(to right, transparent, oklch(0.68 0.19 48 / 45%), transparent)",
                }}
              />
              <ol className="relative grid gap-10 lg:grid-cols-4 lg:gap-8">
                {steps.map((s, i) => (
                  <Reveal as="li" key={s.n} delay={i * 110}>
                    <span className="flex size-[72px] items-center justify-center rounded-2xl border border-border bg-card/70 shadow-[var(--shadow-card)]">
                      <s.Icon className="size-6 text-primary" />
                    </span>
                    <p className="mt-6 font-mono text-xs tracking-[0.22em] text-primary">
                      {s.n}
                    </p>
                    <h3 className="mt-2 font-display text-xl tracking-[-0.01em]">{s.title}</h3>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-foreground/60">
                      {s.body}
                    </p>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* WHY CHOOSE */}
        <section
          className="relative overflow-hidden py-24 lg:py-32"
          style={{ backgroundColor: "oklch(0.155 0.016 55)" }}
        >
          <Grain />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow>Why customers choose Jays Vault</Eyebrow>
            </Reveal>
            <ul className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
              {reasons.map(([title, body], i) => (
                <Reveal as="li" key={title} delay={i * 60}>
                  <div className="h-full bg-background/85 p-8 transition-colors hover:bg-background/60">
                    <h3 className="font-display text-lg tracking-[-0.01em]">{title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-foreground/60">{body}</p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        {/* STATS */}
        <section className="relative overflow-hidden py-24 lg:py-32">
          <Glow className="left-1/2 top-0 h-[360px] w-[820px] -translate-x-1/2" strength={24} />
          <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
            <ul className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map(([value, label], i) => (
                <Reveal as="li" key={label} delay={i * 90}>
                  <p className="font-display text-5xl font-semibold tracking-[-0.03em] text-foreground lg:text-6xl">
                    {value}
                  </p>
                  <div aria-hidden className="mt-4 h-px w-10 bg-primary/70" />
                  <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    {label}
                  </p>
                </Reveal>
              ))}
            </ul>
            <Reveal delay={200}>
              <p className="mt-12 text-xs text-muted-foreground/70">
                Values shown are placeholders and will be replaced with verified figures.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CREATOR ECOSYSTEM */}
        <section className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
              <Reveal>
                <Eyebrow>Creators</Eyebrow>
                <h2 className="mt-7 font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
                  Built with creators. Designed for everyone.
                </h2>
                <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-foreground/65">
                  The vault grows through the people who make genuinely useful things — designers,
                  writers, operators, and builders. Creator slots below are placeholders until
                  partnerships are confirmed.
                </p>
              </Reveal>
              <Reveal delay={120}>
                <ul aria-label="Creator placeholders" className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {["JV", "AK", "MR", "SD", "LN", "TP", "OB", "KE"].map((m, i) => (
                    <li
                      key={m}
                      className="flex aspect-square items-center justify-center rounded-2xl border border-border bg-card/50 font-display text-sm tracking-[0.1em] text-foreground/45 transition-colors hover:border-primary/40 hover:text-primary"
                      style={{ opacity: 1 - i * 0.05 }}
                    >
                      {m}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* PHILOSOPHY */}
        <section className="relative overflow-hidden py-28 lg:py-44">
          <Glow className="left-1/2 top-1/2 h-[440px] w-[900px] -translate-x-1/2 -translate-y-1/2" strength={34} />
          <Grain />
          <div className="relative mx-auto max-w-4xl px-6 text-center lg:px-10">
            <Reveal>
              <p className="font-display text-2xl font-light leading-tight tracking-[-0.02em] text-foreground/35 sm:text-3xl lg:text-4xl">
                The goal isn't to sell more digital files.
              </p>
            </Reveal>
            <Reveal delay={180}>
              <p className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-[68px]">
                It's to help people <span className="text-ember">make progress</span>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* MISSION + VISION */}
        <section
          className="relative overflow-hidden py-24 lg:py-32"
          style={{ backgroundColor: "oklch(0.155 0.016 55)" }}
        >
          <Grain />
          <div className="relative mx-auto grid max-w-7xl gap-px overflow-hidden rounded-3xl border border-border bg-border px-0 lg:mx-auto lg:grid-cols-2">
            <Reveal>
              <div className="h-full bg-background/85 p-10 lg:p-14">
                <Eyebrow>Our mission</Eyebrow>
                <h2 className="mt-7 font-display text-2xl leading-snug tracking-[-0.02em] lg:text-3xl">
                  Make high-quality digital resources easier to discover, understand, access, and use.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-foreground/60">
                  That means clearer product pages, tighter curation, and access that just works —
                  every improvement measured against whether it saves you time.
                </p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="h-full bg-background/85 p-10 lg:p-14">
                <Eyebrow>Our vision</Eyebrow>
                <h2 className="mt-7 font-display text-2xl leading-snug tracking-[-0.02em] lg:text-3xl">
                  Build a trusted digital marketplace where useful ideas become usable tools.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-foreground/60">
                  A place people return to because the resources inside it consistently earn their
                  price — not because of marketing pressure.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* DIRECTION */}
        <section className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <Reveal>
              <Eyebrow>Our direction</Eyebrow>
              <h2 className="mt-7 max-w-xl font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl lg:text-5xl">
                Where the vault is heading.
              </h2>
              <p className="mt-5 max-w-lg text-sm text-foreground/55">
                These are intentions rather than commitments — priorities can shift as we learn what
                people actually need.
              </p>
            </Reveal>
            <ol className="mt-16 grid gap-10 lg:grid-cols-3 lg:gap-8">
              {phases.map(([phase, body], i) => (
                <Reveal as="li" key={phase} delay={i * 110}>
                  <div className="relative border-t border-border pt-7">
                    <span
                      aria-hidden
                      className="absolute -top-[5px] left-0 size-2.5 rounded-full bg-primary"
                      style={{ opacity: 1 - i * 0.3 }}
                    />
                    <h3 className="font-display text-xl tracking-[-0.01em]">{phase}</h3>
                    <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/60">{body}</p>
                  </div>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative px-6 py-20 lg:px-10 lg:py-28">
          <Reveal>
            <div className="group relative mx-auto max-w-6xl overflow-hidden rounded-[36px] border border-primary/20 bg-[oklch(0.11_0.01_55)] px-8 py-20 text-center transition-shadow duration-700 hover:shadow-[0_0_120px_-40px_var(--primary)] lg:px-16 lg:py-28">
              <Glow
                className="left-1/2 top-[55%] h-[480px] w-[900px] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 group-hover:opacity-100"
                strength={50}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 lg:size-[760px]"
              />
              <Grain />
              <div className="relative">
                <h2 className="mx-auto max-w-3xl font-display text-3xl font-semibold leading-[1.08] tracking-[-0.03em] sm:text-4xl lg:text-[56px]">
                  Your next useful resource is probably closer than you think.
                </h2>
                <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-foreground/60">
                  Explore the vault and find something that helps you move your next idea forward.
                </p>
                <div className="mt-10 flex flex-wrap justify-center gap-3">
                  <PrimaryCta to="/products">Explore the Vault</PrimaryCta>
                  <GhostCta to="/products">Browse Categories</GhostCta>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
