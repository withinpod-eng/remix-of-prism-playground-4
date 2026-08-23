import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, ArrowRight, ChevronDown, Lock, Mail } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const TITLE = "Privacy Policy | Jays Vault";
const DESCRIPTION =
  "Learn how Jays Vault collects, uses, protects, and manages personal information across its digital marketplace.";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "/privacy-policy" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/privacy-policy" }],
  }),
  component: PrivacyPolicyPage,
});

const LAST_UPDATED = "[DD MONTH YYYY]";
const EFFECTIVE_FROM = "[DD MONTH YYYY]";
const PRIVACY_EMAIL = "privacy@[yourdomain].com";

type Section = { id: string; num: string; title: string };

const sections: Section[] = [
  { id: "overview", num: "01", title: "Overview" },
  { id: "information-we-collect", num: "02", title: "Information We Collect" },
  { id: "transactions", num: "03", title: "Transaction & Order Information" },
  { id: "automatic", num: "04", title: "Automatically Collected Information" },
  { id: "cookies", num: "05", title: "Cookies & Similar Technologies" },
  { id: "how-we-use", num: "06", title: "How We Use Information" },
  { id: "security", num: "07", title: "Data Storage & Security" },
  { id: "third-party", num: "08", title: "Third-Party Services" },
  { id: "delivery", num: "09", title: "Digital Product Access & Delivery" },
  { id: "retention", num: "10", title: "Data Retention" },
  { id: "rights", num: "11", title: "Your Rights & Choices" },
  { id: "children", num: "12", title: "Children's Privacy" },
  { id: "international", num: "13", title: "International Data Transfers" },
  { id: "changes", num: "14", title: "Changes to This Policy" },
  { id: "contact", num: "15", title: "Contact Us" },
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
    <p className="mt-7 max-w-[68ch] text-[15px] leading-[1.9] text-foreground/70 sm:text-base">
      {children}
    </p>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mt-12 font-display text-lg font-medium tracking-tight text-foreground">
      {children}
    </h3>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-6 max-w-[68ch] space-y-3.5">
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
  icon: typeof Lock;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10 mb-4 max-w-[68ch] rounded-2xl border border-primary/25 bg-[oklch(0.19_0.04_45_/_70%)] p-6 shadow-[inset_0_1px_0_0_oklch(1_0_0_/_5%)] sm:p-7">
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

function SectionBlock({
  section,
  children,
}: {
  section: Section;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <section id={section.id} aria-labelledby={`${section.id}-heading`} className="scroll-mt-28 pt-24 first:pt-0 lg:pt-32">
        <p className="font-mono text-xs tracking-[0.3em] text-primary">{section.num}</p>
        <h2
          id={`${section.id}-heading`}
          className="mt-3 font-display text-[26px] font-medium leading-[1.15] tracking-tight text-foreground sm:text-3xl lg:text-[38px]"
        >
          {section.title}
        </h2>
        <div
          aria-hidden
          className="mt-7 h-px w-full max-w-[68ch]"
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

/* ---------- page ---------- */

function PrivacyPolicyPage() {
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
              Legal / Privacy
            </p>
            <h1 className="mt-7 max-w-2xl font-display text-5xl font-light leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              Privacy <span className="font-medium">Policy</span>
            </h1>
            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-foreground/65 sm:text-base">
              Your privacy matters. Here's how Jays Vault collects, uses, protects, and manages your
              information.
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
            <nav aria-label="On this page" className="sticky top-[76px] z-30 -mx-6 mb-2 bg-background/90 px-6 py-3 backdrop-blur-xl lg:hidden">
              <button
                type="button"
                onClick={() => setMobileTocOpen((v) => !v)}
                aria-expanded={mobileTocOpen}
                className="flex w-full items-center justify-between rounded-xl border border-border px-4 py-3 text-sm text-foreground/80"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.2em]">On this page</span>
                <ChevronDown
                  aria-hidden
                  className={"size-4 text-primary transition-transform " + (mobileTocOpen ? "rotate-180" : "")}
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
                  Jays Vault respects your privacy. This Privacy Policy explains what information may
                  be collected when you use our marketplace, why it is collected, how it is used, and
                  the choices available to you.
                </P>
                <P>
                  This policy applies to the Jays Vault website, account system, checkout experience,
                  customer support channels, and related digital services operated by
                  [BUSINESS ENTITY NAME].
                </P>
                <Callout icon={AlertTriangle} title="Important">
                  This page explains Jays Vault's intended privacy practices. The final policy should
                  be reviewed and adapted to the actual data practices, service providers, and laws
                  and jurisdictions that apply to the business.
                </Callout>
              </SectionBlock>

              <SectionBlock section={sec(1)}>
                <P>
                  We aim to collect only the information needed to operate the marketplace and support
                  your purchases. The categories below describe the information that may be collected.
                </P>
                <SubHeading>Information you provide</SubHeading>
                <Bullets
                  items={[
                    "Name and email address",
                    "Account credentials used to sign in",
                    "Billing details required to complete a purchase",
                    "Order information relating to the products you buy",
                    "Messages you send to customer support",
                    "Contact information you choose to share",
                    "Preferences you submit through the site",
                  ]}
                />
                <P>
                  The final published policy should list only the information Jays Vault actually
                  collects — nothing more.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(2)}>
                <P>
                  When you purchase digital products, we may process the information necessary to
                  operate the transaction, including to:
                </P>
                <Bullets
                  items={[
                    "Identify you as the customer of an order",
                    "Process and confirm your order",
                    "Confirm that payment was completed",
                    "Provide access to your purchased products",
                    "Maintain purchase and receipt records",
                    "Provide order-related support",
                    "Detect and prevent fraud or abuse",
                  ]}
                />
                <P>
                  Payment processing may be handled by third-party payment providers such as
                  [PAYMENT PROVIDER]. Where payment processing is handled by a provider, full payment
                  card details are processed by that provider rather than stored by Jays Vault.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(3)}>
                <P>
                  Some information may be collected automatically when you visit the site, for example:
                </P>
                <Bullets
                  items={[
                    "IP address",
                    "Browser type and version",
                    "Device information",
                    "Operating system",
                    "Pages visited on the site",
                    "Referring pages or sources",
                    "Approximate usage and activity information",
                    "Diagnostic and error information",
                  ]}
                />
                <P>
                  The final legal version should list only the categories actually collected by the
                  site's hosting, analytics, and security tooling.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(4)}>
                <P>
                  Jays Vault may use cookies and similar technologies to operate and improve the site.
                  Depending on the implementation, these may include:
                </P>
                <Bullets
                  items={[
                    "Essential cookies required for the site to function",
                    "Authentication and session cookies",
                    "Preference cookies",
                    "Analytics cookies",
                    "Performance-related technologies",
                  ]}
                />
                <P>These technologies may be used to:</P>
                <Bullets
                  items={[
                    "Keep you signed in to your account",
                    "Remember your preferences",
                    "Understand how the website performs",
                    "Improve usability and navigation",
                    "Analyse aggregate traffic patterns",
                  ]}
                />
                <P>
                  Advertising cookies are only relevant if the site actually uses them; they should be
                  described in the final policy only where that is the case.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(5)}>
                <P>Information may be used for purposes such as:</P>
                <Bullets
                  items={[
                    "Creating and managing your account",
                    "Processing transactions and purchases",
                    "Delivering digital products and access",
                    "Providing customer support",
                    "Communicating with you about your orders",
                    "Improving our products and website experience",
                    "Protecting the service and its users",
                    "Detecting fraud, abuse, and misuse",
                    "Maintaining security and service integrity",
                    "Complying with applicable legal obligations",
                    "Analysing performance where applicable",
                  ]}
                />
              </SectionBlock>

              <SectionBlock section={sec(6)}>
                <P>
                  Information may be stored using our hosting and infrastructure providers, described
                  in the Third-Party Services section below.
                </P>
                <Callout icon={Lock} title="Security matters">
                  Jays Vault uses reasonable technical and organisational measures designed to protect
                  information against unauthorised access, loss, misuse, alteration, or disclosure. No
                  online service can guarantee absolute security, so we do not claim that transmission
                  or storage is completely immune to risk.
                </Callout>
              </SectionBlock>

              <SectionBlock section={sec(7)}>
                <P>
                  Jays Vault may rely on third-party providers and infrastructure to operate the
                  marketplace, including for:
                </P>
                <Bullets
                  items={[
                    "Payment processing — [PAYMENT PROVIDER]",
                    "Authentication and account sign-in — [AUTHENTICATION PROVIDER]",
                    "Hosting and content delivery — [HOSTING PROVIDER]",
                    "Cloud storage and file delivery — [CLOUD STORAGE PROVIDER]",
                    "Analytics and performance measurement — [ANALYTICS PROVIDER]",
                    "Transactional email delivery — [EMAIL PROVIDER]",
                    "Customer support tooling — [SUPPORT PROVIDER]",
                    "Fraud prevention — [FRAUD PREVENTION PROVIDER]",
                  ]}
                />
                <P>
                  These providers process information on our behalf for the purposes described above.
                  The final policy should name only the providers actually in use and link to their
                  respective privacy policies.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(8)}>
                <P>
                  Because Jays Vault sells digital goods, the way a product is delivered depends on the
                  product type. Delivery methods may include:
                </P>
                <Bullets
                  items={[
                    "Instant downloads after checkout",
                    "Account-based access to purchased items",
                    "External file-access links provided by the creator",
                    "Access to a course or learning platform",
                    "Other delivery methods described on the product page",
                  ]}
                />
                <P>
                  Purchase and access records may be associated with your account so that access can be
                  restored, managed, or supported. The duration of access is governed by the terms
                  stated for each product rather than by this Privacy Policy.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(9)}>
                <P>
                  Information may be retained for as long as reasonably necessary for purposes such as:
                </P>
                <Bullets
                  items={[
                    "Account management and product access",
                    "Transaction and receipt records",
                    "Customer support history",
                    "Fraud prevention and security",
                    "Legitimate operational needs",
                    "Legal, tax, and compliance obligations",
                  ]}
                />
                <P>
                  Specific retention periods should be documented here based on the business's actual
                  practices and applicable legal requirements: [RETENTION PERIODS].
                </P>
              </SectionBlock>

              <SectionBlock section={sec(10)}>
                <P>
                  Depending on your location and applicable law, you may have rights in relation to your
                  personal information, which can include:
                </P>
                <Bullets
                  items={[
                    "Requesting access to the personal information we hold about you",
                    "Requesting correction of inaccurate or incomplete information",
                    "Requesting deletion of certain information",
                    "Objecting to or requesting restriction of certain processing",
                    "Requesting data portability where applicable",
                    "Withdrawing consent where processing is based on consent",
                    "Managing your cookie preferences",
                    "Contacting Jays Vault with privacy questions or concerns",
                  ]}
                />
                <P>
                  Available rights vary by jurisdiction and applicable law, and some requests may be
                  subject to legal exceptions or verification requirements.
                </P>
              </SectionBlock>

              <SectionBlock section={sec(11)}>
                <P>
                  Jays Vault is not intentionally designed to collect personal information from children
                  in a manner that would conflict with applicable law. If you believe information
                  relating to a child has been provided to us in a way that requires attention, please
                  contact us using the details below so the matter can be reviewed.
                </P>
                <P>
                  Any minimum-age requirement applied by the business should be stated here:
                  [AGE REQUIREMENT, IF ANY].
                </P>
              </SectionBlock>

              <SectionBlock section={sec(12)}>
                <P>
                  Because we rely on hosting, storage, and service providers, your information may be
                  processed or stored in countries other than the one you live in. Where that happens,
                  the transfer will be handled in accordance with applicable law.
                </P>
                <P>
                  The jurisdictions involved and any safeguards or transfer mechanisms relied upon should
                  be confirmed during legal review: [JURISDICTIONS AND SAFEGUARDS].
                </P>
              </SectionBlock>

              <SectionBlock section={sec(13)}>
                <P>
                  This Privacy Policy may be updated from time to time to reflect changes in our
                  practices, services, providers, or legal obligations.
                </P>
                <Bullets
                  items={[
                    "Updated versions will show a new last-updated or effective date",
                    "Material changes may be communicated through appropriate channels",
                    "Continued use of the site after an update is subject to the current policy",
                  ]}
                />
              </SectionBlock>

              <SectionBlock section={sec(14)}>
                <P>
                  If you have questions about this policy or about how your information is handled, you
                  can reach our privacy team at{" "}
                  <a
                    href={`mailto:${PRIVACY_EMAIL}`}
                    className="text-primary underline decoration-primary/40 underline-offset-4 transition-colors hover:decoration-primary"
                  >
                    {PRIVACY_EMAIL}
                  </a>
                  .
                </P>
                <P>
                  Business entity: [BUSINESS ENTITY NAME]. Registered contact address:
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
                      Questions about your privacy?
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-foreground/65">
                      We're here to help clarify how Jays Vault handles personal information.
                    </p>
                    <a
                      href={`mailto:${PRIVACY_EMAIL}`}
                      className="group mt-7 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)]"
                    >
                      <Mail className="size-4" aria-hidden />
                      Contact Privacy Support
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                    </a>
                  </div>
                </div>
              </SectionBlock>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
