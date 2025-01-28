import '../../App.css'

function SearchBar({ value, onChange }) {
    return (
      <input 
        type="text" 
        placeholder="search" 
        className="w-350 md:w-96 bg-secondary searchBar"
        value={value}
        onChange={onChange}
      />
    )
}

export default SearchBar