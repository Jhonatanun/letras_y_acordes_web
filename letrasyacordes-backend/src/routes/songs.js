// const express = require('express');
// const router = express.Router();
// const songs = require('../data/songs.json');

// router.get('/songs', (req, res) => {
//   res.json(songs);
// });

// router.get('/songs/:id', (req, res) => {
//   const song = songs.find(s => s.id === parseInt(req.params.id));
//   if (!song) return res.status(404).json({ message: 'Canción no encontrada' });
//   res.json(song);
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const songs = require('../data/songs.json');

// router.get('/songs', (req, res) => {
//   res.json(songs);
// });

// router.get('/songs/:id', (req, res) => {
//   const song = songs.find(s => s.id === parseInt(req.params.id));
//   if (!song) return res.status(404).json({ message: 'Canción no encontrada' });
//   res.json(song);
// });

// module.exports = router;
const express = require('express');
const router = express.Router();
const songs = require('../data/songs.json');

// Función para parsear el texto ChordPro
function parseChordProText(chordProText) {
  const lines = chordProText.split('\n').filter(line => line.trim() !== '');
  const parsedLines = [];

  for (const line of lines) {
    const segments = parseChordProLine(line);
    if (segments.length > 0) {
      parsedLines.push(segments);
    }
  }

  return parsedLines;
}

// Función auxiliar para parsear una línea individual
function parseChordProLine(line) {
  const regex = /\[([^\]]+)\]([^\[]*)/g;
  let match;
  const segments = [];

  // Manejar directivas entre llaves {}
  if (line.startsWith('{') && line.endsWith('}')) {
    const directive = line.slice(1, -1);
    return [{ chord: '', text: directive, isDirective: true }];
  }

  // Parsear acordes y texto
  while ((match = regex.exec(line)) !== null) {
    segments.push({ chord: match[1], text: match[2].trim() });
  }

  // Manejar texto residual después del último acorde o líneas sin acordes
  const lastMatchIndex = match ? match.index + match[0].length : 0;
  if (lastMatchIndex < line.length) {
    segments.push({ chord: '', text: line.slice(lastMatchIndex).trim() });
  } else if (segments.length === 0 && line.trim()) {
    segments.push({ chord: '', text: line.trim() });
  }

  return segments;
}

// Endpoint para obtener todas las canciones
router.get('/songs', (req, res) => {
  res.json(songs);
});

// Endpoint para obtener una canción específica con el campo parseado
router.get('/songs/:id', (req, res) => {
  const song = songs.find(s => s.id === parseInt(req.params.id));
  if (!song) {
    return res.status(404).json({ message: 'Canción no encontrada' });
  }

  // Parsear el campo chords y agregar el resultado como chordsAndLyrics
  const chordsAndLyrics = parseChordProText(song.chords);

  // Crear el objeto de respuesta con los datos originales más el campo parseado
  const responseSong = {
    ...song,
    chordsAndLyrics
  };

  res.json(responseSong);
});

module.exports = router;