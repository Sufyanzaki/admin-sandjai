import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { deleteCurrency } from "../_api/deleteCurrency";
import { useSWRConfig } from "swr";

export function useDeleteCurrency() {
  const { mutate: globalMutate } = useSWRConfig();
  const { loading, error, mutate, data, refetch } = useSWRFix({
    key: '',
    fetcher: async () => {},
    enabled: false,
  });

  const deleteMutate = async (id: string) => {
    await deleteCurrency(id);
    globalMutate("currencies", (currencies: any[] = []) => currencies.filter(c => c.id !== id), false);
  };

  return {
    mutate: deleteMutate,
    loading,
    error,
    data,
    refetch,
  };
} 