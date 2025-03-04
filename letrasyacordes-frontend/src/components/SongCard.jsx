function SongCard( song ) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <h3 className="text-xl font-semibold text-gray-800">{song.title}</h3>
        <p className="text-gray-600">{song.artist}</p>
        <p className="text-sm text-gray-500 italic">{song.category}</p>
      </div>
    );
  }
  
  export default SongCard;