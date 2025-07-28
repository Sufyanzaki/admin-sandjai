import { deleteRequest } from "@/admin-utils";

export async function deleteCurrency(id: string) {
  return deleteRequest({
    url: `setting/currency/${id}`,
    useAuth: true,
  });
} 