"use client";

import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Currency } from "@/app/(dashboard)/settings/other-settings/_api/currencies";
import useFormatForm from "@/app/(dashboard)/settings/other-settings/_hooks/useFormatForm";
import Preloader from "@/components/ui/Preloader";
import {Save} from "lucide-react";
import {DialogFooter} from "@/components/ui/dialog";

type Props = {
    currencies?: Currency[];
    setOpenFormatDialog: (open: boolean) => void;
};

export default function FormatForm({ currencies, setOpenFormatDialog }: Props) {
    const {
        handleSubmit,
        onSubmit,
        control,
        isLoading,
        errors,
        register,
        formatLoading
    } = useFormatForm();

    if(formatLoading){
        return (
            <div className="flex items-center flex-col justify-center h-64">
                <Preloader/>
                <p className="text-sm">Loading Format</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(v=>onSubmit(v, ()=>setOpenFormatDialog(false)))} className="grid gap-6">
            <div className="space-y-2">
                <Label htmlFor="default">Default Currency *</Label>
                <Controller
                    control={control}
                    name="defaultCurrency"
                    render={({ field }) => (
                        <Select {...field} key={field.value} onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select default currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {(currencies ?? []).map((currency) => (
                                    <SelectItem key={currency.id} value={currency.id}>
                                        {currency.currencyName} ({currency.currencyCode})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                />
                {errors.defaultCurrency && (
                    <p className="text-sm text-red-500">{errors.defaultCurrency.message}</p>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="symbol-format">Symbol Format</Label>
                    <Controller
                        control={control}
                        name="symbolFormat"
                        render={({ field }) => (
                            <Select {...field} key={field.value} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="prefix">Prefix ($100)</SelectItem>
                                    <SelectItem value="suffix">Suffix (100$)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.symbolFormat && (
                        <p className="text-sm text-red-500">{errors.symbolFormat.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="decimal-separator">Decimal Separator</Label>
                    <Controller
                        control={control}
                        name="decimalSeparator"
                        render={({ field }) => (
                            <Select {...field} key={field.value} onValueChange={field.onChange} value={field.value}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select separator" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Period (.)</SelectItem>
                                    <SelectItem value=",">Comma (,)</SelectItem>
                                </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.decimalSeparator && (
                        <p className="text-sm text-red-500">{errors.decimalSeparator.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="decimals">Decimal Places</Label>
                    <Input
                        id="decimals"
                        type="number"
                        min="0"
                        max="4"
                        placeholder="Decimal Places"
                        {...register("decimalPlaces")}
                    />
                    {errors.decimalPlaces && (
                        <p className="text-sm text-red-500">{errors.decimalPlaces.message}</p>
                    )}
                </div>

            </div>

            <DialogFooter>
                <Button variant="outline" onClick={() => setOpenFormatDialog(false)}>
                    Cancel
                </Button>
                <Button type="submit">
                    <Save className="mr-2 h-4 w-4" />
                    Save Format
                </Button>
            </DialogFooter>
        </form>
    );
}
