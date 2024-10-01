import type { ReactNode } from 'react'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import useDebouncedValue from '../hooks/useDebouncedValue'
import type { Post } from '../types'

const apiUrl = import.meta.env.API_URL || 'http://localhost:3000'

interface SearchContextType {
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  results: Post[]
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined)

export default function SearchProvider({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [results, setResults] = useState<Post[]>([])

  const debouncedQuery = useDebouncedValue(searchTerm, 500)

  const handleSearch = useCallback(async () => {
    if (!debouncedQuery) {
      setResults([])
      return
    }

    try {
      const response = await axios.get(`${apiUrl}/search`, {
        params: { query: debouncedQuery },
      })
      setResults(response.data)
    }
    catch (error) {
      console.error('Error fetching search results:', error)
      setResults([])
    }
  }, [debouncedQuery])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])


  const contextValue = useMemo(() => ({
    searchTerm,
    setSearchTerm,
    results,
  }), [searchTerm, results])

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  )
}
