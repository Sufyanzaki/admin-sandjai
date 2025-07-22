import { postRequest, patchRequest } from "@/admin-utils";

export interface UserLocationPayload {
  country: string;
  state: string;
  city: string;
  id?: string;
}

export async function postUserLocation(payload: UserLocationPayload) {
  return postRequest({
    url: `users/${payload.id}/location`,
    data: payload,
    useAuth: true,
  });
}

export async function patchUserLocation(payload: UserLocationPayload) {
  return patchRequest({
    url : `users/${payload.id}/location`,
    data: payload,
    useAuth: true,
  });
} 