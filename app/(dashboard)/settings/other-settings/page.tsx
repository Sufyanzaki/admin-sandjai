"use client"

import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {Building, MoreVertical, Pencil, Plus, Settings, Trash, Upload} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import {useState} from "react";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import {Textarea} from "@/components/ui/textarea";
import {MultiSelectCombobox} from "@/components/ui/combo-box";
import AbusiveCard from "./_components/abusive-card";
import CurrencyTable from "./_components/currency-table";

const pagesData = [
  {
    id: 1,
    name: "Bedrijf",
    pages: ["Home", "Contact", "How Work", "Registration", "Agenda"],
  },
  {
    id: 2,
    name: "Veilig daten",
    pages: ["Agenda"],
  },
  {
    id: 3,
    name: "Legal",
    pages: ["Algemene voorwaarden", "Privacy", "Disclaimer"],
  },
];

const pageOptions = [
  'Home', 'About', 'Contact Us'
]

export default function SettingsPage() {

  const [openFooterDialog, setOpenFooterDialog] = useState(false);

  const [selectedPage, setSelectedPage] = useState<string[]>([])



  return (
    <div className="flex flex-col gap-6 p-4 xl:p-6">
      <div>
        <h2 className="text-2xl font-bold">App Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your app settings and preferences</p>
      </div>

      <Tabs defaultValue="currency" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="currency">Currency</TabsTrigger>
          <TabsTrigger value="abusive-words">Abusive Words</TabsTrigger>
          <TabsTrigger value="footer">Footer</TabsTrigger>
          <TabsTrigger value="footer-settings">Footer Section</TabsTrigger>
          <TabsTrigger value="user-dashboard">User Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="currency" className="space-y-4">
          <CurrencyTable />
        </TabsContent>
        <TabsContent value="abusive-words" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Abusive Words Configuration
                  </CardTitle>
                  <CardDescription>Manage your system settings and appearance</CardDescription>
                </div>
              </div>
            </CardHeader>

            <AbusiveCard />

          </Card>
        </TabsContent>
        <TabsContent value="footer" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Footer
                  </CardTitle>
                  <CardDescription>Manage your system settings and appearance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-6">
                {/* First Row: Image Upload & Footer Description */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Image Upload */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Footer Logo</h3>
                    <div className="flex items-center gap-4">
                      <div className="h-24 w-24 shrink-0 rounded-md bg-muted flex items-center justify-center">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="space-y-2">
                        <input type="file" id="system-logo" className="hidden" />
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() =>
                                document.getElementById("system-logo")?.click()
                            }
                        >
                          Upload Photo
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Upload a profile photo. JPG, PNG or GIF. Max 2MB.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Description */}
                  <div className="space-y-2">
                    <Label htmlFor="footer-description">Footer Description</Label>
                    <Textarea id="footer-description" placeholder="Enter description" />
                  </div>
                </div>

                {/* Second Row: Remaining Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="link-name">Link Name</Label>
                    <Input id="link-name" placeholder="Enter link name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="search-name">Search Name</Label>
                    <Input id="search-name" placeholder="Enter search name" />
                  </div>

                  <div className="space-y-2 col-span-1 md:col-span-2">
                    <Label htmlFor="footer-content">Footer Content</Label>
                    <Input id="footer-content" placeholder="Enter footer content" />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button className="px-8">Save Template</Button>
                </div>
              </form>
            </CardContent>

          </Card>
        </TabsContent>
        <TabsContent value="footer-settings" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Title + Description */}
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Settings className="h-5 w-5" />
                    Footer Section
                  </CardTitle>
                  <CardDescription>
                    Manage your system settings and appearance
                  </CardDescription>
                </div>

                {/* Button */}
                <Button
                    onClick={() => setOpenFooterDialog(true)}
                    className="w-full sm:w-auto"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add New
                </Button>
              </div>
            </CardHeader>
            <div className="px-4 space-y-6 pb-6">
              <div className="py-3 md:py-4 xxl:py-6">
                <Table className="whitespace-nowrap">
                  <TableHeader>
                    <TableRow>
                      <TableHead>#</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Pages</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagesData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.id}</TableCell>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.pages.join(", ")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setOpenFooterDialog(true)}
                                >
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Trash className="w-4 h-4 mr-2 text-red-500" />
                                  <span className="text-red-500">Delete</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>

        </TabsContent>
        <TabsContent value="user-dashboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building className="mr-2 h-5 w-5" />
                User Dashboard Footer Section
              </CardTitle>
              <CardDescription>
                Customize the footer content shown on the user dashboard, including links, contact info, and disclaimers.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="known-languages" className="text-base font-medium">
                  Section Page
                </Label>
                <MultiSelectCombobox options={pageOptions} selected={selectedPage} onChange={setSelectedPage} />
              </div>
              <div className="flex justify-end pt-6">
                <Button className="px-8">Save Configuration</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Set Format Dialog */}


      <Dialog open={openFooterDialog} onOpenChange={setOpenFooterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Footer Section</DialogTitle>
            <DialogDescription>
              Provide the name and page associated with this section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section-name">Section Name</Label>
              <Input id="section-name" placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section-page">Section Page</Label>
              <Input id="section-page" placeholder="Enter page" />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button type="submit">Save Configuration</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
