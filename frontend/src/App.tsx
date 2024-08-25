import { useEffect, useState } from 'react'
import axios from 'axios'

import PostList from './components/PostList'
import SearchBar from './components/SearchBar'

const baseURL = 'http://localhost:3000' // Update this to  server URL

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await axios.get(`${baseURL}/search`, {
          params: { query },
        })
        setResults(response.data)
      }
      catch (error) {
        console.error('Error fetching search results:', error)
      }
    }

    if (query) {
      handleSearch()
    }
  }, [query])

  return (
    <div className="flex-auto items-center">
      <h1>IceWar</h1>
      <SearchBar onQueryChange={setQuery} />
      <PostList Posts={results} />
    </div>
  )
}

export default App
