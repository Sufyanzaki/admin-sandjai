import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { patchEmailTemplate, PatchEmailTemplatePayload } from "../_api/patchEmailTemplate";
import { useEmailTemplateById } from "./useEmailTemplateById";
import { useEffect } from "react";

const translationSchema = z.object({
  language: z.string().min(1, "Language is required"),
  subject: z.string().min(1, "Subject is required"),
  content: z.string().min(1, "Content is required"),
});

const emailTemplateSchema = z.object({
  key: z.string().min(1, "Key is required"),
  isActive: z.boolean(),
  translations: z.array(translationSchema).min(1, "At least one translation is required"),
});

export type EmailTemplateFormValues = z.infer<typeof emailTemplateSchema>;

const languages = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "it", label: "Italian" },
];

export default function useEmailTemplateForm(id: number | string) {
  const { emailTemplate, loading, error } = useEmailTemplateById(id);

  const { trigger, isMutating } = useSWRMutation(
    `patch-email-template-${id}`,
    async (_: string, { arg }: { arg: EmailTemplateFormValues }) => {
      return await patchEmailTemplate(id, arg);
    },
    {
      onError: (error: Error) => {
        showError({ message: error.message });
        console.error("Email template update error:", error);
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    reset,
    watch,
    control,
  } = useForm<EmailTemplateFormValues>({
    resolver: zodResolver(emailTemplateSchema),
    defaultValues: {
      key: "",
      isActive: true,
      translations: [],
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (emailTemplate) {
      // Ensure all translations are present and non-null
      reset({
        key: emailTemplate.key,
        isActive: emailTemplate.isActive,
        translations: languages.map(lang => {
          const t = emailTemplate.translations.find(tr => tr.language === lang.value);
          return {
            language: lang.value,
            subject: t?.subject ?? " ", // Use a single space to pass zod min(1)
            content: t?.content ?? " ",
          };
        }),
      });
    }
  }, [emailTemplate, reset]);

  const onSubmit = async (values: EmailTemplateFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
    if (result) {
      showSuccess("Email template updated successfully!");
      reset();
      callback?.(result);
    }
  };

  return {
    handleSubmit,
    onSubmit,
    errors,
    isLoading: isSubmitting || isMutating,
    register,
    setValue,
    watch,
    control,
    reset,
    emailTemplate,
    loading,
    error,
  };
} 