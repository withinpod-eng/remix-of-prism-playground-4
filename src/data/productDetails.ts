import type { Product } from "@/data/products";
import catTemplates from "@/assets/cat-templates.jpg";
import catPresets from "@/assets/cat-presets.jpg";
import catToolkits from "@/assets/cat-toolkits.jpg";
import catFonts from "@/assets/cat-fonts.jpg";
import cat3d from "@/assets/cat-3d.jpg";
import catAudio from "@/assets/cat-audio.jpg";

/**
 * Purpose-built, decision-making information for the product detail page.
 * Everything here is derived from the product's real category + tags, so no
 * fake ratings, fake review counts or invented commercial rights appear.
 */

export type ProductMeta = { label: string; value: string };
export type Highlight = { title: string; detail: string };
export type GalleryShot = { src: string; caption: string };

export type ProductDetails = {
  badge: string | null;
  highlights: Highlight[];
  includes: string[];
  meta: ProductMeta[];
  license: { title: string; summary: string };
  overview: { heading: string; paragraphs: string[] };
  audience: string[];
  faq: { q: string; a: string }[];
  gallery: GalleryShot[];
};

const galleryPool = [catTemplates, catPresets, catToolkits, catFonts, cat3d, catAudio];

const categoryCopy: Record<
  string,
  {
    includes: string[];
    meta: ProductMeta[];
    license: { title: string; summary: string };
    audience: string[];
    highlight: Highlight;
    captions: string[];
    overview: string[];
  }
