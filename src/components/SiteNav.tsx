import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, Shield, User, X } from "lucide-react";

const links = [
  { label: "Shop", to: "/products" },
  { label: "Categories", to: "/products" },
  { label: "Bundles", to: "/products" },
  { label: "Freebies", to: "/products" },
  { label: "About", to: "/about" },
  { label: "Blog", to: "/" },
];

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50">
      <div
        className={
          "transition-colors duration-300 " +
          (scrolled
            ? "border-b border-border bg-background/70 backdrop-blur-xl"
            : "border-b border-transparent")
        }
      >
        <nav
          aria-label="Main"
          className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-6 lg:px-8"
        >
          <Link to="/" className="flex items-center gap-3" aria-label="Jays Vault home">
            <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background/50">
              <Shield className="size-4 text-primary" />
            </span>
            <span className="font-display text-base tracking-tight text-foreground">Jays Vault</span>
          </Link>

          <ul className="hidden items-center gap-8 text-sm text-foreground/70 lg:flex">
            {links.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="transition-colors hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            {[
              { label: "Search", Icon: Search },
              { label: "Wishlist", Icon: Heart },
            ].map(({ label, Icon }) => (
              <button
                key={label}
                type="button"
                aria-label={label}
                className="hidden size-11 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary hover:text-primary sm:flex"
              >
                <Icon className="size-4" />
              </button>
            ))}
            <Link
              to="/login"
              aria-label="Account sign in"
              className="hidden size-11 items-center justify-center rounded-full border border-border text-foreground/60 transition-colors hover:border-primary hover:text-primary sm:flex"
            >
              <User className="size-4" />
            </Link>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-foreground/70 transition-colors hover:border-primary hover:text-primary lg:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>

        {open && (
          <div className="border-t border-border bg-background/95 px-6 py-4 backdrop-blur-xl lg:hidden">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-sm text-foreground/75 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
