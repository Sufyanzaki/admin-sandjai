"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Box, Calendar, CreditCard, Edit, Mail, Phone, Star, Users } from "lucide-react"
import Link from "next/link"
import { use } from "react"
import usePackageById from "../../_hooks/usePackageById"

export default function PackageDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const {id} = use(params)
    const packageId = Number.parseInt(id)
    const { pkg, loading, error } = usePackageById(packageId);

    if (loading) return <div className="p-6">Loading package...</div>;
    if (error) return <div className="p-6 text-red-500">Failed to load package.</div>;
    if (!pkg) return <div className="p-6 text-muted-foreground">Package not found.</div>;

    return (
        <div className="flex flex-col gap-5 p-4 xl:p-6">
            <div className="flex items-center gap-2">
                <Link href="/packages">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">{pkg.name}</h2>
                <Badge
                    className={
                        pkg.isActive
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    }
                >
                    {pkg.isActive ? "Active" : "Inactive"}
                </Badge>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
                        <Users className="size-8 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">+24 from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                        <CreditCard className="size-8 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€{pkg.price * 35}</div>
                        <p className="text-xs text-muted-foreground">+12% from last month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
                        <Calendar className="size-8 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">78%</div>
                        <p className="text-xs text-muted-foreground">+5% from last quarter</p>
                    </CardContent>
                </Card>
            </div>

            <div className="md:grid gap-4 max-md:space-y-4 md:grid-cols-3">
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Package Information</CardTitle>
                        <CardDescription>Details about the {pkg.name} package</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Box className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Price: €{pkg.price}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Duration: {pkg.validity} days</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Popularity: High</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">Support: {pkg.price === 0 ? "Community" : "Priority"}</span>
                        </div>
                        <div className="pt-4">
                            <h4 className="mb-2 text-sm font-medium">Subscription Growth</h4>
                            <Progress value={pkg.id * 25} className="h-2" />
                            <p className="mt-1 text-xs text-muted-foreground">{pkg.id * 25}% increase this quarter</p>
                        </div>
                        <div className="flex gap-2 pt-4 flex-wrap">
                            <Link href={`/packages/${pkg.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Package
                                </Button>
                            </Link>
                            <Link href={`/packages/${pkg.id}/subscribers`}>
                                <Button size="sm">
                                    <Users className="mr-2 h-4 w-4" />
                                    View Subscribers
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Package Overview</CardTitle>
                        <CardDescription>Key information and statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="features">
                            <TabsList className="mb-4">
                                <TabsTrigger value="features">Features</TabsTrigger>
                                <TabsTrigger value="subscribers">Top Subscribers</TabsTrigger>
                            </TabsList>
                            <TabsContent value="features">
                                <div className="space-y-4">
                                {pkg.features.split(',').map((feature: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="flex items-center justify-center rounded-md bg-primary/10 p-2">
                                            <Star className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium">{feature}</h4>
                                            <p className="text-xs text-muted-foreground">
                                                {[
                                                    "Essential functionality",
                                                    "Core feature",
                                                    "Advanced capability",
                                                    "Premium benefit"
                                                ][i % 4]}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                    <Link href={`/packages/features`}>
                                        <Button variant="outline" className="w-full mt-2">
                                            Compare All Features
                                        </Button>
                                    </Link>
                                </div>
                            </TabsContent>
                            <TabsContent value="subscribers">
                                <div className="space-y-4">
                                    {[1, 2, 3].map((_, i) => (
                                        <div key={i} className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarImage
                                                        src={`/thoughtful-gaze.png?height=36&width=36&query=user${i + 1}`}
                                                        alt={`Subscriber ${i + 1}`}
                                                    />
                                                    <AvatarFallback>U{i + 1}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <h4 className="text-sm font-medium">{["Alex Johnson", "Taylor Smith", "Jamie Wilson"][i]}</h4>
                                                    <p className="text-xs text-muted-foreground">
                                                        {["Business", "Pro", "Enterprise"][i]} plan
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant="outline">
                                                {["2 years", "1 year", "6 months"][i]}
                                            </Badge>
                                        </div>
                                    ))}

                                    <Link href={`/packages/${pkg.id}/subscribers`}>
                                        <Button variant="outline" className="w-full mt-2">
                                            <Users className="mr-2 h-4 w-4" />
                                            View All Subscribers
                                        </Button>
                                    </Link>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}