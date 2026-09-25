import { useEffect, useMemo, useRef, useState } from "react";

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

  /*
  ============================================================
  FILTER SERVICES
  ============================================================
  */

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


  /*
  ============================================================
  CAROUSEL REFS
  ============================================================
  */

  const carouselRef = useRef(null);

  const isDragging = useRef(false);

  const dragStartX = useRef(0);

  const dragStartScrollLeft = useRef(0);

  const autoScrollPaused = useRef(false);

  const resumeTimer = useRef(null);


  /*
  ============================================================
  FIND WIDTH OF ONE COMPLETE SERVICE SET
  ============================================================
  */

  const getLoopWidth = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return 0;
    }

    const track = carousel.querySelector(
      ".services-marquee-track"
    );

    if (!track) {
      return 0;
    }

    const firstCard = track.children[0];

    const secondSetFirstCard =
      track.children[filteredServices.length];

    if (!firstCard || !secondSetFirstCard) {
      return 0;
    }

    return (
      secondSetFirstCard.offsetLeft -
      firstCard.offsetLeft
    );
  };


  /*
  ============================================================
  INFINITE LOOP
  ============================================================
  */

  const normalizeCarouselPosition = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const loopWidth = getLoopWidth();

    if (!loopWidth) {
      return;
    }

    /*
      If we move past the first complete set,
      jump back by exactly one set.
    */

    while (carousel.scrollLeft >= loopWidth) {
      carousel.scrollLeft -= loopWidth;
    }

    /*
      If the user drags/wheels before the beginning,
      jump forward by one complete set.
    */

    while (carousel.scrollLeft < 0) {
      carousel.scrollLeft += loopWidth;
    }
  };


  /*
  ============================================================
  AUTOMATIC SELF-MOVING
  ============================================================

  This is intentionally simple.

  Every 20 milliseconds the carousel moves 1 pixel.

  That means:

  1px x 50 times per second
  = approximately 50px per second.

  The cards continuously move automatically.

  ============================================================
  */

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel || filteredServices.length === 0) {
      return;
    }

    const autoMove = setInterval(() => {

      /*
        Don't move automatically while
        the user is interacting.
      */

      if (
        autoScrollPaused.current ||
        isDragging.current
      ) {
        return;
      }

      /*
        Move cards from RIGHT -> LEFT.
      */

      carousel.scrollLeft += 1;

      /*
        Keep looping forever.
      */

      normalizeCarouselPosition();

    }, 20);


    /*
      Cleanup.
    */

    return () => {
      clearInterval(autoMove);

      if (resumeTimer.current) {
        clearTimeout(resumeTimer.current);
      }
    };

  }, [filteredServices.length]);


  /*
  ============================================================
  PAUSE AUTOMATIC MOVEMENT
  ============================================================
  */

  const pauseAutoScroll = () => {
    autoScrollPaused.current = true;

    if (resumeTimer.current) {
      clearTimeout(resumeTimer.current);
    }

    /*
      Resume automatic movement
      1.8 seconds after interaction.
    */

    resumeTimer.current = setTimeout(() => {
      autoScrollPaused.current = false;
    }, 1800);
  };


  /*
  ============================================================
  MOUSE WHEEL / TRACKPAD
  ============================================================

  Wheel UP:
      cards move LEFT

  Wheel DOWN:
      cards move RIGHT

  ============================================================
  */

  const handleWheel = (event) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    /*
      Prevent the page itself from scrolling vertically
      when the pointer is over the service cards.
    */

    event.preventDefault();

    let movement = 0;

    /*
      Normal mouse wheel.
    */

    if (
      Math.abs(event.deltaY) >
      Math.abs(event.deltaX)
    ) {
      movement = event.deltaY;
    }

    /*
      Trackpad horizontal movement.
    */

    else {
      movement = event.deltaX;
    }

    /*
      Some mouse wheels report movement in lines.
    */

    if (event.deltaMode === 1) {
      movement *= 20;
    }

    carousel.scrollLeft += movement;

    normalizeCarouselPosition();

    /*
      Temporarily pause automatic movement.
    */

    pauseAutoScroll();
  };


  /*
  ============================================================
  MOUSE DOWN
  ============================================================
  */

  const handleMouseDown = (event) => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    /*
      Only left mouse button.
    */

    if (event.button !== 0) {
      return;
    }

    isDragging.current = true;

    autoScrollPaused.current = true;

    dragStartX.current =
      event.pageX - carousel.offsetLeft;

    dragStartScrollLeft.current =
      carousel.scrollLeft;

    carousel.classList.add("is-dragging");

    /*
      Prevent text selection.
    */

    event.preventDefault();
  };


  /*
  ============================================================
  MOUSE MOVE
  ============================================================
  */

  const handleMouseMove = (event) => {
    const carousel = carouselRef.current;

    if (
      !carousel ||
      !isDragging.current
    ) {
      return;
    }

    event.preventDefault();

    const currentX =
      event.pageX - carousel.offsetLeft;

    const distance =
      (currentX - dragStartX.current) * 1.15;

    carousel.scrollLeft =
      dragStartScrollLeft.current - distance;

    normalizeCarouselPosition();
  };


  /*
  ============================================================
  STOP DRAGGING
  ============================================================
  */

  const stopDragging = () => {
    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;

    const carousel = carouselRef.current;

    if (carousel) {
      carousel.classList.remove("is-dragging");
    }

    /*
      Resume automatic movement after
      the interaction finishes.
    */

    pauseAutoScroll();
  };


  /*
  ============================================================
  CLEAR FILTERS
  ============================================================
  */

  const clearFilters = () => {
    setActiveCategory("All Services");

    setSearchTerm("");
  };


  /*
  ============================================================
  PAGE UI
  ============================================================
  */

  return (
    <main className="services-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="services-hero">

        <div className="hero-content">

          <div className="hero-badge">

            <Sparkles size={16} />

            <span>
              HOME SERVICES
            </span>

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


      {/* =====================================================
          SERVICES SECTION
      ===================================================== */}

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


        {/* ===================================================
            CATEGORY FILTERS
        =================================================== */}

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


        {/* ===================================================
            RESULT COUNT
        =================================================== */}

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


        {/* ===================================================
            SERVICE CAROUSEL
        =================================================== */}

        {filteredServices.length > 0 ? (

          <div
            className="services-marquee"
            ref={carouselRef}

            onWheel={handleWheel}

            onMouseDown={handleMouseDown}

            onMouseMove={handleMouseMove}

            onMouseUp={stopDragging}

            onMouseLeave={stopDragging}
          >

            <div className="services-marquee-track">


              {/* FIRST SET */}

              {filteredServices.map((service) => (

                <div
                  className="service-marquee-item"
                  key={`first-${service.id}`}
                >

                  <ServiceCard
                    service={service}
                  />

                </div>

              ))}


              {/* DUPLICATE SET */}

              {filteredServices.map((service) => (

                <div
                  className="service-marquee-item"
                  key={`second-${service.id}`}
                  aria-hidden="true"
                >

                  <ServiceCard
                    service={service}
                  />

                </div>

              ))}

            </div>

          </div>

        ) : (

          /* =================================================
             EMPTY STATE
          ================================================= */

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


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <HowItWorks />


      {/* =====================================================
          CTA
      ===================================================== */}

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