import { useSearch } from "./SearchProvider.js";
import SearchResults from "./SearchResults.js";

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch();
  return (
    <div>
      <input
        type="text"
        placeholder="Search Articles"
        onChange={e => setSearchTerm(e.target.value)}
      />
      {searchTerm  && (
        <div className="absolute top-full left-0 right-0 mt-2">
          <SearchResults />
        </div>
      )}
    </div>
  )
}
