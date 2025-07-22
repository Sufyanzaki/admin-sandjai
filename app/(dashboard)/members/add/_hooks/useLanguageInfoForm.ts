import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { postLanguageInfo, patchLanguageInfo } from "../_api/updateLanguageInfo";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";
import { useLanguageInfoInfo } from "./useLanguageInfoInfo";
import { useEffect } from "react";

const languageInfoSchema = z.object({
  motherTongue: z.string().min(1, "Mother tongue is required"),
  knownLanguages: z.string().min(1, "Known languages are required"),
});

export type LanguageInfoFormValues = z.infer<typeof languageInfoSchema>;

export default function useLanguageInfoForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<LanguageInfoFormValues>({
    resolver: zodResolver(languageInfoSchema),
    defaultValues: {
      motherTongue: "",
      knownLanguages: "",
    },
    mode: "onBlur",
  });

  const { languageInfo, languageInfoLoading } = useLanguageInfoInfo();
  const tracker = getUserTrackingId();

  useEffect(() => {
    if (tracker?.id && languageInfo) {
      reset({
        motherTongue: languageInfo.motherTongue || "",
        knownLanguages: languageInfo.knownLanguages || "",
      });
    }
  }, [tracker?.id, languageInfo, reset]);

  const { trigger, isMutating } = useSWRMutation(
    "updateLanguageInfo",
    async (_: string, { arg }: { arg: LanguageInfoFormValues }) => {
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";
      if (!id) return showError({ message: "User not found" });
      if (tracker && tracker.languages) return await patchLanguageInfo(id, arg);
      else return await postLanguageInfo(id, arg);
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to update language info" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: LanguageInfoFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
    if (result?.status === 201 || result?.status === 200) {
      showSuccess("Language info updated successfully!");
      callback?.(result);
      updateUserTrackingId({ languages: true });
    }
  };

  return {
    handleSubmit,
    errors,
    isLoading: isSubmitting || isMutating,
    reset,
    control,
    watch,
    onSubmit,
    languageInfoLoading,
  };
} 