import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import useSeoSettingsForm from "../_hooks/useSeoSettingsForm";
import { useRef } from "react";
import { Controller } from "react-hook-form";
import { CustomImageUpload } from "@/components/frontend-settings/CustomImageInput";

export default function SEOForm() {
  const {
    handleSubmit,
    onSubmit,
    errors,
    isLoading,
    setValue,
    watch,
    control,
  } = useSeoSettingsForm();

  const keywordsValue = watch("keywords");
  const metaImageValue = watch("metaImage");

  return (
    <CardContent className="space-y-6 pt-6">
      <form className="grid gap-6 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2">
          <Label htmlFor="metaTitle">Meta Title</Label>
          <Input
            id="metaTitle"
            name="metaTitle"
            placeholder="Humsafar - Home"
            onChange={e => setValue("metaTitle", e.target.value, { shouldValidate: true })}
          />
          {errors.metaTitle && <div className="text-red-500 text-sm">{errors.metaTitle.message}</div>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="metaDescription">Meta Description</Label>
          <Textarea
            id="metaDescription"
            name="metaDescription"
            placeholder="Humsafar - Home"
            onChange={e => setValue("metaDescription", e.target.value, { shouldValidate: true })}
          />
          {errors.metaDescription && <div className="text-red-500 text-sm">{errors.metaDescription.message}</div>}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="keywords">Keywords</Label>
          <Textarea
            id="keywords"
            name="keywords"
            placeholder="Humsafar,"
            className="resize-none"
            value={keywordsValue.join(", ")}
            onChange={e => setValue("keywords", e.target.value.split(",").map(k => k.trim()).filter(Boolean), { shouldValidate: true })}
          />
          <p className="text-xs text-muted-foreground">Separate with commas</p>
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
                onFileChange={file => field.onChange(file)}
              />
            )}
          />
          {metaImageValue && typeof metaImageValue === "string" && (
            <div className="text-xs text-muted-foreground">Image URL: {metaImageValue}</div>
          )}
          {errors.metaImage && <div className="text-red-500 text-sm">{errors.metaImage.message}</div>}
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