import { postRequest } from "@/admin-utils";

export interface AddLanguagePayload {
  code: string;
  name: string;
  isActive: boolean;
}

export async function addLanguage(payload: AddLanguagePayload) {
  return postRequest<AddLanguagePayload>({
    url: "setting",
    data: payload,
    useAuth: true,
  });
} 