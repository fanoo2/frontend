import { DefaultApi, Configuration } from 'fanno-payments-workspace';

// initialize with your base URL (if needed)
const config = new Configuration({ basePath: '/payments' });
export const paymentsApi = new DefaultApi(config);