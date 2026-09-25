import { useMemo, useState } from "react";

import { ArrowRight, Sparkles } from "lucide-react";

import ServiceCard from "../components/ServiceCard";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ServiceSearch from "../components/ServiceSearch";
import HowItWorks from "../components/HowItWorks";

import "./Services.css";

const categories = [
  "All Services",
  "AC & Appliances",
  "Plumbing",
  "Electrical",
  "Cleaning",
  "Carpentry",
  "Painting",
];

const services = [
  {
    id: 1,
    title: "AC Repair & Service",
    category: "AC & Appliances",
    icon: "content",
    description:
      "Professional AC repair, servicing and maintenance at your doorstep.",
    rating: "4.9",
    reviews: 128,
    price: 299,
    visualClass: "visual-content",
  },

  {
    id: 2,
    title: "Plumbing & Pipe Repair",
    category: "Plumbing",
    icon: "image",
    description:
      "Fix leaking pipes, taps, sinks and other plumbing problems quickly.",
    rating: "4.8",
    reviews: 96,
    price: 199,
    visualClass: "visual-image",
  },

  {
    id: 3,
    title: "Electrical Repair",
    category: "Electrical",
    icon: "development",
    description:
      "Reliable electrical repair for switches, wiring, fans, lights and more.",
    rating: "5.0",
    reviews: 84,
    price: 249,
    visualClass: "visual-development",
  },

  {
    id: 4,
    title: "Refrigerator Repair",
    category: "AC & Appliances",
    icon: "ai",
    description:
      "Professional refrigerator repair and maintenance by experienced technicians.",
    rating: "4.9",
    reviews: 73,
    price: 349,
    visualClass: "visual-ai",
  },

  {
    id: 5,
    title: "Washing Machine Repair",
    category: "AC & Appliances",
    icon: "data",
    description:
      "Reliable washing machine repair and servicing for all major brands.",
    rating: "4.8",
    reviews: 61,
    price: 299,
    visualClass: "visual-data",
  },

  {
    id: 6,
    title: "Home Cleaning",
    category: "Cleaning",
    icon: "design",
    description:
      "Professional cleaning services for bedrooms, kitchens, bathrooms and complete homes.",
    rating: "4.9",
    reviews: 102,
    price: 499,
    visualClass: "visual-design",
  },

  {
    id: 7,
    title: "Carpentry & Furniture",
    category: "Carpentry",
    icon: "ml",
    description:
      "Furniture repair, installation, assembly and other carpentry services.",
    rating: "4.8",
    reviews: 58,
    price: 399,
    visualClass: "visual-ml",
  },

  {
    id: 8,
    title: "Home Painting",
    category: "Painting",
    icon: "marketing",
    description:
      "Professional interior and exterior painting services for your home.",
    rating: "4.9",
    reviews: 67,
    price: 999,
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
            <span>HOME SERVICES</span>
          </div>

          <h1>
            Explore Our{" "}
            <span>Services</span>
          </h1>

          <p>
            Find trusted professionals for reliable home
            services, repairs and maintenance at your doorstep.
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

            <h2>
              What can we help you with?
            </h2>

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
            <strong>
              {filteredServices.length}
            </strong>{" "}
            services
          </p>

          {(searchTerm ||
            activeCategory !== "All Services") && (
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
  <div className="services-marquee">

    <div className="services-marquee-track">

      {/* FIRST SET */}
      {filteredServices.map((service) => (
        <div
          className="service-marquee-item"
          key={`first-${service.id}`}
        >
          <ServiceCard service={service} />
        </div>
      ))}

      {/* DUPLICATE SET FOR SEAMLESS LOOP */}
      {filteredServices.map((service) => (
        <div
          className="service-marquee-item"
          key={`second-${service.id}`}
          aria-hidden="true"
        >
          <ServiceCard service={service} />
        </div>
      ))}

    </div>

  </div>
) : (

          <div className="empty-services">

            <div className="empty-icon">
              <Sparkles size={30} />
            </div>

            <h3>
              No services found
            </h3>

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

          <h2>
            Have a task in mind?
          </h2>

          <p>
            Find the right home service and get your
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