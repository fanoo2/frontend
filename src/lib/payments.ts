// Temporary implementation until fanno-payments-workspace exports are fixed
export const paymentsApi = {
  createCheckoutSession: async (params: { amount: number; currency: string }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const response = await fetch(`${API_URL}/payments/create-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    return response.json();
  }
};