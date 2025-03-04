import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import SongCard from '../components/SongCard';
import { fetchSongs } from '../services/api';

function Home() {
  const [songs, setSongs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSongs = async () => {
      const data = await fetchSongs();
      setSongs(data);
    };
    loadSongs();
  }, []);

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Canciones Cristianas
        </h2>
        <SearchBar onSearch={setSearchTerm} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSongs.map(song => (
            <Link to={`/song/${song.id}`} key={song.id}>
              <SongCard song={song} />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;