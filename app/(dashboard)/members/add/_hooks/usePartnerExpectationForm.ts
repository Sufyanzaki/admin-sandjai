import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { patchPartnerExpectation, postPartnerExpectation } from "../_api/updatePartnerExpectation";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";

const partnerExpectationSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  lookingFor: z.string().min(1, "Looking for is required"),
  length: z.string().min(1, "Length is required"),
  religion: z.string().min(1, "Religion is required"),
  relationshipStatus: z.string().min(1, "Relationship status is required"),
  education: z.string().min(1, "Education is required"),
  weight: z.string().min(1, "Weight is required"),
  smoke: z.boolean(),
  drinking: z.boolean(),
  goingOut: z.boolean(),
  ageFrom: z.coerce.number().min(0, "From age is required"),
  ageTo: z.coerce.number().min(0, "To age is required"),
  location: z.string().min(1, "Location is required"),
});

export type PartnerExpectationFormValues = z.infer<typeof partnerExpectationSchema>;

export default function usePartnerExpectationForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    reset,
    control,
    watch,
  } = useForm<PartnerExpectationFormValues>({
    resolver: zodResolver(partnerExpectationSchema),
    defaultValues: {
      origin: "",
      lookingFor: "",
      length: "",
      religion: "",
      relationshipStatus: "",
      education: "",
      weight: "",
      smoke: false,
      drinking: false,
      goingOut: false,
      ageFrom: 0,
      ageTo: 0,
      location: "",
    },
    mode: "onBlur",
  });

  const { trigger, isMutating } = useSWRMutation(
    "updatePartnerExpectation",
    async (_: string, { arg }: { arg: PartnerExpectationFormValues }) => {
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";
      if (!id) return showError({ message: "User not found" });

      if (tracker && tracker.partnerExpectation) return await patchPartnerExpectation(id, arg);
      else return await postPartnerExpectation(id, arg);
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to update partner expectation info" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: PartnerExpectationFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
    if (result?.status === 201 || result?.status === 200) {
      showSuccess("Partner expectation updated successfully!");
      callback?.(result);
      updateUserTrackingId({ partnerExpectation: true });
    }
  };

  return {
    register,
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