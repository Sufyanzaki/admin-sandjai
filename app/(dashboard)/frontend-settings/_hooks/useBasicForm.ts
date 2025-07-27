'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import useSWRMutation from "swr/mutation";
import { imageUpload } from '@/admin-utils/utils/imageUpload';
import {showError, showSuccess} from "@/admin-utils";
import { postBasicPage } from '../_api/basicPageApi';

const basicFormSchema = z.object({
    Title: z.string().min(1, 'Title is required'),
    Url: z.string().url('Invalid URL format').min(1, 'URL is required'),
    content: z.string().min(1, 'Content is required'),
    metaTitle: z.string().min(1, 'Meta title is required'),
    metaDescription: z.string().min(1, 'Meta description is required'),
    keywords: z.string().min(1, 'Keywords are required'),
    metaImage: z.any().optional(),
    pageType: z.enum(['Public', 'Private', 'Draft']),
    isActive: z.boolean()
});

type BasicFormValues = z.infer<typeof basicFormSchema>;

export default function useBasicForm() {

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        control,
        formState: { errors },
    } = useForm<BasicFormValues>({
        resolver: zodResolver(basicFormSchema),
        defaultValues: {
            Title: '',
            Url: '',
            content: '',
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            metaImage: '',
            pageType: 'Public',
            isActive: true
        },
    });

    const { trigger, isMutating } = useSWRMutation('createBasicPage',
        async (url: string, { arg }: { arg: BasicFormValues }) => {
            return await postBasicPage(arg)
        },
        {
            onError: (error: any) => {
                showError({ message: error.message });
                console.error('Basic page update error:', error);
            }
        }
    );

    const onSubmit = async (values: BasicFormValues) => {
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
            showSuccess(`Basic page added successfully!`);
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