import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";

import ServiceCard from "../components/ServiceCard";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ServiceSearch from "../components/ServiceSearch";
import HowItWorks from "../components/HowItWorks";

import "./Services.css";

/*
|--------------------------------------------------------------------------
| API CONFIGURATION
|--------------------------------------------------------------------------
|
| Create a frontend .env file:
|
| VITE_API_URL=http://127.0.0.1:8000
|
| Then restart Vite.
|
*/

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TASKS_ENDPOINT = `${API_BASE_URL}/api/tasks`;

/*
|--------------------------------------------------------------------------
| NORMALIZE BACKEND RESPONSE
|--------------------------------------------------------------------------
|
| Different backend implementations may return:
|
| [
|   {...},
|   {...}
| ]
|
| OR:
|
| {
|   "data": [...]
| }
|
| OR:
|
| {
|   "tasks": [...]
| }
|
| This function handles those common formats.
|
*/

function extractServices(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.tasks)) {
    return response.tasks;
  }

  if (Array.isArray(response?.items)) {
    return response.items;
  }

  if (Array.isArray(response?.results)) {
    return response.results;
  }

  return [];
}

/*
|--------------------------------------------------------------------------
| NORMALIZE ONE SERVICE
|--------------------------------------------------------------------------
|
| Converts backend data into the shape expected by ServiceCard.
|
*/

function normalizeService(service, index) {
  const id =
    service.id ??
    service._id ??
    service.task_id ??
    service.taskId ??
    index + 1;

  const title =
    service.title ??
    service.name ??
    service.service_name ??
    service.serviceName ??
    service.task_title ??
    service.taskTitle ??
    "Home Service";

  const category =
    service.category ??
    service.category_name ??
    service.categoryName ??
    service.service_category ??
    "Other";

  const description =
    service.description ??
    service.details ??
    service.task_description ??
    service.taskDescription ??
    "Professional service provided by a trusted professional.";

  const location =
    service.location ??
    service.city ??
    service.address ??
    service.service_location ??
    "Available at your location";

  const price =
    service.price ??
    service.budget ??
    service.starting_price ??
    service.startingPrice ??
    0;

  const rating =
    service.rating ??
    service.average_rating ??
    service.averageRating ??
    0;

  const reviews =
    service.reviews ??
    service.review_count ??
    service.reviewCount ??
    0;

  const image =
    service.image ??
    service.image_url ??
    service.imageUrl ??
    service.thumbnail ??
    service.photo ??
    "";

  return {
    ...service,
    id,
    title,
    category,
    description,
    location,
    price,
    rating,
    reviews,
    image,
  };
}

