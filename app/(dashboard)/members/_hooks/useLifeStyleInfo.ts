import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getUserTrackingId } from "@/lib/access-token";
import { getLifeStyle } from "../_api/updateLifeStyle";
import { useParams } from "next/navigation";

export const useLifeStyleInfo = () => {
  
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? id;

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