"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { Controller } from "react-hook-form";
import LocationSearchInput from "@/components/location-search";
import useLivingLocationForm from "../add/_hooks/useLivingLocationForm";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { getUserTrackingId } from "@/lib/access-token";
import { AlertTriangle } from "lucide-react";

export default function LivingTab() {

  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];

  const tracker = getUserTrackingId();
  const userId = tracker?.id ?? id;

  const {
    handleSubmit,
    errors,
    isLoading,
    control,
    onSubmit,
  } = useLivingLocationForm();

  return (
    <TabsContent value="living" className="space-y-4 mt-4">
      <Card>
        <CardHeader className="">
          <CardTitle>Location</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">Where are you located?</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((values) => onSubmit(values, ()=>{}))}>
        {!userId && <div className="border border-amber-200 bg-amber-50 rounded-sm p-4 mb-6">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <div className="text-amber-700 text-sm">
                  You need to initialize a new member profile before you can add other details. Go back to basic Information to initialze a member
                </div>
            </div>
          </div>}
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Controller
                control={control}
                name="location"
                render={({ field }) => (
                  <LocationSearchInput
                    value={field.value}
                    onSelect={location => field.onChange(location.label)}
                    placeholder="Search for your city, state, or country"
                  />
                )}
              />
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </TabsContent>
  );
} 