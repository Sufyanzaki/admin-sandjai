import { useState } from "react";
import { editPackage, EditPackagePayload } from "../_api/editPackage";
import { mutate as globalMutate } from "swr";
import type { Package } from "../_api/getAllPackages";

export function useEditPackage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const mutate = async (payload: EditPackagePayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await editPackage(payload);
      setSuccess(true);
      globalMutate("all-packages");
      globalMutate(`package-${payload.id}`);
    } catch (err: any) {
      setError(err?.message || "Failed to update package");
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error, success };
} 