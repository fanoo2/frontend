import { DefaultApi, Configuration } from 'fanno-payments-workspace';

// initialize with your base URL using environment variable
const API = import.meta.env.VITE_API_URL;
const config = new Configuration({ basePath: `${API}/payments` });
export const paymentsApi = new DefaultApi(config);