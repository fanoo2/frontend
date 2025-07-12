import { apiClient } from './api';

// Temporary implementation until fanno-payments-workspace exports are fixed
export const paymentsApi = {
  createCheckoutSession: async (params: { amount: number; currency: string }) => {
    const response = await fetch(`${apiClient.baseURL}/payments/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return response.json();
  }
};