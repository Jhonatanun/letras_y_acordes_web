import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSongById, fetchSongs } from '../services/api';
import { jsPDF } from 'jspdf';
import { FaFilePdf } from 'react-icons/fa'; // Importamos el ícono SVG

// Componente para mostrar información legal
function LegalInfo({ legalStatus }) {
  const legalLabels = {
    public_domain: 'Esta canción está en dominio público.',
    cc_by: 'Licencia Creative Commons Atribución (CC BY). Debes dar crédito al autor.',
    cc_by_sa: 'Licencia Creative Commons Atribución-CompartirIgual (CC BY-SA).',
    original_permission: 'Permiso otorgado por el autor original.'
  };

  return (
    <div className="text-sm text-gray-500 italic mt-4">
      {legalLabels[legalStatus] || 'Información legal no disponible.'}
    </div>
  );
}

function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [song, setSong] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [songIds, setSongIds] = useState([]); // Lista de IDs de canciones permitidas

  // Cargar la lista de canciones para obtener los IDs permitidos
  useEffect(() => {
    const loadSongIds = async () => {
      try {
        const songs = await fetchSongs();
        const allowedStatuses = ['public_domain', 'cc_by', 'cc_by_sa', 'original_permission'];
        const allowedSongIds = songs
          .filter(song => allowedStatuses.includes(song.legalStatus))
          .map(song => song.id)
          .sort((a, b) => a - b); // Ordenar IDs numéricamente
        setSongIds(allowedSongIds);
      } catch (error) {
        console.error('Error al cargar la lista de canciones:', error);
        setSongIds([]);
      }
    };
    loadSongIds();
  }, []);

  // Cargar la canción actual
  useEffect(() => {
    const loadSong = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchSongById(id);
        if (data) {
          const allowedStatuses = ['public_domain', 'cc_by', 'cc_by_sa', 'original_permission'];
          if (allowedStatuses.includes(data.legalStatus)) {
            setSong(data);
          } else {
            setError('Esta canción no tiene un estatus legal permitido para su publicación.');
            setSong(null);
          }
        } else {
          setError('No se encontró la canción.');
          setSong(null);
        }
      } catch (error) {
        console.error('Error al cargar la canción:', error);
        setError('No se pudo cargar la canción. Intenta de nuevo más tarde.');
        setSong(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadSong();
  }, [id]);

  // Funciones para navegar a la canción anterior y siguiente
  const navigateToPrevious = () => {
    const currentIndex = songIds.indexOf(parseInt(id));
    if (currentIndex > 0) {
      const previousId = songIds[currentIndex - 1];
      navigate(`/song/${previousId}`);
    }
  };

  const navigateToNext = () => {
    const currentIndex = songIds.indexOf(parseInt(id));
    if (currentIndex < songIds.length - 1) {
      const nextId = songIds[currentIndex + 1];
      navigate(`/song/${nextId}`);
    }
  };


// Función para generar y descargar el PDF
const generatePDF = () => {
  const doc = new jsPDF();
  const margin = 20;
  const pageHeight = doc.internal.pageSize.height; // Alto de la página A4 (297mm)
  let yPosition = margin;

  // Función para agregar el encabezado en cada página
  const addHeader = () => {
    doc.setFontSize(10);
    doc.setTextColor(100); // Gris claro para el encabezado
    doc.text('Letras Cristianas App - Tu fuente de letras cristianas', 190, 10, { align: 'right' });
    doc.setTextColor(0); // Restablecer a negro después del encabezado
  };

  // Agregar encabezado en la primera página
  addHeader();

  // Título
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`${song.title} - ${song.artist}`, margin, yPosition);
  yPosition += 10;

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, 190, yPosition);
  yPosition += 10;

  // Letras
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0); // Establecer el color a negro para las letras
  const lyricsLines = song.lyrics.split('\n');
  lyricsLines.forEach(line => {
    // Manejar saltos de página si el texto excede la página
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      addHeader(); // Agregar encabezado en la nueva página
      yPosition = margin;
    }
    doc.text(line, margin, yPosition);
    yPosition += 7; // Espaciado entre líneas
  });

  // Información legal
  yPosition += 5;
  if (yPosition > pageHeight - margin) {
    doc.addPage();
    addHeader(); // Agregar encabezado en la nueva página
    yPosition = margin;
  }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100); // Gris claro para la información legal
  const legalLabels = {
    public_domain: 'Esta canción está en dominio público.',
    cc_by: 'Licencia Creative Commons Atribución (CC BY). Debes dar crédito al autor.',
    cc_by_sa: 'Licencia Creative Commons Atribución-CompartirIgual (CC BY-SA).',
    original_permission: 'Permiso otorgado por el autor original.'
  };
  doc.text(legalLabels[song.legalStatus] || 'Información legal no disponible.', margin, yPosition);

  // Descargar el PDF
  doc.save(`${song.title} - ${song.artist}.pdf`);
};
  // Determinar si los botones deben estar deshabilitados
  const currentIndex = songIds.indexOf(parseInt(id));
  const isFirstSong = currentIndex === 0 || currentIndex === -1;
  const isLastSong = currentIndex === songIds.length - 1 || currentIndex === -1;

  if (isLoading) {
    return (
      <div className="text-center p-6">
        <svg className="animate-spin h-5 w-5 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-gray-600 mt-2 block">Cargando...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-6 text-red-500">
        {error}
        <button
          onClick={() => {
            setIsLoading(true);
            setError(null);
            loadSong();
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (!song) return <div className="text-center p-6 text-gray-500">No se encontró la canción.</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          {song.title} - {song.artist}
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <pre className="whitespace-pre-wrap text-gray-600 leading-relaxed text-center">
            {song.lyrics || 'No hay letra disponible'}
          </pre>
          <LegalInfo legalStatus={song.legalStatus} />
        </div>
        <div className="flex justify-between mt-6">
          <button
            onClick={navigateToPrevious}
            disabled={isFirstSong}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isFirstSong
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label="Ir a la canción anterior"
            aria-disabled={isFirstSong}
          >
            Anterior
          </button>
          <div className="flex space-x-2">
          <button
          onClick={generatePDF}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
        >
          <FaFilePdf /> {/* Ícono SVG */}
          <span>Imprimir PDF</span>
        </button>
            <Link
              to="/"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Volver al Inicio
            </Link>
          </div>
          <button
            onClick={navigateToNext}
            disabled={isLastSong}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
              isLastSong
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-label="Ir a la canción siguiente"
            aria-disabled={isLastSong}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default SongDetail;