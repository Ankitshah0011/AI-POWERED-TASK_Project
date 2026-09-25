import { Search, X } from "lucide-react";

function ServiceSearch({ searchTerm, setSearchTerm }) {
  return (
    <div className="service-search-wrapper">
      <Search className="search-icon" size={21} />

      <input
        type="text"
        placeholder="Search services..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {searchTerm && (
        <button
          className="clear-search"
          onClick={() => setSearchTerm("")}
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export default ServiceSearch;