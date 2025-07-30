"use client";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import useSeoSettingsForm from "../_hooks/useSeoSettingsForm";
import { Controller } from "react-hook-form";
import { CustomImageUpload } from "@/components/frontend-settings/CustomImageInput";
import Preloader from "@/components/ui/Preloader";

export default function SEOForm() {
  const {
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    control,
    register,
    isFetchingSeo,
    watch,
  } = useSeoSettingsForm();

  const metaImageValue = watch("metaImage");

  if (isFetchingSeo) {
    return (
        <div className="flex items-center flex-col justify-center h-64">
          <Preloader />
          <p className="text-sm">Loading SEO</p>
        </div>
    );
  }

  return (
      <CardContent className="space-y-6 pt-6">
        <form className="grid gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
                id="metaTitle"
                placeholder="Humsafar - Home"
                {...register("metaTitle")}
            />
            {errors.metaTitle && (
                <div className="text-red-500 text-sm">
                  {errors.metaTitle.message}
                </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
                id="metaDescription"
                placeholder="Humsafar - Home"
                {...register("metaDescription")}
            />
            {errors.metaDescription && (
                <div className="text-red-500 text-sm">
                  {errors.metaDescription.message}
                </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="keywords">Meta Keywords</Label>
            <Textarea
                id="keywords"
                placeholder="Humsafar, travel, guide"
                className="resize-none"
                {...register("metaKeywords")}
            />
            <p className="text-xs text-muted-foreground">
              Separate with commas
            </p>
            {errors.metaKeywords && (
                <div className="text-red-500 text-sm">
                  {errors.metaKeywords.message}
                </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Meta Image</h3>
            <Controller
                name="metaImage"
                control={control}
                render={({ field }) => (
                    <CustomImageUpload
                        label="Meta Image"
                        file={field.value instanceof File ? field.value : null}
                        onFileChange={(file) => field.onChange(file)}
                    />
                )}
            />
            {metaImageValue && typeof metaImageValue === "string" && (
                <div className="text-xs text-muted-foreground">
                  Image URL: {metaImageValue}
                </div>
            )}
            {errors.metaImage && (
                <div className="text-red-500 text-sm">
                  {errors.metaImage.message}
                </div>
            )}
          </div>

          <div className="flex justify-end pt-6">
            <Button className="px-8" type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </form>
      </CardContent>
  );
}
