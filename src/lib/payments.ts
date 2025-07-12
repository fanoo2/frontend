import * as PaymentsWorkspace from 'fanno-payments-workspace';
import { apiClient } from './api';

// Use centralized API configuration - adjust based on updated package structure
const config = new PaymentsWorkspace.Configuration({ basePath: `${apiClient.baseURL}/payments` });
export const paymentsApi = new PaymentsWorkspace.DefaultApi(config);