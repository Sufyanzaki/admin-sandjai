import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getEducationCareer } from "../_api/updateEducationCareer";
import { getUserTrackingId } from "@/lib/access-token";

export const useEducationCareerInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `education-career-${userId}` : '',
    fetcher: async () => {
      if (!userId) return null;
      return await getEducationCareer(userId);
    }
  });

  return {
    educationCareer: data,
    educationCareerLoading: loading,
    error,
    mutate
  };
}; 