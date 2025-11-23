import { SavingsProduct } from '../types/savings.ts';

export async function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  const response = await fetch('/api/savings-products');
  if (!response.ok) {
    throw new Error('Failed to fetch savings products');
  }
  return response.json();
}
