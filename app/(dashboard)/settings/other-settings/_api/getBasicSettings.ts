import { getRequest } from "@/admin-utils";

export async function getBasicSettings() {
  return getRequest({ url: "setting/basic-setting", useAuth: true });
} 