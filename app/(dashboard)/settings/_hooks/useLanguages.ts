import { useSWRFix } from "@/admin-utils/lib/useSwrFix";
import { getLanguages, Language } from "../_api/getLanguages";
import { useSession } from "next-auth/react";

export function useLanguages() {
  const { data: session } = useSession();

  const { data, loading, error, mutate } = useSWRFix<Language[]>({
    key: session?.token ? "languages-list" : "",
    fetcher: async () => {
      const response = await getLanguages();
      if (!response) {
        throw new Error("Failed to fetch languages");
      }
      return response;
    },
  });

  return {
    languages: data,
    languagesLoading: loading,
    error,
    mutate,
  };
} 