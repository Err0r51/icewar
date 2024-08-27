import { useEffect, useState } from 'react'
import axios from 'axios'

import { Post } from './types'
import PostList from './components/PostList'
import SearchBar from './components/SearchBar'
import SearchProvider from './components/SearchProvider'
import SearchResults from './components/SearchResults'


function App() {
  return (
    <SearchProvider>
      <div className="flex-auto items-center">
        <h1>IceWar</h1>
        <SearchBar />
        <SearchResults />
        <PostList />
      </div>
    </SearchProvider>
  );
}

export default App;