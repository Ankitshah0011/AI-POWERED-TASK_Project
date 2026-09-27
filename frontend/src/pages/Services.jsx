import { useEffect, useMemo, useRef, useState } from "react";

import { ArrowRight, RefreshCw, Sparkles } from "lucide-react";

import ServiceCard from "../components/ServiceCard";

import ServiceSearch from "../components/ServiceSearch";

import CategoryFilter from "../components/CategoryFilter";

import HowItWorks from "../components/HowItWorks";

import "./Services.css";

/*

|--------------------------------------------------------------------------

| API CONFIGURATION

|--------------------------------------------------------------------------

*/

const API_BASE_URL =

import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const TASKS_ENDPOINT = `${API_BASE_URL}/api/tasks`;

/*

|--------------------------------------------------------------------------

| NORMALIZE SEARCH TEXT

|--------------------------------------------------------------------------

*/

function normalizeSearchText(value = "") {

return String(value)

    .toLowerCase()

    .replace(/[^\w\s]/g, " ")

    .replace(/\s+/g, " ")

    .trim();

}

/*

|--------------------------------------------------------------------------

| NATURAL LANGUAGE SEARCH INTENTS

|--------------------------------------------------------------------------

|

| These keywords help understand what the user means.

|

*/

const intentKeywords = {

  plumbing: [

    "plumber",

    "plumbing",

    "pipe",

    "pipes",

    "leak",

    "leaking",

    "tap",

    "faucet",

    "sink",

    "drain",

    "water",

    "toilet",

    "bathroom",

  ],

  electrical: [

    "electrician",

    "electrical",

    "electric",

    "wiring",

    "wire",

    "switch",

    "socket",

    "fan",

    "light",

    "power",

    "voltage",

  ],

  "ac repair": [

    "ac",

    "air conditioner",

    "air conditioning",

    "cooling",

    "cooler",

    "ac repair",

    "ac service",

  ],

  cleaning: [

    "clean",

    "cleaning",

    "cleaner",

    "house cleaning",

    "home cleaning",

    "deep cleaning",

    "dust",

    "dirty",

    "wash",

    "sanitization",

  ],

  carpentry: [

    "carpenter",

    "carpentry",

    "furniture",

    "wood",

    "woodwork",

    "door",

    "drawer",

    "table",

    "chair",

    "cupboard",

  ],

  painting: [

    "paint",

    "painting",

    "painter",

    "wall",

    "walls",

    "color",

    "colour",

    "renovation",

  ],

  appliances: [

    "appliance",

    "appliances",

    "washing machine",

    "refrigerator",

    "fridge",

    "microwave",

    "oven",

    "tv",

    "television",

    "geyser",

  ],

  gardening: [

    "garden",

    "gardening",

    "gardener",

    "plants",

    "plant",

    "lawn",

    "grass",

    "trees",

  ],

  locksmith: [

    "lock",

    "locksmith",

    "key",

    "keys",

    "door lock",

    "unlock",

  ],

  moving: [

    "move",

    "moving",

    "mover",

    "shifting",

    "house shifting",

    "relocation",

    "transport",

  ],

  mechanic: [

    "mechanic",

    "car repair",

    "vehicle",

    "bike",

    "car",

    "automobile",

    "engine",

  ],

};

/*

|--------------------------------------------------------------------------

| FIND USER INTENTS

|--------------------------------------------------------------------------

*/

function getSearchIntentScores(searchTerm) {

const query = normalizeSearchText(searchTerm);

const scores = {};

if (!query) {

return scores;

  }

  Object.entries(intentKeywords).forEach(

    ([intent, keywords]) => {

let score = 0;

      keywords.forEach((keyword) => {

const normalizedKeyword =

          normalizeSearchText(keyword);

if (query.includes(normalizedKeyword)) {

          score += normalizedKeyword.includes(" ")

? 4

: 2;

        }

      });

if (score > 0) {

        scores[intent] = score;

      }

    }

  );

return scores;

}

/*

|--------------------------------------------------------------------------

| SCORE SERVICE AGAINST USER SEARCH

|--------------------------------------------------------------------------

*/

