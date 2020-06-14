import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_CORE,
});

export const getAllItems = async <T>() => {
  return await api.get<T>('/items');
};

export const createNewPoint = async <T>(pointData: FormData) => {
  return await api.post<T>('/points', pointData);
};

export default api;
