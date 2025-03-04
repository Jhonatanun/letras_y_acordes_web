const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const songRoutes = require('./routes/songs');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api', songRoutes);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});