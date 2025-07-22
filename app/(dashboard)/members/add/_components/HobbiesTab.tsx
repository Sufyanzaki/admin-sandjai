"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TabsContent } from "@/components/ui/tabs";
import { MultiSelectCombobox } from "@/components/ui/combo-box";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import useHobbiesInterestsForm from "../_hooks/useHobbiesInterestsForm";
import type { HobbiesInterestsFormValues } from "../_hooks/useHobbiesInterestsForm";
import type { FieldErrors } from "react-hook-form";
import { Controller } from "react-hook-form";

interface InterestSection {
  id: string;
  label: string;
  selected: string[];
  options: string[];
}

const interestMap: { id: keyof HobbiesInterestsFormValues; label: string; options: string[] }[] = [
  { id: "sports", label: "Sports", options: [
    "Rugby", "Autosport", "Football", "Basketball", "Tennis", "Swimming", "Cricket", "Baseball", "Hockey", "Golf"
  ] },
  { id: "music", label: "Music", options: [
    "blues", "Rock", "Pop", "Jazz", "Classical", "Hip Hop", "Country", "Electronic", "R&B", "Reggae"
  ] },
  { id: "kitchen", label: "Kitchen", options: [
    "Mexicaans", "Italian", "Chinese", "Indian", "French", "Thai", "Japanese", "Mediterranean", "American", "Korean"
  ] },
  { id: "reading", label: "Reading", options: [
    "Familie-en streekromans", "Mystery", "Romance", "Science Fiction", "Fantasy", "Biography", "History", "Self-help", "Poetry", "Thriller"
  ] },
  { id: "tvShows", label: "TV Shows", options: [
    "Drama", "Comedy", "Action", "Horror", "Documentary", "Reality TV", "Sci-Fi", "Crime", "Romance", "Animation"
  ] },
];

export default function HobbiesTab() {
  const {
    handleSubmit,
    errors,
    isLoading,
    onSubmit,
    control,
  } = useHobbiesInterestsForm();

  return (
    <TabsContent value="hobbies" className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Interests & Preferences</CardTitle>
          <CardDescription>Select your interests in different categories</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit((values) => onSubmit(values))}>
          <CardContent className="space-y-6">
            {interestMap.map((section) => (
              <div key={section.id} className="space-y-3">
                <Label className="text-base font-medium">{section.label}*</Label>
                <Controller
                  control={control}
                  name={section.id}
                  render={({ field }) => (
                    <MultiSelectCombobox
                      selected={field.value ? field.value.split(", ") : []}
                      onChange={selected => field.onChange(selected.join(", "))}
                      options={section.options}
                    />
                  )}
                />
                {(errors as FieldErrors<HobbiesInterestsFormValues>)[section.id as keyof FieldErrors<HobbiesInterestsFormValues>] && (
                  <p className="text-sm text-red-500">{(errors as FieldErrors<HobbiesInterestsFormValues>)[section.id as keyof FieldErrors<HobbiesInterestsFormValues>]?.message}</p>
                )}
              </div>
            ))}
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Hobbies & Interests"}
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </TabsContent>
  );
} 