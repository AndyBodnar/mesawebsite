"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Search,
  Zap,
  Heart,
  Gift,
  Shield,
  Package,
  Sparkles,
  Car,
  User,
  Award,
  ChevronDown,
  Plus,
  Minus,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Product types
type Product = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  category: "vip" | "vehicles" | "items" | "currency";
  tags: string[];
  featured?: boolean;
  comingSoon?: boolean;
  benefits?: string[];
};

// Store data
const products: Product[] = [
  {
    id: "support-tier",
    name: "Community Support Tier",
    description: "Support the city. This tier helps fund server infrastructure, development, and moderation tools. No gameplay advantage. No economy imbalance. Just keeping Black Mesa RP running strong.",
    price: null,
    category: "vip",
    tags: ["FEATURED", "Support"],
    featured: true,
    comingSoon: true,
    benefits: [
      "Helps cover hosting and backend services",
      "Funds ongoing development and improvements",
      "Cosmetic-only recognition"
    ]
  },
  {
    id: "vehicle-customization",
    name: "Vehicle Customization Access",
    description: "Unlock advanced vehicle customization options.",
    price: null,
    category: "vehicles",
    tags: ["Cosmetic", "Vehicle RP"],
    comingSoon: true
  },
  {
    id: "character-slot",
    name: "Character Slot Expansion",
    description: "Add additional character slots to your account.",
    price: null,
    category: "items",
    tags: ["Account", "RP Flexibility"],
    comingSoon: true
  },
  {
    id: "cosmetic-pack",
    name: "Community Cosmetic Pack",
    description: "Exclusive clothing and prop items.",
    price: null,
    category: "items",
    tags: ["Clothing", "Props"],
    comingSoon: true
  },
  {
    id: "recognition-badge",
    name: "Community Recognition Badge",
    description: "Show your support with a profile badge.",
    price: null,
    category: "items",
    tags: ["Profile", "Cosmetic"],
    comingSoon: true
  }
];

const categories = [
  { id: "all", name: "All Items" },
  { id: "vip", name: "VIP Packages" },
  { id: "vehicles", name: "Vehicles" },
  { id: "items", name: "Items & Perks" },
  { id: "currency", name: "In-Game Currency" },
];

const sortOptions = [
  { id: "recommended", name: "Recommended" },
  { id: "price-low", name: "Price (Low)" },
  { id: "price-high", name: "Price (High)" },
  { id: "newest", name: "Newest" },
];

type CartItem = {
  product: Product;
  quantity: number;
};

