import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { TableHeader, TableRow, TableHead, Table, TableCell, TableBody } from "@/components/ui/table";
import {MoreHorizontal, Pencil, Plus, Save, Settings, Settings2, Trash2} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import { DropdownMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {Switch} from "@/components/ui/switch";
import { useCurrencies } from "../_hooks/useCurrencies";
import type { Currency } from "../_api/getCurrencies";

export default function CurrencyTable() {
    const { currencies, loading, error } = useCurrencies();
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [openFormatDialog, setOpenFormatDialog] = useState(false);
    const [currencyToDelete, setCurrencyToDelete] = useState<Currency | undefined>(undefined);

    if (loading) return <div className="p-6">Loading currencies...</div>;
    if (error) return <div className="p-6 text-red-500">Failed to load currencies.</div>;

  return (
    <>
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {/* Title & Description */}
                    <div>
                        <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                            <Settings className="h-5 w-5" />
                            Currency Configuration
                        </CardTitle>
                        <CardDescription>
                            Manage your system settings and appearance
                        </CardDescription>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenFormatDialog(true)}
                            className="w-full sm:w-auto"
                        >
                            <Settings2 className="mr-2 h-4 w-4" />
                            Set Format
                        </Button>
                        <Button
                            onClick={() => setOpenAddDialog(true)}
                            className="w-full sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Currency
                        </Button>
                    </div>
                </div>
            </CardHeader>

            {!currencies ? <div className="p-6 text-muted-foreground">No currencies found.</div> : <CardContent className="p-0">
                <div className="rounded-lg border">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="w-[80px]">#</TableHead>
                                <TableHead>Currency</TableHead>
                                <TableHead>Code</TableHead>
                                <TableHead>RTL</TableHead>
                                <TableHead className="w-[120px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currencies.map((currency, idx) => (
                                <TableRow key={currency.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">{idx + 1}</TableCell>
                                    <TableCell>{currency.currencyName}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{currency.currencyCode}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Switch id={`show-${currency.id}`} checked={!!currency.textDirection} />
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 ml-auto">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem onClick={()=> setOpenAddDialog(true)}>
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    className="text-destructive focus:text-destructive"
                                                    onClick={() => setCurrencyToDelete(currency)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>}
        </Card>

        <Dialog open={openFormatDialog} onOpenChange={setOpenFormatDialog}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Currency Format Settings</DialogTitle>
                    <DialogDescription>
                        Configure how currency values are displayed
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="default">Default Currency *</Label>
                        <Select>
                            <SelectTrigger>
                                <SelectValue placeholder="Select default currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {(currencies ?? []).map(currency => (
                                    <SelectItem key={currency.id} value={currency.id}>
                                        {currency.currencyName} ({currency.currencyCode})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="symbol-format">Symbol Format</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="prefix">Prefix ($100)</SelectItem>
                                    <SelectItem value="suffix">Suffix (100$)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="decimal-separator">Decimal Separator</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select separator" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value=".">Period (.)</SelectItem>
                                    <SelectItem value=",">Comma (,)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="decimals">Decimal Places</Label>
                            <Input id="decimals" type="number" min="0" max="4" defaultValue="2" />
                        </div>
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
            </DialogContent>
        </Dialog>
        <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Add New Currency</DialogTitle>
                    <DialogDescription>
                        Add a new currency to your system
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Currency Name *</Label>
                            <Input id="name" placeholder="e.g. US Dollar" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="code">Currency Code *</Label>
                            <Input id="code" placeholder="e.g. USD" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="symbol">Symbol *</Label>
                            <Input id="symbol" placeholder="e.g. $" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="rtl">Text Direction</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select direction" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ltr">Left-to-Right (LTR)</SelectItem>
                                    <SelectItem value="rtl">Right-to-Left (RTL)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
                        Cancel
                    </Button>
                    <Button type="submit">
                        <Save className="mr-2 h-4 w-4" />
                        Save Currency
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  )
}