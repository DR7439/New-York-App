import axios from 'axios';
import { message } from "antd";

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',  
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

axiosInstance.interceptors.response.use(
  function (response) {
    // Do something with response data
    return response;
  },
  function (error) {
    if (error.response?.status === 401) {
      message.error("Session Expired. Please login again");
      localStorage.removeItem("token");
      localStorage.removeItem("csrftoken");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
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