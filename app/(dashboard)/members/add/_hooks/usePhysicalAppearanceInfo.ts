import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUserTrackingId } from "@/lib/access-token";
import { getPhysicalAppearance } from "../_api/updatePhysicalAppearance";

export const usePhysicalAppearanceInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `physical-appearance-${userId}` : '',
    fetcher: async () => {
      if (!userId) return null;
      return await getPhysicalAppearance(userId);
    }
  });

  return {
    physicalAppearance: data,
    physicalAppearanceLoading: loading,
    error,
    mutate
  };
}; 