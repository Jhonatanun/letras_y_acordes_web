
function SearchBar( onSearch ) {
    return (
      <input
        type="text"
        placeholder="Busca una canción por título o artista..."
        className="w-full max-w-lg mx-auto block p-3 mb-6 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={e => onSearch(e.target.value)}
      />
    );
  }
  
  export default SearchBar;