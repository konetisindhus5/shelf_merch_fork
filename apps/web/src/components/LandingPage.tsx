import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import bottleAsset from "../../assets/bottle.png";
import capAsset from "../../assets/cap.png";
import diaryAsset from "../../assets/diary.png";
import hoodieAsset from "../../assets/hoodie.png";
import mugAsset from "../../assets/mug.png";
import templateAsset from "../../assets/template.png";
import toteAsset from "../../assets/tote.png";
import {
  Award,
  Backpack,
  Briefcase,
  Cake,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Coffee,
  CreditCard,
  CupSoda,
  Dumbbell,
  Eye,
  Factory,
  Gem,
  Gift,
  Globe,
  Hand,
  Handshake,
  Headphones,
  Heart,
  HeartHandshake,
  IdCard,
  Instagram,
  Laptop,
  Linkedin,
  Megaphone,
  Menu,
  MessageCircle,
  Monitor,
  Package,
  PartyPopper,
  Pencil,
  Plane,
  Play,
  Popcorn,
  Puzzle,
  Rocket,
  Search,
  Settings,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Store,
  Target,
  Tent,
  TrendingUp,
  Truck,
  User,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";

const LP_ICONS = {
  monitor: Monitor,
  package: Package,
  star: Star,
  backpack: Backpack,
  "shopping-bag": ShoppingBag,
  factory: Factory,
  puzzle: Puzzle,
  gift: Gift,
  party: PartyPopper,
  coffee: Coffee,
} as const satisfies Record<string, LucideIcon>;

type CardIconKey = keyof typeof LP_ICONS;

function LpIcon({
  icon: Icon,
  size = 20,
  className,
  strokeWidth = 2,
}: {
  icon: LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}) {
  return <Icon size={size} className={className} strokeWidth={strokeWidth} aria-hidden />;
}

function LpSectionHeader({
  badge,
  title,
  sub,
  align = "center",
}: {
  badge: string;
  title: ReactNode;
  sub?: string;
  align?: "center" | "left";
}) {
  return (
    <header className={`lp-section-header${align === "left" ? " lp-section-header--left" : ""}`}>
      <span className="lp-hero__badge">{badge}</span>
      <h2 className="lp-section-header__title">{title}</h2>
      {sub ? <p className="lp-section-header__sub">{sub}</p> : null}
    </header>
  );
}

const HERO_NAV_LINKS = [
  { label: "Products", href: "#products", chevron: true },
  { label: "Solutions", href: "#solutions", chevron: true },
  { label: "Pricing", href: "#pricing", chevron: false },
  { label: "Resources", href: "#resources", chevron: true },
] as const;

const HERO_TRUST_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: CheckCircle2, label: "100% risk-free" },
  { icon: Truck, label: "No inventory" },
  { icon: Globe, label: "Global fulfillment" },
  { icon: Headphones, label: "Expert support" },
];

const HERO_FLOATS = [
  { src: hoodieAsset, alt: "Green hoodie mockup", className: "lp-hero__float--hoodie" },
  { src: toteAsset, alt: "Canvas tote mockup", className: "lp-hero__float--tote" },
  { src: mugAsset, alt: "Branded mug mockup", className: "lp-hero__float--mug" },
  { src: bottleAsset, alt: "Water bottle mockup", className: "lp-hero__float--bottle" },
  { src: diaryAsset, alt: "Notebook mockup", className: "lp-hero__float--diary" },
  { src: capAsset, alt: "Cap mockup", className: "lp-hero__float--cap" },
] as const;

const INTRO_FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Monitor, title: "One dashboard", desc: "Shops, gifts, and swag unified" },
  { icon: Sparkles, title: "Smart automation", desc: "Milestones and peer recognition" },
  { icon: Globe, title: "Global reach", desc: "Fulfillment in 170+ countries" },
];

const INTRO_CHAPTERS = ["Overview", "Kits & Swag", "Gifting", "Analytics"] as const;

/* ─── offerings tabs (ShelfMerch) ─── */
const OFFERING_TABS = [
  {
    id: "shops",
    label: "Shops",
    icon: "/images/offering-icons/shops.svg",
    color: "#0D5C3F",
    bg: "#eef5f0",
    bgDark: "#14532d",
    title: "Do it all with your shop",
    layout: "shop" as const,
    perfectFor: [
      "Company Storefront",
      "Swag & Uniform Shops",
      "Corporate Gifts",
      "Rewards Redemption",
      "Retail",
      "Recognition & Incentives",
      "Fundraising",
    ],
    features: ["Add your branding", "Curated catalog", "Points or currency", "5K+ product options"],
  },
  {
    id: "gifting",
    label: "Gifting",
    icon: "/images/offering-icons/gifting.svg",
    color: "#00C036",
    bg: "#ecfdf5",
    bgDark: "#047857",
    title: "All your gifting operations in one place",
    layout: "gifting" as const,
    cards: [
      { image: "/images/offerings/gifting/gift-boxes.png", title: "Gift Boxes", desc: "Customize everything from gifts to branding." },
      { image: "/images/offerings/gifting/give-a-budget.svg", title: "Give a Budget", desc: "Points, currency, or a number of gifts." },
      { image: "/images/offerings/gifting/spot-gifting.png", title: "Spot Gifting", desc: "Gift on a whim — there's always a reason to gift." },
      { image: "/images/offerings/gifting/automated-gifting.png", title: "Automated Gifting", desc: "Set and forget for any occasion." },
    ],
    features: ["Clients & Prospects", "Holidays & Celebrations", "Employee Appreciation", "Birthdays"],
  },
  {
    id: "anniversaries",
    label: "Service Anniversaries",
    icon: "/images/offering-icons/anniversaries.svg",
    color: "#1A6B52",
    bg: "#e8f2ed",
    bgDark: "#14532d",
    title: "Celebrate milestones across your team",
    layout: "anniversaries" as const,
    cards: [
      { image: "/images/offerings/anniversaries/spot-recurring.png", title: "Spot & Recurring", desc: "Give once or set ongoing recognition." },
      { image: "/images/offerings/anniversaries/feedback-reporting.svg", title: "Feedback & Reporting", desc: "Guardrails, analytics, and insights." },
      { image: "/images/offerings/anniversaries/integrations.png", title: "Integrations", desc: "HRIS, CRM, Slack, Teams, and more." },
    ],
    features: ["Service Anniversaries", "Employee Appreciation", "Rewards Redemption", "Sales Incentives"],
  },
  {
    id: "events",
    label: "In-Person & Events",
    icon: "/images/offering-icons/events.svg",
    color: "#B8872E",
    bg: "#faf6ee",
    bgDark: "#8a6520",
    title: "Elevate your in-person experience",
    layout: "cards" as const,
    cards: [
      { iconKey: "monitor", title: "Virtual Swag Bar", desc: "Let attendees pick their favorites." },
      { iconKey: "package", title: "Bulk Swag", desc: "Ship branded gear to any venue." },
      { iconKey: "star", title: "VIP Gifts", desc: "Premium gifts for key guests." },
      { iconKey: "backpack", title: "Goodie Bags & Cases", desc: "Ready-to-hand event kits." },
    ],
    features: ["Upload Your Booth", "Capture Leads", "Room Drops", "Pre- & Post-Event Engagement"],
  },
  {
    id: "kudos",
    label: "Employee Kudos",
    icon: "/images/offering-icons/kudos.svg",
    color: "#C45C6A",
    bg: "#faf4f5",
    bgDark: "#a84855",
    title: "Empower recognition with top incentives",
    layout: "kudos" as const,
    bullets: [
      "Employee-to-employee recognition",
      "Assign monetary value to kudos or keep them free",
      "Integrate with Teams, Slack, or use our platform",
      "Thousands of gifts from top brands + customizable swag",
      "Enable kudos to flow freely across your org chart",
    ],
    features: ["Peer Recognition", "Manager Awards", "Budget Controls", "Redemption Tracking"],
  },
  {
    id: "swag",
    label: "Swag",
    icon: "/images/offering-icons/swag.svg",
    color: "#00C036",
    bg: "#f0fdfa",
    bgDark: "#0f766e",
    title: "The only swag partner you need",
    layout: "brands" as const,
    cards: [
      { iconKey: "star", title: "VIP Gifts", desc: "Premium branded items." },
      { iconKey: "monitor", title: "Virtual Swag Bar", desc: "Online pick-and-pack." },
      { iconKey: "package", title: "Kits", desc: "Onboarding & celebration kits." },
      { iconKey: "shopping-bag", title: "On-Demand Shops", desc: "Launch stores in minutes." },
      { iconKey: "factory", title: "Bulk Swag", desc: "Volume orders, one platform." },
    ],
    features: ["Global Fulfillment", "Endless Customization", "Storage", "Sustainable Practices", "5K+ Items"],
    brands: ["Nike", "Carhartt", "North Face", "BELLA+CANVAS", "Columbia", "Adidas", "Port Authority"],
  },
  {
    id: "snacks",
    label: "Snacks",
    icon: "/images/offering-icons/snacks.svg",
    color: "#2D7A5F",
    bg: "#eef5f2",
    bgDark: "#1a5c47",
    title: "Snacks and sips in all the ways",
    layout: "brands" as const,
    cards: [
      { iconKey: "puzzle", title: "Build-Your-Own", desc: "Customize every box." },
      { iconKey: "gift", title: "Curated Boxes", desc: "Expertly assembled selections." },
      { iconKey: "shopping-bag", title: "Goodie Bags", desc: "Individual treats at scale." },
      { iconKey: "party", title: "Surprise Boxes", desc: "Delight with the unexpected." },
      { iconKey: "coffee", title: "Pantry Refills", desc: "Keep offices stocked." },
    ],
    features: ["Global Fulfillment", "Box Customizations", "Add Branding", "Add Swag", "Sustainable Practices"],
    brands: ["Hippeas", "Pipcorn", "Hu", "Siete", "Kettle Brand"],
  },
] as const;

type OfferingId = (typeof OFFERING_TABS)[number]["id"];

const SHOP_HERO_IMAGE = "/images/shops/shop-preview-clean.png";

/* ─── data ─── */
const TEAMS = [
  {
    id: "hr",
    label: "Human Resources",
    icon: Users,
    title: "Empower Your Employees",
    desc: "Optimize HR processes, recognize employees, and nurture the employee experience with ShelfMerch.",
    benefits: [
      "Onboard employees with an onboarding shop or swag kits.",
      "Automate service awards and milestone celebrations.",
      "Build culture with peer-to-peer recognition programs.",
    ],
  },
  {
    id: "marketing",
    label: "Marketing & Branding",
    icon: Megaphone,
    title: "Amplify Your Brand",
    desc: "Deliver branded experiences that leave lasting impressions on customers and partners.",
    benefits: [
      "Launch branded company stores in minutes.",
      "Send curated gift campaigns at scale.",
      "Track engagement and ROI across programs.",
    ],
  },
  {
    id: "leaders",
    label: "Team Leaders",
    icon: Target,
    title: "Motivate Your Teams",
    desc: "Give managers the tools to recognize wins and keep teams engaged every day.",
    benefits: [
      "Distribute kudos budgets to team leads.",
      "Celebrate wins with instant rewards.",
      "Run team-specific gifting programs.",
    ],
  },
  {
    id: "sales",
    label: "Sales",
    icon: Briefcase,
    title: "Close Deals Faster",
    desc: "Prospect, incentivize, and reward with premium gifts that open doors.",
    benefits: [
      "Send prospecting gifts globally.",
      "Run sales incentive programs effortlessly.",
      "Track redemption and engagement metrics.",
    ],
  },
  {
    id: "ops",
    label: "Operations",
    icon: Settings,
    title: "Streamline Operations",
    desc: "Consolidate vendors, automate fulfillment, and reduce operational overhead.",
    benefits: [
      "One platform for all gifting and swag.",
      "Automated global fulfillment and tracking.",
      "Centralized billing and reporting.",
    ],
  },
  {
    id: "events",
    label: "Event Managers",
    icon: Tent,
    title: "Elevate Every Event",
    desc: "From welcome kits to booth swag, deliver memorable event experiences.",
    benefits: [
      "Ship event kits to any location worldwide.",
      "Custom branding on every item.",
      "Real-time order tracking and support.",
    ],
  },
] as const;

