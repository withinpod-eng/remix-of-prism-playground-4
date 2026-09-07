import { useEffect, useRef, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronDown,
  Heart,
  Menu,
  Search,
  Shield,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useSession } from "@/hooks/useSession";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/utils";

type NavLink = { label: string; to: string; match: (path: string) => boolean };

const primaryLinks: NavLink[] = [
  { label: "Home", to: "/", match: (p) => p === "/" },
  { label: "Products", to: "/products", match: (p) => p.startsWith("/products") },
  { label: "About", to: "/about", match: (p) => p.startsWith("/about") },
];

const moreLinks = [
  { label: "Contact", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const { session } = useSession();
  const { count, hydrated } = useCart();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const moreActive = moreLinks.some((l) => pathname.startsWith(l.to));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMoreOpen(false);
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMoreOpen(false);
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [moreOpen]);

  const itemBase =
    "relative rounded-full px-3 py-2 text-[13.5px] font-medium transition-all duration-200 md:px-3.5 lg:px-4";
  const itemIdle = "text-foreground/60 hover:bg-foreground/5 hover:text-foreground";
  const itemActive =
    "text-primary-foreground shadow-[0_6px_18px_-8px_var(--primary)] bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))]";

  return (
    <div className="sticky top-3 z-50 md:top-5">
      <div className="pointer-events-none absolute inset-x-0 -top-6 mx-auto h-28 max-w-3xl bg-[radial-gradient(ellipse_at_center,oklch(0.68_0.19_48/22%),transparent_70%)] blur-2xl" />

      <header
        className={cn(
          "relative mx-auto w-[calc(100%-24px)] max-w-[1400px] rounded-[22px] border transition-all duration-300 md:w-[calc(100%-48px)]",
          scrolled
            ? "border-border bg-background/85 shadow-[0_24px_60px_-30px_oklch(0_0_0/90%)] backdrop-blur-2xl"
            : "border-border/60 bg-background/55 shadow-[0_18px_50px_-34px_oklch(0_0_0/80%)] backdrop-blur-xl",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-4 px-4 transition-all duration-300 md:px-5",
            scrolled ? "h-[62px] md:h-[66px]" : "h-[66px] md:h-[74px]",
          )}
        >
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-all duration-200 hover:brightness-125 hover:drop-shadow-[0_0_12px_oklch(0.68_0.19_48/45%)]"
            aria-label="Jays Vault home"
          >
            <span className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10">
              <Shield className="size-4 text-primary" />
            </span>
            <span className="font-display text-base tracking-tight text-foreground">Jays Vault</span>
          </Link>

          {/* Center pill navigation — desktop & tablet only */}
          <nav
            aria-label="Primary navigation"
            className="hidden items-center rounded-full border border-border/70 bg-foreground/[0.035] p-1 md:flex"
          >
            {primaryLinks.map((l) => {
              const active = l.match(pathname);
              return (
                <Link
                  key={l.label}
                  to={l.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(itemBase, active ? itemActive : itemIdle)}
                >
                  {l.label}
                </Link>
              );
            })}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={moreOpen}
                onClick={() => setMoreOpen((v) => !v)}
                className={cn(itemBase, "flex items-center gap-1", moreActive ? itemActive : itemIdle)}
              >
                More
                <ChevronDown
                  className={cn("size-3.5 transition-transform duration-200", moreOpen && "rotate-180")}
                />
              </button>

              {moreOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] w-52 animate-in fade-in slide-in-from-top-1 rounded-2xl border border-border bg-card/95 p-2 shadow-[0_30px_70px_-30px_oklch(0_0_0/85%)] backdrop-blur-xl duration-200"
                >
                  {moreLinks.map((l) => (
                    <Link
                      key={l.to}
                      to={l.to}
                      role="menuitem"
                      className="block rounded-xl px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-primary/10 hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            {[
              { label: "Search", Icon: Search },
              { label: "Wishlist", Icon: Heart },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="hidden size-10 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground/60 transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-primary lg:flex"
              >
                <Icon className="size-4" />
              </button>
            ))}

            <Link
              to={session ? "/account" : "/login"}
              aria-label={session ? "Your account" : "Account sign in"}
              className={cn(
                "hidden size-10 items-center justify-center rounded-full border bg-foreground/[0.04] transition-colors md:flex",
                session
                  ? "border-primary/50 text-primary"
                  : "border-border text-foreground/60 hover:border-primary/40 hover:text-primary",
              )}
            >
              <User className="size-4" />
            </Link>

            <Link
              to="/cart"
              aria-label={hydrated && count > 0 ? `Cart, ${count} items` : "Cart"}
              className="relative flex size-10 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground/60 transition-colors hover:border-primary/40 hover:text-primary"
            >
              <ShoppingBag className="size-4" />
              {hydrated && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex min-w-4.5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>

            <Link
              to="/products"
              className="group hidden h-11 items-center gap-2 rounded-full bg-[linear-gradient(135deg,var(--primary),var(--primary-glow))] px-4 text-sm font-semibold text-primary-foreground shadow-[0_10px_28px_-14px_var(--primary)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_-14px_var(--primary)] motion-reduce:hover:translate-y-0 md:inline-flex lg:px-5"
            >
              <span className="hidden lg:inline">Explore Products</span>
              <span className="lg:hidden">Explore</span>
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
            </Link>

            {/* Mobile trigger */}
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex size-10 items-center justify-center rounded-full border border-border bg-foreground/[0.04] text-foreground/70 transition-colors hover:border-primary/40 hover:text-primary md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border px-4 py-3 md:hidden">
            <ul className="flex flex-col">
              {[...primaryLinks.map((l) => ({ label: l.label, to: l.to })), ...moreLinks].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="block rounded-xl px-2 py-3 text-sm text-foreground/75 transition-colors hover:text-primary"
                    aria-current={pathname === l.to ? "page" : undefined}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to={session ? "/account" : "/login"}
                  className="block rounded-xl px-2 py-3 text-sm text-foreground/75 transition-colors hover:text-primary"
                >
                  {session ? "Account" : "Sign in"}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}
