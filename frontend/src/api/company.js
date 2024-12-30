import axios from 'axios';

const API_URL = 'https://calendar-communication-tracker-backend.onrender.com/api/companies';


const createConfig = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, 
  },
});

export const fetchCompanies = async (token) => {
  const config = createConfig(token);
  const response = await axios.get(API_URL, config);
  return response.data;
};

export const addCompany = async (companyData, token) => {
  const config = createConfig(token);
  const response = await axios.post(API_URL, companyData, config);
  return response.data;
};

export const updateCompany = async (id, companyData, token) => {
  const config = createConfig(token);
  const response = await axios.put(`${API_URL}/${id}`, companyData, config);
  return response.data;
};

export const deleteCompany = async (id, token) => {
  const config = createConfig(token);
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};
