import { http, isHttpError } from 'tosslib';
import { SavingsProduct } from '../types';

export async function fetchSavingsProducts(): Promise<SavingsProduct[]> {
  try {
    return await http.get<SavingsProduct[]>('/api/savings-products');
  } catch (e) {
    if (isHttpError(e)) {
      console.log(e.message);
    }
    throw e;
  }
}
