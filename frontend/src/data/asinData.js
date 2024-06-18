import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
});

export const fetchAsins = async () => {
  const response = await apiClient.get('/asins');
  return response.data;
};

export const fetchAsinWarehouseQuantities = async () => {
  const response = await apiClient.get('/asinwarehousequantity');
  return response.data;
};