const CATEGORIES = [
  { title: "Food & Beverages", img: "/images/landing/categories/food-beverages.png", fullCard: true },
  { title: "Luxury", img: "/images/landing/categories/luxury.png", fullCard: true },
  { title: "Wellness", img: "/images/landing/categories/wellness.png", fullCard: true },
  { title: "Gift Cards", img: "/images/landing/categories/gift-cards.png", fullCard: true },
  {
    title: "Work & Essentials",
    img: "/images/landing/categories/work-essentials.png",
    fullCard: true,
  },
  { title: "Apparel & Wearables", img: "/images/landing/categories/apparel-wearables.png", fullCard: true, bleed: true },
  {
    title: "Life & Hobbies",
    img: "/images/landing/categories/life-hobbies.png",
    fullCard: true,
  },
  {
    title: "Experiences",
    img: "/images/landing/categories/experiences.png",
    fullCard: true,
  },
] as const;

const USE_CASES: { label: string; icon: LucideIcon; bg: string; color: string }[] = [
  { label: "Employee Appreciation", icon: Star, bg: "#D1FAE5", color: "#059669" },
  { label: "Rewards & Recognition", icon: Award, bg: "#FEF3C7", color: "#D97706" },
  { label: "Swag Distribution", icon: Package, bg: "#EDE9FE", color: "#7C3AED" },
  { label: "Client Gifting", icon: Gift, bg: "#D1FAE5", color: "#059669" },
  { label: "Sales Incentives", icon: Target, bg: "#CCFBF1", color: "#0D9488" },
  { label: "Employee Birthday Gifts", icon: Cake, bg: "#CCFBF1", color: "#0D9488" },
  { label: "Snack Boxes", icon: Popcorn, bg: "#FFEDD5", color: "#EA580C" },
  { label: "Prospecting & Outreach", icon: Search, bg: "#DBEAFE", color: "#2563EB" },
  { label: "Onboarding Kits", icon: IdCard, bg: "#DBEAFE", color: "#2563EB" },
  { label: "Work Anniversaries", icon: Calendar, bg: "#FCE7F3", color: "#DB2777" },
  { label: "Gift Cards", icon: CreditCard, bg: "#CCFBF1", color: "#0D9488" },
  { label: "Celebration Kits", icon: PartyPopper, bg: "#FCE7F3", color: "#DB2777" },
  { label: "Remote Employee Kits", icon: Laptop, bg: "#EDE9FE", color: "#7C3AED" },
  { label: "Swag Store Redemption", icon: ShoppingBag, bg: "#D1FAE5", color: "#059669" },
  { label: "Channel Partner Rewards", icon: Handshake, bg: "#DBEAFE", color: "#2563EB" },
  { label: "Corporate Events", icon: Tent, bg: "#FFEDD5", color: "#EA580C" },
  { label: "Marketing Campaigns", icon: Megaphone, bg: "#FCE7F3", color: "#DB2777" },
  { label: "Company Store", icon: Store, bg: "#DBEAFE", color: "#2563EB" },
  { label: "Wellness Programs", icon: Heart, bg: "#FCE7F3", color: "#DB2777" },
  { label: "New Hire Welcome", icon: Hand, bg: "#CCFBF1", color: "#0D9488" },
  { label: "Customer Loyalty", icon: Heart, bg: "#FFEDD5", color: "#EA580C" },
  { label: "Boosting Attendance", icon: TrendingUp, bg: "#EDE9FE", color: "#7C3AED" },
  { label: "Boosting Response Rates", icon: MessageCircle, bg: "#FEF3C7", color: "#D97706" },
  { label: "Recognizing DEI Events", icon: HeartHandshake, bg: "#EDE9FE", color: "#7C3AED" },
];

const TESTIMONIALS = [
  "ShelfMerch has completely streamlined our branded merchandise process. The quality is top-notch, the platform is easy to use, and our team loves the variety of options!",
  "From onboarding kits to employee appreciation gifts, ShelfMerch helps us deliver meaningful swag that represents our brand perfectly. Our go-to platform!",
  "The ShelfMerch team is amazing! Fast turnaround, great support, and products our employees actually use and love.",
];

const TRUSTED_LOGOS = [
  { name: "Google", src: "/images/logos/google-wordmark.svg", width: 92, height: 28 },
  { name: "Pinterest", src: "/images/logos/pinterest-wordmark.png", width: 110, height: 28 },
  { name: "Spotify", src: "/images/logos/spotify-wordmark.svg", width: 100, height: 28 },
  { name: "Airbnb", src: "/images/logos/airbnb-wordmark.svg", width: 92, height: 28 },
  { name: "Slack", src: "/images/logos/slack-wordmark.svg", width: 88, height: 28 },
  { name: "HubSpot", src: "/images/logos/hubspot-wordmark.svg", width: 96, height: 28 },
] as const;

const INTEGRATIONS: { icon: LucideIcon; label: string }[] = [
  { icon: Wallet, label: "Payroll" },
  { icon: Plane, label: "Travel" },
  { icon: Gift, label: "Gifting" },
  { icon: Rocket, label: "Automation" },
  { icon: Package, label: "Fulfillment" },
  { icon: MessageCircle, label: "Slack" },
  { icon: Users, label: "HRIS" },
  { icon: Eye, label: "Analytics" },
];

const KUDOS_FEED = [
  { initials: "PS", name: "Priya S.", action: "sent kudos", message: "Great work on the launch!", points: 15, tone: "#C45C6A" },
  { initials: "MK", name: "Marcus K.", action: "shout-out", message: "Thanks for going the extra mile.", points: 10, tone: "#A84855" },
  { initials: "AL", name: "Alex L.", action: "recognized", message: "Crushed the client demo today.", points: 20, tone: "#B85A68" },
] as const;

