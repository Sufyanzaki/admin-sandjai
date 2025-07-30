import {useSWRFix} from "@/admin-utils/lib/useSwrFix";
import {getCurrencyFormat} from "@/app/(dashboard)/settings/other-settings/_api/currencies";

export function useFormat() {
    const { data, error, loading, mutate } = useSWRFix({
        key: "format",
        fetcher: getCurrencyFormat,
    });

    return { data, error, loading, mutate };
}
