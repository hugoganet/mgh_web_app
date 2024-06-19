import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const fetchSkus = async () => {
  const response = await apiClient.get('/skus');
  console.log(response.data);
  return response.data;
};
