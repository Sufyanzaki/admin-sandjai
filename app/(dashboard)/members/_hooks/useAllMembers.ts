import { useSWRFix } from '@/admin-utils/lib/useSwrFix';
import { getAllMembers, GetAllMembersParams } from '../_api/getAllMembers';

export default function useAllMembers(params?: GetAllMembersParams) {
  const { data, error, loading } = useSWRFix({
    key: `all-members-${JSON.stringify(params || {})}`,
    fetcher: () => getAllMembers(params),
    config: { revalidateOnFocus: false },
  });
  return { data, error, isLoading: loading };
} 