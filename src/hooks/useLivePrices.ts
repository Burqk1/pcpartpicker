import { useQuery } from '@tanstack/react-query';
import { getLivePrices } from '@/services/api';
import type { StorePrice } from '@/types';

export function useLivePrices(productId: string | undefined) {
  return useQuery<StorePrice[]>({
    queryKey: ['live-prices', productId],
    queryFn: () => getLivePrices(productId!),
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,      // 5 minutes
    gcTime: 10 * 60 * 1000,        // 10 minutes
    retry: 2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 10000),
  });
}
