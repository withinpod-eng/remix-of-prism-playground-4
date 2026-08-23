import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, LogOut, Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

const TITLE = "Your Account | Jays Vault";
const DESCRIPTION =
  "Manage your Jays Vault account, review your profile details, and access your digital product library.";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccountPage,
});

function AccountPage() {
  const { user } = useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  const displayName =
    profile?.full_name ?? (user?.user_metadata?.["full_name"] as string | undefined) ?? "Member";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-glow opacity-60" />
      <div className="relative mx-auto max-w-3xl px-6 py-14">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Jays Vault home">
            <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60">
              <Shield className="size-4 text-primary" />
            </span>
            <span className="font-display text-base tracking-tight text-foreground">Jays Vault</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>

        <h1 className="mt-12 font-display text-4xl tracking-tight text-foreground">
          Welcome back, {displayName}.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          Your vault is where every purchase, download, and resource stays organized.
        </p>

        <dl className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Name</dt>
            <dd className="mt-2 text-[15px] text-foreground">{displayName}</dd>
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-5">
            <dt className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</dt>
            <dd className="mt-2 break-all text-[15px] text-foreground">{user?.email}</dd>
          </div>
        </dl>

        <div className="mt-10 rounded-2xl border border-border bg-card/60 p-6">
          <h2 className="font-display text-xl text-foreground">Your library</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Purchases you make will appear here, ready to download any time.
          </p>
          <Link
            to="/products"
            className="group mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary"
          >
            Browse the store
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
          </Link>
        </div>
      </div>
    </div>
  );
}
