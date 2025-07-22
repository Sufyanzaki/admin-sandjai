import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUserTrackingId } from "@/lib/access-token";
import { getHobbiesInterests } from "../_api/updateHobbiesInterests";

export const useHobbiesInterestsInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `hobbies-interests-${userId}` : '',
    fetcher: async () => {
      if (!userId) return null;
      return await getHobbiesInterests(userId);
    }
  });

  return {
    hobbiesInterests: data,
    hobbiesInterestsLoading: loading,
    error,
    mutate
  };
}; 