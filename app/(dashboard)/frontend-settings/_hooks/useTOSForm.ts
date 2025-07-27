'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { useEffect } from 'react';
import { imageUpload } from '@/admin-utils/utils/imageUpload';
import {patchTermsConditionsSettings} from "@/app/(dashboard)/frontend-settings/_api/tosApi";
import {useTOS} from "@/app/(dashboard)/frontend-settings/_hooks/useTOS";

const tosFormSchema = z.object({
    Title: z.string().min(1, 'Title is required'),
    Url: z.string().min(1, 'URL is required'),
    showOnHeader: z.boolean(),
    isActive: z.boolean(),
    pageSectiontitle: z.string().min(1, 'Section title is required'),
    link: z.string().min(1, 'Link is required'),
    content: z.string().min(1, 'Content is required'),

    // SEO fields
    metaTitle: z.string().min(1, 'Meta title is required'),
    metaDescription: z.string().min(1, 'Meta description is required'),
    keywords: z.string().min(1, 'Keywords are required'),
    metaImage: z.any().optional(),

    pageType: z.literal('terms'),
});

type TOSFormValues = z.infer<typeof tosFormSchema>;

export default function useTOSForm() {
    const { tosSettings, mutate } = useTOS();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<TOSFormValues>({
        resolver: zodResolver(tosFormSchema),
        defaultValues: {
            Title: '',
            Url: '',
            showOnHeader: true,
            isActive: true,
            pageSectiontitle: '',
            link: '',
            content: '',
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            metaImage: '',
            pageType: 'terms',
        },
    });

    const { trigger, isMutating } = useSWRMutation(
        'updateTOSSettings',
        async (url: string, { arg }: { arg: TOSFormValues }) => {
            return await patchTermsConditionsSettings(arg);
        },
        {
            onError: (error: any) => {
                showError({ message: error.message });
                console.error('TOS settings update error:', error);
            }
        }
    );

    // Reset form with fetched data
    useEffect(() => {
        if (tosSettings) {
            reset({
                Title: tosSettings.Title || '',
                Url: tosSettings.Url || '',
                showOnHeader: tosSettings.showOnHeader ?? true,
                isActive: tosSettings.isActive ?? true,
                pageSectiontitle: tosSettings.pageSectiontitle || '',
                link: tosSettings.link || '',
                content: tosSettings.content || '',
                metaTitle: tosSettings.metaTitle || '',
                metaDescription: tosSettings.metaDescription || '',
                keywords: tosSettings.keywords || '',
                metaImage: tosSettings.metaImage || '',
                pageType: 'terms',
            });
        }
    }, [tosSettings, reset]);

    const onSubmit = async (values: TOSFormValues) => {
        let metaImageUrl = values.metaImage;

        if (values.metaImage instanceof File) {
            metaImageUrl = await imageUpload(values.metaImage);
        }

        const payload = {
            ...values,
            metaImage: metaImageUrl,
        };

        const result = await trigger(payload);
        if (result) {
            await mutate();
            showSuccess('Terms of Service settings updated successfully!');
        }
    };

    return {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        errors,
        isLoading: isMutating,
        onSubmit,
    };
}