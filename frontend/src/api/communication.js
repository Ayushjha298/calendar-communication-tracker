// src/api/communication.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/communication-methods';

export const getCommunicationMethods = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching communication methods', error);
  }
};

export const addCommunicationMethod = async (method) => {
  try {
    const response = await axios.post(API_URL, method);
    return response.data;
  } catch (error) {
    console.error('Error adding communication method', error);
  }
};

export const updateCommunicationMethod = async (id, updatedMethod) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedMethod);
    return response.data;
  } catch (error) {
    console.error('Error updating communication method', error);
  }
};

export const deleteCommunicationMethod = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error('Error deleting communication method', error);
  }
};
