import { useSearch } from './SearchProvider'

export default function SearchResults() {
  const { searchTerm, results } = useSearch()


  if (searchTerm && (!results || results.length === 0)) {
    return (
      <div className="p-4 text-gray-500"> 
        No Search Results found for: <span className="font-semibold">{searchTerm}</span>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white border border-gray-300 rounded shadow-md">
      <ul className="space-y-2">
        {results.map(result => (
          <li key={result.id} className="p-2 border-b border-gray-200">
            <a href={result.Url} target="_blank" rel="noreferrer" className="text-red-600 hover:underline">
              <strong>{result.title}</strong>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}