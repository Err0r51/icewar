import PostList from "./components/PostList"
import SearchBar from "./components/SearchBar"


function App() {

  return (
    <div className="flex-auto items-center">
         <h1>IceWar</h1>
      <SearchBar />
      <PostList Posts={[]} />
    </div>


  )
}

export default App
