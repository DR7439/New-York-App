import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://adoptima.online',
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        const csrftoken = getCookie('csrftoken');  

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (csrftoken) {
            config.headers['X-CSRFToken'] = csrftoken;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export default axiosInstance;