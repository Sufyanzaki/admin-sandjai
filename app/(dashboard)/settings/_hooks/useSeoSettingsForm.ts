import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import useSWRMutation from "swr/mutation";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import { postSeoSettings } from "../_api/postSeoSettings";
import { imageUpload } from "@/admin-utils/utils/imageUpload";

export const seoSettingsSchema = z.object({
  metaTitle: z.string().min(1, "Meta title is required"),
  metaDescription: z.string().min(1, "Meta description is required"),
  keywords: z.array(z.string()),
  metaImage: z.union([z.string(), z.instanceof(File), z.null()]).optional(),
});

export type SeoSettingsFormValues = z.infer<typeof seoSettingsSchema>;

export default function useSeoSettingsForm() {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<SeoSettingsFormValues>({
    resolver: zodResolver(seoSettingsSchema),
    defaultValues: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
      metaImage: null,
    },
    mode: "onBlur",
  });

  const { trigger, isMutating } = useSWRMutation(
    "postSeoSettings",
    async (_: string, { arg }: { arg: SeoSettingsFormValues }) => {
      let metaImageUrl: string | null = null;
      if (arg.metaImage instanceof File) {
        try {
          metaImageUrl = await imageUpload(arg.metaImage);
        } catch (error: any) {
          showError({ message: error.message });
          throw error;
        }
      } else if (typeof arg.metaImage === "string") {
        metaImageUrl = arg.metaImage;
      } else {
        metaImageUrl = null;
      }
      const apiPayload = {
        metaTitle: arg.metaTitle,
        metaDescription: arg.metaDescription,
        keywords: arg.keywords,
        metaImage: metaImageUrl,
      };
      return await postSeoSettings(apiPayload);
    },
    {
      onError: (error: Error) => {
        showError({ message: error.message });
        console.error("SEO settings error:", error);
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: SeoSettingsFormValues) => {
    const result = await trigger(values);
    if (result?.status === 201) {
      showSuccess("SEO settings saved successfully!");
      reset();
    }
  };

  return {
    handleSubmit,
    onSubmit,
    errors,
    isLoading: isSubmitting || isMutating,
    setValue,
    watch,
    reset,
    control,
  };
} 