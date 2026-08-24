import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products, type Product } from "@/data/products";

const STORAGE_KEY = "jays-vault-cart";

export type CartLine = {
  slug: string;
  product: Product;
  /** Digital licences are sold one per account — no quantities. */
  unitPrice: number;
};

type Coupon = { code: string; percentOff: number };

const COUPONS: Coupon[] = [{ code: "WELCOME10", percentOff: 10 }];

/** Keep money in whole cents while calculating, format only at the edge. */
const toCents = (value: number) => Math.round(value * 100);
const fromCents = (cents: number) => cents / 100;

export const priceToNumber = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

export const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

/** Short, digital-product specific access line shown in the cart row. */
export function accessLabel(product: Product) {
  switch (product.category) {
    case "AI Prompts":
      return "AI Prompts • Digital download";
    case "Ebooks":
      return "Ebook • Instant PDF access";
    case "Canva Templates":
      return "Canva Templates • Instant access";
    case "Notion Templates":
      return "Notion Template • Instant access";
    case "Digital Courses":
      return "Course • Account access";
    case "UI Kits":
      return "UI Kit • Figma + code files";
    default:
      return `${product.category} • Digital download`;
  }
}

type CartContextValue = {
  items: CartLine[];
  count: number;
  subtotal: number;
  discount: number;
  total: number;
  coupon: Coupon | null;
  has: (slug: string) => boolean;
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  removeMany: (slugs: string[]) => void;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

type StoredState = { slugs: (string | { slug: string })[]; coupon: string | null };

function readStorage(): { slugs: string[]; coupon: string | null } {
  if (typeof window === "undefined") return { slugs: [], coupon: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { slugs: [], coupon: null };
    const parsed = JSON.parse(raw) as StoredState;
    const slugs = Array.isArray(parsed.slugs)
      ? parsed.slugs.map((entry) => (typeof entry === "string" ? entry : entry?.slug)).filter(Boolean)
      : [];
    return { slugs: Array.from(new Set(slugs as string[])), coupon: parsed.coupon ?? null };
  } catch {
    return { slugs: [], coupon: null };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readStorage();
    setEntries(stored.slugs);
    setCouponCode(stored.coupon);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ slugs: entries, coupon: couponCode } satisfies StoredState),
    );
  }, [entries, couponCode, hydrated]);

  const items = useMemo<CartLine[]>(
    () =>
      entries.flatMap((slug) => {
        const product = products.find((p) => p.slug === slug);
        if (!product) return [];
        return [{ slug, product, unitPrice: priceToNumber(product.price) }];
      }),
    [entries],
  );

  const subtotalCents = items.reduce((sum, line) => sum + toCents(line.unitPrice), 0);
  const coupon = COUPONS.find((c) => c.code === couponCode) ?? null;
  const discountCents = coupon ? Math.round((subtotalCents * coupon.percentOff) / 100) : 0;
  const totalCents = Math.max(0, subtotalCents - discountCents);

  const subtotal = fromCents(subtotalCents);
  const discount = fromCents(discountCents);
  const total = fromCents(totalCents);

  const addItem = useCallback((slug: string) => {
    setEntries((prev) => (prev.includes(slug) ? prev : [...prev, slug]));
  }, []);

  const removeItem = useCallback((slug: string) => {
    setEntries((prev) => prev.filter((s) => s !== slug));
  }, []);

  const removeMany = useCallback((slugs: string[]) => {
    if (slugs.length === 0) return;
    setEntries((prev) => prev.filter((s) => !slugs.includes(s)));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  const applyCoupon = useCallback((code: string) => {
    const normalized = code.trim().toUpperCase();
    const match = COUPONS.find((c) => c.code === normalized);
    if (!match) return { ok: false, message: "That code isn't valid." };
    setCouponCode(match.code);
    return { ok: true, message: `${match.code} applied — ${match.percentOff}% off.` };
  }, []);

  const removeCoupon = useCallback(() => setCouponCode(null), []);

  const value: CartContextValue = {
    items,
    count: items.length,
    subtotal,
    discount,
    total,
    coupon,
    has: (slug: string) => entries.includes(slug),
    addItem,
    removeItem,
    removeMany,
    clear,
    applyCoupon,
    removeCoupon,
    hydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
