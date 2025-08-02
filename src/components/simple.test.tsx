import { render, screen } from '@testing-library/react';

// Simple test without importing components that use @/ paths
describe('Basic React Testing Library Setup', () => {
  it('can render a simple component', () => {
    const TestComponent = () => <div>Test Component</div>;
    render(<TestComponent />);
    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });
});