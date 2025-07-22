import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUserTrackingId } from "@/lib/access-token";
import { getLifeStyle } from "../_api/updateLifeStyle";

export const useLifeStyleInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `lifestyle-${userId}` : '',
    fetcher: async () => {
      if (!userId) return null;
      return await getLifeStyle(userId);
    }
  });

  return {
    lifeStyle: data,
    lifeStyleLoading: loading,
    error,
    mutate
  };
}; 