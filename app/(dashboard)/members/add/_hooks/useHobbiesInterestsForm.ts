import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { postHobbiesInterests, patchHobbiesInterests } from "../_api/updateHobbiesInterests";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";
import { useHobbiesInterestsInfo } from "./useHobbiesInterestsInfo";
import { useEffect } from "react";

const hobbiesInterestsSchema = z.object({
  sports: z.string().min(1, "Sports is required"),
  music: z.string().min(1, "Music is required"),
  kitchen: z.string().min(1, "Kitchen is required"),
  reading: z.string().min(1, "Reading is required"),
  tvShows: z.string().min(1, "TV Shows is required"),
});

export type HobbiesInterestsFormValues = z.infer<typeof hobbiesInterestsSchema>;

export default function useHobbiesInterestsForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<HobbiesInterestsFormValues>({
    resolver: zodResolver(hobbiesInterestsSchema),
    defaultValues: {
      sports: "",
      music: "",
      kitchen: "",
      reading: "",
      tvShows: "",
    },
    mode: "onBlur",
  });

  const { hobbiesInterests, hobbiesInterestsLoading } = useHobbiesInterestsInfo();
  const tracker = getUserTrackingId();

  useEffect(() => {
    if (tracker?.id && hobbiesInterests) {
      reset({
        sports: hobbiesInterests.sports || "",
        music: hobbiesInterests.music || "",
        kitchen: hobbiesInterests.kitchen || "",
        reading: hobbiesInterests.reading || "",
        tvShows: hobbiesInterests.tvShows || "",
      });
    }
  }, [tracker?.id, hobbiesInterests, reset]);

  const { trigger, isMutating } = useSWRMutation(
    "updateHobbiesInterests",
    async (_: string, { arg }: { arg: HobbiesInterestsFormValues }) => {
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";

      if (!id) return showError({ message: "User not found" });

      if (tracker && tracker.hobbiesAndInterest) return await patchHobbiesInterests(id, arg);
      else return await postHobbiesInterests(id, arg);
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to update hobbies/interests info" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: HobbiesInterestsFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
    if (result?.status === 201 || result?.status === 200) {
      showSuccess("Hobbies & Interests updated successfully!");
      callback?.(result);
      updateUserTrackingId({ hobbiesAndInterest: true });
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
    hobbiesInterestsLoading,
  };
} 