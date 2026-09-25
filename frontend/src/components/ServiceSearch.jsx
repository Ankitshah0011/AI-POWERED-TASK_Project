import { Search, X } from "lucide-react";

/**
 * ServiceSearch
 * -------------
 * A controlled search input.
 *
 * "Controlled" means this component does not keep its own state —
 * the actual text lives in the PARENT (Services.jsx) as `searchTerm`.
 * This component just displays that value and reports changes back
 * up through `setSearchTerm`. That's why we pass both down as props.
 */
function ServiceSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="service-search">
      <Search size={19} className="service-search__icon" />
      <input
        type="text"
        className="service-search__input"
        placeholder="Search for services, skills, or tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search services"
      />
      {searchTerm && (
        <button
          type="button"
          className="service-search__clear"
          onClick={() => setSearchTerm("")}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
      <button type="button" className="btn btn--primary service-search__btn">
        Search
      </button>
    </div>
  );
}

export default ServiceSearch;
