import { DefaultApi, Configuration } from 'fanno-payments-workspace';
import { apiClient } from './api';

// Use centralized API configuration
const config = new Configuration({ basePath: `${apiClient.baseURL}/payments` });
export const paymentsApi = new DefaultApi(config);