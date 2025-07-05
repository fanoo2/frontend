import { useState } from 'react';
import { paymentsApi } from '@/lib/payments';

export function checkout() {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const { sessionId } = await paymentsApi.createCheckoutSession({
        amount: 1000,
        currency: 'usd'
      });
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Processing…' : 'Buy 10 Coins for $10'}
    </button>
  );
}
