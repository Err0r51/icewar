import PostList from './components/PostList'
import SearchBar from './components/SearchBar'
import SearchProvider from './components/SearchProvider'

function App() {
  console.log(import.meta.env)

  return (
    <SearchProvider>
      <div className="flex-auto items-center">
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-2xl font-bold leading-7">IceWar</h2>
          <div className='mt-4'><SearchBar /></div>
        </div>
        <PostList />
      </div>
    </SearchProvider>
  )
}

export default App
