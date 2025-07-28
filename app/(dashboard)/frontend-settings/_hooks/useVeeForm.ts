'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { useEffect } from 'react';
import { patchVeeSettings } from "../_api/veeApi";
import { useVee } from "./useVee";
import { imageUpload } from '@/admin-utils/utils/imageUpload';

const veeFormSchema = z.object({
    Title: z.string().min(1, 'Title is required'),
    Url: z.string().url('Invalid URL format').min(1, 'URL is required'),
    PageContentitle: z.string().min(1, 'Page content title is required'),
    link: z.string().min(1, 'Link is required'),
    content: z.string().min(1, 'Content is required'),
    metaTitle: z.string().min(1, 'Meta title is required'),
    metaDescription: z.string().min(1, 'Meta description is required'),
    keywords: z.string().min(1, 'Keywords are required'),
    metaImage: z.any().optional(),
    pageType: z.string().min(1, 'Page type is required'),
    pageName: z.string().min(1, 'Page name is required'),
});

type VeeFormValues = z.infer<typeof veeFormSchema>;

export default function useVeeForm() {
    const { veeData, mutate, veeLoading } = useVee();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<VeeFormValues>({
        resolver: zodResolver(veeFormSchema),
        defaultValues: {
            Title: '',
            Url: '',
            PageContentitle: '',
            link: '',
            content: '',
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            metaImage: '',
            pageType: 'static',
            pageName: '',
        },
    });

    const { trigger, isMutating } = useSWRMutation(
        'updateVeeSettings',
        async (url: string, { arg }: { arg: VeeFormValues }) => {
            return await patchVeeSettings(arg);
        },
        {
            onError: (error: any) => {
                showError({ message: error.message });
                console.error('Vee settings update error:', error);
            }
        }
    );

    // Reset form with fetched data
    useEffect(() => {
        if (veeData) {
            reset({
                Title: veeData.Title || '',
                Url: veeData.Url || '',
                PageContentitle: veeData.PageContentitle || '',
                link: veeData.link || '',
                content: veeData.content || '',
                metaTitle: veeData.metaTitle || '',
                metaDescription: veeData.metaDescription || '',
                keywords: veeData.keywords || '',
                metaImage: veeData.metaImage || '',
                pageType: veeData.pageType || 'static',
                pageName: veeData.pageName || '',
            });
        }
    }, [veeData, reset]);

    const onSubmit = async (values: VeeFormValues) => {
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
            showSuccess('Vee page settings updated successfully!');
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
        veeLoading
    };
}