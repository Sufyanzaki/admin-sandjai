import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUserTrackingId } from "@/lib/access-token";
import { getLanguageInfo } from "../_api/updateLanguageInfo";

export const useLanguageInfoInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `language-info-${userId}` : '',
    fetcher: async () => {
      if (!userId) return null;
      return await getLanguageInfo(userId);
    }
  });

  return {
    languageInfo: data,
    languageInfoLoading: loading,
    error,
    mutate
  };
}; 