export default function StorePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    // Sort
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity));
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity));
    }
    // "recommended" keeps featured first
    if (sortBy === "recommended") {
      result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return result;
  }, [selectedCategory, searchQuery, sortBy]);

  const getQuantity = (id: string) => quantities[id] ?? 1;

  const setQuantity = (id: string, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, Math.min(99, qty)) }));
  };

  const addToCart = (product: Product) => {
    const qty = getQuantity(product.id);
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
    0
  );

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "vip": return <Sparkles className="h-5 w-5" />;
      case "vehicles": return <Car className="h-5 w-5" />;
      case "items": return <Package className="h-5 w-5" />;
      case "currency": return <Award className="h-5 w-5" />;
      default: return <Package className="h-5 w-5" />;
    }
  };

  return (
    <div className="store-page">
      {/* Animated Brand Header */}
      <div className="store-brand-header">
        <div className="store-badge" aria-hidden="true" />
        <div className="store-brand-text">
          <h1 className="store-brand-title">BLACK&nbsp;MESA&nbsp;RP</h1>
          <div className="store-brand-sub">Community Store</div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="store-hero">
        <div className="store-hero-content">
          <h2>COMMUNITY STORE</h2>
          <p>
            This store supports the Black Mesa RP community. Purchases are balanced,
            audited, and designed to enhance both Law Enforcement and Criminal roleplay
            without breaking immersion.
          </p>
        </div>
        <div className="store-hero-ctas">
          <div className="store-spark">
            <Zap className="h-4 w-4" />
            Instant Delivery • Tebex supported
          </div>
          <button className="store-btn store-btn-primary" type="button">
            <Heart className="h-4 w-4" />
            Support the Server
          </button>
          <button className="store-btn" type="button">
            <Gift className="h-4 w-4" />
            Gift Access
          </button>
        </div>
      </section>

      {/* Main Layout */}
      <section className="store-main">
        {/* Sidebar */}
        <aside className="store-sidebar">
          {/* Cart Panel */}
          <motion.div
            className="store-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="store-card-inner">
              <div className="store-section-title">
                <span>PURCHASE QUEUE</span>
                <div className="store-mini">{cartItemCount} Item{cartItemCount !== 1 ? "s" : ""}</div>
              </div>

              <AnimatePresence mode="popLayout">
                {cart.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-white/50 py-3"
                  >
                    Your cart is empty
                  </motion.div>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <motion.div
                        key={item.product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="store-cart-row"
                      >
                        <div>
                          <strong>
                            {item.product.price
                              ? `$${(item.product.price * item.quantity).toFixed(2)}`
                              : "TBD"}
                          </strong>
                          <div><em>{item.product.name}</em></div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-white/70 text-xs">x{item.quantity}</span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-white/40 hover:text-white/70 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              <div className="h-3" />
              <button className="store-btn store-btn-primary store-view-cart" type="button">
                <ShoppingCart className="h-4 w-4" />
                {cart.length > 0 ? `Review Cart - $${cartTotal.toFixed(2)}` : "Review Cart"}
              </button>
            </div>
          </motion.div>

          {/* Categories Panel */}
          <motion.div
            className="store-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <div className="store-card-inner">
              <div className="store-section-title">
                <span>CATEGORIES</span>
                <div className="store-mini">Filter</div>
              </div>
              <div className="store-pills">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={cn("store-pill-btn", selectedCategory === cat.id && "active")}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Trust Panel */}
          <motion.div
            className="store-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="store-card-inner">
              <div className="store-section-title">
                <span>SECURITY & FAIR PLAY</span>
                <div className="store-mini">Verified</div>
              </div>
              <div className="store-trust-list">
                <div className="store-trust-item">
                  <div className="store-shield"><Shield className="h-3 w-3" /></div>
                  <div><b>Secure checkout</b><br />Payments processed via Tebex.</div>
                </div>
                <div className="store-trust-item">
                  <div className="store-shield"><Zap className="h-3 w-3" /></div>
                  <div><b>Instant delivery</b><br />Items delivered automatically in-game.</div>
                </div>
                <div className="store-trust-item">
                  <div className="store-shield"><Package className="h-3 w-3" /></div>
                  <div><b>Refund policy</b><br />Clear rules reduce chargebacks.</div>
                </div>
              </div>
            </div>
          </motion.div>
        </aside>

        {/* Content */}
        <section className="store-content">
          <div className="store-content-head">
            <div className="store-content-head-left">
              <strong>COMMUNITY STORE</strong>
              <div className="text-white/70 text-sm">Featured offers + clean product browsing</div>
            </div>

            <div className="store-filters">
              <div className="store-search">
                <Search className="h-4 w-4 opacity-75" />
                <input
                  placeholder="Search bundles, vehicles, perks…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="store-select-wrapper">
                <select
                  className="store-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  {sortOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      Sort: {opt.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="store-select-icon" />
              </div>
            </div>
          </div>

          <div className="store-product-grid">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.article
                  key={product.id}
                  className={cn(product.featured ? "store-offer" : "store-row-item")}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  {product.featured ? (
                    // Featured product layout
                    <>
                      <div className="store-offer-row">
                        <div className="store-icon">
                          {getCategoryIcon(product.category)}
                        </div>
                        <div className="store-offer-info">
                          <h3>{product.name}</h3>
                          <div className="store-offer-meta">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className={cn("store-tag", tag === "FEATURED" && "hot")}
                              >
                                {tag}
                              </span>
                            ))}
                            {product.comingSoon && (
                              <span className="text-white/60">Coming Soon</span>
                            )}
                          </div>
                        </div>
                        <div className="store-price">
                          <div className="store-price-value">
                            {product.price ? `$${product.price.toFixed(2)}` : "Coming Soon"}
                          </div>
                          <div className="store-price-sub">
                            {product.price ? "one-time" : "Pricing to be announced"}
                          </div>
                        </div>
                        <div className="store-buy">
                          <div className="store-qty">
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, getQuantity(product.id) - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span>{getQuantity(product.id)}</span>
                            <button
                              type="button"
                              onClick={() => setQuantity(product.id, getQuantity(product.id) + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            className="store-add-btn"
                            type="button"
                            onClick={() => !product.comingSoon && addToCart(product)}
                          >
                            {product.comingSoon ? "Notify Me" : "Add to Cart"}
                          </button>
                        </div>
                      </div>

                      {product.benefits && (
                        <div className="store-details">
                          <div className="store-blurb">
                            <b>Support the city.</b> {product.description}
                          </div>
                          <div className="store-benefits">
                            {product.benefits.map((benefit) => (
                              <div key={benefit} className="store-benefit">
                                <span className="store-chip" />
                                {benefit}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Regular product layout
                    <div className="store-row-item-row">
                      <div className="store-sm-icon">
                        {getCategoryIcon(product.category)}
                      </div>
                      <div className="store-row-item-info">
                        <h4>{product.name}</h4>
                        <div className="store-row-item-meta">
                          {product.tags.join(" • ")} {product.comingSoon && "• Coming Soon"}
                        </div>
                      </div>
                      <div className="store-row-item-actions">
                        <div className="text-right">
                          <div className="font-bold">
                            {product.price ? `$${product.price.toFixed(2)}` : "Coming Soon"}
                          </div>
                          <div className="text-white/50 text-xs">
                            {product.price ? "one-time" : "Details pending"}
                          </div>
                        </div>
                        <button className="store-ghost" type="button">
                          Details
                        </button>
                        <button
                          className="store-add-btn"
                          type="button"
                          onClick={() => !product.comingSoon && addToCart(product)}
                        >
                          {product.comingSoon ? "Notify" : "Add"}
                        </button>
                      </div>
                    </div>
                  )}
                </motion.article>
              ))}
            </AnimatePresence>

            {filteredProducts.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-white/50"
              >
                No products found matching your criteria.
              </motion.div>
            )}

            <div className="store-note">
              <b>Note:</b> All Community Store items are cosmetic or access-based only.
              No pay-to-win mechanics will ever be introduced.
            </div>
          </div>
        </section>
      </section>
    </div>
  );
}