> = {
  "AI Prompts": {
    includes: [
      "Structured prompt templates grouped by workflow",
      "Category index for fast lookup",
      "Quick-start usage guide (PDF)",
      "Editable source file you can extend",
    ],
    meta: [
      { label: "Format", value: "PDF + Notion copy" },
      { label: "Compatibility", value: "Any chat-based AI model" },
      { label: "Delivery", value: "Instant digital access" },
    ],
    license: {
      title: "Commercial use — single brand",
      summary:
        "Use the prompts in your own client and business work. Reselling or redistributing the prompt library itself is not permitted.",
    },
    audience: ["Creators", "Marketers", "Founders", "Writers", "Freelancers"],
    highlight: { title: "Workflow ready", detail: "Prompts written for real tasks, not demos" },
    captions: ["Prompt library", "Category index", "Prompt example", "Workflow result"],
    overview: [
      "Instead of starting from a blank prompt box, you open a library that already knows the shape of the task — research, drafting, positioning, iteration.",
      "Every prompt is written in a structured format with clear variables, so you can adapt it to your own product, voice and audience in seconds.",
    ],
  },
  Ebooks: {
    includes: [
      "Full ebook in print-ready PDF",
      "Chapter worksheets and checklists",
      "Reference summary of every framework",
      "Lifetime access to future revisions",
    ],
    meta: [
      { label: "Format", value: "PDF" },
      { label: "Compatibility", value: "Any PDF reader, desktop or mobile" },
      { label: "Delivery", value: "Instant download" },
    ],
    license: {
      title: "Personal use",
      summary:
        "The ebook is licensed for your personal reading and practice. Sharing files or republishing the content is not permitted.",
    },
    audience: ["Solo founders", "Creators", "Students", "Side-project builders"],
    highlight: { title: "Practical", detail: "Frameworks you can apply the same week" },
    captions: ["Cover", "Inside spread", "Worksheets", "Framework pages"],
    overview: [
      "A focused read built for people who want to ship, not collect theory. Each chapter ends with a concrete action rather than a summary.",
      "The worksheets turn the reading into decisions you can make about your own product, pricing and launch.",
    ],
  },
  "Canva Templates": {
    includes: [
      "Editable Canva template links",
      "Organised layout categories",
      "Font and colour setup guide",
      "Export presets for each platform",
    ],
    meta: [
      { label: "Format", value: "Canva template links" },
      { label: "Compatibility", value: "Canva Free and Canva Pro" },
      { label: "Delivery", value: "Instant access links" },
    ],
    license: {
      title: "Commercial use — single brand",
      summary:
        "Publish designs made with these templates for one brand, including client-facing content. Selling the templates as your own is not permitted.",
    },
    audience: ["Creators", "Social media managers", "Small businesses", "Coaches"],
    highlight: { title: "Fully editable", detail: "Swap colours, type and imagery in Canva" },
    captions: ["Template set", "Editing view", "Carousel layouts", "Story layouts"],
    overview: [
      "A complete visual system rather than a pile of unrelated layouts — spacing, type scale and colour behave consistently across every design.",
      "Drop in your brand palette once and the whole pack follows it, so a week of content takes an afternoon.",
    ],
  },
  "Notion Templates": {
    includes: [
      "Duplicable Notion workspace",
      "Pre-built dashboards and databases",
      "Relation and rollup setup already wired",
      "Setup walkthrough",
    ],
    meta: [
      { label: "Format", value: "Notion duplicate link" },
      { label: "Compatibility", value: "Notion Free and paid plans" },
      { label: "Delivery", value: "Instant access link" },
    ],
    license: {
      title: "Personal and internal team use",
      summary:
        "Duplicate and adapt the workspace for yourself or your team. Redistribution or resale of the template is not permitted.",
    },
    audience: ["Knowledge workers", "Freelancers", "Small teams", "Students"],
    highlight: { title: "Pre-wired", detail: "Databases, relations and views already connected" },
    captions: ["Dashboard", "Database view", "Weekly workflow", "Mobile view"],
    overview: [
      "A calm system that survives real use: capture stays fast, review stays honest, and nothing depends on you remembering a manual step.",
      "Every view exists for a reason — there are no decorative databases to maintain.",
    ],
  },
  "Digital Courses": {
    includes: [
      "Full video lesson library",
      "Downloadable source and project files",
      "Lesson notes and checklists",
      "Future lesson updates included",
    ],
    meta: [
      { label: "Format", value: "Streaming video + downloadable files" },
      { label: "Compatibility", value: "Any modern browser" },
      { label: "Delivery", value: "Account access after checkout" },
    ],
    license: {
      title: "Single-seat access",
      summary:
        "Course access is tied to your Jays Vault account. Sharing credentials or re-hosting lesson material is not permitted.",
    },
    audience: ["Designers", "Marketers", "Freelancers", "Founders"],
    highlight: { title: "Build along", detail: "Every lesson ships with the source files" },
    captions: ["Lesson player", "Curriculum", "Project files", "Finished result"],
    overview: [
      "Lessons are built around one finished outcome, so you are always producing something rather than watching a survey of a topic.",
      "The source files let you compare your work against the reference at every step.",
    ],
  },
  "UI Kits": {
    includes: [
      "Component library with variants and states",
      "Design tokens for colour, type and spacing",
      "Responsive layout examples",
      "Handoff-ready documentation",
    ],
    meta: [
      { label: "Format", value: "Figma file + code snippets" },
      { label: "Compatibility", value: "Figma, Tailwind-friendly tokens" },
      { label: "Delivery", value: "Instant download" },
    ],
    license: {
      title: "Commercial use — single brand",
      summary:
        "Ship products and client work built on the kit. Redistributing the kit or a derivative kit is not permitted.",
    },
    audience: ["Product designers", "Frontend developers", "Startup teams", "Agencies"],
    highlight: { title: "Token driven", detail: "Restyle the whole kit from one token set" },
    captions: ["Component overview", "States and variants", "Layout examples", "Tokens"],
    overview: [
      "A kit built the way production design systems are built: tokens first, components second, screens last.",
      "That means restyling for a new brand is a token change, not a redraw.",
    ],
  },
  "Website Templates": {
    includes: [
      "Complete responsive page set",
      "Clean, commented source code",
      "CMS-ready content structure",
      "Deployment instructions",
    ],
    meta: [
      { label: "Format", value: "Source code (ZIP)" },
      { label: "Compatibility", value: "Modern browsers, any static host" },
      { label: "Delivery", value: "Instant download" },
    ],
    license: {
      title: "Commercial use — single site",
      summary:
        "Launch one live site per licence, including for a client. Reselling the template files is not permitted.",
    },
    audience: ["Freelancers", "Studios", "Founders", "Developers"],
    highlight: { title: "Production ready", detail: "Responsive, accessible and deployable" },
    captions: ["Home page", "Case study page", "Mobile layout", "Code structure"],
    overview: [
      "A template written the way you would write it yourself — readable structure, sensible naming and no framework lock-in surprises.",
      "Replace the content, adjust the tokens and it is ready to ship.",
    ],
  },
  "Marketing Kits": {
    includes: [
      "Campaign frameworks and sequences",
      "Editable copy templates",
      "Launch checklist and timeline",
      "Measurement and reporting sheet",
    ],
    meta: [
      { label: "Format", value: "Docs + spreadsheet templates" },
      { label: "Compatibility", value: "Google Workspace, Notion, Office" },
      { label: "Delivery", value: "Instant download" },
    ],
    license: {
      title: "Commercial use — single brand",
      summary:
        "Run these campaigns for your own brand or a client engagement. Packaging the kit for resale is not permitted.",
    },
    audience: ["Marketers", "Founders", "Agencies", "Creators"],
    highlight: { title: "Campaign ready", detail: "Sequences with timing and copy included" },
    captions: ["Campaign map", "Email sequences", "Checklists", "Reporting sheet"],
    overview: [
      "A launch is a sequence of small, timed decisions. This kit writes that sequence down so nothing gets improvised at the worst moment.",
      "Copy templates are starting points with the structure already solved.",
    ],
  },
  "Spreadsheet Resources": {
    includes: [
      "Pre-built dashboards with live charts",
      "Automatic formulas and validation",
      "Sample data you can safely delete",
      "Usage instructions tab",
    ],
    meta: [
      { label: "Format", value: "Google Sheets + XLSX" },
      { label: "Compatibility", value: "Google Sheets, Excel, Numbers" },
      { label: "Delivery", value: "Instant download" },
    ],
    license: {
      title: "Personal and internal business use",
      summary: "Use the sheets for your own business. Reselling the files is not permitted.",
    },
    audience: ["Freelancers", "Small businesses", "Founders", "Operators"],
    highlight: { title: "Formulas done", detail: "Charts and rollups update as you type" },
    captions: ["Dashboard", "Input tab", "Charts", "Instructions"],
    overview: [
      "The hard part of a finance sheet is the wiring, not the numbers. That wiring is already done and documented here.",
      "Enter your figures and the dashboards, charts and summaries update themselves.",
    ],
  },
  "Design Assets": {
    includes: [
      "Complete asset library, organised by type",
      "Source files where applicable",
      "Multiple export formats",
      "Usage notes",
    ],
    meta: [
      { label: "Format", value: "Organised asset pack (ZIP)" },
      { label: "Compatibility", value: "Major design and editing tools" },
      { label: "Delivery", value: "Instant download" },
    ],
    license: {
      title: "Commercial use — single brand",
      summary:
        "Use the assets inside your own projects and client deliverables. Redistributing the assets as a pack is not permitted.",
    },
    audience: ["Designers", "Editors", "Creators", "Agencies"],
    highlight: { title: "Organised", detail: "Named and foldered so you can actually find things" },
    captions: ["Pack overview", "In use", "Variations", "File structure"],
    overview: [
      "Assets are only useful when you can find them, so the pack is structured and named for real project work.",
      "Every item is delivered in the formats the tools actually expect.",
    ],
  },
};

