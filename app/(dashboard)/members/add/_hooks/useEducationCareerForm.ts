import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { patchEducationCareer, updateEducationCareer } from "../_api/updateEducationCareer";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";
import { useEducationCareerInfo } from "./useEducationCareerInfo";
import { useEffect } from "react";

const educationCareerSchema = z.object({
  primarySpecialization: z.string().min(1, "Primary specialization is required"),
  secondarySpecialization: z.string().min(1, "Secondary specialization is required"),
  qualifications: z.string().min(1, "Qualifications are required"),
  experience: z.string().min(1, "Experience is required"),
  education: z.string().min(1, "Education is required"),
  certifications: z.string().min(1, "Certifications are required"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
});

export type EducationCareerFormValues = z.infer<typeof educationCareerSchema>;

export default function useEducationCareerForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    control,
    watch,
    register,
  } = useForm<EducationCareerFormValues>({
    resolver: zodResolver(educationCareerSchema),
    defaultValues: {
      primarySpecialization: "",
      secondarySpecialization: "",
      qualifications: "",
      experience: "",
      education: "",
      certifications: "",
      department: "",
      position: "",
    },
    mode: "onBlur",
  });

  const { educationCareer, educationCareerLoading } = useEducationCareerInfo();
  const tracker = getUserTrackingId();

  useEffect(() => {
    if (tracker?.id && educationCareer) {
      reset({
        primarySpecialization: educationCareer.primarySpecialization || "",
        secondarySpecialization: educationCareer.secondarySpecialization || "",
        qualifications: educationCareer.qualifications || "",
        experience: educationCareer.experience || "",
        education: educationCareer.education || "",
        certifications: educationCareer.certifications || "",
        department: educationCareer.department || "",
        position: educationCareer.position || "",
      });
    }
  }, [tracker?.id, educationCareer, reset]);

  const { trigger, isMutating } = useSWRMutation(
    "updateEducationCareer",
    async (_: string, { arg }: { arg: EducationCareerFormValues }) => {
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";
      if (tracker && tracker.educationAndCareer) {
        return await patchEducationCareer(id, arg);
      } else {
        return await updateEducationCareer(id, arg);
      }
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to update education/career info" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: EducationCareerFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
    if (result?.status === 201 || result?.status === 200) {
      showSuccess("Education & Career updated successfully!");
      reset();
      callback?.(result.response);
      updateUserTrackingId({ educationAndCareer: true });
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
    educationCareerLoading,
  };
} 