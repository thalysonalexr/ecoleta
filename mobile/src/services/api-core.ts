import axios from 'axios';

export const BASE_URL = 'http://192.168.0.102:3333/v1';

type ParamsType = {
  city: string;
  uf: string;
  items?: string[];
};

const api = axios.create({
  baseURL: BASE_URL,
});

export const getAllItems = async <T>() => {
  return await api.get<T>('/items');
};

export const getPointById = async <T>(id: string) => {
  return await api.get<T>(`/points/${id}`);
};

export const getAllPoints = async <T>({ items, ...params }: ParamsType) => {
  const parsedItems = items?.length
    ? { items: items.join(',').replace(' ', '') }
    : {};

  return await api.get<T>('/points', {
    params: { ...params, ...parsedItems },
  });
};

export default api;
