import PostList from './components/PostList'
import SearchBar from './components/SearchBar'
import SearchProvider from './components/SearchProvider'


function App() {
  return (
    <SearchProvider>
      <div className="flex-auto items-center">
        <h1>IceWar</h1>
        <SearchBar />
        <PostList />
      </div>
    </SearchProvider>
  );
}

export default App;