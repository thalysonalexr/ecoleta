import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_IBGE,
});

export const getAllStates = async <T>() => {
  return await api.get<T>('/localidades/estados');
};

export const getCitiesByState = async <T>(uf: string) => {
  return await api.get<T>(`/localidades/estados/${uf}/municipios`);
};

export default api;
