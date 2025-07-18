import { postRequest } from "@/admin-utils";

export interface PostCookieSettingsPayload {
  cookieText: string;
  showAgreement: boolean;
}

export async function postCookieSettings(payload: PostCookieSettingsPayload) {
  return postRequest<PostCookieSettingsPayload>({
    url: "setting/cookie-settings",
    data: payload,
    useAuth: true,
  });
} 