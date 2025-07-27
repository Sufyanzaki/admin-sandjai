"use client"

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {ArrowLeft, Upload, X} from "lucide-react"
import Link from "next/link";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor"
import { Controller } from "react-hook-form";
import useHowWorkForm from "@/app/(dashboard)/frontend-settings/_hooks/useHowWorkForm";

export default function HowItWorks(){
    const {
        register,
        handleSubmit,
        control,
        errors,
        isLoading,
        onSubmit,
        setValue,
        watch,
    } = useHowWorkForm();

    const bannerImage = watch("bannerImage");

    const handleImageUpload = (file: File | null) => {
        setValue("bannerImage", file);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-6 p-4 xl:p-6">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/frontend-settings">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>

                    <div className="flex flex-col space-y-2">
                        <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">How it works</h2>
                        <p className="text-muted-foreground">Fill the form to add new page.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Banner Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>Banner Image (Recommended size 1920x1080)</Label>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <Input
                                        id="banner-image"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                                        className="hidden"
                                    />
                                    <div className="flex items-center gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => document.getElementById("banner-image")?.click()}
                                            className="flex items-center gap-2"
                                        >
                                            <Upload className="h-4 w-4" />
                                            Choose File
                                        </Button>
                                        <span className="text-sm text-muted-foreground">
                                            {bannerImage instanceof File ? bannerImage.name :
                                                bannerImage ? "Image uploaded" : "No file chosen"}
                                        </span>
                                        {(bannerImage) && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => handleImageUpload(null)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                {bannerImage && (
                                    <div className="w-20 h-20 border rounded-lg overflow-hidden">
                                        <img
                                            src={bannerImage instanceof File ? URL.createObjectURL(bannerImage) : bannerImage}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                {...register("bannerTitle")}
                            />
                            {errors.bannerTitle && (
                                <p className="text-sm font-medium text-destructive">{errors.bannerTitle.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="sub-title">Sub Title</Label>
                            <Controller
                                name="bannerSubTitle"
                                control={control}
                                render={({ field }) => (
                                    <SimpleEditor
                                        existingValue={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.bannerSubTitle && (
                                <p className="text-sm font-medium text-destructive">{errors.bannerSubTitle.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                {...register("contactName")}
                            />
                            {errors.contactName && (
                                <p className="text-sm font-medium text-destructive">{errors.contactName.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="search">Search Placeholder</Label>
                            <Input
                                id="search"
                                placeholder="Search"
                                {...register("searchPlaceholder")}
                            />
                            {errors.searchPlaceholder && (
                                <p className="text-sm font-medium text-destructive">{errors.searchPlaceholder.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* FAQs Section */}
                <Card>
                    <CardHeader>
                        <CardTitle>FAQs Section</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="faq-title">Title</Label>
                            <Input
                                id="faq-title"
                                {...register("faqTitle")}
                            />
                            {errors.faqTitle && (
                                <p className="text-sm font-medium text-destructive">{errors.faqTitle.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="faq-sub-title">Sub Title</Label>
                            <Controller
                                name="faqSubTitle"
                                control={control}
                                render={({ field }) => (
                                    <SimpleEditor
                                        existingValue={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.faqSubTitle && (
                                <p className="text-sm font-medium text-destructive">{errors.faqSubTitle.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Controller
                                name="faqDescription"
                                control={control}
                                render={({ field }) => (
                                    <SimpleEditor
                                        existingValue={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.faqDescription && (
                                <p className="text-sm font-medium text-destructive">{errors.faqDescription.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="faq-name">Profile Name</Label>
                            <Input
                                id="faq-name"
                                {...register("faqProfileName")}
                            />
                            {errors.faqProfileName && (
                                <p className="text-sm font-medium text-destructive">{errors.faqProfileName.message}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Options */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Controller
                                    name="showOnHeader"
                                    control={control}
                                    render={({ field }) => (
                                        <Checkbox
                                            id="show-header"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                                <Label htmlFor="show-header">Show on Header</Label>
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update"}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    )
}