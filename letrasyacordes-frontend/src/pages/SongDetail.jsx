import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSongById } from '../services/api';

// Componente para un segmento (acorde + texto)
function ChordProSegment( segment ) {
  return (
    <div className="chord-pro-segment">
      {segment.chord && <div className="chord">{segment.chord}</div>}
      <div className="text">{segment.text}</div>
    </div>
  );
}

// Componente para una línea completa
function ChordProLine( segments ) {
  return (
    <div className="chord-pro-line">
      {segments.map((seg, i) => (
        seg.isDirective ? (
          <div key={i} className="directive">{seg.text}</div>
        ) : (
          <ChordProSegment key={i} segment={seg} />
        )
      ))}
    </div>
  );
}

function SongDetail() {
  const { id } = useParams();
  const [song, setSong] = useState(null);
  const [viewMode, setViewMode] = useState('chords');

  useEffect(() => {
    const loadSong = async () => {
      const data = await fetchSongById(id);
      setSong(data);
    };
    loadSong();
  }, [id]);

  if (!song) return <div className="text-center p-6">Cargando...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          {song.title} - {song.artist}
        </h1>
        <div className="flex space-x-2 mb-4 pb-2">
          <button
            onClick={() => setViewMode('lyrics')}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-200 ${
              viewMode === 'lyrics'
                ? 'bg-blue-600 text-white border-b-4 border-cyan-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Letra
          </button>
          <button
            onClick={() => setViewMode('chords')}
            className={`px-4 py-2 rounded-t-lg font-semibold transition-all duration-200 ${
              viewMode === 'chords'
                ? 'bg-blue-600 text-white border-b-4 border-cyan-500'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Letra con Acordes
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          {viewMode === 'chords' ? (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                Letra con Acordes
              </h2>
              <div className="chord-pro">
                {song.chordsAndLyrics.map((segments, index) => (
                  <ChordProLine key={index} segments={segments} />
                ))}
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">
                Letra
              </h2>
              <pre className="whitespace-pre-wrap text-gray-600 leading-relaxed text-center">
                {song.lyrics}
              </pre>
            </div>
          )}
        </div>
        <Link
          to="/"
          className="mt-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
}

export default SongDetail;