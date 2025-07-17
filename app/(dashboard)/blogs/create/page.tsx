"use client"

import { Button } from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import {ArrowLeft} from "lucide-react";
import {SimpleEditor} from "@/components/tiptap-templates/simple/simple-editor";
import { useBlogCategories } from "../category/_hooks/useBlogCategories";
import useCreateBlog from "../_hooks/useCreateBlog";
import { Controller } from "react-hook-form";
import {imageUpload} from "@/admin-utils/utils/imageUpload";

export default function AddBlogPage() {

    const { categories = [], loading: categoriesLoading } = useBlogCategories();

    const {
        handleSubmit,
        onSubmit,
        errors,
        isLoading,
        register,
        control,
    } = useCreateBlog(imageUpload);

    return (
        <div className="flex flex-col gap-4 p-4 xl:p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/blogs/list">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Back</span>
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight mb-2">Add Blog</h1>
                        <p className="text-muted-foreground">Create and publish new blog content</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Blogs Details</CardTitle>
                    <CardDescription>View and manage all ambulances in your fleet</CardDescription>
                </CardHeader>

                <CardContent>
                    <form
                        className="grid grid-cols-2 gap-6"
                        onSubmit={handleSubmit(async (values) => {
                            await onSubmit(values);
                        })}
                    >
                        {/* Blog Title */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="title">Blog Title *</Label>
                            <Input id="title" placeholder="Blog Title" required {...register('title')} />
                            {errors.title && <div className="text-red-500 text-sm">{errors.title.message}</div>}
                        </div>

                        {/* Category */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Controller
                                control={control}
                                name="categoryId"
                                render={({ field }) => (
                                    <Select
                                        required
                                        disabled={categoriesLoading || categories.length === 0}
                                        value={field.value ? String(field.value) : ''}
                                        onValueChange={val => field.onChange(Number(val))}
                                    >
                                <SelectTrigger>
                                            <SelectValue placeholder={categoriesLoading ? "Loading..." : "Select"} />
                                </SelectTrigger>
                                <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={String(cat.id)}>{cat.name}</SelectItem>
                                            ))}
                                </SelectContent>
                            </Select>
                                )}
                            />
                            {errors.categoryId && <div className="text-red-500 text-sm">{errors.categoryId.message}</div>}
                        </div>

                        {/* Slug */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="slug">Slug *</Label>
                            <Input id="slug" placeholder="Slug" required {...register('slug')} />
                            {errors.slug && <div className="text-red-500 text-sm">{errors.slug.message}</div>}
                        </div>

                        {/* Banner */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="banner">Banner (1300x650)</Label>
                            <Controller
                                control={control}
                                name="bannerImage"
                                render={({ field }) => (
                            <Input
                                id="banner"
                                type="file"
                                accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                                    />
                                )}
                            />
                        </div>

                        {/* Short Description */}
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="short-description">Short Description *</Label>
                            <Textarea id="short-description" placeholder="Short Description" rows={4} required {...register('shortDescription')} />
                            {errors.shortDescription && <div className="text-red-500 text-sm">{errors.shortDescription.message}</div>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2 col-span-2">
                            <Label htmlFor="description">Description</Label>
                            <Controller
                                control={control}
                                name="description"
                                render={({ field }) => (
                                    <SimpleEditor
                                        existingValue={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            {errors.description && <div className="text-red-500 text-sm">{errors.description.message}</div>}
                        </div>

                        {/* Meta Title */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="meta-title">Meta Title</Label>
                            <Input id="meta-title" placeholder="Meta Title" {...register('metaTitle')} />
                            {errors.metaTitle && <div className="text-red-500 text-sm">{errors.metaTitle.message}</div>}
                        </div>

                        {/* Meta Image */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="meta-image">Meta Image</Label>
                            <Controller
                                control={control}
                                name="metaImage"
                                render={({ field }) => (
                            <Input
                                id="meta-image"
                                type="file"
                                accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                                    />
                                )}
                            />
                        </div>

                        {/* Meta Description */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="meta-description">Meta Description</Label>
                            <Textarea id="meta-description" placeholder="Meta Description" rows={4} {...register('metaDescription')} />
                            {errors.metaDescription && <div className="text-red-500 text-sm">{errors.metaDescription.message}</div>}
                        </div>

                        {/* Meta Keywords */}
                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="meta-keywords">Meta Keywords</Label>
                            <Input id="meta-keywords" placeholder="Meta Keywords" {...register('metaKeywords')} />
                            {errors.metaKeywords && <div className="text-red-500 text-sm">{errors.metaKeywords.message}</div>}
                        </div>

                        {/* Action Buttons */}
                        <div className="col-span-2 flex justify-end space-x-4 pt-4">
                            <Button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}