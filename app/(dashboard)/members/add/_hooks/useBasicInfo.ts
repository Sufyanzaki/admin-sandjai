import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUser } from "../_api/createUser";
import { getUserTrackingId } from "@/lib/access-token";

export const useBasicInfo = () => {
  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? '';

  const { data, loading, error, mutate } = useSWRFix({
    key: userId ? `user-${userId}` : '',
    fetcher: async () => {
        if (!userId) return null;
        return await getUser(userId)
    }
  });

  return {
    user: data,
    userLoading: loading,
    error,
    mutate
  };
};