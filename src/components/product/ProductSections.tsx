import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import type { ProductDetails } from "@/data/productDetails";
import { Reveal } from "@/components/Reveal";

export function WhatsIncluded({ details }: { details: ProductDetails }) {
  return (
    <section className="px-5 py-24 sm:px-6 lg:py-32" style={{ backgroundColor: "oklch(0.155 0.016 55)" }}>
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
              Overview
            </span>
            <h2 className="mt-5 font-display text-3xl leading-tight text-foreground sm:text-4xl">
              {details.overview.heading}
            </h2>
            <div className="mt-6 space-y-4">
              {details.overview.paragraphs.map((p) => (
                <p key={p} className="text-[15px] leading-relaxed text-muted-foreground">
                  {p}
                </p>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="glass-panel rounded-[1.75rem] p-7 sm:p-9">
            <h3 className="font-display text-2xl text-foreground">What's inside</h3>
            <ul className="mt-6 space-y-3.5">
              {details.includes.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
            <dl className="mt-8 space-y-3 border-t border-border/60 pt-6 text-sm">
              {details.meta.map((m) => (
                <div key={m.label} className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{m.label}</dt>
                  <dd className="text-right text-foreground">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

const steps = [
  { n: "01", title: "Purchase", body: "Complete a secure checkout — no subscription, no renewal." },
  { n: "02", title: "Access", body: "The product is linked to your account the moment payment clears." },
  { n: "03", title: "Use", body: "Open the files and adapt them to your own brand and workflow." },
  { n: "04", title: "Create", body: "Put the resource to work and return to it whenever you need." },
];

export function HowItWorks() {
  return (
    <section className="px-5 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">How it works</h2>
        <div className="relative mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-10 hidden h-px w-full bg-gradient-to-r from-primary/60 via-primary/20 to-transparent lg:block"
          />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 90}>
              <div className="relative rounded-[1.5rem] border border-border bg-card/40 p-6 backdrop-blur">
                <span className="font-mono text-xs text-primary">{s.n}</span>
                <h3 className="mt-3 font-display text-xl text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhoItsFor({ audience }: { audience: string[] }) {
  return (
    <section
      className="px-5 py-24 sm:px-6 lg:py-32"
      style={{ backgroundColor: "oklch(0.155 0.016 55)" }}
    >
      <div className="mx-auto max-w-6xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">Who it's for</h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {audience.map((a) => (
            <span
              key={a}
              className="rounded-full border border-border bg-background/50 px-5 py-3 text-sm text-foreground/85 backdrop-blur"
            >
              {a}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductFaq({ faq }: { faq: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-5 py-24 sm:px-6 lg:py-32">
      <div className="mx-auto max-w-3xl">
        <h2 className="font-display text-3xl text-foreground sm:text-4xl">Product FAQ</h2>
        <div className="mt-10 space-y-3">
          {faq.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className={`rounded-[1.25rem] border transition-all ${
                  isOpen ? "border-primary/55 bg-card/70" : "border-border bg-card/35"
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="flex-1 text-[15px] font-medium text-foreground">{item.q}</span>
                  <span
                    className={`flex size-8 shrink-0 items-center justify-center rounded-full border ${
                      isOpen
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-border text-foreground/70"
                    }`}
                  >
                    {isOpen ? <Minus className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>
                <div
                  className="grid overflow-hidden transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-6 text-sm leading-relaxed text-muted-foreground sm:px-6">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
