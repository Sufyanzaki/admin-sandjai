import { getRequest } from "@/admin-utils";

export async function getAbusiveWords(): Promise<string[]> {
  const res = await getRequest<{ words: string[] }>({
    url: "setting/abusive",
    useAuth: true,
  });
  return res.words || [];
} 