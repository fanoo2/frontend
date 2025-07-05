import { DefaultApi, Configuration } from 'fanno-payments-workspace';

// Use centralized API configuration
const API = import.meta.env.VITE_API_URL;
const config = new Configuration({ basePath: `${API}/payments` });
export const paymentsApi = new DefaultApi(config);