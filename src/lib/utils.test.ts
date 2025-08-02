import { cn } from './utils';

describe('cn utility function', () => {
  it('merges class names correctly', () => {
    const result = cn('px-2 py-1', 'px-4', 'text-sm');
    expect(result).toBe('py-1 px-4 text-sm');
  });

  it('handles conditional classes', () => {
    const result = cn('base-class', true && 'conditional-class', false && 'hidden-class');
    expect(result).toBe('base-class conditional-class');
  });

  it('handles undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class');
    expect(result).toBe('base-class valid-class');
  });

  it('handles arrays of classes', () => {
    const result = cn(['flex', 'items-center'], 'justify-between');
    expect(result).toBe('flex items-center justify-between');
  });

  it('merges conflicting tailwind classes correctly', () => {
    const result = cn('text-red-500 text-blue-500');
    expect(result).toBe('text-blue-500');
  });

  it('returns empty string for no arguments', () => {
    const result = cn();
    expect(result).toBe('');
  });
});