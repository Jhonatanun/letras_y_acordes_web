import axios from 'axios';

const API_URL = 'http://localhost:3001/api'; // Cambia esto al deploy

export const fetchSongs = async () => {
  const response = await axios.get(`${API_URL}/songs`);
  return response.data;
};

export const fetchSongById = async (id) => {
  const response = await axios.get(`${API_URL}/songs/${id}`);
  return response.data;
};