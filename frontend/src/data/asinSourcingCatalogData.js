import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchAsinSourcingCatalog = async () => {
  const response = await apiClient.get('/asinSourcingCatalog');
  return response.data;
};
