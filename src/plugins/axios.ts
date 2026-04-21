import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { AuthCredentials, AuthResponse } from '../interface';
import { unwrapApiData } from '../utils/api';

const API_BASE_URL = '/api';
const SIGN_IN_PATH = '/auth/signin';
const REFRESH_TOKEN_PATH = '/auth/refresh-token';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const persistAuth = ({ accessToken, refreshToken }: AuthResponse) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

const extractAuthTokens = (payload: unknown): AuthResponse => {
    const authData = unwrapApiData<AuthResponse>(payload);

    if (!authData?.accessToken || !authData?.refreshToken) {
        throw new Error('Phan hoi dang nhap khong hop le.');
    }

    return authData;
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const isAuthenticated = () => Boolean(getAccessToken());

export const clearAuthTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export async function login(credentials: AuthCredentials) {
    const { data } = await authApi.post(SIGN_IN_PATH, credentials);
    const tokens = extractAuthTokens(data);
    persistAuth(tokens);

    return tokens;
}

export async function refreshToken() {
    const storedRefreshToken = getRefreshToken();

    if (!storedRefreshToken) {
        throw new Error('Khong tim thay refresh token.');
    }

    const { data } = await authApi.post(REFRESH_TOKEN_PATH, {
        refreshToken: storedRefreshToken,
    });
    const tokens = extractAuthTokens(data);
    persistAuth(tokens);

    return tokens;
}

api.interceptors.request.use((config) => {
    if (config.url?.includes(SIGN_IN_PATH) || config.url?.includes(REFRESH_TOKEN_PATH)) {
        return config;
    }

    const token = getAccessToken();

    if (token) {
        config.headers = config.headers ?? new AxiosHeaders();
        config.headers.set('Authorization', `Bearer ${token}`);
    }

    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error?.config as RetryableRequestConfig | undefined;
        const shouldRetry = error?.response?.status === 401 || error?.response?.status === 400;

        if (
            !originalRequest ||
            originalRequest._retry ||
            originalRequest.url?.includes(SIGN_IN_PATH) ||
            originalRequest.url?.includes(REFRESH_TOKEN_PATH) ||
            !shouldRetry
        ) {
            throw error;
        }

        const storedRefreshToken = getRefreshToken();

        if (!storedRefreshToken) {
            clearAuthTokens();
            throw error;
        }

        originalRequest._retry = true;

        try {
            const tokens = await refreshToken();

            originalRequest.headers = originalRequest.headers ?? new AxiosHeaders();
            originalRequest.headers.set('Authorization', `Bearer ${tokens.accessToken}`);

            return api(originalRequest);
        } catch (refreshError) {
            clearAuthTokens();
            throw refreshError;
        }
    },
);

export default api;
