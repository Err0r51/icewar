import { useSearch } from "./SearchProvider.js";



export default function SearchBar() {
  const { searchTerm, setSearchTerm, results, handleSearch } = useSearch();
  return (
    <div>
      <input
        type="text"
        placeholder="Search Articles"
        onChange={e => setSearchTerm(e.target.value)}
      />
    </div>
  )
}
