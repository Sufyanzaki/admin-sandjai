'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { showError } from "@/admin-utils/lib/formErrors";
import { showSuccess } from "@/admin-utils/lib/formSuccess";
import useSWRMutation from "swr/mutation";
import { useEffect } from 'react';
import { imageUpload } from '@/admin-utils/utils/imageUpload';
import {useHowWork} from "@/app/(dashboard)/frontend-settings/_hooks/useHowWork";
import {patchHowWorkSettings} from "@/app/(dashboard)/frontend-settings/_api/howWorkApi";

const howItWorksFormSchema = z.object({
    Title: z.string().min(1, 'Title is required'),
    Url: z.string().url('Invalid URL format').min(1, 'URL is required'),
    bannerImage: z.any().optional(), // Accept File or string
    bannerTitle: z.string().min(1, 'Banner title is required'),
    bannerSubTitle: z.string().min(1, 'Banner subtitle is required'),
    contactName: z.string().min(1, 'Contact name is required'),
    searchPlaceholder: z.string().min(1, 'Search placeholder is required'),
    faqTitle: z.string().min(1, 'FAQ title is required'),
    faqSubTitle: z.string().min(1, 'FAQ subtitle is required'),
    faqDescription: z.string().min(1, 'FAQ description is required'),
    faqProfileName: z.string().min(1, 'FAQ profile name is required'),
    showOnHeader: z.boolean(),
});

type HowItWorksFormValues = z.infer<typeof howItWorksFormSchema>;

export default function useHowWorkForm() {
    const { howWorkSettings, mutate } = useHowWork();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        control,
        formState: { errors },
    } = useForm<HowItWorksFormValues>({
        resolver: zodResolver(howItWorksFormSchema),
        defaultValues: {
            Title: '',
            Url: '',
            bannerTitle: '',
            bannerSubTitle: '',
            contactName: '',
            searchPlaceholder: '',
            faqTitle: '',
            faqSubTitle: '',
            faqDescription: '',
            faqProfileName: '',
            showOnHeader: true,
        },
    });

    const { trigger, isMutating } = useSWRMutation(
        'updateHowItWorksSettings',
        async (url: string, { arg }: { arg: HowItWorksFormValues }) => {
            return await patchHowWorkSettings(arg);
        },
        {
            onError: (error: any) => {
                showError({ message: error.message });
                console.error('How It Works settings update error:', error);
            }
        }
    );

    // Reset form with fetched data
    useEffect(() => {
        if (howWorkSettings) {
            reset({
                Title: howWorkSettings.Title || '',
                Url: howWorkSettings.Url || '',
                bannerImage: howWorkSettings.bannerImage || '',
                bannerTitle: howWorkSettings.bannerTitle || '',
                bannerSubTitle: howWorkSettings.bannerSubTitle || '',
                contactName: howWorkSettings.contactName || '',
                searchPlaceholder: howWorkSettings.searchPlaceholder || '',
                faqTitle: howWorkSettings.faqTitle || '',
                faqSubTitle: howWorkSettings.faqSubTitle || '',
                faqDescription: howWorkSettings.faqDescription || '',
                faqProfileName: howWorkSettings.faqProfileName || '',
                showOnHeader: howWorkSettings.showOnHeader ?? true,
            });
        }
    }, [howWorkSettings, reset]);

    const onSubmit = async (values: HowItWorksFormValues) => {
        let bannerImageUrl = values.bannerImage;

        if (values.bannerImage instanceof File) {
            bannerImageUrl = await imageUpload(values.bannerImage);
        }

        const payload = {
            ...values,
            bannerImage: bannerImageUrl,
        };

        const result = await trigger(payload);
        if (result) {
            await mutate();
            showSuccess('How It Works settings updated successfully!');
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
        howWorkSettings,
    };
}