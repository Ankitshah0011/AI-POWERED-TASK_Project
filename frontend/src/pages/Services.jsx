import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

import ServiceCard from "../components/ServiceCard";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ServiceSearch from "../components/ServiceSearch";
import HowItWorks from "../components/HowItWorks";

import "./Services.css";

const categories = [
  "All Services",
  "AI & Automation",
  "Development",
  "Design",
  "Content",
  "Data & Analytics",
  "Marketing",
];

const services = [
  {
    id: 1,
    title: "AI Content Generation",
    category: "Content",
    icon: "content",
    description:
      "Create high-quality blogs, product descriptions, social posts and marketing content with AI assistance.",
    rating: "4.9",
    reviews: 128,
    price: 20,
    visualClass: "visual-content",
  },
  {
    id: 2,
    title: "AI Image Generation",
    category: "Design",
    icon: "image",
    description:
      "Generate creative visuals, illustrations and marketing graphics using modern AI tools.",
    rating: "4.8",
    reviews: 96,
    price: 15,
    visualClass: "visual-image",
  },
  {
    id: 3,
    title: "Full Stack Web Development",
    category: "Development",
    icon: "development",
    description:
      "Build modern, responsive and scalable web applications using today's popular technologies.",
    rating: "5.0",
    reviews: 84,
    price: 50,
    visualClass: "visual-development",
  },
  {
    id: 4,
    title: "AI Chatbot Development",
    category: "AI & Automation",
    icon: "ai",
    description:
      "Build intelligent chatbots for customer support, business workflows and process automation.",
    rating: "4.9",
    reviews: 73,
    price: 40,
    visualClass: "visual-ai",
  },
  {
    id: 5,
    title: "Data Analysis",
    category: "Data & Analytics",
    icon: "data",
    description:
      "Transform raw data into meaningful insights, reports and useful business visualizations.",
    rating: "4.8",
    reviews: 61,
    price: 35,
    visualClass: "visual-data",
  },
  {
    id: 6,
    title: "UI/UX Design",
    category: "Design",
    icon: "design",
    description:
      "Design clean, intuitive and engaging interfaces for web and mobile applications.",
    rating: "4.9",
    reviews: 102,
    price: 30,
    visualClass: "visual-design",
  },
  {
    id: 7,
    title: "Machine Learning Solutions",
    category: "AI & Automation",
    icon: "ml",
    description:
      "Develop machine learning solutions for prediction, classification and intelligent automation.",
    rating: "4.9",
    reviews: 55,
    price: 60,
    visualClass: "visual-ml",
  },
  {
    id: 8,
    title: "SEO & Digital Marketing",
    category: "Marketing",
    icon: "marketing",
    description:
      "Improve online visibility with practical SEO strategies and digital marketing solutions.",
    rating: "4.7",
    reviews: 78,
    price: 25,
    visualClass: "visual-marketing",
  },
];

function Services() {
  const [activeCategory, setActiveCategory] =
    useState("All Services");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        activeCategory === "All Services" ||
        service.category === activeCategory;

      const search = searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        service.title.toLowerCase().includes(search) ||
        service.description.toLowerCase().includes(search) ||
        service.category.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchTerm]);

  const clearFilters = () => {
    setActiveCategory("All Services");
    setSearchTerm("");
  };

  return (
    <main className="services-page">

      {/* HERO */}
      <section className="services-hero">
        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={16} />
            <span>AI-POWERED SERVICES</span>
          </div>

          <h1>
            Explore Our{" "}
            <span>Services</span>
          </h1>

          <p>
            Discover AI-powered services designed to help you
            complete tasks faster, smarter and more efficiently.
          </p>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="services-section">

        <div className="services-toolbar">

          <div>
            <span className="section-label">
              FIND THE RIGHT SERVICE
            </span>

            <h2>What can we help you with?</h2>
          </div>

          <ServiceSearch
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />

        </div>

        {/* CATEGORY FILTER */}
        <div className="category-filters">
          {categories.map((category) => (
            <ServiceCategoryCard
              key={category}
              category={category}
              activeCategory={activeCategory}
              onClick={setActiveCategory}
            />
          ))}
        </div>

        {/* RESULT COUNT */}
        <div className="services-result-row">
          <p>
            Showing{" "}
            <strong>{filteredServices.length}</strong>{" "}
            services
          </p>

          {(searchTerm || activeCategory !== "All Services") && (
            <button
              className="clear-filters"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* SERVICE GRID */}
        {filteredServices.length > 0 ? (
          <div className="services-grid">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
              />
            ))}
          </div>
        ) : (
          <div className="empty-services">
            <div className="empty-icon">
              <Sparkles size={30} />
            </div>

            <h3>No services found</h3>

            <p>
              Try adjusting your search or selecting a
              different category.
            </p>

            <button
              className="primary-btn"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          </div>
        )}

      </section>

      {/* HOW IT WORKS */}
      <HowItWorks />

      {/* CTA */}
      <section className="services-cta">
        <div className="cta-content">

          <span className="cta-label">
            READY TO GET STARTED?
          </span>

          <h2>Have a task in mind?</h2>

          <p>
            Find the right AI-powered service and get your
            task moving today.
          </p>

          <button className="cta-button">
            Browse Services
            <ArrowRight size={18} />
          </button>

        </div>
      </section>

    </main>
  );
}

export default Services;