function getServiceSearchScore(service, searchTerm) {

const query = normalizeSearchText(searchTerm);

if (!query) {

return 0;

  }

const title = normalizeSearchText(service.title);

const category = normalizeSearchText(

    service.category

  );

const description = normalizeSearchText(

    service.description

  );

const location = normalizeSearchText(

    service.location

  );

const searchableText = [

    title,

    category,

    description,

    location,

  ].join(" ");

let score = 0;

  /*

  |--------------------------------------------------------------------------

  | EXACT MATCHES

  |--------------------------------------------------------------------------

  */

if (title === query) {

    score += 100;

  }

if (category === query) {

    score += 90;

  }

  /*

  |--------------------------------------------------------------------------

  | PARTIAL MATCHES

  |--------------------------------------------------------------------------

  */

if (title.includes(query)) {

    score += 50;

  }

if (category.includes(query)) {

    score += 45;

  }

if (description.includes(query)) {

    score += 30;

  }

if (location.includes(query)) {

    score += 15;

  }

  /*

  |--------------------------------------------------------------------------

  | WORD MATCHING

  |--------------------------------------------------------------------------

  */

const queryWords = query

    .split(" ")

    .filter((word) => word.length > 2);

  queryWords.forEach((word) => {

if (title.includes(word)) {

      score += 12;

    }

if (category.includes(word)) {

      score += 10;

    }

if (description.includes(word)) {

      score += 6;

    }

if (searchableText.includes(word)) {

      score += 3;

    }

  });

  /*

  |--------------------------------------------------------------------------

  | INTENT MATCHING

  |--------------------------------------------------------------------------

  */

const intentScores =

    getSearchIntentScores(searchTerm);

  Object.entries(intentScores).forEach(

    ([intent, intentScore]) => {

const normalizedIntent =

        normalizeSearchText(intent);

      /*

      | Category / title directly matches intent

      */

if (

        category.includes(normalizedIntent) ||

        title.includes(normalizedIntent)

      ) {

        score += intentScore * 15;

      }

      /*

      | Individual intent words

      */

const intentWords =

        normalizedIntent.split(" ");

      intentWords.forEach((word) => {

if (

          category.includes(word) ||

          title.includes(word) ||

          description.includes(word)

        ) {

          score += intentScore * 5;

        }

      });

    }

  );

return score;

}

/*

|--------------------------------------------------------------------------

| NORMALIZE BACKEND RESPONSE

|--------------------------------------------------------------------------

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

/*

|--------------------------------------------------------------------------

| SERVICES PAGE

|--------------------------------------------------------------------------

*/

