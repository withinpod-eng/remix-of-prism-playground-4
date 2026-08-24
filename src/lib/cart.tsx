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
  /** Digital licences are sold one per purchase. */
  quantity: number;
  unitPrice: number;
};

type Coupon = { code: string; percentOff: number };

const COUPONS: Coupon[] = [{ code: "WELCOME10", percentOff: 10 }];

export const priceToNumber = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

export const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

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
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  setQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => { ok: boolean; message: string };
  removeCoupon: () => void;
  hydrated: boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

type StoredState = { slugs: { slug: string; quantity: number }[]; coupon: string | null };

function readStorage(): StoredState {
  if (typeof window === "undefined") return { slugs: [], coupon: null };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { slugs: [], coupon: null };
    const parsed = JSON.parse(raw) as StoredState;
    return {
      slugs: Array.isArray(parsed.slugs) ? parsed.slugs : [],
      coupon: parsed.coupon ?? null,
    };
  } catch {
    return { slugs: [], coupon: null };
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<{ slug: string; quantity: number }[]>([]);
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
      entries.flatMap((entry) => {
        const product = products.find((p) => p.slug === entry.slug);
        if (!product) return [];
        return [
          {
            slug: entry.slug,
            product,
            quantity: entry.quantity,
            unitPrice: priceToNumber(product.price),
          },
        ];
      }),
    [entries],
  );

  const subtotal = items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  const coupon = COUPONS.find((c) => c.code === couponCode) ?? null;
  const discount = coupon ? Math.round(subtotal * coupon.percentOff) / 100 : 0;
  const total = Math.max(0, subtotal - discount);

  const addItem = useCallback((slug: string) => {
    setEntries((prev) =>
      prev.some((e) => e.slug === slug) ? prev : [...prev, { slug, quantity: 1 }],
    );
  }, []);

  const removeItem = useCallback((slug: string) => {
    setEntries((prev) => prev.filter((e) => e.slug !== slug));
  }, []);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.slug === slug ? { ...e, quantity: Math.max(1, quantity) } : e)),
    );
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
    addItem,
    removeItem,
    setQuantity,
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
