import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUserTrackingId } from "@/lib/access-token";
import { getPersonalityBehavior } from "../_api/updatePersonalityBehavior";

export const usePersonalityBehaviorInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `personality-behavior-${userId}` : '',
    fetcher: async () => {
      if (!userId) return null;
      return await getPersonalityBehavior(userId);
    }
  });

  return {
    personalityBehavior: data,
    personalityBehaviorLoading: loading,
    error,
    mutate
  };
}; 