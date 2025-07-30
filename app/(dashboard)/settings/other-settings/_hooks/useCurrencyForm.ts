import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {Currency, postCurrency} from "@/app/(dashboard)/settings/other-settings/_api/currencies";

const currencySchema = z.object({
    currencyName: z.string().min(2, "Currency name is required"),
    currencyCode: z.string().min(2, "Currency code is required"),
    symbol: z.string().optional(),
    textDirection: z.boolean().optional(),
});

export type CurrencyFormValues = z.infer<typeof currencySchema>;

export default function useCurrencyForm(onSuccess?: (currency: Currency) => void) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<CurrencyFormValues>({
        resolver: zodResolver(currencySchema),
        defaultValues: {
            currencyName: "",
            currencyCode: "",
            symbol: "",
            textDirection: false,
        },
    });

    const onSubmit = async (values: CurrencyFormValues) => {
        setIsLoading(true);
        try {
            const created = await postCurrency(values);
            if (onSuccess) onSuccess(created);
            form.reset();
        } catch (error) {
            console.error("Failed to create currency", error);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        ...form,
        onSubmit,
        isLoading,
    };
}
