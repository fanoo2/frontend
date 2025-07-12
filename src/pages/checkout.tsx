
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { paymentsApi } from '@/lib/payments';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBuy = async (amount: number, description: string) => {
    setLoading(true);
    setError(null);
    
    try {
      if (!import.meta.env.VITE_API_URL) {
        throw new Error('VITE_API_URL environment variable is not set');
      }
      
      const { sessionId } = await paymentsApi.createCheckoutSession({
        amount: amount, // amount in cents
        currency: 'usd'
      });
      
      // Redirect to Stripe Checkout
      window.location.href = `https://checkout.stripe.com/pay/${sessionId}`;
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Failed to create checkout session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Starter Pack</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">$9.99</div>
              <ul className="space-y-2 mb-6">
                <li>✓ 100 API Credits</li>
                <li>✓ Basic Support</li>
                <li>✓ 1 Agent</li>
              </ul>
              <Button 
                onClick={() => handleBuy(999, 'Starter Pack')}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Buy Starter Pack'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Pack</CardTitle>
              <CardDescription>For power users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-4">$19.99</div>
              <ul className="space-y-2 mb-6">
                <li>✓ 500 API Credits</li>
                <li>✓ Priority Support</li>
                <li>✓ 5 Agents</li>
                <li>✓ Advanced Features</li>
              </ul>
              <Button 
                onClick={() => handleBuy(1999, 'Pro Pack')}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Processing...' : 'Buy Pro Pack'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
