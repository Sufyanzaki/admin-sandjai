import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { patchUserLocation, postUserLocation } from "../_api/updateLocation";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";

const livingLocationSchema = z.object({
  id: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

export type UpdateUserLocationFormValues = z.infer<typeof livingLocationSchema>;

export default function useLivingLocationForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
    watch,
  } = useForm<UpdateUserLocationFormValues>({
    resolver: zodResolver(livingLocationSchema),
    defaultValues: {
      country: "",
      state: "",
      city: "",
    },
    mode: "onBlur",
  });

  const { trigger, isMutating } = useSWRMutation(
    "updateUserLocation",
    async (_: string, { arg }: { arg: UpdateUserLocationFormValues }) => {
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";

      if (!id) return showError({ message: "User not found" });

      if (tracker && tracker.living) return await patchUserLocation(arg);
       else  await postUserLocation(arg);
      
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to update user location" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: UpdateUserLocationFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
    if (result?.status === 201 || result?.status === 200) {
      showSuccess("User location updated successfully!");
      reset();
      callback?.(result);
      updateUserTrackingId({ living: true });
    }
  };

  return {
    handleSubmit,
    errors,
    isLoading: isSubmitting || isMutating,
    setValue,
    reset,
    control,
    watch,
    onSubmit,
  };
} 