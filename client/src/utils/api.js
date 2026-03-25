import axios from 'axios';

const api = axios.create({
    // 👇 Replace this with your BACKEND Render URL!
    baseURL: 'https://your-backend-app.onrender.com', 
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;

