
import { useState } from 'react';
import { Button } from './button';
import { paymentsApi } from '@/lib/payments';

interface CheckoutProps {
  amount?: number;
  currency?: string;
  description?: string;
  className?: string;
}

export function Checkout({ 
  amount = 1000, 
  currency = 'usd', 
  description = '10 Coins',
  className 
}: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { sessionId } = await paymentsApi.createCheckoutSession({
        amount: amount,
        currency: currency
      });
      
      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {error && (
        <div className="text-red-600 text-sm mb-2">{error}</div>
      )}
      <Button onClick={handleClick} disabled={loading}>
        {loading ? 'Processing…' : `Buy ${description} for $${(amount / 100).toFixed(2)}`}
      </Button>
    </div>
  );
}
