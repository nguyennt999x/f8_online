import axios from 'axios';

const API_BASE_URL = '/api';
const SIGN_IN_PATH = '/auth/signin';
const REFRESH_TOKEN_PATH = '/auth/refresh-token';

const DEFAULT_CREDENTIALS = {
    email: 'sonnv@test.com',
    password: '12345678',
};

type RetryableRequestConfig = {
    url?: string;
    headers?: Record<string, string | number | boolean>;
    _retry?: boolean;
    [key: string]: unknown;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function login() {
    const { data } = await axios.post(`${API_BASE_URL}${SIGN_IN_PATH}`, DEFAULT_CREDENTIALS, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const accessToken = data?.data?.accessToken || data?.accessToken || data?.token;
    const refreshToken = data?.data?.refreshToken || data?.refreshToken;

    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    return accessToken;
}

async function refreshToken() {
    const storedRefreshToken = localStorage.getItem('refreshToken');

    if (!storedRefreshToken) {
        return login();
    }

    const { data } = await axios.post(`${API_BASE_URL}${REFRESH_TOKEN_PATH}`, { refreshToken: storedRefreshToken }, {
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const accessToken = data?.data?.accessToken || data?.accessToken || data?.token;
    const newRefreshToken = data?.data?.refreshToken || data?.refreshToken;

    localStorage.setItem('accessToken', accessToken);

    if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
    }

    return accessToken;
}



api.interceptors.request.use(async (config) => {
    if (config.url?.includes(SIGN_IN_PATH) || config.url?.includes(REFRESH_TOKEN_PATH)) {
        return config;
    }

    const token = localStorage.getItem('accessToken') || (await login());
    config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
    };

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config as RetryableRequestConfig | undefined;

        if (!originalRequest || originalRequest._retry || originalRequest.url?.includes(SIGN_IN_PATH) || originalRequest.url?.includes(REFRESH_TOKEN_PATH)) {
            throw error;
        }

        // Handle 401 (Unauthorized) or 400 (Bad Request - expired token)
        if (error.response?.status !== 401 && error.response?.status !== 400) {
            throw error;
        }

        originalRequest._retry = true;

        const token = await refreshToken();
        originalRequest.headers = {
            ...(originalRequest.headers || {}),
            Authorization: `Bearer ${token}`,
        };

        return api(originalRequest);
    },
);

export { login, refreshToken };
export default api;
