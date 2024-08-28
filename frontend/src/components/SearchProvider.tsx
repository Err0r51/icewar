import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import useDebouncedValue from '../hooks/useDebouncedValue'
import type { Post } from '../types'

interface SearchContextType {
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  results: Post[]
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export function useSearch() {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

const baseURL = 'http://localhost:3000' // Update this to  server URL

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [results, setResults] = useState<Post[]>([])

  const debouncedQuery = useDebouncedValue(searchTerm, 500)

  const handleSearch = async () => {
    if (!debouncedQuery)
      return // Avoid empty queries or initializing searches

    try {
      console.log('Searching for:', debouncedQuery)
      const response = await axios.get(`${baseURL}/search`, {
        params: { query: debouncedQuery },
      })
      setResults(response.data)
    }
    catch (error) {
      console.error('Error fetching search results:', error)
      setResults([]) // Optionally reset results on error
    }
  }

  // Effect to trigger the search
  useEffect(() => {
    handleSearch()
  }, [debouncedQuery])

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, results }}>
      {children}
    </SearchContext.Provider>
  )
}
