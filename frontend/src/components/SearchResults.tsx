import { useSearch } from './SearchProvider.js'

export default function SearchResults() {
  const { searchTerm, results } = useSearch()

  if (!results) {
    return (
      <div>
        No Search Results found for:
        {searchTerm}
      </div>
    )
  }

  return (
    <div>
      <ul>
        {results.map(result => (
          <li>
            <a href={result.Url} target="_blank" rel="noreferrer">
              <strong>{result.title}</strong>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
