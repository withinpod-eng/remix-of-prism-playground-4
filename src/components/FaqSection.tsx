import { useState } from "react";
import { ArrowUpRight, Plus, X } from "lucide-react";

const faqs = [
  {
    q: "What types of digital products can I find on Jays Vault?",
    a: "Jays Vault offers ebooks, AI prompt packs, Canva templates, Notion templates, digital courses, design assets, marketing kits, website templates, UI kits, spreadsheet resources and other downloadable digital products.",
  },
  {
    q: "How do I get access after purchasing?",
    a: "After your payment is successfully confirmed, your purchase is linked to your account. Depending on the product, you'll receive an instant download, an access link, or instructions for accessing the resource.",
  },
  {
    q: "Can I access my products again later?",
    a: "Yes. Products assigned to your account can be accessed again through your My Products area, subject to the specific access terms of that product.",
  },
  {
    q: "Are the products available for commercial use?",
    a: "Usage rights vary by product. Each product page states whether the item is for personal use, commercial use, or subject to additional licensing terms.",
  },
  {
    q: "What happens if my payment succeeds but I can't access my product?",
    a: "Your order and access status are recorded after checkout. If access isn't available after a successful payment, contact support with your order details so the issue can be reviewed.",
  },
  {
    q: "Can I get a refund for a digital product?",
    a: "Refund eligibility depends on Jays Vault's refund policy and the circumstances of the purchase. The applicable terms are shown before checkout and in the product and policy pages.",
  },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(1);

  return (
    <section className="relative overflow-hidden px-5 py-28 sm:px-6 lg:px-10 lg:py-40">
      {/* ambient studio light behind the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse 55% 60% at 50% 20%, oklch(0.62 0.17 50 / 40%) 0%, oklch(0.5 0.14 20 / 18%) 45%, transparent 75%)",
        }}
      />

      <div
        className="relative mx-auto max-w-5xl rounded-[2.25rem] border border-border p-7 sm:p-12 lg:px-20 lg:py-24"
        style={{
          background:
            "linear-gradient(160deg, oklch(0.19 0.02 55) 0%, oklch(0.16 0.024 45) 55%, oklch(0.15 0.03 40) 100%)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex items-center gap-2 rounded-full border border-border bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="size-1.5 rounded-full bg-primary" />
            FAQ / The Vault
          </span>
          <h2 className="mt-7 max-w-xl font-display text-4xl font-light leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Everything you need
            <br />
            to know.
          </h2>
        </div>

        <div className="mt-14 space-y-3 lg:mt-[68px]">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="rounded-[1.35rem] border transition-all duration-300"
                style={
                  isOpen
                    ? {
                        borderColor: "oklch(0.68 0.19 48 / 55%)",
                        backgroundColor: "oklch(0.23 0.03 48)",
                        boxShadow: "0 0 50px -18px oklch(0.68 0.19 48 / 45%)",
                      }
                    : {
                        borderColor: "oklch(0.42 0.05 55 / 28%)",
                        backgroundColor: "oklch(0.185 0.018 50)",
                      }
                }
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 px-5 py-6 text-left sm:gap-6 sm:px-7 sm:py-7"
                >
                  <span
                    className={`font-mono text-xs ${isOpen ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-[15px] font-medium leading-snug text-foreground sm:text-base">
                    {item.q}
                  </span>
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors sm:size-10 ${
                      isOpen
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-border bg-background/60 text-foreground/70"
                    }`}
                    style={
                      isOpen ? { boxShadow: "0 0 24px -8px oklch(0.68 0.19 48 / 60%)" } : undefined
                    }
                  >
                    {isOpen ? <X className="size-4" /> : <Plus className="size-4" />}
                  </span>
                </button>

                <div
                  className="grid overflow-hidden transition-all duration-300"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[46rem] px-5 pb-8 pl-5 text-[13.5px] leading-relaxed text-muted-foreground sm:px-7 sm:pb-9 sm:pl-[4.1rem] sm:text-sm">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-14 flex flex-col items-center gap-2 text-center">
          <p className="text-xs text-muted-foreground">Still have questions?</p>
          <a
            href="mailto:support@jaysvault.com"
            className="group flex items-center gap-2 text-sm font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-primary"
          >
            Contact Jays Vault
            <ArrowUpRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
