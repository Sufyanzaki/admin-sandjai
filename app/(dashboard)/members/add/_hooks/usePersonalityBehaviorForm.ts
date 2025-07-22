import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { updatePersonalityBehavior, patchPersonalityBehavior, UpdatePersonalityBehaviorPayload } from "../_api/updatePersonalityBehavior";
import { getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";
import { usePersonalityBehaviorInfo } from "./usePersonalityBehaviorInfo";
import { useEffect } from "react";

const personalityBehaviorSchema = z.object({
  simple: z.boolean(),
  musical: z.boolean(),
  conservative: z.boolean(),
  calm: z.boolean(),
  pragmatic: z.boolean(),
  streetSmart: z.boolean(),
  subdued: z.boolean(),
  demanding: z.boolean(),
  narcissistic: z.boolean(),
  eccentric: z.boolean(),
  spiritual: z.boolean(),
  talkative: z.boolean(),
  prettySmart: z.boolean(),
  undemanding: z.boolean(),
  altruistic: z.boolean(),
  stubborn: z.boolean(),
  selfish: z.boolean(),
  sporty: z.boolean(),
  modest: z.boolean(),
  humorous: z.boolean(),
  romantic: z.boolean(),
  serious: z.boolean(),
  sharp: z.boolean(),
  caring: z.boolean(),
  spontaneously: z.boolean(),
  freethinking: z.boolean(),
  adventurous: z.boolean(),
  sensual: z.boolean(),
  straightForward: z.boolean(),
  intellectual: z.boolean(),
  embarrassed: z.boolean(),
  exuberant: z.boolean(),
  worldly: z.boolean(),
  artistic: z.boolean(),
  sluggish: z.boolean(),
  compulsive: z.boolean(),
  relaxed: z.boolean(),
});

export type PersonalityBehaviorFormValues = z.infer<typeof personalityBehaviorSchema>;

export default function usePersonalityBehaviorForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    reset,
    control,
    watch,
  } = useForm<PersonalityBehaviorFormValues>({
    resolver: zodResolver(personalityBehaviorSchema),
    defaultValues: {
      simple: false,
      musical: false,
      conservative: false,
      calm: false,
      pragmatic: false,
      streetSmart: false,
      subdued: false,
      demanding: false,
      narcissistic: false,
      eccentric: false,
      spiritual: false,
      talkative: false,
      prettySmart: false,
      undemanding: false,
      altruistic: false,
      stubborn: false,
      selfish: false,
      sporty: false,
      modest: false,
      humorous: false,
      romantic: false,
      serious: false,
      sharp: false,
      caring: false,
      spontaneously: false,
      freethinking: false,
      adventurous: false,
      sensual: false,
      straightForward: false,
      intellectual: false,
      embarrassed: false,
      exuberant: false,
      worldly: false,
      artistic: false,
      sluggish: false,
      compulsive: false,
      relaxed: false,
    },
    mode: "onBlur",
  });

  const { personalityBehavior, personalityBehaviorLoading } = usePersonalityBehaviorInfo();
  const tracker = getUserTrackingId();

  useEffect(() => {
    if (tracker?.id && personalityBehavior) {
      reset({
        ...personalityBehavior
      });
    }
  }, [tracker?.id, personalityBehavior, reset]);

  const { trigger, isMutating } = useSWRMutation(
    "updatePersonalityBehavior",
    async (_: string, { arg }: { arg: PersonalityBehaviorFormValues }) => {
      const { ...payload } = arg;
      const tracker = getUserTrackingId();
      const id = tracker?.id ?? "";
    
      if(!id) return showError({message : "User not found"});
      
      if (tracker && tracker.personalityAndBehavior) return await patchPersonalityBehavior(id, payload);
      else return await updatePersonalityBehavior(id, payload);
    
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to update personality/behavior info" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: PersonalityBehaviorFormValues, callback?: (data: any) => void) => {
    const result = await trigger(values);
      if (result?.status === 201 || result?.status === 200) {
        showSuccess("Personality & Behavior updated successfully!");
        callback?.(result);
        updateUserTrackingId({ personalityAndBehavior: true });
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
    personalityBehaviorLoading,
  };
} 