const fallback = categoryCopy["Design Assets"]!;

/** Tag-driven badge — only shown when the product genuinely carries the tag. */
function badgeFor(product: Product): string | null {
  const tags = product.tags.map((t) => t.toLowerCase());
  if (tags.includes("best seller")) return "BESTSELLER";
  if (tags.includes("top rated")) return "TOP RATED";
  if (tags.includes("new")) return "NEW";
  if (tags.includes("on sale")) return "LIMITED DROP";
  if (tags.includes("bundle")) return "BUNDLE";
  return null;
}

export function getProductDetails(product: Product): ProductDetails {
  const copy = categoryCopy[product.category] ?? fallback;
  const specTag = product.tags.find((t) => /\d/.test(t));
  const start = galleryPool.indexOf(product.image);

  const gallery: GalleryShot[] = copy.captions.map((caption, i) => ({
    src: galleryPool[(Math.max(start, 0) + i) % galleryPool.length]!,
    caption,
  }));
  gallery[0] = { src: product.image, caption: copy.captions[0]! };

  const highlights: Highlight[] = [
    specTag
      ? { title: specTag, detail: "Included in this release" }
      : { title: "Curated", detail: "Reviewed before it enters the Vault" },
    { title: "Instant access", detail: "Available right after successful payment" },
    copy.highlight,
    { title: copy.license.title.split("—")[0]!.trim(), detail: "Rights as stated in the licence" },
  ];

  return {
    badge: badgeFor(product),
    highlights,
    includes: copy.includes,
    meta: [{ label: "Category", value: product.category }, ...copy.meta],
    license: copy.license,
    overview: {
      heading: "Built to help you move faster.",
      paragraphs: [product.description, ...copy.overview],
    },
    audience: copy.audience,
    faq: [
      {
        q: "How will I receive this product?",
        a: `${copy.meta.find((m) => m.label === "Delivery")?.value ?? "Digital access"}. Once your payment is confirmed, the product is linked to your Jays Vault account and appears in My Products.`,
      },
      {
        q: "Can I use it commercially?",
        a: `${copy.license.title}. ${copy.license.summary}`,
      },
      {
        q: "Can I edit the files?",
        a: `Yes — this product is delivered as ${copy.meta.find((m) => m.label === "Format")?.value ?? "editable files"}, so you can adapt it to your own workflow and branding.`,
      },
      {
        q: "What do I need to use it?",
        a: `Compatibility: ${copy.meta.find((m) => m.label === "Compatibility")?.value ?? "standard tools"}. No additional purchase is required from Jays Vault.`,
      },
      {
        q: "Can I access it again later?",
        a: "Yes. The product stays in your account, so you can return to My Products and access it again at any time, subject to the product's access terms.",
      },
      {
        q: "Do I get updates?",
        a: "Revisions to this release are included with your purchase and appear in the same place in your account.",
      },
    ],
    gallery,
  };
}