function Services() {
  /*
  |--------------------------------------------------------------------------
  | STATE
  |--------------------------------------------------------------------------
  */

  const [services, setServices] = useState([]);
  const [activeCategory, setActiveCategory] =
    useState("All Services");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | FETCH SERVICES FROM FASTAPI
  |--------------------------------------------------------------------------
  */

  const fetchServices = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(TASKS_ENDPOINT);

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const serviceList = extractServices(data);

      const normalizedServices = serviceList.map(
        normalizeService
      );

      setServices(normalizedServices);

      /*
      |--------------------------------------------------------------------------
      | RESET CATEGORY WHEN NEW DATA ARRIVES
      |--------------------------------------------------------------------------
      */

      setActiveCategory("All Services");
    } catch (err) {
      console.error("Failed to fetch services:", err);

      setError(
        "Unable to load services. Please make sure the FastAPI backend is running."
      );

      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOAD SERVICES ON PAGE LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchServices();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | CREATE CATEGORIES DYNAMICALLY
  |--------------------------------------------------------------------------
  |
  | Categories are NOT hardcoded anymore.
  |
  */

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(
        services
          .map((service) => service.category)
          .filter(Boolean)
      ),
    ];

    return [
      "All Services",
      ...uniqueCategories,
    ];
  }, [services]);

  /*
  |--------------------------------------------------------------------------
  | FILTER SERVICES
  |--------------------------------------------------------------------------
  */

  const filteredServices = useMemo(() => {
    const search = searchTerm
      .toLowerCase()
      .trim();

    return services.filter((service) => {
      /*
      |--------------------------------------------------------------------------
      | CATEGORY FILTER
      |--------------------------------------------------------------------------
      */

      const matchesCategory =
        activeCategory === "All Services" ||
        service.category === activeCategory;

      /*
      |--------------------------------------------------------------------------
      | SEARCH FILTER
      |--------------------------------------------------------------------------
      */

      const matchesSearch =
        !search ||
        String(service.title)
          .toLowerCase()
          .includes(search) ||
        String(service.description)
          .toLowerCase()
          .includes(search) ||
        String(service.category)
          .toLowerCase()
          .includes(search) ||
        String(service.location)
          .toLowerCase()
          .includes(search);

      return (
        matchesCategory &&
        matchesSearch
      );
    });
  }, [
    services,
    activeCategory,
    searchTerm,
  ]);

  /*
  |--------------------------------------------------------------------------
  | CAROUSEL REFERENCES
  |--------------------------------------------------------------------------
  */

  const carouselRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScrollLeft = useRef(0);
  const autoScrollPaused = useRef(false);
  const resumeTimer = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | FIND ONE COMPLETE SET WIDTH
  |--------------------------------------------------------------------------
  */

  const getLoopWidth = () => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return 0;
    }

    // Infinite looping is only needed when there are
    // at least 2 services.
    if (filteredServices.length <= 1) {
      return 0;
    }

    const track =
      carousel.querySelector(
        ".services-marquee-track"
      );

    if (!track) {
      return 0;
    }

    const firstCard =
      track.children[0];

    const secondSetFirstCard =
      track.children[
        filteredServices.length
      ];

    if (
      !firstCard ||
      !secondSetFirstCard
    ) {
      return 0;
    }

    return (
      secondSetFirstCard.offsetLeft -
      firstCard.offsetLeft
    );
  };

  /*
  |--------------------------------------------------------------------------
  | INFINITE CAROUSEL
  |--------------------------------------------------------------------------
  */

  const normalizeCarouselPosition = () => {
    const carousel =
      carouselRef.current;

    if (!carousel) {
      return;
    }

    const loopWidth =
      getLoopWidth();

    if (!loopWidth) {
      return;
    }

    while (
      carousel.scrollLeft >=
      loopWidth
    ) {
      carousel.scrollLeft -=
        loopWidth;
    }

    while (
      carousel.scrollLeft < 0
    ) {
      carousel.scrollLeft +=
        loopWidth;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | AUTOMATIC MOVEMENT
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const carousel =
      carouselRef.current;

    // Do not auto-scroll when there
    // is only one service.
    if (
      !carousel ||
      filteredServices.length <= 1
    ) {
      return;
    }

    const autoMove =
      setInterval(() => {
        if (
          autoScrollPaused.current ||
          isDragging.current
        ) {
          return;
        }

        carousel.scrollLeft += 1;

        normalizeCarouselPosition();
      }, 20);

    return () => {
      clearInterval(autoMove);

      if (resumeTimer.current) {
        clearTimeout(
          resumeTimer.current
        );
      }
    };
  }, [filteredServices.length]);

  /*
  |--------------------------------------------------------------------------
  | PAUSE AUTO SCROLL
  |--------------------------------------------------------------------------
  */

  const pauseAutoScroll = () => {
    autoScrollPaused.current = true;

    if (resumeTimer.current) {
      clearTimeout(
        resumeTimer.current
      );
    }

    resumeTimer.current =
      setTimeout(() => {
        autoScrollPaused.current =
          false;
      }, 1800);
  };

  /*
  |--------------------------------------------------------------------------
  | MOUSE WHEEL / TRACKPAD
  |--------------------------------------------------------------------------
  */

  const handleWheel = (event) => {
    const carousel =
      carouselRef.current;

    if (!carousel) {
      return;
    }

    event.preventDefault();

    let movement = 0;

    if (
      Math.abs(event.deltaY) >
      Math.abs(event.deltaX)
    ) {
      movement = event.deltaY;
    } else {
      movement = event.deltaX;
    }

    /*
    |--------------------------------------------------------------------------
    | Trackpad/mouse wheel normalization
    |--------------------------------------------------------------------------
    */

    if (event.deltaMode === 1) {
      movement *= 20;
    }

    carousel.scrollLeft += movement;

    normalizeCarouselPosition();

    pauseAutoScroll();
  };

  /*
  |--------------------------------------------------------------------------
  | MOUSE DRAG START
  |--------------------------------------------------------------------------
  */

  const handleMouseDown = (
    event
  ) => {
    const carousel =
      carouselRef.current;

    if (!carousel) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    isDragging.current = true;

    autoScrollPaused.current = true;

    dragStartX.current =
      event.pageX -
      carousel.offsetLeft;

    dragStartScrollLeft.current =
      carousel.scrollLeft;

    carousel.classList.add(
      "is-dragging"
    );

    event.preventDefault();
  };

  /*
  |--------------------------------------------------------------------------
  | MOUSE DRAG MOVE
  |--------------------------------------------------------------------------
  */

  const handleMouseMove = (
    event
  ) => {
    const carousel =
      carouselRef.current;

    if (
      !carousel ||
      !isDragging.current
    ) {
      return;
    }

    event.preventDefault();

    const currentX =
      event.pageX -
      carousel.offsetLeft;

    const distance =
      (currentX -
        dragStartX.current) *
      1.15;

    carousel.scrollLeft =
      dragStartScrollLeft.current -
      distance;

    normalizeCarouselPosition();
  };

  /*
  |--------------------------------------------------------------------------
  | STOP DRAGGING
  |--------------------------------------------------------------------------
  */

  const stopDragging = () => {
    if (!isDragging.current) {
      return;
    }

    isDragging.current = false;

    const carousel =
      carouselRef.current;

    if (carousel) {
      carousel.classList.remove(
        "is-dragging"
      );
    }

    pauseAutoScroll();
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setActiveCategory(
      "All Services"
    );

    setSearchTerm("");
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="services-page">
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
              Find trusted professionals
              for reliable home services,
              repairs and maintenance at
              your doorstep.
            </p>
          </div>
        </section>

        <section className="services-section">
          <div className="empty-services">
            <div className="empty-icon">
              <RefreshCw
                size={30}
                className="animate-spin"
              />
            </div>

            <h3>
              Loading services...
            </h3>

            <p>
              Getting the latest services
              from our server.
            </p>
          </div>
        </section>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | MAIN UI
  |--------------------------------------------------------------------------
  */

  return (
    <main className="services-page">

      {/* ================================================================
          HERO
      ================================================================= */}

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
            Find trusted professionals
            for reliable home services,
            repairs and maintenance at
            your doorstep.
          </p>

        </div>
      </section>

      {/* ================================================================
          SERVICES
      ================================================================= */}

      <section className="services-section">

        {/* ==============================================================
            TOOLBAR
        ============================================================== */}

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
            setSearchTerm={
              setSearchTerm
            }
          />

        </div>

        {/* ==============================================================
            DYNAMIC CATEGORIES
        ============================================================== */}

        <div className="category-filters">

          {categories.map(
            (category) => (
              <ServiceCategoryCard
                key={category}
                category={category}
                activeCategory={
                  activeCategory
                }
                onClick={
                  setActiveCategory
                }
              />
            )
          )}

        </div>

        {/* ==============================================================
            RESULT COUNT
        ============================================================== */}

        <div className="services-result-row">

          <p>
            Showing{" "}
            <strong>
              {
                filteredServices.length
              }
            </strong>{" "}
            services
          </p>

          {(searchTerm ||
            activeCategory !==
              "All Services") && (

            <button
              className="clear-filters"
              onClick={
                clearFilters
              }
            >
              Clear filters
            </button>

          )}

        </div>

        {/* ==============================================================
            ERROR STATE
        ============================================================== */}

        {error && (
          <div className="empty-services">

            <div className="empty-icon">
              <RefreshCw
                size={30}
              />
            </div>

            <h3>
              Could not load services
            </h3>

            <p>
              {error}
            </p>

            <button
              className="primary-btn"
              onClick={
                fetchServices
              }
            >
              Try Again
            </button>

          </div>
        )}

        {/* ==============================================================
            SERVICE CAROUSEL
        ============================================================== */}

        {!error &&
          filteredServices.length >
            0 && (

          <div
            className="services-marquee"
            ref={carouselRef}
            onWheel={
              handleWheel
            }
            onMouseDown={
              handleMouseDown
            }
            onMouseMove={
              handleMouseMove
            }
            onMouseUp={
              stopDragging
            }
            onMouseLeave={
              stopDragging
            }
          >

            <div className="services-marquee-track">

              {/* ======================================================
                  FIRST SET
              ====================================================== */}

              {filteredServices.map(
                (service) => (
                  <div
                    className="service-marquee-item"
                    key={`first-${service.id}`}
                  >
                    <ServiceCard
                      service={service}
                    />
                  </div>
                )
              )}

              {/* ======================================================
                  SECOND SET

                  Only create the duplicate set when there
                  is more than one service.

                  This prevents:

                  Showing 1 services

                  [AC Repair] [AC Repair]

                  ====================================================== */}

              {filteredServices.length > 1 &&
                filteredServices.map(
                  (service) => (
                    <div
                      className="service-marquee-item"
                      key={`second-${service.id}`}
                      aria-hidden="true"
                    >
                      <ServiceCard
                        service={service}
                      />
                    </div>
                  )
                )}

            </div>

          </div>
        )}

        {/* ==============================================================
            NO RESULTS
        ============================================================== */}

        {!error &&
          filteredServices.length ===
            0 && (

          <div className="empty-services">

            <div className="empty-icon">
              <Sparkles
                size={30}
              />
            </div>

            <h3>
              No services found
            </h3>

            <p>
              Try adjusting your search
              or selecting another
              category.
            </p>

            <button
              className="primary-btn"
              onClick={
                clearFilters
              }
            >
              Clear Filters
            </button>

          </div>
        )}

      </section>

      {/* ================================================================
          HOW IT WORKS
      ================================================================= */}

      <HowItWorks />

      {/* ================================================================
          CTA
      ================================================================= */}

      <section className="services-cta">

        <div className="cta-content">

          <span className="cta-label">
            READY TO GET STARTED?
          </span>

          <h2>
            Have a task in mind?
          </h2>

          <p>
            Find the right home service
            and get your task moving
            today.
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