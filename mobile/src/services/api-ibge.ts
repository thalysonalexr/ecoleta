import axios from 'axios';

export const API_IBGE = 'https://servicodados.ibge.gov.br/api/v1';

const api = axios.create({
  baseURL: API_IBGE,
});

export const getAllStates = async <T>() => {
  return await api.get<T>('/localidades/estados');
};

export const getCitiesByState = async <T>(uf: string) => {
  return await api.get<T>(`/localidades/estados/${uf}/municipios`);
};

export default api;
