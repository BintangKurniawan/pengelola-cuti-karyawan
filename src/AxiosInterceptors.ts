import axios from 'axios';
import { Cookies } from 'quasar';
import { useRouter } from 'vue-router';
import { useConfigPortStore } from './stores/configStore';
const store = useConfigPortStore();

const port = store.getPort;
const ip = store.getIp;

const api = axios.create({
  baseURL: 'https://10.10.101.212:8080/api',
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // console.log(token);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
// eslint-disable-next-line prefer-const
let refreshPromise = null;

async function refreshToken() {
  try {
    const newToken = await api.get('/auth/refresh', { withCredentials: true });

    localStorage.setItem('token', newToken.data.data.accessToken);
    return newToken.data.data.accessToken;
  } catch (error) {
    console.error('Token refresh invalid');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    useRouter().push('/login');
    throw error;
  }
}

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 408 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccessToken = await refreshToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (error) {
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      } else {
        if (!refreshPromise) {
          refreshPromise = new Promise((resolve) => {
            setTimeout(() => {
              resolve(api(originalRequest));
            }, 1000);
          }).finally(() => {
            refreshPromise = null;
          });
        }

        return refreshPromise;
      }
    }

    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => {
//     while (refreshQue.length > 0) {
//       const quedRequest = refreshQue.shift();
//       quedRequest();
//     }
//     return response;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );
export default api;

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response.status === 408 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newToken = await api.get('/auth/refresh', {
//           withCredentials: true,
//         });
//         console.log('token', newToken);
//         originalRequest.headers.Authorization = `Bearer ${newToken.data.data.accessToken}`;
//         localStorage.setItem('token', newToken.data.data.accessToken);
//         return api(originalRequest);
//       } catch (refreshError) {
//         console.error('Token refresh failed', refreshError);
//         localStorage.removeItem('token');
//         useRouter().push('/login');
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );
