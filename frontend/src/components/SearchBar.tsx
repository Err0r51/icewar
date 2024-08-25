interface SearchBarProps {
  onQueryChange: (query: string) => void
}

export default function SearchBar({ onQueryChange }: SearchBarProps) {
  return (
    <div>
      <input
        type="text"
        placeholder="Search Articles"
        onChange={e => onQueryChange(e.target.value)}
      />
    </div>
  )
}
