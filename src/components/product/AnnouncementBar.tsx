import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/** Thin copper information strip above the product hero. */
export function AnnouncementBar() {
  return (
    <div className="border-b border-primary/25 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent">
      <Link
        to="/products"
        className="group mx-auto flex max-w-7xl items-center justify-center gap-2 px-5 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/85 transition-colors hover:text-primary sm:text-[11px]"
      >
        Instant digital access • Shop the Vault
        <ArrowRight className="size-3.5 text-primary transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
