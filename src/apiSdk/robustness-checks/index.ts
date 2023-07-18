import axios from 'axios';
import queryString from 'query-string';
import { RobustnessCheckInterface, RobustnessCheckGetQueryInterface } from 'interfaces/robustness-check';
import { GetQueryInterface } from '../../interfaces';

export const getRobustnessChecks = async (query?: RobustnessCheckGetQueryInterface) => {
  const response = await axios.get(`/api/robustness-checks${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createRobustnessCheck = async (robustnessCheck: RobustnessCheckInterface) => {
  const response = await axios.post('/api/robustness-checks', robustnessCheck);
  return response.data;
};

export const updateRobustnessCheckById = async (id: string, robustnessCheck: RobustnessCheckInterface) => {
  const response = await axios.put(`/api/robustness-checks/${id}`, robustnessCheck);
  return response.data;
};

export const getRobustnessCheckById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/robustness-checks/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteRobustnessCheckById = async (id: string) => {
  const response = await axios.delete(`/api/robustness-checks/${id}`);
  return response.data;
};
