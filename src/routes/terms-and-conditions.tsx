import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, ChevronDown, Mail, ScrollText, Scale } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const TITLE = "Terms & Conditions | Jays Vault";
const DESCRIPTION =
  "Read the Terms & Conditions governing use of Jays Vault, digital product purchases, product access, licenses, accounts, refunds, and related services.";

export const Route = createFileRoute("/terms-and-conditions")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/terms-and-conditions" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/terms-and-conditions" }],
  }),
  component: TermsPage,
});

const LAST_UPDATED = "[DD MONTH YYYY]";
const EFFECTIVE_FROM = "[DD MONTH YYYY]";
const SUPPORT_EMAIL = "support@[yourdomain].com";

type Section = { id: string; num: string; title: string };

const sections: Section[] = [
  { id: "introduction", num: "01", title: "Introduction" },
  { id: "eligibility", num: "02", title: "Eligibility & Accounts" },
  { id: "website-use", num: "03", title: "Website Use" },
  { id: "digital-products", num: "04", title: "Digital Products" },
  { id: "purchases", num: "05", title: "Purchases & Payments" },
  { id: "access", num: "06", title: "Product Access & Delivery" },
  { id: "licenses", num: "07", title: "Licenses & Intellectual Property" },
  { id: "prohibited", num: "08", title: "Prohibited Use" },
  { id: "user-content", num: "09", title: "User Content" },
  { id: "third-party", num: "10", title: "Third-Party Services" },
  { id: "refunds", num: "11", title: "Refunds & Cancellations" },
  { id: "termination", num: "12", title: "Suspension & Termination" },
  { id: "disclaimers", num: "13", title: "Disclaimers" },
  { id: "liability", num: "14", title: "Limitation of Liability" },
  { id: "indemnification", num: "15", title: "Indemnification" },
  { id: "changes", num: "16", title: "Changes to These Terms" },
  { id: "governing-law", num: "17", title: "Governing Law & Disputes" },
  { id: "contact", num: "18", title: "Contact Us" },
];

const sec = (i: number): Section => sections[i]!;

/* ---------- primitives ---------- */

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "-40px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={
        "motion-reduce:translate-y-0 motion-reduce:opacity-100 transition-[opacity,transform] duration-700 ease-out " +
        (shown ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0") +
        " " +
        className
      }
    >
      {children}
    </div>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-5 max-w-[68ch] text-[15px] leading-[1.8] text-foreground/70 sm:text-base">
      {children}
    </p>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-9 font-display text-lg font-medium tracking-tight text-foreground">
      {children}
    </h3>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 max-w-[68ch] space-y-2.5">
      {items.map((i) => (
        <li key={i} className="flex gap-3 text-[15px] leading-[1.75] text-foreground/70">
          <span aria-hidden className="mt-[9px] size-1.5 shrink-0 rounded-full bg-primary/80" />
          <span>{i}</span>
        </li>
      ))}
    </ul>
  );
}

function Callout({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Scale;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 max-w-[68ch] rounded-2xl border border-primary/25 bg-[oklch(0.19_0.04_45_/_70%)] p-6 shadow-[inset_0_1px_0_0_oklch(1_0_0_/_5%)]">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <Icon className="size-4 text-primary" aria-hidden />
        </span>
        <h4 className="font-display text-sm font-medium uppercase tracking-[0.16em] text-foreground">
          {title}
        </h4>
      </div>
      <p className="mt-4 text-[15px] leading-[1.75] text-foreground/70">{children}</p>
    </div>
  );
}

function SectionBlock({ section, children }: { section: Section; children: React.ReactNode }) {
  return (
    <Reveal>
      <section
        id={section.id}
        aria-labelledby={`${section.id}-heading`}
        className="scroll-mt-28 pt-16 first:pt-0 lg:pt-24"
      >
        <p className="font-mono text-xs tracking-[0.3em] text-primary">{section.num}</p>
        <h2
          id={`${section.id}-heading`}
          className="mt-3 font-display text-[26px] font-medium leading-[1.15] tracking-tight text-foreground sm:text-3xl lg:text-[38px]"
        >
          {section.title}
        </h2>
        <div
          aria-hidden
          className="mt-6 h-px w-full max-w-[68ch]"
          style={{
            background:
              "linear-gradient(to right, oklch(0.68 0.19 48 / 45%) 0%, oklch(1 0 0 / 8%) 30%, transparent 100%)",
          }}
        />
        {children}
      </section>
    </Reveal>
  );
}

/* ---------- table of contents ---------- */

