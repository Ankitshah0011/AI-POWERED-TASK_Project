import { useState, useMemo } from "react";
import {
  Code,
  Smartphone,
  Palette,
  PenTool,
  Brain,
  Megaphone,
  FileText,
  BarChart3,
  ArrowRight,
  Star,
  Users,
  Briefcase,
  ListChecks,
  Menu,
  X,
} from "lucide-react";

import ServiceCard from "../components/ServiceCard";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ServiceSearch from "../components/ServiceSearch";
import HowItWorks from "../components/HowItWorks";
import "./Services.css";

/* ------------------------------------------------------------------
 * MOCK DATA
 * ------------------------------------------------------------------
 * There is no backend yet, so all content the page needs lives here
 * as plain JavaScript arrays. Later, this can be swapped for data
 * coming from an API call inside src/services/ — the components
 * below won't need to change at all, since they only care about
 * receiving props, not where the data came from.
 * ------------------------------------------------------------------ */

// Categories shown in the "Explore Service Categories" section.
const categories = [
  { id: "web-dev", icon: Code, title: "Web Development", description: "Build modern websites and web applications", count: "120+ services", color: "blue" },
  { id: "mobile-dev", icon: Smartphone, title: "Mobile Development", description: "Native and cross-platform mobile apps", count: "80+ services", color: "purple" },
  { id: "uiux", icon: Palette, title: "UI/UX Design", description: "Design interfaces people love to use", count: "95+ services", color: "green" },
  { id: "graphic-design", icon: PenTool, title: "Graphic Design", description: "Logos, branding, and visual identity", count: "110+ services", color: "orange" },
  { id: "ai-ml", icon: Brain, title: "AI & Machine Learning", description: "Custom models, chatbots, and automation", count: "60+ services", color: "purple" },
  { id: "marketing", icon: Megaphone, title: "Digital Marketing", description: "Grow your audience and reach", count: "75+ services", color: "green" },
  { id: "writing", icon: FileText, title: "Content Writing", description: "Copy, articles, and content strategy", count: "50+ services", color: "orange" },
  { id: "data", icon: BarChart3, title: "Data & Analytics", description: "Dashboards, reports, and insights", count: "40+ services", color: "blue" },
];

// Filter tabs shown in the "Explore All Services" section.
// Each tab's `id` is matched against a service's `group` field.
const filterTabs = [
  { id: "All", label: "All" },
  { id: "Development", label: "Development" },
  { id: "Design", label: "Design" },
  { id: "AI & ML", label: "AI & ML" },
  { id: "Marketing", label: "Marketing" },
  { id: "Writing", label: "Writing" },
  { id: "Data", label: "Data" },
];

// The full service catalogue. `group` is used for tab filtering,
// `category` is the human-readable label shown on the card.
const services = [
  {
    id: 1,
    title: "Build a Modern React Website",
    category: "Web Development",
    group: "Development",
    description: "A responsive, modern React website built for your business or personal brand.",
    price: 2999,
    rating: 4.9,
    reviews: 124,
    provider: "Alex Developer",
    icon: Code,
  },
  {
    id: 2,
    title: "AI Chatbot Development",
    category: "AI & Machine Learning",
    group: "AI & ML",
    description: "A trained conversational chatbot connected to your product or support flow.",
    price: 4999,
    rating: 4.8,
    reviews: 87,
    provider: "Priya Nair",
    icon: Brain,
  },
  {
    id: 3,
    title: "Professional UI/UX Design",
    category: "UI/UX Design",
    group: "Design",
    description: "Wireframes to polished, user-tested screens for web or mobile.",
    price: 2499,
    rating: 4.9,
    reviews: 156,
    provider: "Meera Studio",
    icon: Palette,
  },
  {
    id: 4,
    title: "Python Automation Script",
    category: "Programming",
    group: "Development",
    description: "A custom script that automates a repetitive task in your workflow.",
    price: 1999,
    rating: 4.7,
    reviews: 63,
    provider: "Rohan Mehta",
    icon: Code,
  },
  {
    id: 5,
    title: "Social Media Marketing",
    category: "Digital Marketing",
    group: "Marketing",
    description: "A full campaign plan and content calendar to grow your reach.",
    price: 2999,
    rating: 4.8,
    reviews: 102,
    provider: "GrowthDesk",
    icon: Megaphone,
  },
  {
    id: 6,
    title: "Professional Logo Design",
    category: "Graphic Design",
    group: "Design",
    description: "A distinctive, versatile logo with full brand color and type guidelines.",
    price: 999,
    rating: 4.9,
    reviews: 211,
    provider: "Kabir Studio",
    icon: PenTool,
  },
];

