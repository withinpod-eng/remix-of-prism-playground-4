import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock, LifeBuoy, Mail } from "lucide-react";
import { z } from "zod";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";

const TITLE = "Contact Jays Vault | Support & Help";
const DESCRIPTION =
  "Questions about an order, product access, or downloads? Message the Jays Vault support team and we'll get back to you.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const SUPPORT_EMAIL = "support@[yourdomain].com";

const REASONS = [
  "Product access",
  "Download issue",
  "Order question",
  "Refund request",
  "Technical issue",
  "Partnership",
  "Creator inquiry",
  "Other",
];

const schema = z.object({
  name: z.string().trim().nonempty({ message: "Please enter your name" }).max(80),
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  orderId: z.string().trim().max(60).optional(),
  reason: z.string().trim().nonempty({ message: "Choose a reason" }),
  message: z
    .string()
    .trim()
    .nonempty({ message: "Please write a short message" })
    .max(1500, { message: "Message must be under 1500 characters" }),
});

type Errors = Partial<Record<"name" | "email" | "orderId" | "reason" | "message", string>>;

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: delay + "ms" }}
      className={
        "transition-all duration-700 ease-out " +
        (shown ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0") +
        " " +
        className
      }
    >
      {children}
    </div>
  );
}

const fieldBase =
  "w-full rounded-xl border border-border bg-background/80 px-4 py-3 text-[15px] text-foreground placeholder:text-muted-foreground/70 outline-none transition-all duration-300 focus:border-primary/70 focus:shadow-[0_0_0_4px_oklch(0.68_0.19_48/12%)]";

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-xs font-medium tracking-wide text-foreground/70">
      {children}
      {required && <span className="ml-0.5 text-primary">*</span>}
    </label>
  );
}

function ContactPage() {
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      const next: Errors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof Errors;
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    setSent(true);
  };

  const supportItems = [
    { icon: Mail, label: "Support", body: SUPPORT_EMAIL, to: undefined as string | undefined },
    {
      icon: Clock,
      label: "Response",
      body: "We'll get back to you as soon as possible.",
      to: undefined as string | undefined,
    },
    { icon: LifeBuoy, label: "Help Center", body: "Visit FAQ", to: "/" as string | undefined },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      <main className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hero-glow absolute left-1/2 top-[-12%] h-[900px] w-[1400px] -translate-x-1/2 opacity-40 blur-[40px] md:opacity-55" />
          <div className="absolute left-1/2 top-[26%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />
          <div className="absolute left-1/2 top-[40%] hidden h-[620px] w-[620px] -translate-x-1/2 rounded-full border border-primary/10 md:block" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 md:pt-28">
          <Reveal className="text-center">
            <p className="font-mono text-[11px] tracking-[0.32em] text-primary/80">
              JAYS VAULT / SUPPORT
            </p>
            <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-[74px]">
              How can we help?
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
              Need help with an order, product access, downloads, or something else? Send us a
              message and the Jays Vault team will get back to you.
            </p>
          </Reveal>

          <Reveal delay={140} className="mt-14 md:mt-16">
            <div className="mx-auto max-w-[940px] rounded-[32px] border border-border bg-card/80 p-6 shadow-[var(--shadow-card)] backdrop-blur-xl md:p-12">
              {sent ? (
                <div className="flex flex-col items-center py-14 text-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                  <h2 className="mt-5 text-2xl font-semibold text-foreground">Message sent</h2>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                    Thanks for reaching out. The Jays Vault team will get back to you as soon as
                    possible.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSent(false)}
                    className="mt-7 rounded-full border border-border px-5 py-2.5 text-sm text-foreground/80 transition-colors hover:border-primary/50 hover:text-foreground"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <FieldLabel required>Name</FieldLabel>
                      <input
                        name="name"
                        className={fieldBase}
                        placeholder="Your full name"
                        maxLength={80}
                      />
                      {errors.name && <p className="mt-2 text-xs text-destructive">{errors.name}</p>}
                    </div>
                    <div>
                      <FieldLabel required>Email address</FieldLabel>
                      <input
                        name="email"
                        type="email"
                        className={fieldBase}
                        placeholder="you@example.com"
                        maxLength={255}
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs text-destructive">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <FieldLabel>Order ID (optional)</FieldLabel>
                    <input
                      name="orderId"
                      className={fieldBase}
                      placeholder="e.g. JV-10482"
                      maxLength={60}
                    />
                  </div>

                  <div>
                    <FieldLabel required>Reason for contacting us</FieldLabel>
                    <select name="reason" defaultValue="" className={fieldBase + " appearance-none"}>
                      <option value="" disabled>
                        Select a reason
                      </option>
                      {REASONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                    {errors.reason && (
                      <p className="mt-2 text-xs text-destructive">{errors.reason}</p>
                    )}
                  </div>

                  <div>
                    <FieldLabel required>Message</FieldLabel>
                    <textarea
                      name="message"
                      rows={6}
                      maxLength={1500}
                      className={fieldBase + " resize-y"}
                      placeholder="Tell us what you need help with..."
                    />
                    {errors.message && (
                      <p className="mt-2 text-xs text-destructive">{errors.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col items-start gap-5 pt-2 md:flex-row md:items-center md:justify-between">
                    <p className="max-w-md text-xs leading-relaxed text-muted-foreground">
                      By submitting this form, you agree that Jays Vault may use your information to
                      respond to your request.{" "}
                      <Link
                        to="/privacy-policy"
                        className="text-primary/90 underline-offset-4 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </p>
                    <button
                      type="submit"
                      className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow)] md:w-auto"
                    >
                      Send Message
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Reveal>

          <Reveal delay={220} className="mt-16">
            <div className="mx-auto grid max-w-[940px] gap-4 md:grid-cols-3">
              {supportItems.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-card/50 p-5 backdrop-blur-md"
                >
                  <item.icon className="h-4 w-4 text-primary" />
                  <p className="mt-3 font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                    {item.label.toUpperCase()}
                  </p>
                  {item.to ? (
                    <Link
                      to={item.to}
                      className="mt-1.5 block text-sm text-foreground transition-colors hover:text-primary"
                    >
                      {item.body}
                    </Link>
                  ) : (
                    <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{item.body}</p>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
