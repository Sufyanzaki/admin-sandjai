import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import { postBasicSettings } from "../_api/postBasicSettings";

const basicSettingsSchema = z.object({
  systemLogo: z.any().optional(),
  systemName: z.string().min(1, "System name is required"),
  memberPrefix: z.string().min(1, "Member prefix is required"),
  minimumAge: z.coerce.number().min(1, "Minimum age is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  adminPanelTitle: z.string().min(1, "Admin panel title is required"),
  loginImage: z.any().optional(),
  loginMessage: z.string().min(1, "Login message is required"),
  maintenanceMode: z.boolean().optional(),
  defaultCurrency: z.string().min(1, "Default currency is required"),
  defaultLanguage: z.string().min(1, "Default language is required"),
  serverInformation: z.string().optional(),
  database: z.string().optional(),
});

export type BasicSettingsFormValues = z.infer<typeof basicSettingsSchema>;

export function useBasicSettingsForm() {
  const { data, isLoading: loading } = useSWR("getBasicSettings", getBasicSettings);
  const { trigger, isMutating } = useSWRMutation(
    "postBasicSettings",
    async (_: string, { arg }: { arg: BasicSettingsFormValues }) => {
      return await postBasicSettings(arg);
    },
    {
      onError: (error: Error) => {
        showError({ message: error.message });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BasicSettingsFormValues>({
    resolver: zodResolver(basicSettingsSchema),
    defaultValues: {
      systemLogo: undefined,
      systemName: "",
      memberPrefix: "",
      minimumAge: 18,
      dateFormat: "DD-MM-YYYY",
      adminPanelTitle: "",
      loginImage: undefined,
      loginMessage: "",
      maintenanceMode: false,
      defaultCurrency: "USD",
      defaultLanguage: "en",
      serverInformation: "",
      database: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    if (data) reset(data);
  }, [data, reset]);

  const onSubmit = async (values: BasicSettingsFormValues) => {
    const result = await trigger(values);
    if (result) {
      showSuccess("Settings updated successfully!");
    }
  };

  return {
    handleSubmit,
    control,
    register,
    errors,
    isLoading: isSubmitting || isMutating,
    onSubmit,
    loading,
    data,
  };
} 