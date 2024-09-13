import PostList from './components/PostList'
import SearchBar from './components/SearchBar'
import SearchProvider from './components/SearchProvider'

function App() {
  return (
    <SearchProvider>
      <div className="flex-auto items-center">
        <div className="flex justify-start ml-6 mt-4">
          <h2 className="text-2xl font-bold leading-7">IceWar</h2>
        </div>

        <SearchBar />
        <PostList />
      </div>
    </SearchProvider>
  )
}

export default App
