import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/hooks/useSession";

/**
 * Slugs the signed-in user already owns. Digital products are one-time
 * purchases, so an owned product can never be bought again.
 */
export function useOwnedProducts() {
  const { user, loading: sessionLoading } = useSession();
  const [owned, setOwned] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) {
      setOwned(new Set());
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await supabase
      .from("purchases")
      .select("product_slug")
      .eq("user_id", user.id);
    if (!error) setOwned(new Set((data ?? []).map((r) => r.product_slug)));
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (sessionLoading) return;
    void load();
  }, [sessionLoading, load]);

  return {
    owned,
    loading: sessionLoading || loading,
    isOwned: (slug: string) => owned.has(slug),
    refresh: load,
  };
}
