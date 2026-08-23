import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Asterisk, Eye, EyeOff, Loader2, MailCheck, Shield } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import vaultVisual from "@/assets/auth-vault-ecosystem.jpg";


export type AuthMode = "signup" | "login" | "forgot" | "reset";
type ViewMode = AuthMode | "verify" | "sent" | "updated";

const PATHS: Record<AuthMode, string> = {
  signup: "/signup",
  login: "/login",
  forgot: "/forgot-password",
  reset: "/reset-password",
};

const LEFT_COPY: Record<ViewMode, { eyebrow: string; title: string[]; body: string }> = {
  signup: {
    eyebrow: "Welcome to the vault",
    title: ["Your digital resources,", "all in one place."],
    body: "Create your account to keep purchases organized and access your Jays Vault resources from one place.",
  },
  login: {
    eyebrow: "Welcome back",
    title: ["Your vault", "is waiting."],
    body: "Sign in to access your purchases, manage your account, and continue where you left off.",
  },
  forgot: {
    eyebrow: "Account recovery",
    title: ["Get back into", "your vault."],
    body: "We'll email you a secure link so you can set a new password and pick up where you left off.",
  },
  reset: {
    eyebrow: "Account recovery",
    title: ["Set a new", "vault key."],
    body: "Choose a strong password you don't use anywhere else to keep your purchases protected.",
  },
  verify: {
    eyebrow: "Almost there",
    title: ["One click", "from the vault."],
    body: "Confirm your email address and your Jays Vault account is ready to use.",
  },
  sent: {
    eyebrow: "Account recovery",
    title: ["Check your", "inbox."],
    body: "The reset link lands in your inbox within a minute. It expires shortly after for your security.",
  },
  updated: {
    eyebrow: "All set",
    title: ["Your vault", "is secure."],
    body: "Your password has been updated. Sign in to continue exploring Jays Vault.",
  },
};

const emailSchema = z.string().trim().email({ message: "Please enter a valid email address." }).max(255);
const nameSchema = z
  .string()
  .trim()
  .nonempty({ message: "Please enter your full name." })
  .max(80, { message: "Name must be under 80 characters." });
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .max(128, { message: "Password must be under 128 characters." });

type Errors = Partial<Record<"name" | "email" | "password" | "confirm", string>>;

