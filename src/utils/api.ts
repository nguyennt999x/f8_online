import axios from 'axios';

export const unwrapApiData = <T>(payload: unknown): T => {
    if (
        payload &&
        typeof payload === 'object' &&
        'data' in payload &&
        (payload as { data?: unknown }).data !== undefined
    ) {
        return (payload as { data: T }).data;
    }

    return payload as T;
};

export const getErrorMessage = (error: unknown, fallbackMessage: string) => {
    if (axios.isAxiosError(error)) {
        const payload = error.response?.data as
            | { message?: string; error?: string; data?: { message?: string } }
            | undefined;

        return payload?.message || payload?.error || payload?.data?.message || error.message || fallbackMessage;
    }

    if (error instanceof Error && error.message) {
        return error.message;
    }

    return fallbackMessage;
};
