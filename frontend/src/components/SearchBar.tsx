import useSearch from './useSearch'

export default function SearchBar() {
  const { searchTerm, setSearchTerm } = useSearch()
  return (
    <div>
      <input
        type="text"
        placeholder="Search Articles"
        value={searchTerm} // Controlled input
        onChange={e => setSearchTerm(e.target.value)} 
        className="w-full px-4 py-2 border border-secondary rounded-lg focus:outline-primary"
      />
    </div>
  )
}
