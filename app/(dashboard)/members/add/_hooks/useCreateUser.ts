import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import { patchUser, postUser, UserPayload } from "../_api/createUser";
import useSWRMutation from "swr/mutation";
import { imageUpload } from "@/admin-utils/utils/imageUpload";
import { setUserTrackingId, getUserTrackingId, updateUserTrackingId } from "@/lib/access-token";
import { isFile } from "@/lib/utils";
import { useEffect } from "react";
import { useBasicInfo } from "./useBasicInfo";

interface UserApiResponse {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
  dob?: string;
  image?: string;
  phone?: string;
  origin?: string;
  gender?: string;
  age?: number;
  relationshipStatus?: string;
  children?: boolean;
  religion?: string;
  shortDescription?: string;
}

const createUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password is required and must be at least 6 characters"),
  username: z.string().min(1, "Username is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.string().min(1, "Role is required"),
  dob: z.string().min(1, "Date of birth is required"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  phone: z.string().min(1, "Phone is required"),
  origin: z.string().min(1, "Origin is required"),
  gender: z.string().min(1, "Gender is required"),
  age: z.coerce.number().min(1, "Age is required"),
  relationshipStatus: z.string().min(1, "Relationship status is required"),
  children: z.boolean({ required_error: "Children is required" }),
  religion: z.string().min(1, "Religion is required"),
  shortDescription: z.string().min(1, "Short description is required"),
});

export type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function useCreateUserForm() {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    setValue,
    reset,
    control,
    watch,
  } = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
      firstName: "",
      lastName: "",
      role: "CLIENT",
      dob: "",
      image: undefined,
      phone: "",
      origin: "",
      gender: "",
      age: 18,
      relationshipStatus: "",
      children: false,
      religion: "",
      shortDescription: "",
    },
    mode: "onBlur",
  });

  const { user, userLoading } = useBasicInfo();
  const tracker = getUserTrackingId();

  useEffect(() => {
    if (tracker?.id && user) {
      const u = user as UserApiResponse;
      reset({
        email: u.email || "",
        password: "",
        username: u.username || "",
        firstName: u.firstName || "",
        lastName: u.lastName || "",
        role: u.role || "CLIENT",
        dob: u.dob ? u.dob.split("T")[0] : "",
        image: u.image || undefined,
        phone: u.phone || "",
        origin: u.origin || "",
        gender: u.gender || "",
        age: u.age || 18,
        relationshipStatus: u.relationshipStatus || "",
        children: u.children ?? false,
        religion: u.religion || "",
        shortDescription: u.shortDescription || "",
      });
    }
  }, [tracker?.id, user]);

  const { trigger, isMutating } = useSWRMutation(
    "createOrUpdateUser",
    async (_: string, { arg }: { arg: UserPayload }) => {
      const tracker = getUserTrackingId();
      let imageUrl: string = "";
      if (isFile(arg.image)) imageUrl = await imageUpload(arg.image);
      else if (typeof arg.image === "string") imageUrl = arg.image;
      if(tracker?.id && tracker.basicInformation) return await patchUser(tracker.id, { ...arg, image: imageUrl });
      else return await postUser({ ...arg, image: imageUrl });
    },
    {
      onError: (error: any) => {
        showError({ message: error.message || "Failed to add user" });
      },
      revalidate: false,
      populateCache: false,
    }
  );

  const onSubmit = async (values: CreateUserFormValues, callback?: (data: any) => void) => {
    const tracker = getUserTrackingId();
    let imageUrl: string = "";
    if (isFile(values.image)) {
      imageUrl = await imageUpload(values.image as File);
    } else if (typeof values.image === "string") {
      imageUrl = values.image;
    }
    const result = await trigger({ ...values, image: imageUrl });
    if (result?.status === 201 || result?.status === 200) {
      showSuccess("User created successfully!");
      callback?.(result.response);
      if (tracker && tracker.id) {
        updateUserTrackingId({ basicInformation: true });
      } else {
        setUserTrackingId({
          id: result.response.id,
          basicInformation: true,
          educationAndCareer: false,
          personalityAndBehavior: false,
          partnerExpectation: false,
          lifeStyle: false,
          hobbiesAndInterest: false,
          languages: false,
          living: false,
          aboutMe: false,
        });
      }
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
    userLoading
  };
} 