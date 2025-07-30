"use client"

import React, { useEffect } from 'react';
import {
    ArrowLeft,
    Save,
    Upload,
    Plus,
    Trash2,
    Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import usePackageById from '../../_hooks/usePackageById';
import { useEditPackage } from '../../_hooks/useEditPackage';
import { CustomImageUpload } from '@/components/frontend-settings/CustomImageInput';
import { useRouter, useParams } from 'next/navigation';
import { imageUpload } from '@/admin-utils/utils/imageUpload';
import Preloader from "@/components/ui/Preloader";

export default function PackageEditPage() {
    const params = useParams();
    let id = params?.id;
    if (Array.isArray(id)) id = id[0];
    const { pkg, loading, error } = usePackageById(id);
    const { mutate, loading: saving } = useEditPackage();
    const router = useRouter();

    const { control, register, handleSubmit, reset, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            price: 0,
            validity: 0,
            image: '',
            isActive: true,
            features: [''],
        },
    });
    const { fields, append, remove } = useFieldArray({ control, name: 'features' });

    useEffect(() => {
        if (pkg) {
            reset({
                name: pkg.name,
                price: pkg.price,
                validity: pkg.validity,
                image: pkg.image,
                isActive: pkg.isActive,
                features: pkg.features && pkg.features.length > 0 ? pkg.features : [''],
            });
        }
    }, [pkg, reset]);

    const onSubmit = async (values: any) => {
        let imageUrl = values.image;
        if (typeof values.image === 'object' && values.image !== null && 'name' in values.image) {
            imageUrl = await imageUpload(values.image);
        }
        await mutate({
            id,
            ...values,
            image: imageUrl,
        });
        router.push('/packages');
    };

    if (loading) return(
        <div className="flex items-center flex-col justify-center h-64">
            <Preloader/>
            <p className="text-sm">Package Loading</p>
        </div>
    );
    if (error) return <div className="p-6 text-red-500">Failed to load package.</div>;
    if (!pkg) return <div className="p-6 text-muted-foreground">Package not found.</div>;

    return (
        <div className="flex flex-col gap-5 p-4 xl:p-6">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" asChild>
                    <a href="/packages">
                        <ArrowLeft className="h-4 w-4" />
                    </a>
                </Button>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Edit Package</h2>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Information</CardTitle>
                            <CardDescription>Update the basic information for this package</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">
                                    Package Name <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. Premium Plan"
                                    {...register('name', { required: true })}
                                />
                                {errors.name && <div className="text-red-500 text-sm">Name is required</div>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">
                                    Price <span className="text-red-500">*</span>
                                </Label>
                                <div className="relative">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                                        €
                                    </div>
                                    <Input
                                        id="price"
                                        placeholder="0.00"
                                        className="pl-8"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        {...register('price', { valueAsNumber: true, required: true })}
                                    />
                                </div>
                                {errors.price && <div className="text-red-500 text-sm">Price is required</div>}
                                <p className="text-xs text-muted-foreground">
                                    Set 0 for free packages
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="validity">
                                    Validity <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="validity"
                                    placeholder="0 Days"
                                    type="number"
                                    min="0"
                                    {...register('validity', { valueAsNumber: true, required: true })}
                                />
                                {errors.validity && <div className="text-red-500 text-sm">Validity is required</div>}
                            </div>

                            <div className="flex items-center justify-between space-y-0">
                                <div className="flex flex-col space-y-1">
                                    <Label htmlFor="isActive">Package Status</Label>
                                    <span className="text-sm text-muted-foreground">
                                        {watch('isActive') ? 'Package is currently active' : 'Package is currently inactive'}
                                    </span>
                                </div>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            id="isActive"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Package Details</CardTitle>
                            <CardDescription>Additional information about the package</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Controller
                                    name="image"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomImageUpload
                                            label="Package Image"
                                            file={field.value instanceof File ? field.value : null}
                                            onFileChange={file => field.onChange(file)}
                                        />
                                    )}
                                />
                                {errors.image && <div className="text-red-500 text-sm">Image is required</div>}
                                <p className="text-xs text-muted-foreground">
                                    Recommended: 600x600px, Max 2MB
                                </p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" type="button" asChild>
                                <a href="/packages">Cancel</a>
                            </Button>
                            <Button type="submit" disabled={saving}>
                                <Save className="mr-2 h-4 w-4" />
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                {/* Features Section - Full Width */}
                <Card className="mt-4">
                    <CardHeader>
                        <CardTitle>Package Features</CardTitle>
                        <CardDescription>Define what's included in this package</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex items-center gap-3">
                                    <Input
                                        placeholder={`Feature ${index + 1}`}
                                        {...register(`features.${index}` as const)}
                                        className="flex-1"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        type="button"
                                        onClick={() => remove(index)}
                                        disabled={fields.length === 1}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" type="button" onClick={() => append("")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Feature
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}