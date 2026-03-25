import axios from 'axios';

const api = axios.create({
    // 👇 Replace this with your BACKEND Render URL!
    baseURL: 'http://localhost:5000', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

