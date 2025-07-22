import { getRequest } from "@/admin-utils";

export interface Currency {
  id: string;
  currencyName: string;
  currencyCode: string;
  symbol?: string;
  textDirection?: boolean;
}

export async function getCurrencies(): Promise<Currency[]> {
  return getRequest<Currency[]>({
    url: "setting/currency",
    useAuth: true,
  });
} 