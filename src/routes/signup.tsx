import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";

const TITLE = "Create Account | Join Jays Vault";
const DESCRIPTION =
  "Create your Jays Vault account to organize purchases, manage downloads, and access your digital resources in one place.";

export const Route = createFileRoute("/signup")({
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
  component: () => <AuthShell initialMode="signup" />,
});
