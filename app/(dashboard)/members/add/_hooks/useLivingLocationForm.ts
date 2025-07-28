import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { patchUserLocation, postUserLocation } from "../../_api/updateLocation";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";

const livingLocationSchema = z.object({
  id: z.string().optional(),
  location: z.string().min(1, "Location is required"),
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
      location: "",
    },
    mode: "onBlur",
  });

  const { trigger, isMutating } = useSWRMutation(
    "updateUserLocation",
    async (_: string, { arg }: { arg: UpdateUserLocationFormValues }) => {
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";

      if (!id) return showError({ message: "You need to initialize a new member profile before you can add other details. Go back to basic Information to initialze a member" });

      if (tracker && tracker.living) return await patchUserLocation(id,arg);
       else  await postUserLocation(id, arg);
      
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