import axios from "axios";

let memoryToken: string | null = null;

export const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

export const setAccessToken = (token: string | null) => {
  memoryToken = token;
};

export const getAccessToken = () => memoryToken;

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post<{ accessToken: string }>(
          "/api/auth/refresh",
          {},
          { withCredentials: true },
        );

        setAccessToken(data.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);

        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
  },
);