function Services() {

  /*

  |--------------------------------------------------------------------------

  | STATE

  |--------------------------------------------------------------------------

  */

const [services, setServices] =

    useState([]);

const [selectedCategories, setSelectedCategories] =

    useState([]);

const [searchTerm, setSearchTerm] =

    useState("");

const [priceFilter, setPriceFilter] =

    useState("all");

const [sortOption, setSortOption] =

    useState("default");

const [loading, setLoading] =

    useState(true);

const [error, setError] =

    useState("");

  /*

  |--------------------------------------------------------------------------

  | FETCH SERVICES FROM FASTAPI

  |--------------------------------------------------------------------------

  */

const fetchServices = async () => {

try {

      setLoading(true);

      setError("");

const response =

await fetch(TASKS_ENDPOINT);

if (!response.ok) {

throw new Error(

          `Server returned ${response.status}`

        );

      }

const data =

await response.json();

const serviceList =

        extractServices(data);

const normalizedServices =

        serviceList.map(normalizeService);

      setServices(normalizedServices);

      setSelectedCategories([]);

    } catch (err) {

      console.error(

        "Failed to fetch services:",

        err

      );

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

  | LOAD SERVICES

  |--------------------------------------------------------------------------

  */

  useEffect(() => {

    fetchServices();

  }, []);

  /*

  |--------------------------------------------------------------------------

  | DYNAMIC CATEGORIES FROM API

  |--------------------------------------------------------------------------

  */

const categories = useMemo(() => {

return [

...new Set(

        services

          .map(

            (service) =>

              service.category

          )

          .filter(Boolean)

      ),

    ];

  }, [services]);

  /*

  |--------------------------------------------------------------------------

  | SMART EMPTY-STATE SUGGESTIONS

  |--------------------------------------------------------------------------

  */

const smartSuggestions = useMemo(() => {

    const categoryCounts = new Map();

    services.forEach((service) => {

      const category = String(

        service.category || ""

      ).trim();

      if (!category) return;

      categoryCounts.set(

        category,

        (categoryCounts.get(category) || 0) + 1

      );

    });

    const categoriesByPopularity = [

      ...categoryCounts.entries(),

    ]

      .sort((a, b) => b[1] - a[1])

      .map(([category]) => category);

    if (searchTerm.trim()) {

      const relatedCategories =

        categoriesByPopularity

          .map((category) => ({

            category,

            score: getServiceSearchScore(

              {

                title: category,

                category,

                description: "",

                location: "",

              },

              searchTerm

            ),

          }))

          .filter((item) => item.score > 0)

          .sort((a, b) => b.score - a.score)

          .map((item) => item.category);

      const combined = [

        ...relatedCategories,

        ...categoriesByPopularity,

      ];

      return [...new Set(combined)].slice(0, 3);

    }

    return categoriesByPopularity.slice(0, 3);

  }, [services, searchTerm]);

  /*

  |--------------------------------------------------------------------------

  | FILTER SERVICES

  |--------------------------------------------------------------------------

  */

const filteredServices = useMemo(() => {

const search =

      searchTerm.trim();

const result =

      services.filter((service) => {

        /*

        |--------------------------------------------------------------------------

        | CATEGORY

        |--------------------------------------------------------------------------

        */

const matchesCategory =

          selectedCategories.length === 0 ||

          selectedCategories.some(

            (category) =>

              String(service.category)

                .toLowerCase()

                .trim() ===

              String(category)

                .toLowerCase()

                .trim()

          );

        /*

        |--------------------------------------------------------------------------

        | NATURAL LANGUAGE SEARCH

        |--------------------------------------------------------------------------

        */

const searchScore =

          getServiceSearchScore(

            service,

            search

          );

const matchesSearch =

!search ||

          searchScore > 0;

        /*

        |--------------------------------------------------------------------------

        | PRICE

        |--------------------------------------------------------------------------

        */

const numericPrice =

          Number(service.price) || 0;

let matchesPrice = true;

if (

          priceFilter === "under500"

        ) {

          matchesPrice =

            numericPrice < 500;

        }

if (

          priceFilter === "500to1000"

        ) {

          matchesPrice =

            numericPrice >= 500 &&

            numericPrice <= 1000;

        }

if (

          priceFilter === "above1000"

        ) {

          matchesPrice =

            numericPrice > 1000;

        }

return (

          matchesCategory &&

          matchesSearch &&

          matchesPrice

        );

      });

    /*

    |--------------------------------------------------------------------------

    | SORT BY PRICE

    |--------------------------------------------------------------------------

    */

if (

      sortOption === "priceLow"

    ) {

      result.sort(

        (a, b) =>

          Number(a.price || 0) -

          Number(b.price || 0)

      );

    }

if (

      sortOption === "priceHigh"

    ) {

      result.sort(

        (a, b) =>

          Number(b.price || 0) -

          Number(a.price || 0)

      );

    }

    /*

    |--------------------------------------------------------------------------

    | SORT BY RATING

    |--------------------------------------------------------------------------

    */

if (

      sortOption === "ratingHigh"

    ) {

      result.sort(

        (a, b) =>

          Number(b.rating || 0) -

          Number(a.rating || 0)

      );

    }

    /*

    |--------------------------------------------------------------------------

    | NATURAL LANGUAGE RELEVANCE SORT

    |--------------------------------------------------------------------------

    |

    | If the user searches something like:

    |

    | "I need someone to fix my leaking tap"

    |

    | the most relevant service appears first.

    |

    */

if (search) {

      result.sort(

        (a, b) =>

          getServiceSearchScore(

            b,

            search

          ) -

          getServiceSearchScore(

            a,

            search

          )

      );

    }

return result;

  }, [

    services,

    selectedCategories,

    searchTerm,

    priceFilter,

    sortOption,

  ]);

  /*

  |--------------------------------------------------------------------------

  | CAROUSEL REFERENCES

  |--------------------------------------------------------------------------

  */

const carouselRef =

    useRef(null);

const isDragging =

    useRef(false);

const dragStartX =

    useRef(0);

const dragStartScrollLeft =

    useRef(0);

const autoScrollPaused =

    useRef(false);

const resumeTimer =

    useRef(null);

  /*

  |--------------------------------------------------------------------------

  | FIND COMPLETE LOOP WIDTH

  |--------------------------------------------------------------------------

  */

const getLoopWidth = () => {

const carousel =

      carouselRef.current;

if (!carousel) {

return 0;

    }

if (

      filteredServices.length <= 1

    ) {

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

  | NORMALIZE CAROUSEL POSITION

  |--------------------------------------------------------------------------

  */

const normalizeCarouselPosition =

    () => {

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

  | AUTOMATIC CAROUSEL

  |--------------------------------------------------------------------------

  */

  useEffect(() => {

const carousel =

      carouselRef.current;

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

    autoScrollPaused.current =

true;

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

  | WHEEL / TRACKPAD

  |--------------------------------------------------------------------------

  |

  | Vertical scrolling does NOT

  | move the carousel.

  |

  | Horizontal scrolling moves

  | the carousel.

  |

  |--------------------------------------------------------------------------

  */

const handleWheel = (event) => {

const carousel =

      carouselRef.current;

if (!carousel) {

return;

    }

    /*

      Only handle genuine

      horizontal scrolling.

    */

if (

      Math.abs(event.deltaX) > 0

    ) {

      carousel.scrollLeft +=

        event.deltaX;

      normalizeCarouselPosition();

      pauseAutoScroll();

    }

    /*

      IMPORTANT:

      No preventDefault().

      deltaY is untouched.

    */

  };

  /*

  |--------------------------------------------------------------------------

  | MOUSE DRAG START

  |--------------------------------------------------------------------------

  */

const handleMouseDown = (event) => {

const carousel =

      carouselRef.current;

if (!carousel) {

return;

    }

if (event.button !== 0) {

return;

    }

    isDragging.current = true;

    autoScrollPaused.current =

true;

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

const handleMouseMove = (event) => {

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

  | CATEGORY APPLY

  |--------------------------------------------------------------------------

  */

const handleCategoryApply = (

    categories

  ) => {

    setSelectedCategories(

      categories

    );

  };

  /*

  |--------------------------------------------------------------------------

  | SEARCH RECOMMENDATION CLICK

  |--------------------------------------------------------------------------

  */

const handleSuggestionSelect = (

    service

  ) => {

    setSearchTerm(

      service.title

    );

  };

  /*

  |--------------------------------------------------------------------------

  | CLEAR FILTERS

  |--------------------------------------------------------------------------

  */

const clearFilters = () => {

    setSelectedCategories([]);

    setSearchTerm("");

    setPriceFilter("all");

    setSortOption("default");

  };

  /*

  |--------------------------------------------------------------------------

  | SMART EMPTY-STATE SUGGESTION CLICK

  |--------------------------------------------------------------------------

  */

const handleSmartSuggestion = (category) => {

    setSelectedCategories([category]);

    setSearchTerm("");

    setPriceFilter("all");

    setSortOption("default");

  };

  /*

  |--------------------------------------------------------------------------

  | LOADING

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

              <span>

                Services

              </span>

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

      {/* HERO */}

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

            <span>

              Services

            </span>

          </h1>

          <p>

            Find trusted professionals

            for reliable home services,

            repairs and maintenance at

            your doorstep.

          </p>

        </div>

      </section>

      {/* SERVICES */}

      <section className="services-section">

        {/* TOOLBAR */}

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

            services={services}

            onSelectSuggestion={

              handleSuggestionSelect

            }

          />

        </div>

        {/* FILTER BAR */}

        <div className="service-filter-bar">

          <CategoryFilter

            selectedCategories={

              selectedCategories

            }

            onApply={

              handleCategoryApply

            }

          />

          {/* PRICE */}

          <div className="price-filter-wrapper">

            <span className="filter-small-label">

              PRICE

            </span>

            <div className="price-filter-options">

              <button

                type="button"

                className={

                  priceFilter === "all"

? "price-filter-btn active"

: "price-filter-btn"

                }

                onClick={() =>

                  setPriceFilter("all")

                }

              >

                All

              </button>

              <button

                type="button"

                className={

                  priceFilter === "under500"

? "price-filter-btn active"

: "price-filter-btn"

                }

                onClick={() =>

                  setPriceFilter(

                    "under500"

                  )

                }

              >

                Under ₹500

              </button>

              <button

                type="button"

                className={

                  priceFilter ===

                  "500to1000"

? "price-filter-btn active"

: "price-filter-btn"

                }

                onClick={() =>

                  setPriceFilter(

                    "500to1000"

                  )

                }

              >

                ₹500 – ₹1000

              </button>

              <button

                type="button"

                className={

                  priceFilter ===

                  "above1000"

? "price-filter-btn active"

: "price-filter-btn"

                }

                onClick={() =>

                  setPriceFilter(

                    "above1000"

                  )

                }

              >

                ₹1000+

              </button>

            </div>

          </div>

          {/* SORT */}

          <div className="sort-wrapper">

            <label

              htmlFor="service-sort"

              className="filter-small-label"

            >

              SORT

            </label>

            <select

              id="service-sort"

              value={sortOption}

              onChange={(event) =>

                setSortOption(

                  event.target.value

                )

              }

              className="service-sort-select"

            >

              <option value="default">

                Default

              </option>

              <option value="priceLow">

                Price: Low to High

              </option>

              <option value="priceHigh">

                Price: High to Low

              </option>

              <option value="ratingHigh">

                Rating: High to Low

              </option>

            </select>

          </div>

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

          {(

            searchTerm ||

            selectedCategories.length > 0 ||

            priceFilter !== "all" ||

            sortOption !== "default"

          ) && (

            <button

              type="button"

              className="clear-filters"

              onClick={clearFilters}

            >

              Clear filters

            </button>

          )}

        </div>

        {/* ERROR */}

        {error && (

          <div className="empty-services">

            <div className="empty-icon">

              <RefreshCw size={30} />

            </div>

            <h3>

              Could not load services

            </h3>

            <p>

              {error}

            </p>

            <button

              type="button"

              className="primary-btn"

              onClick={fetchServices}

            >

              Try Again

            </button>

          </div>

        )}

        {/* SERVICE CAROUSEL */}

        {!error &&

          filteredServices.length > 0 && (

            <div

              className="services-marquee"

              ref={carouselRef}

              onWheel={handleWheel}

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

                {/* FIRST SET */}

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

                {/* SECOND SET */}

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

        {/* SMART NO RESULTS */}

        {!error &&

          filteredServices.length === 0 && (

            <div className="smart-empty-state">

              <div className="smart-empty-icon">

                <Sparkles size={30} />

              </div>

              <span className="smart-empty-label">

                SMART SEARCH

              </span>

              <h3>

                {searchTerm.trim()

                  ? "No close matches found"

                  : services.length === 0

                  ? "No services available"

                  : "No services match these filters"}

              </h3>

              <p>

                {searchTerm.trim() ? (

                  <>

                    We couldn't find a service for{" "}

                    <strong>

                      "{searchTerm.trim()}"

                    </strong>

                    .

                    <br />

                    Try one of these services instead.

                  </>

                ) : services.length === 0 ? (

                  "There are no services available right now."

                ) : (

                  "Try another category or remove a filter to see more services."

                )}

              </p>

              {smartSuggestions.length > 0 && (

                <div className="smart-empty-suggestions">

                  <div className="empty-search-chips">

                    {smartSuggestions.map((category) => (

                      <button

                        key={category}

                        type="button"

                        className="smart-empty-btn"

                        onClick={() =>

                          handleSmartSuggestion(category)

                        }

                      >

                        {category}

                      </button>

                    ))}

                  </div>

                </div>

              )}

              <button

                type="button"

                className="primary-btn"

                onClick={clearFilters}

              >

                Reset Filters

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

            Find the right home service

            and get your task moving

            today.

          </p>

          <button

            type="button"

            className="cta-button"

          >

            Browse Services

            <ArrowRight size={18} />

          </button>

        </div>

      </section>

    </main>

  );

}

export default Services;