import axios from 'axios';

const BASE_URL = 'https://student-management-system-backend.up.railway.app/api/vehicle-service';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchVehicles = async () => {
  const res = await api.get('/vehicle');
  return res.data;
};

export const fetchVehicle = async (id) => {
  const res = await api.get(`/vehicle/${id}`);
  return res.data;
};

export const fetchVehicleSegment = async (id, segment) => {
  const res = await api.get(`/vehicle/${id}/${segment}`);
  return res.data;
};

export const createVehicle = async (payload) => {
  const res = await api.post('/vehicle', payload);
  return res.data;
};

export const updateVehicle = async ({ id, payload }) => {
  const res = await api.put(`/vehicle/${id}`, payload);
  return res.data;
};

export const deleteVehicle = async (id) => {
  const res = await api.delete(`/vehicle/${id}`);
  return res.data;
};

export default api;
