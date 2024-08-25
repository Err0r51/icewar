import { useEffect, useState } from 'react'
import axios from 'axios'

import { Post } from './types'
import PostList from './components/PostList'
import SearchBar from './components/SearchBar'
import useDebouncedValue from './hooks/useDebouncedValue'

const baseURL = 'http://localhost:3000' // Update this to  server URL

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Post[]>([])

  const debouncedQuery = useDebouncedValue(query, 500)

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(`${baseURL}/search`, {
          params: { query: debouncedQuery },
        })
        setResults(response.data)
      }
      catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    if (debouncedQuery) {
      handleSearch()
    }
  }, [debouncedQuery])

  return (
    <div className="flex-auto items-center">
      <h1>IceWar</h1>
      <SearchBar onQueryChange={setQuery} />
      <PostList />
    </div>
  )
}

export default App
