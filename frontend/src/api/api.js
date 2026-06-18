import axios from 'axios';

// url base
const apiClient = axios.create({
    baseURL: 'http://localhost:3000'
});

// apiClient.get('/cadastro')

apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');

        if(token){
            config.headers.set('Authorization', `Bearer ${token}`)
        }

        config.headers.set('Accept', 'application/json')

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export default apiClient;