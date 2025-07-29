import { patchRequest, getRequest } from "@/admin-utils";

export interface FooterFormData {
  footerLogo?: string;
  footerDescription: string;
  linkName: string;
  searchName: string;
  footerContent: string;
}

export interface FooterResponse {
  id: string;
  footerLogo?: string;
  footerDescription: string;
  linkName: string;
  searchName: string;
  footerContent: string;
  createdAt: string;
  updatedAt: string;
}

export async function patchFooterSettings(data: FooterFormData) {
  const r = await patchRequest<FooterFormData>({
    url: "setting/footer",
    data,
    useAuth: true,
  });
  return r.response;
}

export async function getFooterSettings() {
  return await getRequest<FooterResponse>({
    url: "setting/footer",
    useAuth: true,
  });
}