import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchEans = async () => {
  const response = await apiClient.get('/keepaData');
  return response.data;
};
