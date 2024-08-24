export default function SearchBar() {
  return (
    <div>
      <input type="text" placeholder="Search Articles" onChange={e => console.log(e.target.value)} />
      <button type="button">Search</button>
    </div>
  )
}
