import { useSearch } from "./SearchProvider.js";



export default function SearchBar() {
  const { setSearchTerm } = useSearch();
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
