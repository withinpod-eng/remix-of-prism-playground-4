import catTemplates from "@/assets/cat-templates.jpg";
import catPresets from "@/assets/cat-presets.jpg";
import catToolkits from "@/assets/cat-toolkits.jpg";
import catFonts from "@/assets/cat-fonts.jpg";
import cat3d from "@/assets/cat-3d.jpg";
import catAudio from "@/assets/cat-audio.jpg";

export type Product = {
  slug: string;
  title: string;
  price: string;
  description: string;
  tags: string[];
  image: string;
  category: string;
};

export const categories = [
  "All Products",
  "AI Prompts",
  "Ebooks",
  "Canva Templates",
  "Notion Templates",
  "Digital Courses",
  "Design Assets",
  "Marketing Kits",
  "Website Templates",
  "UI Kits",
  "Spreadsheet Resources",
] as const;

const baseProducts: Omit<Product, "slug">[] = [
  {
    title: "Neon UI Kit",
    price: "$49",
    description:
      "A complete neon-styled interface kit with 220+ components, ready for Figma and code.",
    tags: ["Top Rated", "Instant download"],
    image: catTemplates,
    category: "UI Kits",
  },
  {
    title: "Film Grade LUTs",
    price: "$29",
    description:
      "Cinematic color presets built for moody, warm footage across every major editor.",
    tags: ["Best Seller", "42 presets"],
    image: catPresets,
    category: "Design Assets",
  },
  {
    title: "Creator Toolkit",
    price: "$79",
    description:
      "Everything a creator needs: templates, overlays, hooks and launch checklists.",
    tags: ["Bundle", "Lifetime updates"],
    image: catToolkits,
    category: "Marketing Kits",
  },
  {
    title: "Display Font Pack",
    price: "$34",
    description: "Six expressive display faces with full Latin coverage and variable weights.",
    tags: ["New", "6 families"],
    image: catFonts,
    category: "Design Assets",
  },
  {
    title: "3D Asset Vault",
    price: "$89",
    description: "Studio-lit 3D props and scenes, exported for Blender, Spline and Cinema 4D.",
    tags: ["Pro", "120 assets"],
    image: cat3d,
    category: "Design Assets",
  },
  {
    title: "Audio Pack Vol. 1",
    price: "$25",
    description: "Ambient loops, risers and UI sounds mastered for short-form video and apps.",
    tags: ["Royalty free", "180 sounds"],
    image: catAudio,
    category: "Design Assets",
  },
  {
    title: "Prompt Library Pro",
    price: "$39",
    description: "900 structured AI prompts for writing, research, code and marketing workflows.",
    tags: ["Best Seller", "900 prompts"],
    image: catTemplates,
    category: "AI Prompts",
  },
  {
    title: "Notion Second Brain",
    price: "$45",
    description: "A calm Notion system for notes, projects and goals with dashboards included.",
    tags: ["Top Rated", "Notion"],
    image: catToolkits,
    category: "Notion Templates",
  },
  {
    title: "Canva Social Pack",
    price: "$27",
    description: "180 editable Canva layouts for carousels, reels covers and story sequences.",
    tags: ["New", "180 layouts"],
    image: catPresets,
    category: "Canva Templates",
  },
  {
    title: "Digital Product Playbook",
    price: "$19",
    description: "A 140-page ebook on building, pricing and launching digital products solo.",
    tags: ["Ebook", "140 pages"],
    image: catFonts,
    category: "Ebooks",
  },
  {
    title: "Landing Page Course",
    price: "$99",
    description: "Six hours of lessons on high-converting landing pages, with source files.",
    tags: ["Course", "6 hours"],
    image: cat3d,
    category: "Digital Courses",
  },
  {
    title: "Finance Tracker Suite",
    price: "$22",
    description: "Spreadsheet dashboards for revenue, expenses and runway with live charts.",
    tags: ["Sheets", "Auto formulas"],
    image: catAudio,
    category: "Spreadsheet Resources",
  },
  {
    title: "Portfolio Web Template",
    price: "$59",
    description: "A dark editorial portfolio template with case-study pages and CMS-ready code.",
    tags: ["On Sale", "Responsive"],
    image: catTemplates,
    category: "Website Templates",
  },
  {
    title: "Launch Email Kit",
    price: "$31",
    description: "24 email sequences for pre-launch, launch week and post-purchase retention.",
    tags: ["Marketing", "24 sequences"],
    image: catToolkits,
    category: "Marketing Kits",
  },
  {
    title: "Mobile UI Screens",
    price: "$54",
    description: "120 polished mobile screens covering onboarding, commerce and dashboards.",
    tags: ["Pro", "120 screens"],
    image: catPresets,
    category: "UI Kits",
  },
];

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export const products: Product[] = baseProducts.map((p) => ({ ...p, slug: slugify(p.title) }));

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

export const getRelatedProducts = (product: Product, limit = 4) =>
  products
    .filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.category === product.category) - Number(a.category === product.category))
    .slice(0, limit);