function Field({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  autoComplete,
  trailing,
  labelAside,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string | undefined;
  autoComplete?: string | undefined;
  trailing?: React.ReactNode;
  labelAside?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-[13px] font-medium text-secondary-foreground/80">
          {label}
        </label>
        {labelAside}
      </div>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={
            "h-13 w-full rounded-2xl border bg-background/80 px-4 pr-12 text-[15px] text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/70 focus:border-primary/65 focus:shadow-[0_0_0_4px_oklch(0.68_0.19_48/12%)] " +
            (error ? "border-destructive/70" : "border-border")
          }
        />
        {trailing ? (
          <div className="absolute inset-y-0 right-2 flex items-center">{trailing}</div>
        ) : null}
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function PasswordToggle({ shown, onToggle }: { shown: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={shown ? "Hide password" : "Show password"}
      className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {shown ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
    </button>
  );
}

function PrimaryButton({
  children,
  pending,
}: {
  children: React.ReactNode;
  pending: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-ember)] text-[15px] font-semibold text-primary-foreground shadow-[0_18px_40px_-18px_oklch(0.68_0.19_48/70%)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-18px_oklch(0.68_0.19_48/85%)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 motion-reduce:transform-none"
    >
      {pending ? <Loader2 className="size-4 animate-spin" /> : null}
      {children}
      {!pending ? (
        <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transform-none" />
      ) : null}
    </button>
  );
}

function SwitchLink({
  prompt,
  action,
  onClick,
}: {
  prompt: string;
  action: string;
  onClick: () => void;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <button
        type="button"
        onClick={onClick}
        className="font-medium text-primary underline-offset-4 transition-colors hover:text-primary-glow hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {action}
      </button>
    </p>
  );
}

export function AuthShell({ initialMode }: { initialMode: AuthMode }) {
  const [view, setView] = useState<ViewMode>(initialMode);
  const [animKey, setAnimKey] = useState(0);
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const liveRef = useRef<HTMLParagraphElement>(null);
  const navigate = useNavigate();

  useEffect(() => setView(initialMode), [initialMode]);


  const go = (next: ViewMode) => {
    setErrors({});
    setFormError(null);
    setView(next);
    setAnimKey((k) => k + 1);
    const path = PATHS[next as AuthMode];
    if (path && typeof window !== "undefined") {
      window.history.replaceState(null, "", path);
    }
  };

  const left = LEFT_COPY[view];

  const heading = useMemo(() => {
    switch (view) {
      case "signup":
        return {
          title: "Create an account",
          body: "Save your purchases, organize your digital resources, and access your Jays Vault account from one place.",
        };
      case "login":
        return {
          title: "Welcome back",
          body: "Sign in to access your purchases, manage your resources, and continue exploring Jays Vault.",
        };
      case "forgot":
        return {
          title: "Reset your password",
          body: "Enter the email connected to your Jays Vault account and we'll send you a password reset link.",
        };
      case "reset":
        return {
          title: "Create a new password",
          body: "Choose a new password for your Jays Vault account. You'll use it the next time you sign in.",
        };
      case "verify":
        return {
          title: "Check your email",
          body: "We've sent a verification link to your email address. Open it to activate your Jays Vault account.",
        };
      case "sent":
        return {
          title: "Reset link sent",
          body: "If an account exists for that email, a password reset link is on its way.",
        };
      default:
        return {
          title: "Password updated",
          body: "Your password has been changed. Sign in to get back into your vault.",
        };
    }
  }, [view]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};

    if (view === "signup") {
      const n = nameSchema.safeParse(name);
      if (!n.success) next.name = n.error.issues[0]?.message ?? "Please enter your full name.";
    }
    if (view === "signup" || view === "login" || view === "forgot") {
      const m = emailSchema.safeParse(email);
      if (!m.success) next.email = m.error.issues[0]?.message ?? "Please enter a valid email address.";
    }
    if (view === "signup" || view === "login" || view === "reset") {
      const p = passwordSchema.safeParse(password);
      if (!p.success) next.password = p.error.issues[0]?.message ?? "Password must be at least 8 characters.";
    }
    if (view === "reset" && confirm !== password) {
      next.confirm = "Passwords don't match.";
    }

    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setPending(true);
    try {
      if (view === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/account`,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        setPassword("");
        go("verify");
      } else if (view === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setPassword("");
        navigate({ to: "/account", replace: true });
      } else if (view === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        go("sent");
      } else {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setPassword("");
        setConfirm("");
        go("updated");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setFormError(message);
      if (liveRef.current) liveRef.current.textContent = message;
    } finally {
      setPending(false);
    }
  };

  const onGoogle = async () => {
    setFormError(null);
    setPending(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) {
        setFormError("Google sign-in didn't complete. Please try again.");
        return;
      }
      if (result.redirected) return;
      navigate({ to: "/account", replace: true });
    } finally {
      setPending(false);
    }
  };

  const isFormView = view === "signup" || view === "login" || view === "forgot" || view === "reset";


  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* atmosphere */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hero-glow opacity-70"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 size-[46rem] rounded-full bg-primary/12 blur-[160px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 size-[32rem] rounded-full bg-chart-4/20 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22/></filter><rect width=%22140%22 height=%22140%22 filter=%22url(%23n)%22/></svg>')]"
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1320px] flex-col px-5 py-6 sm:px-8 lg:py-10">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3" aria-label="Jays Vault home">
            <span className="flex size-9 items-center justify-center rounded-full border border-border bg-background/60">
              <Shield className="size-4 text-primary" />
            </span>
            <span className="font-display text-base tracking-tight text-foreground">Jays Vault</span>
          </Link>
          <Link
            to="/products"
            className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Back to store
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transform-none" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-8 lg:py-12">
          <section className="w-full max-w-[1240px] animate-fade-in overflow-hidden rounded-[28px] border border-border bg-card/70 shadow-[var(--shadow-card)] backdrop-blur-xl lg:rounded-[34px]">
            <div className="grid lg:min-h-[720px] lg:grid-cols-[45fr_55fr]">
              {/* LEFT — brand */}
              <div className="relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden border-b border-border bg-[#0b0910] p-7 sm:min-h-[320px] lg:min-h-0 lg:border-b-0 lg:border-r lg:p-10">
                <img
                  src={vaultVisual}
                  alt=""
                  aria-hidden
                  width={1024}
                  height={1280}
                  className="absolute inset-0 -z-10 size-full object-cover opacity-90"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_60%_at_60%_75%,oklch(0.68_0.19_48/28%),transparent_70%)]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-gradient-to-t from-[#080A16] via-[#080A16]/70 to-[#080A16]/20"
                />

                <div className="max-w-md">
                  <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-primary">
                    {left.eyebrow}
                  </p>
                  <h2 className="mt-4 font-display text-3xl leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-[44px]">
                    {left.title.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </h2>
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-secondary-foreground/75">
                    {left.body}
                  </p>
                </div>
              </div>

              {/* RIGHT — form */}
              <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-[72px] lg:py-14">
                <div key={animKey} className="w-full max-w-[440px] animate-fade-in">
                  <p ref={liveRef} className="sr-only" aria-live="polite" />

                  <span className="inline-flex size-9 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                    {view === "verify" || view === "sent" ? (
                      <MailCheck className="size-4 text-primary" />
                    ) : (
                      <Asterisk className="size-4 text-primary" />
                    )}
                  </span>

                  <h1 className="mt-6 font-display text-[32px] leading-tight tracking-tight text-foreground sm:text-[40px]">
                    {heading.title}
                  </h1>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                    {heading.body}
                  </p>

                  {isFormView ? (
                    <form onSubmit={onSubmit} noValidate className="mt-9 space-y-5">
                      {view === "signup" ? (
                        <Field
                          id="auth-name"
                          label="Full name"
                          placeholder="Enter your name"
                          autoComplete="name"
                          value={name}
                          onChange={setName}
                          error={errors.name}
                        />
                      ) : null}

                      {view !== "reset" ? (
                        <Field
                          id="auth-email"
                          label="Email address"
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          value={email}
                          onChange={setEmail}
                          error={errors.email}
                        />
                      ) : null}

                      {view === "signup" || view === "login" || view === "reset" ? (
                        <Field
                          id="auth-password"
                          label={
                            view === "signup"
                              ? "Create password"
                              : view === "reset"
                                ? "New password"
                                : "Password"
                          }
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete={view === "login" ? "current-password" : "new-password"}
                          value={password}
                          onChange={setPassword}
                          error={errors.password}
                          trailing={
                            <PasswordToggle
                              shown={showPassword}
                              onToggle={() => setShowPassword((v) => !v)}
                            />
                          }
                          labelAside={
                            view === "login" ? (
                              <button
                                type="button"
                                onClick={() => go("forgot")}
                                className="text-[13px] text-muted-foreground transition-colors hover:text-primary"
                              >
                                Forgot password?
                              </button>
                            ) : null
                          }
                        />
                      ) : null}

                      {view === "reset" ? (
                        <Field
                          id="auth-confirm"
                          label="Confirm new password"
                          type={showConfirm ? "text" : "password"}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          value={confirm}
                          onChange={setConfirm}
                          error={errors.confirm}
                          trailing={
                            <PasswordToggle
                              shown={showConfirm}
                              onToggle={() => setShowConfirm((v) => !v)}
                            />
                          }
                        />
                      ) : null}

                      {formError ? (
                        <p
                          role="alert"
                          className="rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-[13px] leading-relaxed text-destructive"
                        >
                          {formError}
                        </p>
                      ) : null}

                      <div className="pt-3">
                        <PrimaryButton pending={pending}>
                          {view === "signup"
                            ? "Create Account"
                            : view === "login"
                              ? "Sign In"
                              : view === "forgot"
                                ? "Send Reset Link"
                                : "Update Password"}
                        </PrimaryButton>
                      </div>

                      {view === "signup" || view === "login" ? (
                        <>
                          <div className="flex items-center gap-4 pt-1">
                            <span className="h-px flex-1 bg-border" />
                            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-muted-foreground/70">
                              or
                            </span>
                            <span className="h-px flex-1 bg-border" />
                          </div>
                          <button
                            type="button"
                            onClick={onGoogle}
                            disabled={pending}
                            className="inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl border border-border bg-background/70 text-[15px] font-medium text-foreground transition-colors hover:border-primary/60 hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70"
                          >
                            <svg className="size-4" viewBox="0 0 24 24" aria-hidden>
                              <path
                                fill="currentColor"
                                d="M12 11v3.2h5.3c-.2 1.4-1.6 4.1-5.3 4.1-3.2 0-5.8-2.6-5.8-5.9S8.8 6.5 12 6.5c1.8 0 3 .8 3.7 1.4l2.5-2.4C16.6 4 14.5 3 12 3 7 3 3 7 3 12s4 9 9 9c5.2 0 8.6-3.6 8.6-8.7 0-.6-.1-1-.2-1.4H12z"
                              />
                            </svg>
                            Continue with Google
                          </button>
                        </>
                      ) : null}


                      <p className="pt-1 text-center text-xs leading-relaxed text-muted-foreground/80">
                        Your account information is protected using the security measures
                        implemented by Jays Vault and its authentication providers.
                      </p>

                      <div className="pt-4">
                        {view === "signup" ? (
                          <SwitchLink
                            prompt="Already have an account?"
                            action="Sign in"
                            onClick={() => go("login")}
                          />
                        ) : view === "login" ? (
                          <SwitchLink
                            prompt="Don't have an account?"
                            action="Create one"
                            onClick={() => go("signup")}
                          />
                        ) : (
                          <SwitchLink
                            prompt="Remember your password?"
                            action="Sign in"
                            onClick={() => go("login")}
                          />
                        )}
                      </div>
                    </form>
                  ) : (
                    <div className="mt-9 space-y-5">
                      <div className="rounded-2xl border border-border bg-background/60 p-5 text-sm leading-relaxed text-secondary-foreground/80">
                        {view === "verify" || view === "sent"
                          ? "Didn't get it? Check your spam folder, or try again in a few minutes."
                          : "You can now sign in with your new password."}
                      </div>
                      <button
                        type="button"
                        onClick={() => go("login")}
                        className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[image:var(--gradient-ember)] text-[15px] font-semibold text-primary-foreground transition-all duration-200 hover:-translate-y-0.5 motion-reduce:transform-none"
                      >
                        Back to Sign In
                        <ArrowRight className="size-4" />
                      </button>
                      {view === "verify" ? (
                        <SwitchLink
                          prompt="Typed the wrong email?"
                          action="Create account again"
                          onClick={() => go("signup")}
                        />
                      ) : null}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="flex flex-col items-center justify-between gap-3 border-t border-border pt-5 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 Jays Vault</p>
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link to="/privacy-policy" className="transition-colors hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="/terms-and-conditions" className="transition-colors hover:text-primary">
              Terms &amp; Conditions
            </Link>
          </nav>
        </footer>
      </div>
    </div>
  );
}
