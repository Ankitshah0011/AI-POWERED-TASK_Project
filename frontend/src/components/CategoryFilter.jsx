import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  Search,
} from "lucide-react";

/*
|--------------------------------------------------------------------------
| HOME SERVICE CATEGORIES
|--------------------------------------------------------------------------
*/

const HOME_SERVICE_CATEGORIES = [
  // Cleaning
  "Home Cleaning",
  "Deep Cleaning",
  "Kitchen Cleaning",
  "Bathroom Cleaning",
  "Sofa Cleaning",
  "Carpet Cleaning",
  "Mattress Cleaning",
  "Window Cleaning",
  "Water Tank Cleaning",
  "Move-In / Move-Out Cleaning",

  // Plumbing
  "Plumbing",
  "Tap Repair",
  "Pipe Repair",
  "Water Leakage Repair",
  "Drain Cleaning",
  "Bathroom Plumbing",
  "Kitchen Plumbing",
  "Water Tank Repair",
  "Geyser Plumbing",

  // Electrical
  "Electrical Repair",
  "Electrician",
  "Wiring & Rewiring",
  "Switch & Socket Repair",
  "Fan Installation & Repair",
  "Light Installation",
  "MCB / Fuse Repair",
  "Inverter Installation",
  "Electrical Appliance Installation",

  // AC & Cooling
  "AC Repair",
  "AC Installation",
  "AC Servicing",
  "AC Gas Refill",
  "AC Cleaning",
  "AC Maintenance",
  "Cooler Repair",
  "Cooler Installation",

  // Appliances
  "Refrigerator Repair",
  "Washing Machine Repair",
  "Microwave Repair",
  "Dishwasher Repair",
  "Oven Repair",
  "TV Repair",
  "Geyser Repair",
  "Water Purifier Repair",
  "Chimney Repair",

  // Carpentry
  "Carpenter",
  "Furniture Repair",
  "Furniture Assembly",
  "Door Repair",
  "Window Repair",
  "Cabinet Repair",
  "Wardrobe Repair",
  "Bed Repair",
  "Table & Chair Repair",
  "Modular Furniture",

  // Painting
  "Wall Painting",
  "Interior Painting",
  "Exterior Painting",
  "Room Painting",
  "Furniture Painting",
  "Waterproof Painting",
  "Texture Painting",
  "Wallpaper Installation",

  // Home Maintenance
  "Home Maintenance",
  "Handyman",
  "Lock Repair",
  "Locksmith",
  "Roof Repair",
  "Ceiling Repair",
  "Tile Repair",
  "Grouting",
  "Waterproofing",

  // Pest Control
  "Pest Control",
  "Cockroach Control",
  "Termite Control",
  "Mosquito Control",
  "Bed Bug Control",
  "Rodent Control",
  "Ant Control",

  // Moving
  "Home Shifting",
  "Packers & Movers",
  "Furniture Moving",
  "Local Moving",
  "Loading & Unloading",
  "Delivery Services",

  // Garden
  "Gardening",
  "Lawn Maintenance",
  "Plant Care",
  "Tree Trimming",
  "Landscaping",
  "Garden Cleaning",

  // Security
  "CCTV Installation",
  "CCTV Repair",
  "Security System Installation",
  "Smart Lock Installation",
  "Doorbell Installation",

  // Beauty
  "Home Salon",
  "Haircut at Home",
  "Makeup at Home",
  "Manicure & Pedicure",
  "Massage at Home",
  "Beauty Services",

  // Technology
  "Computer Repair",
  "Internet / Wi-Fi Setup",
  "Home Automation",
  "Smart Home Installation",

  // Other
  "Home Inspection",
  "Solar Panel Installation",
  "Water Purifier Installation",
];

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function CategoryFilter({
  selectedCategories,
  onApply,
}) {
  const [open, setOpen] = useState(false);

  const [search, setSearch] = useState("");

  const [temporarySelection, setTemporarySelection] =
    useState(selectedCategories);

  /*
  |--------------------------------------------------------------------------
  | SYNC SELECTION
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    setTemporarySelection(selectedCategories);
  }, [selectedCategories]);

  /*
  |--------------------------------------------------------------------------
  | SEARCH CATEGORIES
  |--------------------------------------------------------------------------
  */

  const filteredCategories = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return HOME_SERVICE_CATEGORIES;
    }

    return HOME_SERVICE_CATEGORIES.filter(
      (category) =>
        category
          .toLowerCase()
          .includes(query)
    );
  }, [search]);

  /*
  |--------------------------------------------------------------------------
  | OPEN
  |--------------------------------------------------------------------------
  */

  const handleOpen = () => {
    setTemporarySelection(
      selectedCategories
    );

    setOpen(true);
  };

  /*
  |--------------------------------------------------------------------------
  | TOGGLE CATEGORY
  |--------------------------------------------------------------------------
  */

  const toggleCategory = (category) => {
    setTemporarySelection(
      (previous) => {
        if (previous.includes(category)) {
          return previous.filter(
            (item) => item !== category
          );
        }

        return [
          ...previous,
          category,
        ];
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR ALL
  |--------------------------------------------------------------------------
  */

  const clearAll = () => {
    setTemporarySelection([]);
  };

  /*
  |--------------------------------------------------------------------------
  | CANCEL
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {
    setTemporarySelection(
      selectedCategories
    );

    setSearch("");

    setOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | APPLY
  |--------------------------------------------------------------------------
  */

  const handleApply = () => {
    onApply(temporarySelection);

    setSearch("");

    setOpen(false);
  };

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div className="category-filter-wrapper">

      {/* CATEGORY BUTTON */}

      <button
        type="button"
        className={`filter-bar-button ${
          selectedCategories.length > 0
            ? "active"
            : ""
        }`}
        onClick={handleOpen}
      >
        <span>
          {selectedCategories.length > 0
            ? `${selectedCategories.length} categories`
            : "Category"}
        </span>

        <ChevronDown
          size={19}
          className={
            open
              ? "rotate-chevron"
              : ""
          }
        />
      </button>

      {open && (
        <>
          {/* BACKDROP */}

          <div
            className="category-filter-backdrop"
            onClick={handleCancel}
          />

          {/* PANEL */}

          <div className="category-filter-panel">

            {/* HEADER */}

            <div className="category-filter-header">

              <div className="category-search-box">

                <Search size={23} />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search categories"
                  autoFocus
                />

              </div>

              <button
                type="button"
                className="category-clear-button"
                onClick={clearAll}
              >
                Clear all
              </button>

            </div>

            {/* TITLE */}

            <div className="category-panel-title">
              ALL CATEGORIES
            </div>

            {/* CATEGORY LIST */}

            <div className="category-list">

              {filteredCategories.length > 0 ? (
                filteredCategories.map(
                  (category) => {
                    const checked =
                      temporarySelection.includes(
                        category
                      );

                    return (
                      <label
                        key={category}
                        className="category-checkbox-row"
                      >

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleCategory(
                              category
                            )
                          }
                        />

                        <span className="custom-checkbox">
                          {checked && "✓"}
                        </span>

                        <span className="category-checkbox-name">
                          {category}
                        </span>

                      </label>
                    );
                  }
                )
              ) : (
                <div className="category-no-results">
                  No categories found
                </div>
              )}

            </div>

            {/* FOOTER */}

            <div className="category-filter-footer">

              <button
                type="button"
                className="category-cancel-button"
                onClick={handleCancel}
              >
                Cancel
              </button>

              <button
                type="button"
                className="category-apply-button"
                onClick={handleApply}
              >
                Apply
              </button>

            </div>

          </div>
        </>
      )}

    </div>
  );
}