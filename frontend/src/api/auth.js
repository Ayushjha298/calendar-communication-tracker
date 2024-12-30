import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';  

export const login = async (email, password,role) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, { email, password,role });

        if (response.data && response.data.token && response.data.role) {
            return {
                token: response.data.token,
                role: response.data.role,
            };
        } else {
            throw new Error('Missing token or role in response.');
        }
    } catch (err) {
        console.error('Login failed:', err);
        throw new Error('Login failed. Please check your credentials and try again.');
    }
};

// Register function
export const register = async (email, password, role) => {
    try {
        const data = {
            email,
            password,
            role
        }
        console.log("data",data)
        const response = await axios.post(`${API_URL}/auth/register`, data);

        

        if (response.data && response.data.token && response.data.role) {
            return {
                token: response.data.token,
                role: response.data.role,
            };
        } else {
            throw new Error('Missing token or role in response.');
        }
    } catch (err) {
        console.error('Registration failed:', err);
        throw new Error('Registration failed. Please try again.');
    }
};