/* ─── component ─── */
export default function LandingPage() {
  const [offering, setOffering] = useState<OfferingId>("shops");
  const [team, setTeam] = useState<(typeof TEAMS)[number]["id"]>("hr");
  const activeTeam = TEAMS.find((t) => t.id === team)!;
  const activeOffering = OFFERING_TABS.find((t) => t.id === offering)!;

  return (
    <div className="lp">
      <style>{LP_CSS}</style>

      {/* ── NAV ── */}
      <header className="lp-nav lp-nav--merch">
        <div className="lp-container lp-nav__inner lp-nav__inner--merch">
          <a href="/" className="lp-logo">
            <img
              src="/assets/rockefeller.png"
              alt="Shelf Merch"
              width={178}
              height={30}
              className="lp-logo__img"
            />
          </a>

          <nav className="lp-nav__links lp-nav__links--merch">
            {HERO_NAV_LINKS.map((item) => (
              <a key={item.label} href={item.href}>
                <span>{item.label}</span>
                {item.chevron ? <ChevronDown className="lp-nav__chevron" aria-hidden /> : null}
              </a>
            ))}
          </nav>

          <div className="lp-nav__actions lp-nav__actions--merch">
            <Link to="/login" className="lp-btn-ghost lp-btn-ghost--merch">
              Log in
            </Link>
            <Link to="/signup" className="lp-btn-primary lp-btn-primary-sm lp-btn-pill">
              Get started
            </Link>
          </div>

          <button type="button" className="lp-nav__menu" aria-label="Open navigation">
            <Menu className="lp-nav__menu-icon" aria-hidden />
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <div className="lp-hero-zone lp-hero-zone--merch">
        <div className="lp-hero__floats" aria-hidden="true">
          {HERO_FLOATS.map((product) => (
            <img
              key={product.alt}
              src={product.src}
              alt={product.alt}
              className={`lp-hero__float ${product.className}`}
              loading="eager"
            />
          ))}
          <LpHeroDecorSprig className="lp-hero__decor lp-hero__decor--sprig" />
          <LpHeroDecorSquiggle className="lp-hero__decor lp-hero__decor--squiggle" />
          <LpHeroDecorWave className="lp-hero__decor lp-hero__decor--wave" />
          <LpHeroDecorDots className="lp-hero__decor lp-hero__decor--dots-r" />
          <LpHeroDecorDots className="lp-hero__decor lp-hero__decor--dots-l" />
        </div>

        <section className="lp-hero lp-hero--merch">
          <div className="lp-hero--merch__inner">
            <div className="lp-hero__content lp-hero__content--merch">
              {/* <a href="#products" className="lp-hero__announce">
                <strong>NEW</strong>
                <span>Spring collection now available</span>
                <ChevronRight className="lp-hero__announce-icon" aria-hidden />
              </a> */}

              <h1 className="lp-hero__headline">
                Limitless engagement.
                <br />
                One platform.
              </h1>

              <p className="lp-hero__lede">
                Power your global recognition programs with premium swag,
                <br className="lp-hero__lede-br" />
                snack boxes, and gifts—all fulfilled locally in 170+ countries.
              </p>

              <div className="lp-hero__ctas lp-hero__ctas--merch">
                <Link to="/signup" className="lp-btn-primary lp-btn-pill">
                  Get started for free
                </Link>
                <a href="#demo" className="lp-btn-outline-green">
                  Book a demo
                </a>
              </div>

              <ul className="lp-hero__trust">
                {HERO_TRUST_ITEMS.map((item, index) => (
                  <li key={item.label}>
                    {index > 0 ? <span className="lp-hero__trust-sep" aria-hidden /> : null}
                    <LpIcon icon={item.icon} size={14} className="lp-hero__trust-icon" strokeWidth={2} />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lp-hero__mockup">
              <div className="lp-hero__mockup-frame">
                <img
                  src={templateAsset}
                  alt="Shelf Merch editor interface for creating a branded hoodie design"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── OFFERINGS TABS ── */}
      <section className="lp-section lp-offerings" id="products">
        <div className="lp-container">
          <div className="lp-offerings__shell">
          <div className="lp-offerings-tabs" role="tablist" aria-label="ShelfMerch offerings">
            {OFFERING_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={offering === tab.id}
                className={`lp-offerings-tab${offering === tab.id ? " is-active" : ""}`}
                onClick={() => setOffering(tab.id)}
                style={{ "--tab-accent": tab.color } as React.CSSProperties}
              >
                <img
                  src={tab.icon}
                  alt=""
                  className="lp-offerings-tab__icon"
                  width={38}
                  height={38}
                  loading="eager"
                  decoding="async"
                />
                <span className="lp-offerings-tab__label">{tab.label}</span>
              </button>
            ))}
          </div>

          <div
            className="lp-offerings-panel"
            role="tabpanel"
            style={{ "--panel-bg": activeOffering.bg, "--panel-accent": activeOffering.bgDark } as React.CSSProperties}
          >
            <h3 className="lp-offerings-panel__title">{activeOffering.title}</h3>

            {activeOffering.layout === "shop" && (
              <div className="lp-offerings-shop">
                <div className="lp-shop-hero">
                  <img
                    src={SHOP_HERO_IMAGE}
                    alt="Branded company shop with customizable swag, points redemption, and thousands of catalog options"
                    width={2149}
                    height={1031}
                    className="lp-shop-hero__img"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <aside className="lp-offerings-perfect lp-offerings-perfect--shop">
                  <h4>Perfect for:</h4>
                  <ul>
                    {activeOffering.perfectFor?.map((item) => (
                      <li key={item}>
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                          <circle cx="8" cy="8" r="8" fill="#ede9fe" />
                          <path d="M5 8.2 7 10.2 11 6.2" stroke="#0D5C3F" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link to="/app/shops" className="lp-offerings-learn">Learn More →</Link>
                </aside>
              </div>
            )}

            {(activeOffering.layout === "gifting" || activeOffering.layout === "anniversaries") && activeOffering.cards && (
              <div className={`lp-offerings-feature-cards lp-offerings-feature-cards--${activeOffering.layout}`}>
                <div className="lp-offerings-feature-cards__grid">
                  {activeOffering.cards.map((card) => (
                    <article key={card.title} className="lp-offerings-feature-cards__card">
                      <div className="lp-offerings-feature-cards__visual">
                        {"image" in card && (
                          <img
                            src={card.image}
                            alt=""
                            width={284}
                            height={206}
                            loading="lazy"
                            decoding="async"
                          />
                        )}
                      </div>
                      <h4>{card.title}</h4>
                      {"desc" in card && card.desc && <p>{card.desc}</p>}
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeOffering.layout === "cards" && activeOffering.cards && (
              <div className="lp-offerings-cards">
                {activeOffering.cards.map((card) => (
                  <div key={card.title} className="lp-offerings-card">
                    <div className="lp-offerings-card__visual">
                      {"iconKey" in card && (
                        <LpIcon icon={LP_ICONS[card.iconKey as CardIconKey]} size={28} strokeWidth={1.75} />
                      )}
                    </div>
                    <h4>{card.title}</h4>
                    {card.desc && <p>{card.desc}</p>}
                  </div>
                ))}
              </div>
            )}

            {activeOffering.layout === "kudos" && activeOffering.bullets && (
              <div className="lp-offerings-kudos">
                <ul className="lp-offerings-kudos__list">
                  {activeOffering.bullets.map((b) => (
                    <li key={b}>
                      <span className="lp-offerings-kudos__check">
                        <Check size={12} strokeWidth={2.75} />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <div className="lp-kudos-preview" aria-label="Kudos activity preview">
                  <div className="lp-kudos-preview__head">
                    <div className="lp-kudos-preview__title">
                      <span className="lp-kudos-preview__title-icon"><Heart size={16} fill="currentColor" strokeWidth={0} /></span>
                      Team Kudos
                    </div>
                    <span className="lp-kudos-preview__live">Live</span>
                  </div>

                  <div className="lp-kudos-preview__feed">
                    {KUDOS_FEED.map((item) => (
                      <article key={item.initials} className="lp-kudos-preview__item">
                        <span className="lp-kudos-preview__avatar" style={{ background: `${item.tone}18`, color: item.tone }}>
                          {item.initials}
                        </span>
                        <div className="lp-kudos-preview__body">
                          <p className="lp-kudos-preview__meta">
                            <strong>{item.name}</strong> {item.action}
                          </p>
                          <p className="lp-kudos-preview__msg">{item.message}</p>
                        </div>
                        <span className="lp-kudos-preview__pts">+{item.points}</span>
                      </article>
                    ))}
                  </div>

                  <div className="lp-kudos-preview__footer">
                    <div>
                      <strong>2.4k</strong>
                      <span>kudos this month</span>
                    </div>
                    <div>
                      <strong>89%</strong>
                      <span>team participation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeOffering.layout === "brands" && activeOffering.cards && (
              <>
                <div className="lp-offerings-cards lp-offerings-cards--5">
                  {activeOffering.cards.map((card) => (
                    <div key={card.title} className="lp-offerings-card">
                      <div className="lp-offerings-card__visual">
                        {"iconKey" in card && (
                          <LpIcon icon={LP_ICONS[card.iconKey as CardIconKey]} size={28} strokeWidth={1.75} />
                        )}
                      </div>
                      <h4>{card.title}</h4>
                      {card.desc && <p>{card.desc}</p>}
                    </div>
                  ))}
                </div>
                {activeOffering.brands && (
                  <div className="lp-offerings-brands">
                    {activeOffering.brands.map((b) => (
                      <span key={b}>{b}</span>
                    ))}
                    <span className="lp-offerings-brands__more">+ Many more</span>
                  </div>
                )}
              </>
            )}

            {activeOffering.layout !== "shop" && (
              <div className="lp-offerings-panel__cta">
                <Link to="/app" className="lp-offerings-learn">Learn More →</Link>
              </div>
            )}
          </div>

          {activeOffering.features && activeOffering.layout !== "shop" && (
            <ul className={`lp-offerings-footer${activeOffering.layout === "gifting" ? " lp-offerings-footer--gifting" : ""}${activeOffering.layout === "anniversaries" ? " lp-offerings-footer--anniversaries" : ""}${activeOffering.layout === "kudos" ? " lp-offerings-footer--kudos" : ""}`}>
              {activeOffering.features.map((f) => (
                <li key={f}>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <circle cx="8" cy="8" r="8" fill="currentColor" fillOpacity=".12" />
                    <path d="M5 8.2 7 10.2 11 6.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
          )}
          </div>
        </div>
      </section>

      {/* ── VIDEO INTRO ── */}
      <section className="lp-section lp-intro" id="demo">
        <div className="lp-container">
          <LpSectionHeader
            badge="Platform Tour"
            title={<>See ShelfMerch <span className="c-gold">in action</span></>}
            sub="Watch how teams worldwide engage employees, delight customers, and consolidate gifting, swag, and recognition in one platform."
          />
          <div className="lp-shell lp-intro__shell">
            <div className="lp-intro__grid">
              <div className="lp-intro__copy">
                <p className="lp-intro__eyebrow">
                  <Play size={12} fill="currentColor" strokeWidth={0} aria-hidden />
                  2-minute product walkthrough
                </p>
                <h3>Take your ShelfMerch experience further</h3>
                <p className="lp-intro__lede">
                  From onboarding kits to global gifting campaigns—manage every recognition moment
                  without juggling vendors.
                </p>
                <ul className="lp-intro__features">
                  {INTRO_FEATURES.map((feature) => (
                    <li key={feature.title} className="lp-intro__feature">
                      <span className="lp-intro__feature-icon" aria-hidden>
                        <LpIcon icon={feature.icon} size={18} strokeWidth={2.25} />
                      </span>
                      <span className="lp-intro__feature-text">
                        <strong>{feature.title}</strong>
                        <span>{feature.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="lp-intro__ctas">
                  <Link to="/signup" className="lp-btn-primary lp-btn-primary-sm lp-btn-pill">
                    Get started free
                  </Link>
                  <a href="#intro-video" className="lp-intro__play-link">
                    <span className="lp-intro__play-link-icon" aria-hidden>
                      <Play size={14} fill="currentColor" strokeWidth={0} />
                    </span>
                    Watch overview
                  </a>
                </div>
              </div>
              <div className="lp-intro__media" id="intro-video">
                <div className="lp-video-mock">
                  <div className="lp-video-mock__bar" aria-hidden>
                    <span className="lp-video-mock__dot lp-video-mock__dot--close" />
                    <span className="lp-video-mock__dot lp-video-mock__dot--min" />
                    <span className="lp-video-mock__dot lp-video-mock__dot--max" />
                    <span className="lp-video-mock__title">ShelfMerch — Platform Overview</span>
                  </div>
                  <button
                    type="button"
                    className="lp-video-mock__screen"
                    aria-label="Play platform overview video (2 minutes 45 seconds)"
                  >
                    <img
                      className="lp-video-mock__poster"
                      src={templateAsset}
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                    <span className="lp-video-mock__overlay" aria-hidden>
                      <span className="lp-video-mock__play">
                        <Play size={26} fill="currentColor" strokeWidth={0} />
                      </span>
                      <span className="lp-video-mock__label">Platform Overview</span>
                    </span>
                    <span className="lp-video-mock__duration">2:45</span>
                    <span className="lp-video-mock__progress" aria-hidden>
                      <span className="lp-video-mock__progress-fill" />
                    </span>
                  </button>
                  <div className="lp-video-mock__chapters" role="list" aria-label="Video chapters">
                    {INTRO_CHAPTERS.map((chapter, index) => (
                      <span
                        key={chapter}
                        role="listitem"
                        className={`lp-video-mock__chapter${index === 0 ? " is-active" : ""}`}
                      >
                        {chapter}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="lp-intro__caption">
                  <Users size={14} strokeWidth={2.25} aria-hidden />
                  Trusted by HR, Marketing &amp; Ops teams worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF (logos + quote) ── */}
      <section className="lp-section lp-social" style={{height: "50vh"}}>
        <div className="lp-container lp-social__layout">
          <div className="lp-social__copy">
            <p className="lp-social__label">For every possible occasion</p>
            <h2 className="lp-social__title">
              Loved by teams <span>everywhere</span>
            </h2>
          </div>
          <div className="lp-social__logos" aria-label="Companies using ShelfMerch">
            {TRUSTED_LOGOS.map((logo) => (
              <span key={logo.name} className="lp-social__logo" title={logo.name}>
                <img
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  loading="lazy"
                  decoding="async"
                />
              </span>
            ))}
          </div>
        </div>
        <div className="lp-container" style={{position: "relative", top: "20px"}}>
          <figure className="lp-social__quote lp-shell">
            <span className="lp-social__mark" aria-hidden="true">"</span>
            <blockquote>
              We saved vendors a ton of money and took our engagement to a whole new level.
            </blockquote>
            <figcaption className="lp-social__author">
              <span className="lp-social__avatar">SM</span>
              <span>
                <strong>Sarah Mitchell</strong>
                <span>Head of People, TechCorp</span>
              </span>
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="lp-section lp-categories-section" id="solutions">
        <div className="lp-container">
          <LpSectionHeader
            badge="For Everyone"
            title={<>Something for <span className="c-gold">Everyone</span></>}
            sub="Discover unlimited possibilities with our catalog. From snacks to swag, we've got it all."
          />
          <div className="lp-categories">
            {CATEGORIES.map((c) =>
              "fullCard" in c && c.fullCard ? (
                <Link
                  key={c.title}
                  to="/app/catalog"
                  className={`lp-cat-card lp-cat-card--full${"bleed" in c && c.bleed ? " lp-cat-card--bleed" : ""}`}
                >
                  <img src={c.img} alt={c.title} width={600} height={600} loading="lazy" decoding="async" />
                </Link>
              ) : (
                <Link
                  key={c.title}
                  to="/app/catalog"
                  className="lp-cat-card lp-cat-card--tile"
                  style={{ background: "bg" in c ? c.bg : undefined }}
                >
                  <h3>{c.title}</h3>
                  <div className="lp-cat-card__media">
                    <img src={c.img} alt={c.title} width={600} height={600} loading="lazy" decoding="async" />
                  </div>
                </Link>
              ),
            )}
          </div>
          <div className="lp-categories__cta">
            <Link to="/app/catalog" className="lp-btn-gold lp-btn-gold--sm">View Catalog →</Link>
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      {/* <section className="lp-section lp-integrations">
        <div className="lp-container">
          <LpSectionHeader
            badge="Integrations"
            title={
              <>
                Consolidate your <span className="c-gold">gifting, swag,</span> and{" "}
                <span className="c-gold">recognition</span> vendors
              </>
            }
            sub="Save big on budget and headaches with one connected platform."
          />
          <div className="lp-shell lp-integrations__shell">
            <div className="lp-integration-graphic">
              <svg className="lp-path" viewBox="0 0 900 200" preserveAspectRatio="xMidYMid meet">
                <path d="M 20 160 Q 250 40, 500 100 T 820 80" fill="none" stroke="var(--lp-green-mid)" strokeWidth="2" strokeDasharray="8 6" />
                <circle cx="20" cy="160" r="6" fill="var(--lp-green)" />
                <circle cx="820" cy="80" r="6" fill="var(--lp-gold)" />
              </svg>
              <div className="lp-integration-icons">
                {INTEGRATIONS.map((item, i) => (
                  <div key={item.label} className="lp-int-icon" title={item.label} style={{ left: `${8 + i * 11.5}%` }}>
                    <LpIcon icon={item.icon} size={18} strokeWidth={2} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── TEAMS TABS ── */}
      <section className="lp-section lp-teams-section">
        <div className="lp-container">
          <LpSectionHeader
            badge="Built for Teams"
            title={<>One solution for <span className="c-gold">all your teams</span></>}
            sub="HR, sales, marketing, and ops—every department gets the tools they need."
          />
          <div className="lp-shell lp-teams-card">
            <nav className="lp-teams-nav">
              {TEAMS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`lp-teams-nav__item${team === t.id ? " active" : ""}`}
                  onClick={() => setTeam(t.id)}
                >
                  <span className="lp-teams-nav__icon"><LpIcon icon={t.icon} size={15} strokeWidth={2} /></span>
                  {t.label}
                </button>
              ))}
            </nav>
            <div className="lp-teams-feature">
              <div className="lp-teams-feature__icon"><LpIcon icon={activeTeam.icon} size={28} strokeWidth={1.75} /></div>
              <h3>{activeTeam.title}</h3>
              <p>{activeTeam.desc}</p>
              <a href="#demo" className="lp-teams-feature__link">Learn more →</a>
            </div>
            <ul className="lp-teams-benefits">
              {activeTeam.benefits.map((b) => (
                <li key={b}>
                  <span className="check"><Check size={12} strokeWidth={3} /></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── USE CASES ── */}
      <section className="lp-section lp-usecases">
        <div className="lp-container">
          <LpSectionHeader
            badge="Unlimited Use Cases"
            title={<>ShelfMerch for <span className="c-gold">Every Occasion</span></>}
            sub="From everyday appreciation to big milestones—engage, reward, and celebrate anytime, anywhere."
          />
          <div className="lp-usecases-grid">
            {USE_CASES.map((uc) => (
              <div key={uc.label} className="lp-usecase-card">
                <span className="lp-usecase-card__icon" style={{ background: uc.bg, color: uc.color }}>
                  <LpIcon icon={uc.icon} size={18} strokeWidth={2} />
                </span>
                <span>{uc.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FLEXIBILITY ── */}
      {/* <section className="lp-section lp-flex-section" id="pricing">
        <div className="lp-container">
          <LpSectionHeader
            badge="Total Flexibility"
            title={<>You choose <span className="c-gold">what to give</span> (or not!)</>}
            sub="Selecting gift or reward items doesn't have to be up to you—unless you want it to be."
          />
          <div className="lp-flex-grid">
            <div className="lp-flex-card lp-shell">
              <div className="lp-flex-card__icon" style={{ background: "rgba(204,231,201,.65)", color: "var(--lp-green)" }}><LpIcon icon={Gift} size={24} /></div>
              <h3>Recipient's Choice</h3>
              <p>Give recipients points or a budget, and let them choose the reward they want.</p>
              <div className="lp-diagram">
                <div className="lp-diagram__avatar"><User size={18} /></div>
                <div className="lp-diagram__arrow">→</div>
                <div className="lp-diagram__badge"><Star size={12} fill="currentColor" strokeWidth={0} /> 2,500 PTS TO SPEND</div>
                <div className="lp-diagram__branch">
                  <span><ShoppingBag size={14} /></span><span><Gift size={14} /></span><span><CreditCard size={14} /></span>
                </div>
              </div>
            </div>
            <div className="lp-flex-card lp-shell">
              <div className="lp-flex-card__icon" style={{ background: "rgba(212,162,76,.18)", color: "var(--lp-gold-strong)" }}><LpIcon icon={ShoppingBag} size={24} /></div>
              <h3>Sender's Choice</h3>
              <p>Give recipients specific items of your choosing from our catalog.</p>
              <div className="lp-diagram">
                <div className="lp-diagram__avatar"><User size={18} /></div>
                <div className="lp-diagram__arrow">→</div>
                <div className="lp-diagram__box">
                  <span><Backpack size={14} /></span><span><Coffee size={14} /></span><span><CupSoda size={14} /></span>
                </div>
                <div className="lp-diagram__branch">
                  <span><User size={14} /></span><span><User size={14} /></span><span><User size={14} /></span>
                </div>
              </div>
            </div>
            <div className="lp-flex-card lp-shell">
              <div className="lp-flex-card__icon" style={{ background: "rgba(21,128,61,.12)", color: "var(--lp-green-mid)" }}><LpIcon icon={Users} size={24} /></div>
              <h3>Employee-to-Employee</h3>
              <p>Let employees reward one another with points or a budget they can redeem for cool stuff.</p>
              <div className="lp-diagram lp-diagram--circle">
                <div className="lp-diagram__kudos"><Star size={12} fill="currentColor" strokeWidth={0} /> 10 KUDOS TO SHARE</div>
                <div className="lp-diagram__avatars">
                  <span><User size={14} /></span><span><User size={14} /></span><span><User size={14} /></span><span><User size={14} /></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* ── TESTIMONIALS ── */}
      <section className="lp-section lp-testimonials" id="resources">
        <div className="lp-container">
          <LpSectionHeader
            badge="Customer Stories"
            title={<>What keeps <span className="c-gold">'em coming</span></>}
            sub="Hear from teams who consolidated gifting, swag, and recognition on ShelfMerch."
          />

          <div className="lp-testimonials-grid">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="lp-testimonial-card lp-shell">
                <div className="lp-testimonial-card__quote">"</div>
                <p>{t}</p>
                <hr />
                <div className="lp-testimonial-card__author">
                  <div className="lp-testimonial-card__avatar"><UserCircle size={28} strokeWidth={1.75} /></div>
                </div>
              </div>
            ))}
          </div>
          <div className="lp-center">
            <button type="button" className="lp-btn-gold lp-btn-gold--sm lp-btn-pill">Read More →</button>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-container lp-footer__grid">
          <div>
            <a href="/" className="lp-logo lp-logo--footer">
              <img
                src="/images/logo/shelfmerch-logo-light.svg"
                alt="ShelfMerch"
                width={168}
                height={28}
                className="lp-logo__img"
              />
            </a>
            <div className="lp-footer__social">
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} strokeWidth={2} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} strokeWidth={2} /></a>
            </div>
          </div>
          {[
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
            { title: "Products", links: ["Shops", "Gifting", "Swag", "Snacks", "Gift Cards"] },
            { title: "Solutions", links: ["HR", "Sales", "Marketing", "Events", "Operations"] },
            { title: "Resources", links: ["Blog", "Help Center", "API Docs", "Case Studies"] },
          ].map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l}><a href="#">{l}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="lp-footer__bottom">
          <div className="lp-container">
            <span>© 2026 ShelfMerch. All rights reserved.</span>
            <span><a href="#">Privacy Policy</a> · <a href="#">Terms of Service</a></span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LpHeroDecorSprig({ className }: { className?: string }) {
  return (
    <svg className={className} width="58" height="42" viewBox="0 0 58 42" fill="none" aria-hidden>
      <path d="M13 29L2 19" stroke="#004D3D" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
      <path d="M26 14L21 1" stroke="#004D3D" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
      <path d="M41 22L55 16" stroke="#004D3D" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

function LpHeroDecorSquiggle({ className }: { className?: string }) {
  return (
    <svg className={className} width="70" height="90" viewBox="0 0 70 90" fill="none" aria-hidden>
      <path
        d="M48 7C25 16 15 35 21 47C27 59 46 58 50 70C53 79 46 86 34 87"
        stroke="#004D3D"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function LpHeroDecorWave({ className }: { className?: string }) {
  return (
    <svg className={className} width="62" height="92" viewBox="0 0 62 92" fill="none" aria-hidden>
      <path
        d="M17 6C32 12 44 25 37 39C31 52 12 55 11 68C10 77 15 83 22 87"
        stroke="#004D3D"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  );
}

function LpHeroDecorDots({ className }: { className?: string }) {
  return (
    <div className={className}>
      {Array.from({ length: 12 }).map((_, index) => (
        <span key={index} className="lp-hero__decor-dot" />
      ))}
    </div>
  );
}

/* ─── styles (single-file) ─── */
const LP_CSS = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
.lp{
  --lp-green-deep:#14532d;
  --lp-green:#15803d;
  --lp-green-mid:#166534;
  --lp-green-mint:#86b89a;
  --lp-green-surface:#eef5f0;
  --lp-green-surface-2:#e8f0eb;
  --lp-hero-mint:#cce7c9;
  --lp-hero-mint-2:#b8dbb4;
  --lp-hero-bg:#1a5c42;
  --lp-hero-bg-2:#14532d;
  --lp-body-bg:#f4f8f5;
  --lp-ink:#1a2e28;
  --lp-gold:#D4A24C;
  --lp-gold-strong:#c9922e;
  --lp-text-muted:#5a6b62;
  font-family:'Inter',system-ui,sans-serif;color:#1a1a1a;line-height:1.5;overflow-x:hidden}
.lp-container{max-width:1200px;margin:0 auto;padding:0 24px}
.lp-label{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#006838;text-align:center;margin-bottom:8px}
.lp-heading{font-size:clamp(1.75rem,4vw,2.75rem);font-weight:800;text-align:center;margin-bottom:12px;position:relative}
.lp-heading--left{text-align:left}
.lp-sub{text-align:center;color:#6b7280;font-size:1.05rem;max-width:640px;margin:0 auto 40px}
.lp-sub--left{text-align:left;margin-left:0}
.lp-center{text-align:center;margin-top:40px}
.c-green{color:var(--lp-green)}.c-gold{color:var(--lp-gold)}.c-gold-strong{color:var(--lp-gold-strong)}.c-mint{color:var(--lp-green-mint)}
.c-green-light{color:#2D6A4F}.c-green-dark{color:#106B32}
.lp-badge{display:inline-flex;align-items:center;gap:6px;background:#D1FAE5;color:#065F46;font-size:.7rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;padding:6px 14px;border-radius:999px;margin:0 auto 16px;width:fit-content}
.lp-badge--hero{background:rgba(255,255,255,.1);color:#A3C1AD;border:1px solid rgba(163,193,173,.4);margin:0 auto 20px}
.underline-accent{display:block;width:48px;height:4px;background:#006838;border-radius:2px;margin:8px auto 32px}
.squiggle{color:#006838;font-size:1.2rem;margin-left:8px}

/* buttons */
.lp-btn-primary{display:inline-flex;align-items:center;gap:6px;background:#006838;color:#fff;font-weight:600;font-size:.9rem;padding:12px 24px;border-radius:8px;border:none;cursor:pointer;text-decoration:none;transition:background .2s}
.lp-btn-primary:hover{background:#004d2a}
.lp-btn-primary-sm{padding:8px 18px;font-size:.85rem}
.lp-btn-primary-sm,.lp-btn-ghost,.lp-btn-gold,.lp-btn-outline,.lp-btn-outline-green{text-decoration:none;display:inline-flex;align-items:center}
.lp-btn-gold{background:var(--lp-gold);color:#1a2e28;font-weight:700;padding:14px 28px;border-radius:10px;border:none;cursor:pointer;font-size:.95rem;transition:transform .2s,box-shadow .2s}
.lp-btn-gold--sm{padding:11px 22px;font-size:.88rem;border-radius:8px}
.lp-btn-gold:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(212,162,76,.35)}
.lp-btn-outline--sm{padding:10px 22px;font-size:.88rem;border-radius:8px}
.lp-btn-outline{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.6);padding:14px 28px;border-radius:10px;font-weight:600;font-size:.95rem;cursor:pointer;transition:border-color .2s}
.lp-btn-outline:hover{border-color:#fff}
.lp-btn-outline-green{background:#fff;color:#006838;border:2px solid #006838;padding:12px 28px;border-radius:999px;font-weight:700;font-size:.85rem;letter-spacing:.04em;text-transform:uppercase;cursor:pointer;transition:background .2s,color .2s}
.lp-btn-outline-green:hover{background:#006838;color:#fff}
.lp-btn-ghost{color:#1a1a1a;font-weight:500;font-size:.9rem;padding:8px 16px;border:none;background:transparent;cursor:pointer;font:inherit}
.lp-btn-ghost:disabled{opacity:.6;cursor:wait}
.lp-btn-ghost:hover{color:#006838}
.lp-btn-full{width:100%;justify-content:center;margin-top:16px}
.lp-btn-pill{border-radius:999px;padding:14px 36px}

/* nav */
.lp-nav{position:sticky;top:0;z-index:100;background:#fff;border-bottom:1px solid #f0f0f0}
.lp-nav__inner{display:flex;align-items:center;justify-content:space-between;height:64px}
.lp-logo{display:flex;align-items:center;text-decoration:none}
.lp-logo__img{display:block;height:28px;width:auto;object-fit:contain}
.lp-logo--footer .lp-logo__img{height:32px}
.lp-nav__links{display:flex;gap:28px}
.lp-nav__links a{color:#4b5563;text-decoration:none;font-size:.9rem;font-weight:500;transition:color .2s}
.lp-nav__links a:hover{color:#006838}
.lp-nav__actions{display:flex;align-items:center;gap:8px}
@media(max-width:768px){.lp-nav__links{display:none}}

/* hero */
.lp-hero-zone{
  position:relative;
  background:linear-gradient(155deg,var(--lp-hero-bg) 0%,var(--lp-hero-bg-2) 55%,#0f3d2a 100%);
  overflow:hidden;
}
.lp-hero{
  position:relative;background:transparent;color:#f4faf6;text-align:left;
  padding:clamp(36px,5vw,56px) 0 clamp(20px,3vw,32px);
  overflow:hidden;
}
.lp-hero__inner{
  position:relative;z-index:2;
  display:grid;grid-template-columns:minmax(280px,.95fr) minmax(260px,1.05fr);
  gap:clamp(24px,4vw,48px);align-items:center;
}
.lp-hero__visual{display:flex;align-items:center;justify-content:center}
.lp-hero__visual img{
  display:block;width:100%;max-width:380px;height:auto;
  border-radius:clamp(12px,1.5vw,18px);
  box-shadow:0 20px 48px rgba(0,0,0,.22);
}
.lp-hero__bg{position:absolute;inset:0;pointer-events:none}
.lp-hero__blob{position:absolute;border-radius:50%;filter:blur(1px)}
.lp-hero__blob--1{width:min(360px,45vw);height:min(360px,45vw);background:rgba(134,184,154,.18);top:-18%;right:-8%;opacity:.9}
.lp-hero__blob--2{width:min(280px,34vw);height:min(280px,34vw);background:rgba(212,162,76,.12);bottom:-14%;left:-6%;opacity:.8}
.lp-hero__blob--3{width:min(180px,24vw);height:min(180px,24vw);background:rgba(255,255,255,.06);top:28%;left:42%;opacity:.7}
.lp-hero__content{max-width:560px}
.lp-hero__badge{
  display:inline-block;padding:6px 14px;border-radius:999px;
  border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.1);
  color:#d4e8dc;font-size:.65rem;font-weight:700;letter-spacing:.09em;text-transform:uppercase;
  margin-bottom:clamp(12px,2vw,16px);
}
.lp-hero__title{
  font-size:clamp(1.75rem,3.6vw,2.65rem);font-weight:800;line-height:1.12;
  margin-bottom:clamp(12px,2vw,16px);letter-spacing:-.02em;color:#fff;
}
.lp-hero__sub{
  font-size:clamp(.9rem,1.5vw,1rem);color:rgba(244,250,246,.82);line-height:1.65;
  margin-bottom:clamp(18px,2.5vw,24px);max-width:520px;
}
.lp-hero__stats{
  display:flex;flex-wrap:wrap;justify-content:flex-start;
  gap:8px clamp(14px,2.5vw,22px);list-style:none;
  margin-bottom:clamp(20px,2.5vw,28px);padding:0;
}
.lp-hero__stats li{display:flex;align-items:center;gap:6px;font-size:.78rem;font-weight:600;color:#c8e0d0}
.lp-hero__stat-icon{
  display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:8px;
  background:rgba(255,255,255,.12);color:#e8f5ec;flex-shrink:0;
}
.lp-hero__ctas{display:flex;flex-wrap:wrap;justify-content:flex-start;gap:10px}
@media(max-width:900px){
  .lp-hero__inner{grid-template-columns:1fr;text-align:center}
  .lp-hero__content{max-width:none;margin:0 auto}
  .lp-hero__sub{margin-left:auto;margin-right:auto}
  .lp-hero__stats,.lp-hero__ctas{justify-content:center}
  .lp-hero__visual img{max-width:min(300px,80vw);margin:0 auto}
}

/* merch landing nav + hero */
.lp-nav--merch{
  position:sticky;
  top:0;
  background:#FCFEFD;
  border-bottom:none;
  z-index:100;
}
.lp-hero-zone--merch{
  --lp-nav-merch-height:68px;
  position:relative;
  background:#FCFEFD;
  color:#004D3D;
  height:calc(100dvh - var(--lp-nav-merch-height));
  max-height:calc(100dvh - var(--lp-nav-merch-height));
  min-height:0;
  display:flex;
  flex-direction:column;
  overflow:hidden;
}
.lp-nav__inner--merch{
  display:grid;
  grid-template-columns:1fr auto;
  align-items:center;
  height:68px;
  gap:16px;
}
@media(min-width:1024px){
  .lp-nav__inner--merch{grid-template-columns:1fr auto 1fr}
  .lp-nav__links--merch{justify-self:center}
  .lp-nav__actions--merch{justify-self:end}
}
.lp-nav__links--merch{display:none;gap:28px}
@media(min-width:1024px){.lp-nav__links--merch{display:flex}}
.lp-nav__links--merch a{
  color:#004D3D;
  text-decoration:none;
  font-size:.9375rem;
  font-weight:500;
  display:inline-flex;
  align-items:center;
  gap:4px;
  transition:opacity .2s;
}
.lp-nav__links--merch a:hover{opacity:.7}
.lp-nav__chevron{width:14px;height:14px;opacity:.7;flex-shrink:0}
.lp-nav__actions--merch{display:none;align-items:center;gap:16px}
@media(min-width:1024px){.lp-nav__actions--merch{display:flex}}
.lp-btn-ghost--merch{color:#004D3D}
.lp-btn-ghost--merch:hover{color:#004D3D;opacity:.7}
.lp-nav__menu{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:40px;
  height:40px;
  border-radius:8px;
  border:1px solid #d4e5dc;
  background:#fff;
  color:#004D3D;
  cursor:pointer;
  justify-self:end;
  padding:0;
}
.lp-nav__menu-icon{width:20px;height:20px}
@media(min-width:1024px){.lp-nav__menu{display:none}}
.lp-hero--merch{
  position:relative;
  flex:1;
  min-height:0;
  height:100%;
  display:flex;
  flex-direction:column;
  padding:clamp(4px,1.2vh,16px) 0 clamp(8px,1.5vh,16px);
  background:transparent;
  color:inherit;
  text-align:center;
  overflow:hidden;
}
.lp-hero--merch__inner{
  position:relative;
  z-index:2;
  flex:1;
  min-height:0;
  height:100%;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:space-around;
  gap:clamp(4px,1vh,12px);
  max-width:1320px;
  margin:0 auto;
  width:100%;
  padding:0 clamp(20px,3vw,40px);
}
.lp-hero__content--merch{
  flex-shrink:0;
  max-width:680px;
  margin:0 auto;
  text-align:center;
  display:flex;
  flex-direction:column;
  align-items:center;
  gap:clamp(12px,2.2vh,20px);
}
.lp-hero__headline{
  margin:0 auto;
  max-width:860px;
  font-size:clamp(2.15rem,5vh + 1.15rem,6rem);
  font-weight:600;
  line-height:1.05;
  letter-spacing:normal;
  color:#004D3D;
}
.lp-hero__lede{
  margin:0 auto;
  max-width:640px;
  font-size:clamp(.995rem,1.3vh + .65rem,1.825rem);
  line-height:1.45;
  color:#5a6b64;
}
.lp-hero__lede-br{display:none}
@media(min-width:768px){.lp-hero__lede-br{display:inline}}
.lp-hero__announce{
  display:inline-flex;
  align-items:center;
  gap:6px;
  padding:6px 16px;
  border-radius:999px;
  background:#e8f2ec;
  color:#004D3D;
  font-size:.8125rem;
  font-weight:500;
  text-decoration:none;
  transition:opacity .2s;
}
.lp-hero__announce:hover{opacity:.8}
.lp-hero__announce strong{font-weight:600}
.lp-hero__announce-icon{width:14px;height:14px;flex-shrink:0}
.lp-hero__title--merch{
  font-size:clamp(2.5rem,5.2vw,4.25rem);
  font-weight:700;
  line-height:1.05;
  letter-spacing:-.03em;
  color:#004D3D;
  margin:20px 0 16px;
}
.lp-hero__sub--merch{
  font-size:clamp(1rem,1.4vw,1.1875rem);
  color:#5a6b64;
  line-height:1.55;
  max-width:560px;
  margin:0 auto 28px;
}
.lp-hero__ctas--merch{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  gap:10px;
  margin-top:clamp(8px,1.5vh,16px);
  margin-bottom:0;
}
.lp-hero__ctas--merch .lp-btn-primary{padding:clamp(9px,1.2vh,12px) clamp(20px,2.5vw,28px);font-size:clamp(.84rem,.9vh + .4rem,.9375rem)}
.lp-hero__ctas--merch .lp-btn-outline-green{padding:clamp(8px,1.1vh,11px) clamp(20px,2.5vw,28px);font-size:clamp(.84rem,.9vh + .4rem,.9375rem);text-transform:none;letter-spacing:0}
.lp-hero__trust{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  align-items:center;
  gap:8px 12px;
  list-style:none;
  margin-top:clamp(8px,1.5vh,16px);
  margin-bottom:0;
  padding:0;
  font-size:clamp(.72rem,.9vh + .35rem,.8125rem);
  color:#5a6b64;
}
.lp-hero__trust li{display:inline-flex;align-items:center;gap:6px}
.lp-hero__trust-sep{
  display:none;
  width:4px;
  height:4px;
  border-radius:50%;
  background:#b8ccc4;
  flex-shrink:0;
}
@media(min-width:640px){.lp-hero__trust-sep{display:inline-block}}
.lp-hero__trust-icon{color:#004D3D;flex-shrink:0}
.lp-hero__mockup{
  position:relative;
  flex:1 1 auto;
  min-height:0;
  width:min(100%,600px);
  margin:0 auto;
  padding:0 8px;
  display:flex;
  align-items:flex-end;
  justify-content:center;
  perspective:1800px;
  transform-style:preserve-3d;
  transform-origin:bottom right;
}
.lp-hero__mockup::before{
  content:'';
  position:absolute;
  inset:-12% -8% -4%;
  background:radial-gradient(ellipse 80% 60% at 50% 85%,rgba(0,77,61,.1) 0%,transparent 72%);
  pointer-events:none;
  z-index:0;
}
.lp-hero__mockup::after{
  content:'';
  position:absolute;
  bottom:-6px;
  left:8%;
  width:72%;
  height:28px;
  background:radial-gradient(ellipse,rgba(0,77,61,.22) 0%,transparent 70%);
  filter:blur(6px);
  pointer-events:none;
  z-index:0;
}
.lp-hero__mockup:hover{
  transform:rotateX(9deg) rotateY(7deg);
}
.lp-hero__mockup-frame{
  position:relative;
  z-index:1;
  max-height:100%;
  width:100%;
  overflow:hidden;
  border-radius:clamp(12px,1.5vh,20px);
  border:1px solid rgba(0,77,61,.12);
  background:#fff;
  box-shadow:
    0 1px 2px rgba(0,77,61,.06),
    0 6px 16px rgba(0,77,61,.08),
    0 20px 40px rgba(0,77,61,.1),
    0 40px 80px -16px rgba(0,77,61,.18),
    inset 0 1px 0 rgba(255,255,255,.8);
}
.lp-hero__mockup:hover .lp-hero__mockup-frame{
  box-shadow:
    0 2px 4px rgba(0,77,61,.08),
    0 10px 24px rgba(0,77,61,.12),
    0 28px 56px rgba(0,77,61,.14),
    0 48px 96px -12px rgba(0,77,61,.24),
    inset 0 1px 0 rgba(255,255,255,.8);
}
.lp-hero__mockup-frame img{
  display:block;
  width:100%;
  max-height:min(45vh,340px);
  object-fit:contain;
  object-position:bottom center;
}
@keyframes lp-float-bob-1 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(1.2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes lp-float-bob-2 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-1.5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
@keyframes lp-float-bob-3 {
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-12px) rotate(0.8deg); }
  100% { transform: translateY(0px) rotate(0deg); }
}
.lp-hero__floats{
  pointer-events:none;
  position:absolute;
  inset:0;
  z-index:1;
  overflow:hidden;
}
.lp-hero__float{
  position:absolute;
  display:none;
  z-index:1;
  user-select:none;
  filter:drop-shadow(0 16px 32px rgba(0,77,61,.12));
}
@media(min-width:1280px){.lp-hero__float{display:block}}
.lp-hero__float--hoodie{left:9%;top:6%;width:clamp(170px,20vw,220px);animation:lp-float-bob-1 6s ease-in-out infinite}
.lp-hero__float--tote{left:2%;bottom:16%;width:clamp(120px,20vw,180px);animation:lp-float-bob-2 7s ease-in-out infinite}
.lp-hero__float--mug{left:19%;bottom:4%;width:clamp(150px,12vw,180px);animation:lp-float-bob-3 5.5s ease-in-out infinite}
.lp-hero__float--bottle{right:10%;top:7%;width:clamp(100px,12vw,240px);animation:lp-float-bob-2 8s ease-in-out infinite}
.lp-hero__float--diary{right:2%;bottom:28%;width:clamp(88px,9vw,140px);animation:lp-float-bob-1 6.5s ease-in-out infinite}
.lp-hero__float--cap{right:10%;bottom:2%;width:clamp(100px,16vw,180px);animation:lp-float-bob-3 7.5s ease-in-out infinite}
@media(min-width:1536px){
  .lp-hero__float--hoodie{width:clamp(200px,20vw,260px)}
  .lp-hero__float--tote{width:clamp(180px,20vw,260px)}
  .lp-hero__float--mug{width:clamp(150px,13vw,190px)}
  .lp-hero__float--bottle{width:clamp(200px,24vw,240px)}
  .lp-hero__float--diary{width:clamp(180px,20vw,240px)}
  .lp-hero__float--cap{width:clamp(150px,20vw,230px)}
}
.lp-hero__decor{
  position:absolute;
  display:none;
  z-index:1;
  pointer-events:none;
}
@media(min-width:1280px){.lp-hero__decor{display:block}}
.lp-hero__decor--sprig{left:3%;top:8%}
.lp-hero__decor--squiggle{left:24%;top:38%}
.lp-hero__decor--wave{right:3.5%;top:10%;transform:rotate(10deg)}
.lp-hero__decor--dots-r{
  right:2.8%;
  bottom:8%;
  display:none;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
}
.lp-hero__decor--dots-l{
  left:1%;
  bottom:10%;
  display:none;
  grid-template-columns:repeat(4,1fr);
  gap:12px;
}
@media(min-width:1280px){
  .lp-hero__decor--dots-r,.lp-hero__decor--dots-l{display:grid}
}
.lp-hero__decor-dot{
  width:6px;
  height:6px;
  border-radius:50%;
  background:#004D3D;
  opacity:.3;
}

.lp-badge{display:inline-flex;align-items:center;gap:6px}
.lp-int-icon{display:flex;align-items:center;justify-content:center}
.lp-teams-nav__icon{display:inline-flex;align-items:center;margin-right:4px}
.lp-teams-feature__icon{display:inline-flex;align-items:center;justify-content:center;width:52px;height:52px;border-radius:14px;background:#ecfdf5;color:#059669;margin-bottom:16px}
.lp-teams-benefits .check{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:50%;background:#d1fae5;color:#059669;flex-shrink:0}
.lp-offerings-card__visual{display:flex;align-items:center;justify-content:center;color:#374151}
.lp-flex-card__icon{display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:12px;margin-bottom:14px}
.lp-diagram__avatar,.lp-diagram__branch span,.lp-diagram__box span,.lp-diagram__avatars span{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;background:#f3f4f6;color:#374151}
.lp-diagram__badge{display:inline-flex;align-items:center;gap:4px}
.lp-diagram__kudos{display:inline-flex;align-items:center;gap:4px}
.lp-hero-zone__curve{line-height:0;margin-bottom:-1px}
.lp-hero-zone__curve svg{display:block;width:100%;height:clamp(28px,3.5vw,40px)}

/* offerings — ShelfMerch tabbed section */
.lp-offerings{background:var(--lp-body-bg)}
.lp-offerings.lp-section{padding:0 0 clamp(64px,8vw,96px)}
.lp-nav--merch + .lp-hero-zone--merch + .lp-offerings.lp-section,
.lp-hero-zone--merch + .lp-offerings.lp-section{
  padding-top:clamp(32px,5vw,56px);
}
.lp-hero-zone--merch + .lp-offerings .lp-offerings__shell{
  margin-top:0;
}
.lp-offerings__header{text-align:center;padding:0 24px clamp(20px,3vw,28px);position:relative;z-index:1}
.lp-offerings__header .lp-hero__badge{
  border-color:rgba(255,255,255,.28);background:rgba(255,255,255,.1);color:#d4e8dc;
}
.lp-offerings__title{
  font-size:clamp(1.45rem,3vw,2rem);font-weight:800;color:#fff;
  letter-spacing:-.02em;line-height:1.15;margin-bottom:10px;
}
.lp-offerings__sub{
  font-size:clamp(.86rem,1.4vw,.95rem);color:rgba(244,250,246,.75);
  max-width:480px;margin:0 auto;line-height:1.6;
}
.lp-offerings__shell{
  background:#fff;border-radius:20px;overflow:hidden;
  border:1px solid rgba(6,64,43,.08);
  box-shadow:0 8px 32px rgba(6,64,43,.08),0 24px 64px rgba(6,64,43,.06);
  margin-top:clamp(-28px,-3vw,-40px);position:relative;z-index:2;
}
.lp-offerings-tabs{
  display:flex;flex-wrap:wrap;justify-content:center;gap:0;
  border-bottom:1px solid rgba(6,64,43,.1);
  background:linear-gradient(180deg,#fafcfb 0%,#f6faf8 100%);
  overflow:hidden;margin-bottom:0;
}
.lp-offerings-tab{
  flex:1 1 100px;min-width:88px;display:flex;flex-direction:column;align-items:center;gap:6px;
  padding:14px 8px;background:transparent;border:none;
  border-right:1px solid rgba(6,64,43,.08);border-bottom:3px solid transparent;
  cursor:pointer;transition:background .2s,color .2s;
  color:var(--lp-text-muted);font-size:.72rem;font-weight:600;
}
.lp-offerings-tab:last-child{border-right:none}
.lp-offerings-tab__icon{display:block;width:38px;height:38px;object-fit:contain;flex-shrink:0}
@media(max-width:640px){.lp-offerings-tab__icon{width:32px;height:32px}}
.lp-offerings-tab__label{text-align:center;line-height:1.25}
.lp-offerings-tab:hover{background:rgba(6,64,43,.04);color:var(--tab-accent,var(--lp-green-mid))}
.lp-offerings-tab.is-active{background:#fff;color:var(--tab-accent,var(--lp-green-deep));border-bottom-color:var(--tab-accent,var(--lp-green-deep))}
.lp-offerings-panel{
  background:var(--panel-bg,var(--lp-green-surface));
  border-top:none;padding:clamp(24px,4vw,40px) clamp(16px,3vw,32px) clamp(28px,4vw,36px);
}
.lp-offerings-panel__title{text-align:center;font-size:clamp(1.1rem,2.5vw,1.4rem);font-weight:800;color:var(--panel-accent,var(--lp-green));margin-bottom:clamp(20px,3vw,32px)}
.lp-offerings-panel__cta{text-align:center;margin-top:8px}
.lp-offerings-learn{display:inline-block;font-size:.72rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--panel-accent,var(--lp-green-mid));text-decoration:underline;text-underline-offset:4px}
.lp-offerings-shop{display:flex;align-items:flex-start;gap:clamp(20px,3.5vw,40px);max-width:960px;margin:0 auto}
.lp-shop-hero{flex:1;min-width:0}
.lp-shop-hero__img{display:block;width:100%;height:auto;max-width:100%}
.lp-offerings-perfect--shop{width:min(100%,200px);flex-shrink:0;background:transparent;box-shadow:none;border:none;padding:8px 0 0}
.lp-offerings-perfect--shop h4{font-size:.65rem;font-weight:800;color:#6b7280;letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px}
.lp-offerings-perfect--shop ul{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:20px}
.lp-offerings-perfect--shop li{display:flex;align-items:flex-start;gap:8px;font-size:.78rem;color:#374151;line-height:1.4}
.lp-offerings-perfect--shop li svg{width:15px;height:15px;flex-shrink:0;margin-top:2px}
.lp-offerings-perfect{background:#fff;border-radius:12px;padding:14px;box-shadow:0 4px 18px rgba(0,0,0,.06);border:1px solid rgba(0,0,0,.04)}
.lp-offerings-perfect h4{font-size:.62rem;font-weight:800;color:#006838;letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px}
.lp-offerings-perfect ul{list-style:none;display:flex;flex-direction:column;gap:7px;margin-bottom:12px}
.lp-offerings-perfect li{display:flex;align-items:flex-start;gap:7px;font-size:.7rem;color:#374151;line-height:1.35}
.lp-offerings-perfect li svg{width:14px;height:14px;flex-shrink:0;margin-top:1px}
.lp-offerings-feat{display:flex;gap:10px;align-items:flex-start}
.lp-offerings-feat span{font-size:1.2rem;flex-shrink:0}
.lp-offerings-feat strong{display:block;font-size:.82rem;color:#006838;margin-bottom:4px}
.lp-offerings-feat p{font-size:.78rem;color:#6b7280;line-height:1.5}
.lp-offerings-feature-cards{max-width:920px;margin:0 auto}
.lp-offerings-feature-cards__grid{display:grid;gap:clamp(12px,2vw,20px)}
.lp-offerings-feature-cards--gifting .lp-offerings-feature-cards__grid{grid-template-columns:repeat(4,1fr)}
.lp-offerings-feature-cards--anniversaries .lp-offerings-feature-cards__grid{grid-template-columns:repeat(3,1fr);max-width:780px;margin:0 auto}
.lp-offerings-feature-cards__card{background:#fff;border-radius:14px;padding:clamp(18px,2.5vw,24px) clamp(12px,1.5vw,16px) clamp(16px,2vw,20px);text-align:center;box-shadow:0 4px 24px rgba(0,0,0,.05);border:1px solid rgba(0,0,0,.03);display:flex;flex-direction:column;align-items:center;height:100%}
.lp-offerings-feature-cards__visual{width:100%;max-width:180px;margin:0 auto 14px;display:flex;align-items:center;justify-content:center;min-height:clamp(110px,13vw,150px)}
.lp-offerings-feature-cards--anniversaries .lp-offerings-feature-cards__visual{max-width:220px;min-height:clamp(120px,14vw,165px)}
.lp-offerings-feature-cards__visual img{width:100%;height:auto;max-width:100%;object-fit:contain;display:block}
.lp-offerings-feature-cards__card h4{font-size:.88rem;font-weight:800;color:#111827;margin-bottom:6px;line-height:1.3}
.lp-offerings-feature-cards__card p{font-size:.76rem;color:#6b7280;line-height:1.5;margin:0;max-width:22ch}
@media(max-width:900px){.lp-offerings-feature-cards--gifting .lp-offerings-feature-cards__grid,.lp-offerings-feature-cards--anniversaries .lp-offerings-feature-cards__grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.lp-offerings-feature-cards--gifting .lp-offerings-feature-cards__grid,.lp-offerings-feature-cards--anniversaries .lp-offerings-feature-cards__grid{grid-template-columns:1fr;max-width:300px;margin:0 auto}}
.lp-offerings-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:clamp(12px,2vw,20px);max-width:900px;margin:0 auto}
.lp-offerings-cards--5{max-width:100%;grid-template-columns:repeat(auto-fit,minmax(120px,1fr))}
.lp-offerings-card{background:#fff;border-radius:12px;padding:clamp(16px,2vw,24px) clamp(12px,2vw,16px);text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.05)}
.lp-offerings-card__visual{width:clamp(56px,8vw,72px);height:clamp(56px,8vw,72px);margin:0 auto 12px;border-radius:12px;background:linear-gradient(145deg,#f8fafc,#f1f5f9);display:flex;align-items:center;justify-content:center;font-size:clamp(1.5rem,3vw,2rem)}
.lp-offerings-card h4{font-size:.85rem;font-weight:800;color:#1f2937;margin-bottom:6px}
.lp-offerings-card p{font-size:.75rem;color:#6b7280;line-height:1.45}
.lp-offerings-kudos{display:grid;grid-template-columns:minmax(260px,1fr) minmax(280px,380px);gap:clamp(28px,4vw,48px);align-items:center;max-width:920px;margin:0 auto}
.lp-offerings-kudos__list{list-style:none;display:flex;flex-direction:column;gap:16px}
.lp-offerings-kudos__list li{display:flex;gap:12px;align-items:flex-start;font-size:.9rem;color:#374151;line-height:1.55}
.lp-offerings-kudos__check{display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#fae8eb;color:#C45C6A;flex-shrink:0;margin-top:1px}
.lp-kudos-preview{background:#fff;border-radius:16px;border:1px solid rgba(255,91,119,.12);box-shadow:0 16px 48px rgba(255,91,119,.1);overflow:hidden}
.lp-kudos-preview__head{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-bottom:1px solid #fce7f3;background:linear-gradient(180deg,#fff,#fff8fa)}
.lp-kudos-preview__title{display:flex;align-items:center;gap:8px;font-size:.82rem;font-weight:800;color:#9f1239}
.lp-kudos-preview__title-icon{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:8px;background:#fae8eb;color:#C45C6A}
.lp-kudos-preview__live{font-size:.62rem;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#16a34a;background:#ecfdf5;padding:4px 8px;border-radius:999px}
.lp-kudos-preview__live::before{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:#22c55e;margin-right:5px;vertical-align:middle}
.lp-kudos-preview__feed{display:flex;flex-direction:column;gap:10px;padding:14px}
.lp-kudos-preview__item{display:grid;grid-template-columns:auto 1fr auto;gap:10px;align-items:start;padding:12px;border-radius:12px;background:#fafafa;border:1px solid #f3f4f6}
.lp-kudos-preview__avatar{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;font-size:.62rem;font-weight:800;letter-spacing:.02em;flex-shrink:0}
.lp-kudos-preview__meta{font-size:.76rem;color:#6b7280;margin:0 0 3px;line-height:1.35}
.lp-kudos-preview__meta strong{color:#111827;font-weight:700}
.lp-kudos-preview__msg{font-size:.74rem;color:#4b5563;margin:0;line-height:1.45}
.lp-kudos-preview__pts{font-size:.72rem;font-weight:800;color:#fff;background:linear-gradient(135deg,#C45C6A,#a84855);padding:5px 9px;border-radius:999px;white-space:nowrap;margin-top:2px}
.lp-kudos-preview__footer{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#fce7f3;border-top:1px solid #fce7f3}
.lp-kudos-preview__footer div{padding:12px 16px;background:#fff8fa;text-align:center}
.lp-kudos-preview__footer strong{display:block;font-size:1rem;font-weight:800;color:#9f1239;line-height:1.2}
.lp-kudos-preview__footer span{font-size:.65rem;color:#9ca3af;font-weight:600}
@media(max-width:768px){.lp-offerings-kudos{grid-template-columns:1fr}}
.lp-offerings-brands{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:clamp(12px,3vw,24px);margin-top:clamp(20px,3vw,28px);padding-top:20px;border-top:1px solid rgba(0,0,0,.06)}
.lp-offerings-brands span{font-size:.8rem;font-weight:700;color:#9ca3af;letter-spacing:.02em}
.lp-offerings-brands__more{font-size:.75rem;color:#6b7280;font-weight:600}
.lp-offerings-footer{display:flex;flex-wrap:wrap;justify-content:center;gap:clamp(12px,3vw,28px);list-style:none;margin:0;padding:clamp(16px,2.5vw,20px) clamp(16px,3vw,24px);border-top:1px solid rgba(6,64,43,.1);background:rgba(255,255,255,.55)}
.lp-offerings-footer li{display:flex;align-items:center;gap:8px;font-size:.8rem;font-weight:600;color:#3d4f47}
.lp-offerings-footer li svg{width:16px;height:16px;flex-shrink:0;color:var(--lp-green)}
.lp-offerings-footer--gifting li svg{color:#047857}
.lp-offerings-footer--anniversaries li svg{color:#1A6B52}
.lp-offerings-footer--kudos li svg{color:#C45C6A}
.lp-offerings-footer span{display:inline-flex;width:20px;height:20px;border-radius:50%;background:#d1fae5;color:#059669;align-items:center;justify-content:center;font-size:.6rem;font-weight:800}
@media(max-width:768px){.lp-offerings-shop{flex-direction:column;align-items:stretch}.lp-offerings-perfect--shop{width:100%;padding-top:0}.lp-offerings-kudos{grid-template-columns:1fr}}
@media(max-width:640px){.lp-offerings-tabs{border-radius:0}.lp-offerings-tab{flex:1 1 45%;border-bottom:1px solid rgba(6,64,43,.08)}.lp-offerings__shell{border-radius:16px}}

/* shared section patterns */
.lp-section{padding:clamp(56px,7vw,80px) 0}
.lp-section-header{text-align:center;margin-bottom:clamp(28px,4vw,40px)}
.lp-section-header--left{text-align:left}
.lp-section-header--left .lp-section-header__sub{margin-left:0}
.lp-section-header__title{
  font-size:clamp(1.45rem,3vw,2rem);font-weight:800;color:var(--lp-ink);
  letter-spacing:-.02em;line-height:1.2;margin-bottom:10px;
}
.lp-section-header__sub{
  font-size:clamp(.86rem,1.4vw,.95rem);color:var(--lp-text-muted);
  max-width:520px;margin:0 auto;line-height:1.6;
}
.lp-shell{
  background:#fff;border-radius:20px;overflow:hidden;
  border:1px solid rgba(20,83,45,.08);
  box-shadow:0 8px 32px rgba(20,83,45,.06),0 20px 48px rgba(20,83,45,.04);
}
.lp-center{text-align:center;margin-top:clamp(28px,4vw,36px)}

/* intro */
.lp-intro{background:var(--lp-body-bg)}
.lp-intro__shell{padding:0;overflow:hidden}
.lp-intro__grid{
  display:grid;grid-template-columns:minmax(280px,.95fr) minmax(300px,1.05fr);
  gap:0;align-items:stretch;
}
.lp-intro__copy{
  order:1;padding:clamp(28px,4vw,44px);
  background:linear-gradient(160deg,var(--lp-green-surface) 0%,#fff 55%);
  display:flex;flex-direction:column;justify-content:center;
}
.lp-intro__media{
  order:2;padding:clamp(20px,3.5vw,36px);
  display:flex;flex-direction:column;justify-content:center;gap:14px;
  background:#fff;
}
.lp-intro__eyebrow{
  display:inline-flex;align-items:center;gap:6px;width:fit-content;
  padding:5px 12px;border-radius:999px;margin-bottom:14px;
  background:rgba(21,128,61,.1);color:var(--lp-green-mid);
  font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;
}
.lp-intro__copy h3{
  font-size:clamp(1.2rem,2.4vw,1.5rem);font-weight:800;color:var(--lp-ink);
  margin-bottom:10px;line-height:1.25;letter-spacing:-.02em;
}
.lp-intro__lede{color:var(--lp-text-muted);margin-bottom:20px;line-height:1.65;font-size:.92rem}
.lp-intro__features{list-style:none;display:flex;flex-direction:column;gap:10px;margin:0 0 24px;padding:0}
.lp-intro__feature{
  display:flex;align-items:flex-start;gap:12px;padding:11px 13px;border-radius:12px;
  background:#fff;border:1px solid rgba(20,83,45,.08);
  transition:border-color .2s,box-shadow .2s,transform .2s;
}
.lp-intro__feature:hover{
  border-color:rgba(20,83,45,.14);box-shadow:0 6px 20px rgba(20,83,45,.07);transform:translateY(-1px);
}
.lp-intro__feature-icon{
  width:36px;height:36px;border-radius:10px;flex-shrink:0;
  background:var(--lp-green-surface);color:var(--lp-green);
  display:flex;align-items:center;justify-content:center;
}
.lp-intro__feature-text{display:flex;flex-direction:column;gap:2px;min-width:0}
.lp-intro__feature-text strong{font-size:.84rem;font-weight:700;color:var(--lp-ink);line-height:1.3}
.lp-intro__feature-text span{font-size:.78rem;color:var(--lp-text-muted);line-height:1.4}
.lp-intro__ctas{display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px}
.lp-intro__play-link{
  display:inline-flex;align-items:center;gap:8px;padding:0;border:none;background:transparent;
  font:inherit;font-size:.88rem;font-weight:600;color:var(--lp-green-mid);cursor:pointer;
  text-decoration:none;transition:color .2s,opacity .2s;
}
.lp-intro__play-link:hover{color:var(--lp-green-deep)}
.lp-intro__play-link-icon{
  width:30px;height:30px;border-radius:50%;flex-shrink:0;
  background:var(--lp-green-surface);color:var(--lp-green-deep);
  display:flex;align-items:center;justify-content:center;
  transition:background .2s,transform .2s;
}
.lp-intro__play-link:hover .lp-intro__play-link-icon{background:var(--lp-hero-mint);transform:scale(1.05)}
.lp-video-mock{
  background:#152820;border-radius:16px;overflow:hidden;
  box-shadow:0 20px 50px -12px rgba(20,83,45,.22),0 0 0 1px rgba(20,83,45,.06);
  transition:transform .3s,box-shadow .3s;
}
.lp-intro__media:hover .lp-video-mock{transform:translateY(-3px);box-shadow:0 28px 60px -14px rgba(20,83,45,.28)}
.lp-video-mock__bar{
  display:flex;align-items:center;gap:7px;padding:11px 14px;background:#1f352e;
  border-bottom:1px solid rgba(255,255,255,.06);
}
.lp-video-mock__dot{width:10px;height:10px;border-radius:50%;flex-shrink:0}
.lp-video-mock__dot--close{background:#ff5f57}
.lp-video-mock__dot--min{background:#febc2e}
.lp-video-mock__dot--max{background:#28c840}
.lp-video-mock__title{
  margin-left:6px;font-size:.7rem;font-weight:500;color:rgba(255,255,255,.45);
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.lp-video-mock__screen{
  position:relative;display:block;width:100%;aspect-ratio:16/10;padding:0;border:none;
  background:#0f241c;cursor:pointer;overflow:hidden;
}
.lp-video-mock__poster{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:top center;
  transition:transform .5s ease,filter .35s ease;
}
.lp-video-mock__screen:hover .lp-video-mock__poster,.lp-video-mock__screen:focus-visible .lp-video-mock__poster{
  transform:scale(1.03);filter:brightness(.72);
}
.lp-video-mock__overlay{
  position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:12px;background:linear-gradient(180deg,rgba(15,36,28,.15) 0%,rgba(15,36,28,.55) 100%);
  transition:background .3s;
}
.lp-video-mock__screen:hover .lp-video-mock__overlay,.lp-video-mock__screen:focus-visible .lp-video-mock__overlay{
  background:linear-gradient(180deg,rgba(15,36,28,.25) 0%,rgba(15,36,28,.65) 100%);
}
.lp-video-mock__play{
  position:relative;width:64px;height:64px;border-radius:50%;
  background:rgba(255,255,255,.95);color:var(--lp-green-deep);
  display:flex;align-items:center;justify-content:center;padding-left:3px;
  box-shadow:0 8px 32px rgba(0,0,0,.28);
  transition:transform .25s cubic-bezier(.34,1.56,.64,1),box-shadow .25s;
}
.lp-video-mock__play::before{
  content:'';position:absolute;inset:-10px;border-radius:50%;
  border:2px solid rgba(255,255,255,.45);animation:lp-intro-pulse 2.2s ease-out infinite;
}
@keyframes lp-intro-pulse{
  0%{transform:scale(.92);opacity:.85}
  70%,100%{transform:scale(1.18);opacity:0}
}
.lp-video-mock__screen:hover .lp-video-mock__play,.lp-video-mock__screen:focus-visible .lp-video-mock__play{
  transform:scale(1.08);box-shadow:0 12px 40px rgba(0,0,0,.35);
}
.lp-video-mock__screen:focus-visible{outline:2px solid var(--lp-gold);outline-offset:-2px}
.lp-video-mock__label{color:rgba(255,255,255,.9);font-size:.84rem;font-weight:600;letter-spacing:.01em}
.lp-video-mock__duration{
  position:absolute;bottom:36px;right:12px;z-index:2;
  padding:4px 8px;border-radius:6px;background:rgba(0,0,0,.72);backdrop-filter:blur(4px);
  color:#fff;font-size:.7rem;font-weight:700;font-variant-numeric:tabular-nums;
}
.lp-video-mock__progress{
  position:absolute;bottom:0;left:0;right:0;height:4px;background:rgba(255,255,255,.15);z-index:2;
}
.lp-video-mock__progress-fill{
  display:block;height:100%;width:18%;border-radius:0 2px 2px 0;
  background:linear-gradient(90deg,var(--lp-gold),var(--lp-gold-strong));
}
.lp-video-mock__chapters{
  display:flex;gap:6px;padding:10px 12px;background:#1a2e28;
  overflow-x:auto;scrollbar-width:none;
}
.lp-video-mock__chapters::-webkit-scrollbar{display:none}
.lp-video-mock__chapter{
  flex-shrink:0;padding:5px 11px;border-radius:999px;
  font-size:.68rem;font-weight:600;color:rgba(255,255,255,.55);
  background:rgba(255,255,255,.06);border:1px solid transparent;
  transition:background .2s,color .2s,border-color .2s;
}
.lp-video-mock__chapter.is-active{
  color:#fff;background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.18);
}
.lp-intro__caption{
  display:flex;align-items:center;justify-content:center;gap:7px;
  margin:0;font-size:.78rem;font-weight:500;color:var(--lp-text-muted);
}
.lp-intro__caption svg{color:var(--lp-green-mint);flex-shrink:0}
@media(max-width:768px){
  .lp-intro__grid{grid-template-columns:1fr}
  .lp-intro__media{order:1;padding-bottom:16px}
  .lp-intro__copy{order:2}
  .lp-intro__ctas{flex-direction:column;align-items:stretch}
  .lp-intro__ctas .lp-btn-primary{justify-content:center}
  .lp-intro__play-link{justify-content:center}
}

/* social proof */
.lp-social{
  background:#ecefed;padding-top:clamp(48px,6vw,72px);padding-bottom:clamp(40px,5vw,56px);
}
.lp-social__layout{
  display:grid;grid-template-columns:minmax(200px,.9fr) minmax(280px,1.35fr);
  gap:clamp(32px,5vw,64px);align-items:center;margin-bottom:clamp(32px,4vw,48px);
}
.lp-social__label{
  font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;
  color:#6b7f8f;margin:0 0 12px;
}
.lp-social__title{
  font-size:clamp(1.55rem,2.8vw,2.15rem);font-weight:800;line-height:1.15;
  color:var(--lp-ink);margin:0;letter-spacing:-.02em;
}
.lp-social__title span{color:var(--lp-green-deep)}
.lp-social__logos{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:clamp(28px,4vw,44px) clamp(20px,3vw,36px);align-items:center;justify-items:center;
}
.lp-social__logo{
  display:flex;align-items:center;justify-content:center;width:100%;min-height:40px;padding:4px 8px;
}
.lp-social__logo img{
  display:block;width:auto;height:clamp(22px,3.2vw,32px);max-width:min(140px,100%);
  object-fit:contain;opacity:1;filter:none;
}
.lp-social__quote{
  display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;
  gap:0 clamp(16px,3vw,28px);align-items:start;max-width:720px;margin:0 auto;
  padding:clamp(22px,3vw,32px) clamp(20px,3vw,36px);
}
@media(max-width:768px){
  .lp-social__layout{grid-template-columns:1fr;gap:28px}
  .lp-social__logos{grid-template-columns:repeat(2,1fr);gap:24px 20px}
}
@media(max-width:420px){.lp-social__logos{grid-template-columns:repeat(2,1fr)}}
.lp-social__mark{
  grid-row:1/span 2;font-size:clamp(2.5rem,5vw,3.25rem);line-height:1;
  font-weight:800;color:var(--lp-gold);font-family:Georgia,serif;margin-top:-4px;
}
.lp-social__quote blockquote{
  grid-column:2;font-size:clamp(.95rem,1.6vw,1.08rem);font-weight:600;
  color:var(--lp-ink);line-height:1.55;margin:0;font-style:normal;
}
.lp-social__author{
  grid-column:2;display:flex;align-items:center;gap:10px;margin-top:14px;
}
.lp-social__avatar{
  width:36px;height:36px;border-radius:50%;flex-shrink:0;
  background:linear-gradient(135deg,var(--lp-hero-mint),var(--lp-hero-mint-2));
  color:var(--lp-green-deep);display:flex;align-items:center;justify-content:center;
  font-weight:800;font-size:.72rem;border:1px solid rgba(20,83,45,.12);
}
.lp-social__author strong{display:block;font-size:.84rem;color:var(--lp-ink);font-weight:700}
.lp-social__author span span{display:block;font-size:.76rem;color:var(--lp-text-muted);font-weight:500;margin-top:1px}
@media(max-width:560px){
  .lp-social__quote{grid-template-columns:1fr;gap:8px}
  .lp-social__mark{grid-row:auto;font-size:2rem}
  .lp-social__quote blockquote,.lp-social__author{grid-column:1}
}

/* categories — Stadium-style catalog grid */
.lp-categories-section{background:var(--lp-body-bg)}
.lp-categories{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:clamp(10px,1.4vw,14px);
}
.lp-cat-card{
  aspect-ratio:1;border-radius:clamp(10px,1.2vw,14px);overflow:hidden;
  text-decoration:none;position:relative;
  transition:transform .22s ease,box-shadow .22s ease;
}
.lp-cat-card:hover{
  transform:translateY(-3px);
  box-shadow:0 14px 36px rgba(20,83,45,.14);
}
.lp-cat-card--full{display:block}
.lp-cat-card--full img{width:100%;height:100%;object-fit:cover;display:block}
.lp-cat-card--bleed{background:#ddd0f0}
.lp-cat-card--bleed img{transform:scale(1.08);transform-origin:center}
.lp-cat-card--tile{
  display:flex;flex-direction:column;align-items:stretch;
}
.lp-cat-card--tile h3{
  margin:0;padding:clamp(12px,2vw,16px) 10px 6px;
  text-align:center;font-size:clamp(.82rem,1.35vw,1rem);font-weight:800;
  color:#fff;line-height:1.25;letter-spacing:-.01em;
}
.lp-cat-card--tile .lp-cat-card__media{
  flex:1;min-height:0;display:flex;align-items:flex-end;justify-content:center;
  padding:0 8px 10px;
}
.lp-cat-card--tile .lp-cat-card__media img{
  width:88%;max-height:72%;object-fit:contain;display:block;
  filter:drop-shadow(0 8px 18px rgba(0,0,0,.18));
}
.lp-categories__cta{text-align:center;margin-top:clamp(24px,3.5vw,32px)}
@media(max-width:900px){.lp-categories{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.lp-categories{grid-template-columns:1fr;max-width:360px;margin:0 auto}}

/* integrations */
.lp-integrations{background:var(--lp-body-bg)}
.lp-integrations__shell{padding:clamp(28px,4vw,40px) clamp(16px,3vw,24px)}
.lp-integration-graphic{position:relative;height:180px;margin-top:8px}
.lp-path{width:100%;height:100%}
.lp-integration-icons{position:absolute;inset:0}
.lp-int-icon{position:absolute;top:50%;transform:translateY(-50%);width:44px;height:44px;border-radius:50%;background:#fff;border:1px solid rgba(20,83,45,.1);box-shadow:0 4px 14px rgba(20,83,45,.08);display:flex;align-items:center;justify-content:center;color:var(--lp-green)}

/* teams */
.lp-teams-section{background:#fff}
.lp-teams-card{display:grid;grid-template-columns:220px 1fr 280px;overflow:hidden}
.lp-teams-nav{background:linear-gradient(180deg,#fafcfb,#f6faf8);display:flex;flex-direction:column;border-right:1px solid rgba(20,83,45,.08)}
.lp-teams-nav__item{display:flex;align-items:center;gap:10px;padding:25px 20px;background:none;border:none;border-left:3px solid transparent;cursor:pointer;font-size:.82rem;color:var(--lp-text-muted);text-align:left;transition:all .2s;border-bottom:1px solid rgba(20,83,45,.06)}
.lp-teams-nav__item.active{background:#fff;color:var(--lp-green-mid);border-left-color:var(--lp-green);font-weight:600}
.lp-teams-nav__item:hover{color:var(--lp-green)}
.lp-teams-feature{background:linear-gradient(145deg,#2d6a4f,#166534);color:#fff;padding:clamp(28px,4vw,36px) clamp(20px,3vw,28px)}
.lp-teams-feature__icon{width:48px;height:48px;border-radius:14px;background:rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.lp-teams-feature h3{font-size:clamp(1.1rem,2vw,1.3rem);font-weight:800;margin-bottom:10px}
.lp-teams-feature p{font-size:.88rem;color:rgba(255,255,255,.85);line-height:1.6;margin-bottom:16px}
.lp-teams-feature__link{color:var(--lp-gold);font-weight:700;font-size:.86rem;text-decoration:none}
.lp-teams-benefits{padding:clamp(24px,3vw,32px) clamp(18px,2.5vw,24px);list-style:none;display:flex;flex-direction:column;background:#fff}
.lp-teams-benefits li{display:flex;gap:12px;align-items:flex-start;padding:16px 0;border-bottom:1px solid rgba(20,83,45,.08);font-size:.84rem;color:#4b5f54;line-height:1.5}
.lp-teams-benefits li:last-child{border-bottom:none}
.lp-teams-benefits .check{display:inline-flex;width:22px;height:22px;border-radius:50%;background:rgba(204,231,201,.8);color:var(--lp-green);align-items:center;justify-content:center;flex-shrink:0}
@media(max-width:900px){.lp-teams-card{grid-template-columns:1fr}.lp-teams-nav{flex-direction:row;overflow-x:auto;border-right:none;border-bottom:1px solid rgba(20,83,45,.08)}.lp-teams-nav__item{white-space:nowrap;border-left:none;border-bottom:3px solid transparent}.lp-teams-nav__item.active{border-bottom-color:var(--lp-green)}}

/* use cases */
.lp-usecases{background:var(--lp-body-bg)}
.lp-usecases-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
.lp-usecase-card{display:flex;align-items:center;gap:12px;background:#fff;border-radius:12px;padding:13px 14px;border:1px solid rgba(20,83,45,.08);transition:box-shadow .2s,transform .2s;cursor:pointer}
.lp-usecase-card:hover{box-shadow:0 6px 20px rgba(20,83,45,.08);transform:translateY(-1px)}
.lp-usecase-card__icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.lp-usecase-card span:last-child{font-size:.8rem;font-weight:600;color:var(--lp-ink)}
@media(max-width:900px){.lp-usecases-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:480px){.lp-usecases-grid{grid-template-columns:1fr}}

/* flexibility */
.lp-flex-section{background:#fff}
.lp-flex-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
.lp-flex-card{padding:clamp(24px,3vw,32px) clamp(18px,2.5vw,24px);text-align:center}
.lp-flex-card__icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin:0 auto 14px}
.lp-flex-card h3{font-size:1.05rem;font-weight:800;color:var(--lp-ink);margin-bottom:8px}
.lp-flex-card p{font-size:.84rem;color:var(--lp-text-muted);line-height:1.6;margin-bottom:20px}
.lp-diagram{display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 0}
.lp-diagram__avatar{font-size:2rem}
.lp-diagram__arrow{color:#9ca3af;font-size:1.2rem}
.lp-diagram__badge{background:rgba(204,231,201,.75);color:var(--lp-green-deep);font-size:.68rem;font-weight:700;padding:8px 14px;border-radius:999px}
.lp-diagram__branch{display:flex;gap:16px;font-size:1.5rem}
.lp-diagram__box{display:flex;gap:8px;background:rgba(244,248,245,.9);padding:12px 16px;border-radius:10px;font-size:1.3rem;border:1px solid rgba(20,83,45,.08)}
.lp-diagram--circle{position:relative;min-height:120px}
.lp-diagram__kudos{background:rgba(212,162,76,.2);color:var(--lp-gold-strong);font-size:.68rem;font-weight:700;padding:12px 18px;border-radius:50%;width:96px;height:96px;display:flex;align-items:center;justify-content:center;text-align:center;line-height:1.3}
.lp-diagram__avatars{display:flex;gap:12px;font-size:1.5rem;margin-top:8px}
@media(max-width:900px){.lp-flex-grid{grid-template-columns:1fr}}

/* testimonials */
.lp-testimonials{background:linear-gradient(180deg,var(--lp-body-bg),#eaf4ee)}
.lp-testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:0}
.lp-testimonial-card{padding:clamp(22px,3vw,28px) clamp(18px,2.5vw,24px)}
.lp-testimonial-card__quote{width:38px;height:38px;border-radius:50%;background:rgba(204,231,201,.75);color:var(--lp-green-deep);display:flex;align-items:center;justify-content:center;font-size:1.4rem;font-weight:800;margin-bottom:14px}
.lp-testimonial-card p{font-size:.88rem;color:#3d4f47;line-height:1.65;margin-bottom:18px}
.lp-testimonial-card hr{border:none;border-top:1px solid rgba(20,83,45,.1);margin-bottom:14px}
.lp-testimonial-card__avatar{width:36px;height:36px;border-radius:50%;background:rgba(204,231,201,.6);display:flex;align-items:center;justify-content:center;color:var(--lp-green)}
@media(max-width:768px){.lp-testimonials-grid{grid-template-columns:1fr}}

/* footer */
.lp-footer{background:var(--lp-green-deep);color:rgba(255,255,255,.72);padding:clamp(48px,6vw,64px) 0 0}
.lp-footer__grid{display:grid;grid-template-columns:1.5fr repeat(4,1fr);gap:32px;padding-bottom:40px}
.lp-logo--footer{margin-bottom:16px}
.lp-footer__social{display:flex;gap:10px}
.lp-footer__social a{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.1);display:flex;align-items:center;justify-content:center;color:#fff;text-decoration:none;transition:background .2s}
.lp-footer__social a:hover{background:rgba(255,255,255,.18)}
.lp-footer h4{color:#fff;font-size:.84rem;margin-bottom:14px}
.lp-footer ul{list-style:none;display:flex;flex-direction:column;gap:9px}
.lp-footer a{color:rgba(255,255,255,.65);text-decoration:none;font-size:.84rem;transition:color .2s}
.lp-footer a:hover{color:#fff}
.lp-footer__bottom{border-top:1px solid rgba(255,255,255,.12);padding:18px 0}
.lp-footer__bottom .lp-container{display:flex;justify-content:space-between;font-size:.78rem;flex-wrap:wrap;gap:8px}
@media(max-width:768px){.lp-footer__grid{grid-template-columns:1fr 1fr}}
`;
