// src/utils/searchUtils.js

/*
|--------------------------------------------------------------------------
| NORMALIZE TEXT
|--------------------------------------------------------------------------
*/

export function normalizeSearchText(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/*
|--------------------------------------------------------------------------
| NATURAL LANGUAGE SERVICE KEYWORDS
|--------------------------------------------------------------------------
|
| These are search-intent keywords, NOT service data.
|
| Your actual services still come from the API.
|
*/

const SERVICE_INTENTS = {
  plumbing: [
    "plumb",
    "plumbing",
    "plumber",
    "pipe",
    "pipes",
    "sink",
    "faucet",
    "tap",
    "leak",
    "leaking",
    "water leak",
    "drain",
    "drainage",
    "toilet",
    "bathroom",
    "water",
    "wash basin",
  ],

  electrical: [
    "electric",
    "electrical",
    "electrician",
    "electricity",
    "wire",
    "wiring",
    "switch",
    "socket",
    "plug",
    "power",
    "light",
    "lights",
    "fan",
    "voltage",
    "short circuit",
    "current",
  ],

  ac: [
    "ac",
    "air conditioner",
    "air conditioning",
    "cooling",
    "cooler",
    "not cooling",
    "ac repair",
    "ac service",
    "air conditioner repair",
    "air conditioner service",
    "temperature",
  ],

  cleaning: [
    "clean",
    "cleaning",
    "cleaner",
    "house cleaning",
    "home cleaning",
    "room cleaning",
    "deep cleaning",
    "dirty",
    "dust",
    "dusting",
    "wash",
    "washing",
    "sanitization",
    "sanitizing",
  ],

  carpentry: [
    "carpenter",
    "carpentry",
    "furniture",
    "wood",
    "woodwork",
    "table",
    "chair",
    "door",
    "wooden",
    "cabinet",
    "cupboard",
    "shelf",
    "bed",
    "repair furniture",
  ],

  painting: [
    "paint",
    "painting",
    "painter",
    "wall paint",
    "wall painting",
    "house paint",
    "home paint",
    "room paint",
    "color",
    "colour",
    "repaint",
    "interior painting",
    "exterior painting",
  ],

  appliance: [
    "appliance",
    "appliances",
    "fridge",
    "refrigerator",
    "washing machine",
    "microwave",
    "oven",
    "dishwasher",
    "tv",
    "television",
    "mixer",
    "iron",
  ],

  car: [
    "car",
    "vehicle",
    "car wash",
    "car washing",
    "car cleaning",
    "vehicle cleaning",
    "auto",
  ],

  mechanic: [
    "mechanic",
    "mechanical",
    "bike",
    "motorcycle",
    "scooter",
    "engine",
    "vehicle repair",
    "car repair",
  ],

  locksmith: [
    "lock",
    "locksmith",
    "key",
    "keys",
    "door lock",
    "unlock",
    "locked",
  ],

  beauty: [
    "beauty",
    "salon",
    "hair",
    "haircut",
    "makeup",
    "facial",
    "spa",
    "nails",
    "nail",
  ],

  gardening: [
    "garden",
    "gardening",
    "gardener",
    "plants",
    "plant",
    "lawn",
    "grass",
    "tree",
  ],

  moving: [
    "moving",
    "move",
    "shifting",
    "house shifting",
    "relocation",
    "packers",
    "packing",
    "transport",
  ],
};

/*
|--------------------------------------------------------------------------
| GET SERVICE SEARCH TEXT
|--------------------------------------------------------------------------
*/

export function getServiceSearchText(service) {
  return normalizeSearchText(
    [
      service?.title,
      service?.category,
      service?.description,
      service?.location,
    ]
      .filter(Boolean)
      .join(" ")
  );
}

/*
|--------------------------------------------------------------------------
| GET INTENT TERMS
|--------------------------------------------------------------------------
*/

function getIntentTerms(service) {
  const serviceText = normalizeSearchText(
    `${service?.title || ""} ${service?.category || ""}`
  );

  const matchedTerms = [];

  Object.entries(SERVICE_INTENTS).forEach(
    ([intent, keywords]) => {
      const matchesIntent = keywords.some((keyword) => {
        const normalizedKeyword = normalizeSearchText(keyword);

        return (
          serviceText.includes(normalizedKeyword) ||
          normalizedKeyword.includes(serviceText)
        );
      });

      if (matchesIntent) {
        matchedTerms.push(...keywords);
      }
    }
  );

  return matchedTerms;
}

/*
|--------------------------------------------------------------------------
| CALCULATE SEARCH SCORE
|--------------------------------------------------------------------------
*/

export function getServiceSearchScore(service, query) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return 0;
  }

  const serviceText = getServiceSearchText(service);

  const title = normalizeSearchText(service?.title);
  const category = normalizeSearchText(service?.category);
  const description = normalizeSearchText(
    service?.description
  );

  const queryWords = normalizedQuery
    .split(" ")
    .filter((word) => word.length > 1);

  let score = 0;

  /*
  |--------------------------------------------------------------------------
  | EXACT PHRASE
  |--------------------------------------------------------------------------
  */

  if (serviceText.includes(normalizedQuery)) {
    score += 100;
  }

  /*
  |--------------------------------------------------------------------------
  | TITLE / CATEGORY MATCH
  |--------------------------------------------------------------------------
  */

  queryWords.forEach((word) => {
    if (title.includes(word)) {
      score += 40;
    }

    if (category.includes(word)) {
      score += 35;
    }

    if (description.includes(word)) {
      score += 20;
    }
  });

  /*
  |--------------------------------------------------------------------------
  | NATURAL LANGUAGE INTENT
  |--------------------------------------------------------------------------
  */

  Object.entries(SERVICE_INTENTS).forEach(
    ([intent, keywords]) => {
      const serviceBelongsToIntent =
        getIntentTerms(service).length > 0 &&
        keywords.some((keyword) => {
          const normalizedKeyword =
            normalizeSearchText(keyword);

          return serviceText.includes(normalizedKeyword);
        });

      if (!serviceBelongsToIntent) {
        return;
      }

      queryWords.forEach((word) => {
        const intentMatch = keywords.some((keyword) => {
          const normalizedKeyword =
            normalizeSearchText(keyword);

          return (
            normalizedKeyword.includes(word) ||
            word.includes(normalizedKeyword)
          );
        });

        if (intentMatch) {
          score += 50;
        }
      });
    }
  );

  /*
  |--------------------------------------------------------------------------
  | COMMON NATURAL-LANGUAGE WORDS
  |--------------------------------------------------------------------------
  |
  | Ignore words that don't describe the actual service.
  |
  */

  const ignoredWords = new Set([
    "my",
    "me",
    "i",
    "need",
    "want",
    "please",
    "someone",
    "somebody",
    "help",
    "with",
    "for",
    "the",
    "a",
    "an",
    "is",
    "are",
    "there",
    "has",
    "have",
    "can",
    "you",
    "get",
    "to",
    "of",
    "on",
    "at",
  ]);

  const meaningfulWords = queryWords.filter(
    (word) => !ignoredWords.has(word)
  );

  meaningfulWords.forEach((word) => {
    if (serviceText.includes(word)) {
      score += 25;
    }
  });

  return score;
}

/*
|--------------------------------------------------------------------------
| FIND BEST SERVICES
|--------------------------------------------------------------------------
*/

export function findMatchingServices(
  services = [],
  query = "",
  limit = 6
) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery || !services.length) {
    return [];
  }

  return services
    .map((service) => ({
      service,
      score: getServiceSearchScore(
        service,
        normalizedQuery
      ),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.service);
}