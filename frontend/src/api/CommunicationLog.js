import axios from 'axios';

const API_URL = 'https://calendar-communication-tracker-backend.onrender.com/api/communication-logs'; 


const createConfig = (token) => ({
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`, 
  },
});


export const fetchCommunicationLogsByCompany = async (companyId, token) => {
  const config = createConfig(token);
  const response = await axios.get(`${API_URL}/company/${companyId}`, config); 
  return response.data;
};

export const addCommunicationLog = async (communicationLogData, token) => {
  const config = createConfig(token);
  const response = await axios.post(API_URL, communicationLogData, config); 
  return response.data;
};
