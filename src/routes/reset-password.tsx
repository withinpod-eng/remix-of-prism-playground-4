import { createFileRoute } from "@tanstack/react-router";
import { AuthShell } from "@/components/auth/AuthShell";

const TITLE = "Create New Password | Jays Vault";
const DESCRIPTION =
  "Set a new password for your Jays Vault account and continue accessing your digital resources securely.";

export const Route = createFileRoute("/reset-password")({
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
  component: () => <AuthShell initialMode="reset" />,
});
