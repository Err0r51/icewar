import type { ReactNode } from 'react'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
    if (!debouncedQuery){
        setResults([]) 
        return
    }

    try {
        // eslint-disable-next-line no-console
      console.log('Searching for:', debouncedQuery)
    //   const response = await axios.get(`${baseURL}/search`, {
    //     params: { query: debouncedQuery },
    //   })

    const response = searchPosts(debouncedQuery)
      setResults(response) // change this to response.data if using axios
    }
    catch (error) {
      console.error('Error fetching search results:', error)
      setResults([])
    }
  }

  useEffect(() => {
    handleSearch()
  }, [debouncedQuery])



  // Mock data
const mockData: Post[] = [
    {
      id: 1,
      createdAt: new Date('2023-10-01T00:00:00Z'),
      title: 'First Post',
      Url: 'https://example.com/first-post',
      memberonly: false,
    },
    {
      id: 2,
      createdAt: new Date('2023-10-02T00:00:00Z'),
      title: 'Second Post',
      Url: 'https://example.com/second-post',
      memberonly: true,
    },
    // Add more mock posts as needed
  ];
  
  // Search function
  function searchPosts(query) {
    return mockData.filter(post => post.title.toLowerCase().includes(query.toLowerCase()));
  }
  

  const contextValue = useMemo(() => ({
    searchTerm,
    setSearchTerm,
    results,
  }), [searchTerm, results]);
  


  return (
    <SearchContext.Provider value={ contextValue }>
      {children}
    </SearchContext.Provider>
  )
}
