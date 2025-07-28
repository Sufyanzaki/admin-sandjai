import { postRequest } from "@/admin-utils"; // or "@/admin-utils/lib/httpRequests"

export async function postBasicSettings(data: any) {
  return postRequest({
    url: "setting/basic-setting",
    data,
    useAuth: true,
  });
} 