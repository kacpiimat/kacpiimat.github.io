import axios from 'axios';
import queryString from 'query-string';
import { ModelInterface, ModelGetQueryInterface } from 'interfaces/model';
import { GetQueryInterface } from '../../interfaces';

export const getModels = async (query?: ModelGetQueryInterface) => {
  const response = await axios.get(`/api/models${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createModel = async (model: ModelInterface) => {
  const response = await axios.post('/api/models', model);
  return response.data;
};

export const updateModelById = async (id: string, model: ModelInterface) => {
  const response = await axios.put(`/api/models/${id}`, model);
  return response.data;
};

export const getModelById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/models/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteModelById = async (id: string) => {
  const response = await axios.delete(`/api/models/${id}`);
  return response.data;
};
