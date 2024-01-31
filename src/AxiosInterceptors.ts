import axios from 'axios';
// import router from './router';
import { Cookies } from 'quasar';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
const api = axios.create({
  baseURL: 'https://10.10.101.251:8080/api',
});
const $q = useQuasar();
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const tok = Cookies.get('refreshToken');
    console.log(token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 408 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await api.get('/auth/refresh', {
          withCredentials: true,
        });
        console.log('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken.data.data.accessToken}`;
        localStorage.setItem('token', newToken.data.data.accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed', refreshError);
        localStorage.removeItem('token');
        useRouter().push('/login');
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