function useActiveSection() {
  const [active, setActive] = useState(sections[0]!.id);
  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((e): e is HTMLElement => Boolean(e));
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-96px 0px -65% 0px", threshold: 0 },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
  return active;
}

function TocList({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <ol className="space-y-1">
      {sections.map((s) => {
        const isActive = active === s.id;
        return (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              onClick={onNavigate}
              aria-current={isActive ? "true" : undefined}
              className={
                "group flex items-start gap-3 rounded-lg px-3 py-2 text-[13px] leading-snug transition-colors " +
                (isActive
                  ? "bg-primary/10 font-medium text-foreground"
                  : "text-foreground/55 hover:text-foreground")
              }
            >
              <span
                aria-hidden
                className={
                  "mt-[3px] h-4 w-px shrink-0 transition-colors " +
                  (isActive ? "bg-primary" : "bg-border group-hover:bg-primary/50")
                }
              />
              <span className="font-mono text-[11px] tracking-widest text-primary/80">{s.num}</span>
              <span>{s.title}</span>
            </a>
          </li>
        );
      })}
    </ol>
  );
}

const legalLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Refund Policy", to: "/" },
  { label: "Cookie Policy", to: "/" },
  { label: "Contact", to: "/contact" },
];

/* ---------- page ---------- */

function TermsPage() {
  const active = useActiveSection();
  const [mobileTocOpen, setMobileTocOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      <SiteNav />

      <main>
        {/* HERO */}
        <section className="relative overflow-hidden border-b border-border">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-[62%] h-[620px] w-[900px] -translate-x-1/2 opacity-70 blur-[130px]"
            style={{
              background:
                "radial-gradient(ellipse 55% 55% at 50% 50%, oklch(0.6 0.17 48 / 55%) 0%, oklch(0.34 0.1 40 / 30%) 45%, transparent 78%)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[6%] top-24 hidden size-[320px] rounded-full border border-primary/15 bg-[oklch(0.24_0.05_45_/_25%)] backdrop-blur-[2px] lg:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
            }}
          />

          <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
            <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground/65">
              <span aria-hidden className="h-px w-8 bg-primary" />
              Legal / Terms
            </p>
            <h1 className="mt-7 max-w-2xl font-display text-5xl font-light leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Terms &amp; <span className="font-medium">Conditions</span>
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-foreground/65 sm:text-base">
              Please read these terms carefully before using Jays Vault, creating an account, or
              purchasing digital products.
            </p>

            <dl className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <dt className="uppercase tracking-[0.18em] text-foreground/45">Last updated</dt>
                <dd className="font-mono text-foreground/80">{LAST_UPDATED}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="uppercase tracking-[0.18em] text-foreground/45">Effective from</dt>
                <dd className="font-mono text-foreground/80">{EFFECTIVE_FROM}</dd>
              </div>
            </dl>

            {/* NOTICE */}
            <div className="relative mt-12 max-w-2xl overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-7 shadow-[var(--shadow-card)] sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-16 size-[220px] rounded-full opacity-50 blur-[70px]"
                style={{
                  background: "radial-gradient(circle, oklch(0.62 0.17 48 / 35%) 0%, transparent 70%)",
                }}
              />
              <div className="relative flex gap-4">
                <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
                  <ScrollText className="size-4 text-primary" aria-hidden />
                </span>
                <div>
                  <h2 className="font-display text-lg font-medium tracking-tight text-foreground">
                    Please read before using Jays Vault
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.75] text-foreground/70">
                    These Terms &amp; Conditions govern your access to and use of the Jays Vault
                    website, accounts, purchases, and related digital services.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <div className="mx-auto max-w-7xl px-6 pb-24 lg:px-8 lg:pb-32">
          <div className="grid gap-12 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-16">
            {/* TOC — desktop */}
            <nav aria-label="On this page" className="hidden lg:block">
              <div className="sticky top-28 max-h-[calc(100dvh-8rem)] overflow-y-auto pb-8">
                <p className="px-3 pb-4 font-mono text-[11px] uppercase tracking-[0.24em] text-foreground/45">
                  On this page
                </p>
                <TocList active={active} />
              </div>
            </nav>

            {/* TOC — mobile */}
            <nav
              aria-label="On this page"
              className="sticky top-[76px] z-30 -mx-6 mb-2 bg-background/90 px-6 py-3 backdrop-blur-xl lg:hidden"
            >
              <button
                type="button"
                onClick={() => setMobileTocOpen((v) => !v)}
                aria-expanded={mobileTocOpen}
                className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm text-foreground/80"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">On this page</span>
                <ChevronDown
                  aria-hidden
                  className={
                    "size-4 text-primary transition-transform " + (mobileTocOpen ? "rotate-180" : "")
                  }
                />
              </button>
              {mobileTocOpen && (
                <div className="mt-2 max-h-[55dvh] overflow-y-auto rounded-xl border border-border bg-card/70 p-2">
                  <TocList active={active} onNavigate={() => setMobileTocOpen(false)} />
                </div>
              )}
            </nav>

            {/* SECTIONS */}
            <div className="max-w-[780px] pt-4 lg:pt-16">
              <SectionBlock section={sec(0)}>
                <P>
                  These Terms &amp; Conditions ("Terms") govern your access to and use of the Jays
                  Vault website at [WEBSITE URL], including account creation, purchasing digital
                  products, accessing digital resources, and using related services operated by
                  [LEGAL BUSINESS NAME].
                </P>
                <P>
                  By using the website or purchasing a product, you agree to these Terms as they apply
                  to you. If you do not agree with them, please do not use the service.
                </P>
                <Callout icon={AlertTriangle} title="Legal review required">
                  This page presents Jays Vault's intended terms of service. The final wording must be
                  reviewed and adapted by qualified legal counsel for the actual business entity,
                  jurisdiction, payment providers, licensing model, and applicable consumer laws.
                </Callout>
              </SectionBlock>

              <SectionBlock section={sec(1)}>
                <P>
                  Accessing certain features may require an account. Where an account is created, you
                  agree to the following.
                </P>
                <Bullets
                  items={[
                    "You are eligible to use the website under applicable law",
                    "Any minimum age requirement applied by the business: [MINIMUM USER AGE, IF APPLICABLE]",
                    "The information you provide during registration is accurate and kept up to date",
                    "You keep your login credentials confidential and secure",
                    "You are responsible for activity that occurs under your account",
                    "You notify us promptly if you believe your account has been compromised",
                  ]}
                />
                <P>
                  We may decline, restrict, or close registrations where reasonably necessary to
                  protect the service or comply with legal obligations.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(2)}>
                <P>
                  You agree to use the website lawfully and responsibly. Examples of behaviour that is
                  not acceptable include:
                </P>
                <Bullets
                  items={[
                    "Attempting unauthorised access to any part of the site, accounts, or systems",
                    "Interfering with or disrupting website functionality or availability",
                    "Bypassing access, download, or entitlement controls",
                    "Abusing forms, endpoints, or APIs",
                    "Uploading or distributing malicious software",
                    "Automated scraping or harvesting where prohibited",
                    "Attempting to reverse engineer protected systems where unlawful",
                    "Using the platform for fraudulent activity",
                  ]}
                />
              </SectionBlock>

              <SectionBlock section={sec(3)}>
                <P>Jays Vault may offer a range of digital products, which can include:</P>
                <Bullets
                  items={[
                    "Downloadable files and design assets",
                    "Canva, Notion, and website templates",
                    "Digital documents and ebooks",
                    "AI prompt packs",
                    "Courses and learning material",
                    "Marketing kits and UI kits",
                    "Spreadsheet and software resources",
                    "Account-access products and externally hosted digital resources",
                  ]}
                />
                <P>
                  Product characteristics vary. Not every product is a downloadable file, and access
                  duration is not the same for all products. Access and delivery methods may vary by
                  product and are described on the applicable product page or purchase information.
                </P>
                <SubHeading>Product descriptions</SubHeading>
                <P>
                  We aim to describe products accurately, but previews may differ slightly from final
                  files, creator-supplied content may be subject to individual terms, products may be
                  updated over time, and availability may change. We do not claim that every product
                  is free of errors or suited to every individual requirement.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(4)}>
                <P>Where you purchase a product, the following apply:</P>
                <Bullets
                  items={[
                    "Prices are shown in the currency stated at checkout",
                    "Taxes or fees may be added where applicable",
                    "Submitting an order authorises the stated payment amount",
                    "An order is confirmed once payment has been successfully processed",
                    "Failed or incomplete transactions may prevent product access",
                    "Duplicate transactions may be reviewed and corrected",
                    "Obvious pricing or listing errors may be corrected before fulfilment",
                    "Orders identified as fraudulent may be cancelled",
                  ]}
                />
                <P>
                  Payments may be processed by third-party payment providers such as
                  [PAYMENT PROVIDER]. Where a provider handles payment, full payment card details are
                  processed by that provider rather than stored by Jays Vault.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(5)}>
                <P>Depending on the product, access may be provided through:</P>
                <Bullets
                  items={[
                    "Your customer account",
                    "A download link issued after purchase",
                    "External cloud storage provided by the creator",
                    "A course or learning platform",
                    "Email delivery",
                    "Another delivery mechanism described on the product page",
                  ]}
                />
                <P>
                  Access is generally linked to payment confirmation, your order record, and the
                  entitlement associated with your account. Some products may require manual review,
                  verification, or creator action before access is granted, so instant access is not
                  guaranteed for every product.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(6)}>
                <P>
                  Purchasing a digital product does not transfer ownership of the underlying
                  intellectual property. Creators and rights holders retain their rights, and you
                  receive only the license or usage rights specified by the applicable product terms.
                </P>
                <P>Unless the applicable license expressly permits it, you may not:</P>
                <Bullets
                  items={[
                    "Resell or redistribute the product or its files",
                    "Sublicense or repackage the product",
                    "Claim authorship of the work",
                    "Upload purchased files to public or shared locations",
                    "Share downloads or access credentials with others",
                    "Use assets outside the permitted licensing terms",
                  ]}
                />
                <P>
                  Licenses are not identical across the marketplace. The license associated with a
                  particular product may vary and should be reviewed before use.
                </P>
                <Callout icon={Scale} title="Important: product licenses may differ">
                  Some products may include personal-use, commercial-use, editorial, educational, or
                  other license terms. The applicable license should be reviewed before use and takes
                  precedence for the relevant product to the extent stated.
                </Callout>
              </SectionBlock>

              <SectionBlock section={sec(7)}>
                <P>When using Jays Vault, you agree not to engage in:</P>
                <Bullets
                  items={[
                    "Unlawful use of the website or its products",
                    "Unauthorised redistribution or resale of digital products",
                    "Account sharing where prohibited",
                    "Fraud, chargeback abuse, or payment misuse",
                    "Malicious or abusive activity toward the platform, creators, or other users",
                    "Bypassing download, access, or entitlement restrictions",
                    "Infringement of intellectual property rights",
                    "Unauthorised scraping or interference with platform operation",
                  ]}
                />
              </SectionBlock>

              <SectionBlock section={sec(8)}>
                <P>
                  This section applies only to the extent that Jays Vault actually offers reviews,
                  comments, uploads, creator submissions, or similar functionality:
                  [USER CONTENT FEATURES, IF ANY].
                </P>
                <Bullets
                  items={[
                    "You retain ownership of content you submit",
                    "You confirm you have the rights necessary to submit it",
                    "You grant Jays Vault the permissions needed to host and display it on the platform",
                    "Content may be moderated or removed where it breaches these Terms or applicable law",
                    "Unlawful, infringing, deceptive, or abusive content is not permitted",
                  ]}
                />
              </SectionBlock>

              <SectionBlock section={sec(9)}>
                <P>Jays Vault may rely on third-party providers to operate the marketplace, including for:</P>
                <Bullets
                  items={[
                    "Payments — [PAYMENT PROVIDER]",
                    "Hosting and content delivery — [HOSTING PROVIDER]",
                    "Cloud storage and file delivery — [CLOUD STORAGE PROVIDER]",
                    "Authentication and account sign-in — [AUTHENTICATION PROVIDER]",
                    "Analytics — [ANALYTICS PROVIDER]",
                    "Email delivery — [EMAIL PROVIDER]",
                    "Course delivery — [COURSE PLATFORM]",
                    "Customer support — [SUPPORT PROVIDER]",
                    "Fraud prevention — [FRAUD PREVENTION PROVIDER]",
                  ]}
                />
                <P>
                  Third-party services operate under their own terms and policies. Their inclusion does
                  not imply endorsement, and we do not control their platforms or availability.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(10)}>
                <P>
                  Refund eligibility for digital products is governed by the Jays Vault Refund Policy
                  and by applicable law. Certain circumstances may be treated differently depending on
                  your jurisdiction and the nature of the product.
                </P>
                <P>
                  Cancellation and refund handling, including any conditions or exceptions, should be
                  set out in full in the Refund Policy: [REFUND POLICY URL].
                </P>
                <Link
                  to="/"
                  className="group mt-7 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors"
                >
                  View Refund Policy
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </Link>
              </SectionBlock>

              <SectionBlock section={sec(11)}>
                <P>
                  We may restrict, suspend, or terminate access to an account where reasonably necessary,
                  for example because of:
                </P>
                <Bullets
                  items={[
                    "Fraud or payment abuse",
                    "Breach of these Terms",
                    "Unauthorised redistribution of purchased products",
                    "Security concerns affecting the account or platform",
                    "Unlawful activity",
                    "Misuse of the service or its support channels",
                  ]}
                />
                <P>
                  The effect of suspension or termination on previously purchased products depends on
                  the circumstances, the applicable product terms, and applicable law:
                  [ACCOUNT TERMINATION RULES]. We do not state as a general rule that all purchased
                  products are permanently lost.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(12)}>
                <P>
                  Jays Vault aims to provide a reliable service, but to the extent permitted by
                  applicable law we do not guarantee that:
                </P>
                <Bullets
                  items={[
                    "The website will always be available or uninterrupted",
                    "All content will always be accurate or error-free",
                    "Every product will meet each user's individual needs",
                    "Third-party services will always remain available or unchanged",
                  ]}
                />
                <P>
                  Any warranty or disclaimer language must be reviewed by qualified legal counsel for
                  the jurisdictions in which Jays Vault operates: [JURISDICTION-SPECIFIC LANGUAGE].
                </P>
              </SectionBlock>

              <SectionBlock section={sec(13)}>
                <P>
                  To the extent permitted by applicable law, Jays Vault's liability arising from your
                  use of the website or its products is limited as set out here:
                  [APPLICABLE LIABILITY LIMITS].
                </P>
                <P>
                  Nothing in these Terms excludes or limits liability that cannot lawfully be excluded
                  or limited. The precise scope of any limitation, including its treatment of indirect
                  or consequential loss, must be finalised during legal review:
                  [JURISDICTION-SPECIFIC LANGUAGE].
                </P>
              </SectionBlock>

              <SectionBlock section={sec(14)}>
                <P>
                  Subject to applicable law, you may be asked to indemnify [LEGAL BUSINESS NAME] against
                  claims, losses, or costs arising from your breach of these Terms, your unlawful use of
                  the service, or your misuse of purchased products.
                </P>
                <P>
                  The scope, exclusions, and enforceability of any indemnity vary by jurisdiction and
                  must be drafted for the actual business: [INDEMNIFICATION TERMS — LEGAL REVIEW].
                </P>
              </SectionBlock>

              <SectionBlock section={sec(15)}>
                <P>
                  These Terms may be updated from time to time to reflect changes in our services,
                  providers, product offering, or legal obligations.
                </P>
                <Bullets
                  items={[
                    "Revised Terms will be posted on this page with an updated revision date",
                    "The current revision date is shown at the top of this page",
                    "Material changes may be communicated through appropriate channels where applicable",
                    "How continued use is treated following an update: [NOTICE AND ACCEPTANCE TERMS]",
                  ]}
                />
              </SectionBlock>

              <SectionBlock section={sec(16)}>
                <SubHeading>Governing law</SubHeading>
                <P>
                  These Terms are governed by the laws of [JURISDICTION], subject to applicable
                  mandatory legal requirements.
                </P>
                <SubHeading>Dispute resolution</SubHeading>
                <P>
                  Dispute resolution process: [DETAILS]. Any dispute-resolution mechanism should be
                  completed based on the governing jurisdiction and reviewed by qualified counsel before
                  publication.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(17)}>
                <P>
                  If you have questions about these Terms &amp; Conditions, product usage, purchases, or
                  account rules, you can reach us at{" "}
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                  .
                </P>
                <P>
                  Business entity: [LEGAL BUSINESS NAME]. Registered contact address:
                  [BUSINESS ADDRESS].
                </P>

                {/* CTA PANEL */}
                <div className="relative mt-12 max-w-[68ch] overflow-hidden rounded-3xl border border-primary/20 bg-card/70 p-8 shadow-[var(--shadow-card)] sm:p-10">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-20 size-[280px] rounded-full opacity-60 blur-[70px]"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.62 0.17 48 / 40%) 0%, transparent 70%)",
                    }}
                  />
                  <div className="relative">
                    <h3 className="font-display text-2xl font-medium tracking-tight text-foreground">
                      Questions about these Terms?
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/65">
                      Our team can clarify product usage, purchases, licensing, and account rules.
                    </p>
                    <Link
                      to="/contact"
                      className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
                    >
                      <Mail className="size-4" aria-hidden />
                      Contact Jays Vault
                      <ArrowRight
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                        aria-hidden
                      />
                    </Link>
                  </div>
                </div>

                {/* LEGAL LINK ROW */}
                <nav
                  aria-label="Legal pages"
                  className="mt-12 flex max-w-[68ch] flex-wrap items-center gap-x-6 gap-y-3 border-t border-border pt-6"
                >
                  {legalLinks.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      className="text-xs uppercase tracking-[0.16em] text-foreground/50 transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  ))}
                </nav>
              </SectionBlock>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
