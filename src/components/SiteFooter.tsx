import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Linkedin, Minus, Plus, Shield, Twitter, Youtube } from "lucide-react";

type Group = { heading: string; links: { label: string; to: string }[] };

const groups: Group[] = [
  {
    heading: "Explore",
    links: [
      { label: "All Products", to: "/products" },
      { label: "New Arrivals", to: "/products" },
      { label: "Best Sellers", to: "/products" },
      { label: "Bundles", to: "/products" },
      { label: "Free Resources", to: "/products" },
      { label: "Categories", to: "/products" },
    ],
  },
  {
    heading: "Categories",
    links: [
      { label: "AI Prompts", to: "/products" },
      { label: "Ebooks", to: "/products" },
      { label: "Canva Templates", to: "/products" },
      { label: "Notion Templates", to: "/products" },
      { label: "Digital Courses", to: "/products" },
      { label: "Design Assets", to: "/products" },
      { label: "View All Categories", to: "/products" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "About Us", to: "/about" },
      { label: "FAQ", to: "/" },
      { label: "Contact", to: "/contact" },
      { label: "My Account", to: "/" },
      { label: "My Products", to: "/" },
      { label: "Order Support", to: "/" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy-policy" },
      { label: "Refund Policy", to: "/" },
      { label: "Terms & Conditions", to: "/terms-and-conditions" },
      { label: "Cookie Policy", to: "/" },
    ],
  },
];

const socials = [
  { label: "Instagram", Icon: Instagram },
  { label: "X", Icon: Twitter },
  { label: "YouTube", Icon: Youtube },
  { label: "LinkedIn", Icon: Linkedin },
];

function FooterLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 py-1.5 text-sm text-foreground/55 transition-all hover:translate-x-1 hover:text-foreground"
    >
      <span className="size-1 rounded-full bg-primary opacity-0 transition-opacity group-hover:opacity-100" />
      {label}
    </Link>
  );
}

export function SiteFooter() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <footer className="relative overflow-hidden pt-28 lg:pt-40">
      {/* warm studio light, upper-middle / slightly right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-[58%] h-[560px] w-[1100px] -translate-x-1/2 opacity-70 blur-[120px]"
        style={{
          background:
            "radial-gradient(ellipse 52% 50% at 50% 45%, oklch(0.58 0.16 45 / 55%) 0%, oklch(0.34 0.1 40 / 32%) 45%, transparent 78%)",
        }}
      />
      {/* descent into black */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, oklch(0.13 0.012 60 / 30%) 45%, oklch(0.09 0.008 60 / 92%) 78%, oklch(0.07 0.006 60) 100%)",
        }}
      />
      {/* fine grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='120' height='120' filter='url(%23n)'/></svg>\")",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-14">
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-full border border-border bg-background/40">
                <Shield className="size-4 text-primary" />
              </span>
              <span className="font-display text-lg tracking-tight text-foreground">Jays Vault</span>
            </div>

            <p className="mt-8 font-display text-xl font-light leading-snug text-foreground/90">
              Digital resources.
              <br />
              Built to move ideas forward.
            </p>
            <p className="mt-5 max-w-xs text-xs leading-relaxed text-muted-foreground">
              Discover premium templates, tools, courses, prompts and resources designed to help you
              create faster.
            </p>

            <div className="mt-9 flex gap-2.5">
              {socials.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-full border border-border text-foreground/50 transition-all hover:border-primary hover:text-primary hover:shadow-[0_0_20px_-6px_var(--primary)]"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>

            <p className="mt-10 text-[11px] text-muted-foreground/70">
              © {new Date().getFullYear()} Jays Vault. All rights reserved.
            </p>
          </div>

          {/* NAV COLUMNS — desktop */}
          {groups.map((g) => (
            <div key={g.heading} className="hidden lg:block">
              <h3 className="text-[11px] uppercase tracking-[0.2em] text-foreground/80">
                {g.heading}
              </h3>
              <div className="mt-6 flex flex-col items-start">
                {g.links.map((l) => (
                  <FooterLink key={l.label} {...l} />
                ))}
              </div>
            </div>
          ))}

          {/* NAV ACCORDION — mobile */}
          <div className="lg:hidden">
            {groups.map((g) => {
              const isOpen = openGroup === g.heading;
              return (
                <div key={g.heading} className="border-t border-border">
                  <button
                    onClick={() => setOpenGroup(isOpen ? null : g.heading)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-5 text-left"
                  >
                    <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/80">
                      {g.heading}
                    </span>
                    {isOpen ? (
                      <Minus className="size-4 text-primary" />
                    ) : (
                      <Plus className="size-4 text-foreground/50" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="flex flex-col items-start pb-5">
                      {g.links.map((l) => (
                        <FooterLink key={l.label} {...l} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* GIANT GHOSTED WORDMARK */}
      <div aria-hidden className="relative mt-20 select-none overflow-hidden lg:mt-28">
        <p
          className="whitespace-nowrap text-center font-display text-[11vw] font-semibold leading-[0.95] tracking-[0.03em]"
          style={{
            backgroundImage:
              "linear-gradient(to bottom, oklch(0.62 0.12 45 / 22%) 0%, oklch(0.35 0.07 42 / 12%) 45%, oklch(0.07 0.006 60 / 0%) 92%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          JAYS VAULT
        </p>
      </div>
    </footer>
  );
}
