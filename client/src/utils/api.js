import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ar-boutique-backends.onrender.com', // Update this based on your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
