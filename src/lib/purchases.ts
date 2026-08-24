import { supabase } from "@/integrations/supabase/client";
import { products, type Product } from "@/data/products";

export type PurchaseStatus = "available" | "pending" | "processing" | "revoked";

export type PurchaseRow = {
  id: string;
  product_slug: string;
  product_title: string;
  product_category: string;
  unit_price: number;
  status: PurchaseStatus;
  order_reference: string | null;
  purchased_at: string;
};

export type Purchase = PurchaseRow & { product: Product | undefined };

const bySlug = new Map(products.map((p) => [p.slug, p]));

/** Delivery method differs per product type — never force everything into "Download". */
export function deliveryAction(category: string): { label: string; kind: "download" | "access" } {
  switch (category) {
    case "Ebooks":
      return { label: "Download", kind: "download" };
    case "Canva Templates":
      return { label: "Access Template", kind: "access" };
    case "Notion Templates":
      return { label: "Duplicate Template", kind: "access" };
    case "Digital Courses":
      return { label: "Start Course", kind: "access" };
    default:
      return { label: "Download", kind: "download" };
  }
}

export function deliveryType(category: string) {
  switch (category) {
    case "Digital Courses":
      return "Course access";
    case "Canva Templates":
      return "Canva template";
    case "Notion Templates":
      return "Notion template";
    default:
      return "Digital download";
  }
}

export function formatPurchaseDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export async function fetchPurchases(userId: string): Promise<Purchase[]> {
  const { data, error } = await supabase
    .from("purchases")
    .select("id, product_slug, product_title, product_category, unit_price, status, order_reference, purchased_at")
    .eq("user_id", userId)
    .order("purchased_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => ({
    ...(row as unknown as PurchaseRow),
    product: bySlug.get(row.product_slug),
  }));
}
