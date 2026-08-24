import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, LogOut, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { fetchPurchases } from "@/lib/purchases";

const TITLE = "Your Account | Jays Vault";
const DESCRIPTION =
  "Manage your Jays Vault details and access every digital product you've purchased.";

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
        .select("full_name, created_at")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: purchases } = useQuery({
    queryKey: ["purchases", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => fetchPurchases(user!.id),
  });

  const displayName =
    profile?.full_name ?? (user?.user_metadata?.["full_name"] as string | undefined) ?? "";
  const firstName = displayName.trim().split(" ")[0];

  const handleSignOut = async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="relative min-h-screen bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 -top-56 size-[44rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_68%)] blur-3xl" />
        <div className="absolute left-1/2 top-24 size-[30rem] -translate-x-1/2 rounded-full border border-primary/10" />
        <div className="absolute left-1/2 top-40 size-[46rem] -translate-x-1/2 rounded-full border border-primary/[0.06]" />
      </div>

      <div className="relative">
        <SiteNav />

        <main className="mx-auto max-w-6xl px-6 pb-28 pt-12 lg:px-8 lg:pt-16">
          <Reveal>
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.32em] text-primary/80">
                Account / Your Vault
              </p>
              <h1 className="mt-4 font-display text-4xl tracking-tight text-foreground sm:text-5xl">
                Welcome back{firstName ? `, ${firstName}` : ""}.
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
                Manage your details and access the digital products you've purchased.
              </p>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="uppercase tracking-[0.24em] text-foreground/50">Account</span>
              <span className="text-foreground/80">{user?.email}</span>
              {profile?.created_at && (
                <span>
                  Member since{" "}
                  {new Date(profile.created_at).toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              )}
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-primary"
              >
                <LogOut className="size-3.5" />
                Sign out
              </button>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 lg:grid-cols-5">
            <Reveal delay={140} className="order-2 lg:order-1 lg:col-span-2">
              <MyDetailsCard
                userId={user?.id ?? ""}
                email={user?.email ?? ""}
                name={displayName}
              />
            </Reveal>
            <Reveal delay={200} className="order-1 lg:order-2 lg:col-span-3">
              <MyPurchasesCard count={purchases?.length} />
            </Reveal>
          </div>
        </main>

        <SiteFooter />
      </div>
    </div>
  );
}

const cardClass =
  "relative h-full overflow-hidden rounded-[28px] border border-border bg-card/70 p-7 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] backdrop-blur-sm sm:p-9";

function EdgeLight() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-10 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"
    />
  );
}

function MyDetailsCard({
  userId,
  email,
  name,
}: {
  userId: string;
  email: string;
  name: string;
}) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!editing) setValue(name);
  }, [name, editing]);

  const cancel = () => {
    setEditing(false);
    setError(null);
    setValue(name);
  };


  const mutation = useMutation({
    mutationFn: async (fullName: string) => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: async () => {
      setEditing(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 3000);
      await queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return (
    <section className={cardClass} aria-labelledby="my-details-heading">
      <EdgeLight />
      <h2 id="my-details-heading" className="font-display text-2xl tracking-tight text-foreground">
        My Details
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Review the information associated with your Jays Vault account.
      </p>

      <div className="mt-8 space-y-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Name</p>
          {editing ? (
            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                const parsed = nameSchema.safeParse(value);
                if (!parsed.success) {
                  setError(parsed.error.issues[0]?.message ?? "Invalid name.");
                  return;
                }
                setError(null);
                mutation.mutate(parsed.data);
              }}
            >
              <input
                autoFocus
                value={value}
                maxLength={100}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") cancel();
                }}
                aria-label="Your name"
                aria-invalid={Boolean(error)}
                className="w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-[15px] text-foreground outline-none transition-colors focus:border-primary aria-[invalid=true]:border-destructive"
              />
              <div className="mt-3 flex items-center gap-4">
                <button
                  type="submit"
                  disabled={mutation.isPending || !value.trim()}
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {mutation.isPending ? "Saving…" : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={cancel}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
              {(error || mutation.isError) && (
                <p className="mt-3 text-sm text-destructive">
                  {error ?? "Couldn't save. Please try again."}
                </p>
              )}
            </form>
          ) : (
            <>
              <p className="mt-2 text-[17px] text-foreground">{name || "Not set"}</p>
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground/80 transition-colors hover:border-primary hover:text-primary"
              >
                <Pencil className="size-3.5" />
                Edit Name
              </button>
              {saved && (
                <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-primary">
                  <Check className="size-3.5" />
                  Name updated successfully.
                </p>
              )}
            </>
          )}
        </div>

        <div className="border-t border-border/70 pt-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">Email</p>
          <p className="mt-2 break-all text-[17px] text-foreground">{email}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            Used for account access and purchase delivery where applicable.
          </p>
        </div>
      </div>
    </section>
  );
}

function MyPurchasesCard({ count }: { count: number | undefined }) {
  return (
    <section className={cardClass} aria-labelledby="my-purchases-heading">
      <EdgeLight />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_70%)] blur-2xl"
      />
      <div className="relative">
        <h2
          id="my-purchases-heading"
          className="font-display text-2xl tracking-tight text-foreground"
        >
          My Purchases
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Access the digital products you've purchased from Jays Vault.
        </p>

        <p className="mt-10 font-display text-5xl tracking-tight text-foreground">
          {count ?? "—"}
          <span className="ml-3 align-middle text-sm tracking-normal text-muted-foreground">
            {count === 1 ? "product" : "products"}
          </span>
        </p>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Your purchased resources are all available here, ready whenever you need them.
        </p>

        <Link
          to="/my-products"
          className="group mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-[0_18px_40px_-22px_color-mix(in_oklab,var(--primary)_90%,transparent)] transition-transform hover:-translate-y-0.5 motion-reduce:transform-none"
        >
          View My Purchases
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
        </Link>
      </div>
    </section>
  );
}
