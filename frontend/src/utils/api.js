// Utility to handle API URL construction safely (removes trailing slashes)
export const getApiUrl = (endpoint) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${cleanBaseUrl}${cleanEndpoint}`;
};