// The subset of services featured in "Popular Services" — first four.
const popularServices = services.slice(0, 4);

// Statistics shown in the trust section.
const stats = [
  { id: 1, value: "10K+", label: "Completed Tasks", icon: ListChecks },
  { id: 2, value: "5K+", label: "Skilled Professionals", icon: Users },
  { id: 3, value: "4.8/5", label: "Average Rating", icon: Star },
  { id: 4, value: "50+", label: "Service Categories", icon: Briefcase },
];

function Services() {
  // Text currently typed into the search bar.
  const [searchTerm, setSearchTerm] = useState("");

  // Which filter tab is active in "Explore All Services".
  const [activeCategory, setActiveCategory] = useState("All");

  // Whether the mobile nav menu is open (only relevant if this page's
  // own header is used — skip this piece if you already have a shared Navbar).
  const [menuOpen, setMenuOpen] = useState(false);

  /**
   * FILTERING LOGIC
   * ----------------
   * useMemo re-runs this calculation only when searchTerm, activeCategory,
   * or the underlying services list change — it avoids recalculating the
   * filtered list on every unrelated re-render.
   *
   * A service is kept when BOTH conditions are true:
   *  1. Category match: activeCategory is "All", OR it equals the
   *     service's group.
   *  2. Search match: the search box is empty, OR the search text is
   *     found inside the service title, description, or category
   *     (case-insensitive, so "react" also matches "React").
   */
  const filteredServices = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All" || service.group === activeCategory;

      const matchesSearch =
        query === "" ||
        service.title.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, activeCategory]);

  const filtersActive = searchTerm !== "" || activeCategory !== "All";

  const clearFilters = () => {
    setSearchTerm("");
    setActiveCategory("All");
  };

  return (
    <div className="services-page">
      {/* ============ NAVIGATION ============
          If a shared Navbar component already exists in the project,
          delete this <header> block and render <Navbar /> instead. */}
      <header className="nav">
        <div className="nav__inner">
          <a href="/" className="nav__logo">
            AI Task <span>Marketplace</span>
          </a>

          <nav className="nav__links nav__links--desktop">
            <a href="/">Home</a>
            <a href="/services" className="nav__link--active">Services</a>
            <a href="/browse-tasks">Browse Tasks</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
          </nav>

          <div className="nav__actions nav__actions--desktop">
            <a href="/login" className="btn btn--ghost">Login</a>
            <a href="/get-started" className="btn btn--primary">Get Started</a>
          </div>

          <button
            className="nav__toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="nav__mobile">
            <a href="/">Home</a>
            <a href="/services" className="nav__link--active">Services</a>
            <a href="/browse-tasks">Browse Tasks</a>
            <a href="#how-it-works">How It Works</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <div className="nav__mobile-actions">
              <a href="/login" className="btn btn--ghost">Login</a>
              <a href="/get-started" className="btn btn--primary">Get Started</a>
            </div>
          </div>
        )}
      </header>

      {/* ============ HERO ============ */}
      <section className="hero">
        <div className="hero__decor hero__decor--1" aria-hidden="true" />
        <div className="hero__decor hero__decor--2" aria-hidden="true" />

        <div className="hero__content">
          <h1>Find the Right Service for Your Task</h1>
          <p>
            Connect with skilled professionals and AI-powered solutions to get
            your work done faster, smarter, and better.
          </p>
          <div className="hero__actions">
            <a href="#all-services" className="btn btn--primary btn--lg">
              Explore Services <ArrowRight size={18} />
            </a>
            <a href="/post-task" className="btn btn--outline btn--lg">
              Post a Task
            </a>
          </div>

          {/* Search bar sits inside the hero, per the brief */}
          <div className="hero__search">
            <ServiceSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </div>
        </div>

        {/* Visual: floating category chips instead of a stock image */}
        <div className="hero__visual" aria-hidden="true">
          <div className="hero__float hero__float--1">
            <Code size={18} /> Web Development
          </div>
          <div className="hero__float hero__float--2">
            <Brain size={18} /> AI & ML
          </div>
          <div className="hero__float hero__float--3">
            <Palette size={18} /> UI/UX Design
          </div>
          <div className="hero__float-card">
            <div className="hero__float-card-row">
              <span className="hero__float-avatar" />
              <div>
                <strong>Alex Developer</strong>
                <div className="hero__float-stars">
                  <Star size={13} /> 4.9 (124)
                </div>
              </div>
            </div>
            <span className="hero__float-price">₹2,999</span>
          </div>
        </div>
      </section>

      {/* ============ SERVICE CATEGORIES ============ */}
      <section className="section categories">
        <div className="section-heading">
          <h2>Explore Service Categories</h2>
          <p>Find experts across popular categories.</p>
        </div>

        <div className="categories__grid">
          {categories.map((category) => (
            <ServiceCategoryCard
              key={category.id}
              icon={category.icon}
              title={category.title}
              description={category.description}
              count={category.count}
              color={category.color}
            />
          ))}
        </div>
      </section>

      {/* ============ POPULAR SERVICES ============ */}
      <section className="section popular">
        <div className="section-heading">
          <h2>Popular Services</h2>
          <p>Services people are using right now.</p>
        </div>

        {/* Rendered with .map() from the popularServices array instead of
            writing four separate <ServiceCard> blocks by hand. */}
        <div className="services__grid">
          {popularServices.map((service) => (
            <ServiceCard key={service.id} {...service} />
          ))}
        </div>
      </section>

      {/* ============ ALL SERVICES ============ */}
      <section className="section all-services" id="all-services">
        <div className="section-heading">
          <h2>Explore All Services</h2>
          <p>Search and filter to find exactly what you need.</p>
        </div>

        <div className="all-services__tabs">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${activeCategory === tab.id ? "tab--active" : ""}`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}

          {filtersActive && (
            <button type="button" className="tab tab--clear" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>

        {filteredServices.length > 0 ? (
          <div className="services__grid">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} {...service} />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No services found. Try a different search or category.</p>
          </div>
        )}
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <div id="how-it-works">
        <HowItWorks />
      </div>

      {/* ============ TRUST / STATISTICS ============ */}
      <section className="stats">
        <div className="stats__grid">
          {stats.map((stat) => (
            <div className="stats__item" key={stat.id}>
              <div className="stats__icon">
                <stat.icon size={20} />
              </div>
              <span className="stats__value">{stat.value}</span>
              <span className="stats__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CALL TO ACTION ============ */}
      <section className="cta">
        <h2>Have a Task in Mind?</h2>
        <p>Post your task and let skilled professionals help you get it done.</p>
        <div className="cta__actions">
          <a href="/post-task" className="btn btn--primary btn--lg">Post a Task</a>
          <a href="#all-services" className="btn btn--outline-light btn--lg">Browse Services</a>
        </div>
      </section>

      {/* ============ FOOTER ============
          If a shared Footer component already exists, delete this
          <footer> block and render <Footer /> instead. */}
      <footer className="footer">
        <div className="footer__grid">
          <div className="footer__brand">
            <span className="footer__logo">AI Task Marketplace</span>
            <p>Making it easier to find the right people for the right tasks.</p>
          </div>

          <div className="footer__col">
            <h4>Quick Links</h4>
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/browse-tasks">Browse Tasks</a>
            <a href="#how-it-works">How It Works</a>
          </div>

          <div className="footer__col">
            <h4>Company</h4>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
            <a href="/privacy">Privacy</a>
            <a href="/terms">Terms</a>
          </div>

          <div className="footer__col">
            <h4>Support</h4>
            <a href="/help">Help Center</a>
            <a href="/faqs">FAQs</a>
            <a href="/contact-support">Contact Support</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} AI Task Marketplace. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default Services;
