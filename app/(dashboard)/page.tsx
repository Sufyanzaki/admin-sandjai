"use client"

import { ArrowUpRight, Ban, Dock, Star, User, Users, Edit } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NewMembers } from "@/components/members/new-members"
import { BestSelling } from "@/components/members/best-selling"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import {useDashboard} from "@/app/(dashboard)/_hooks/useDashboard";
import MemberStats from "@/components/members/member-stats";
import {usePackages} from "@/app/(dashboard)/packages/_hooks/usePackages";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { useState } from "react";

const DashboardPage = () => {
  const { stats, statsLoading, error } = useDashboard();
  const [editorContent, setEditorContent] = useState<string>(`
    <h1>Welcome to the Tiptap Rich Text Editor!</h1>
    <p>This is a powerful, community-driven rich text editor built on top of <strong>ProseMirror</strong>. Here are some features you can try:</p>
    
    <h2>Text Formatting</h2>
    <p>You can make text <strong>bold</strong>, <em>italic</em>, <u>underlined</u>, or even <s>strikethrough</s>. You can also add <code>inline code</code> and create <mark>highlighted text</mark>.</p>
    
    <h2>Lists and Tasks</h2>
    <ul>
      <li>Bullet points work great</li>
      <li>You can create nested lists
        <ul>
          <li>Like this nested item</li>
          <li>And this one too</li>
        </ul>
      </li>
    </ul>
    
    <ol>
      <li>Numbered lists are also supported</li>
      <li>With automatic numbering</li>
    </ol>
    
    <ul data-type="taskList">
      <li data-type="taskItem" data-checked="true">Completed task</li>
      <li data-type="taskItem" data-checked="false">Pending task</li>
      <li data-type="taskItem" data-checked="false">Another task to do</li>
    </ul>
    
    <h2>Text Alignment</h2>
    <p style="text-align: center">This text is centered</p>
    <p style="text-align: right">This text is right-aligned</p>
    
    <h2>Blockquotes and Code</h2>
    <blockquote>
      <p>This is a beautiful blockquote that you can use for important quotes or callouts.</p>
    </blockquote>
    
    <pre><code>// This is a code block
    function hello() {
      console.log("Hello, Tiptap!");
    }</code></pre>
    
    <p>You can also use <sup>superscript</sup> and <sub>subscript</sub> formatting.</p>
    
    <p>Try editing this content and explore all the features available in the toolbar above!</p>
  `);

  const cardData = [
    {
      id: 1,
      title: "Total Members",
      count: stats?.totalMembers || 0,
      description: "All registered members",
      status: "",
      icon: Users,
      buttonText: "View All Members",
      borderColor: "border-blue-100 dark:border-blue-900/60",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      iconColor: "text-blue-600 dark:text-blue-400",
      statusColor: "text-blue-500",
      buttonColor: "text-blue-600 dark:text-blue-400"
    },
    {
      id: 2,
      title: "Today Members",
      count: stats?.todayMembers || 0,
      description: "Members with premium subscriptions",
      status: "",
      icon: Star,
      buttonText: "Manage Memberships",
      borderColor: "border-emerald-100 dark:border-emerald-900/60",
      iconBg: "bg-emerald-100 dark:bg-emerald-900/50",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      statusColor: "text-emerald-500",
      buttonColor: "text-emerald-600 dark:text-emerald-400"
    },
    {
      id: 3,
      title: "Free Members",
      count: stats?.freeMembers || 0,
      description: "Members with free accounts",
      status: "",
      icon: User,
      buttonText: "View Free Members",
      borderColor: "border-amber-100 dark:border-amber-900/60",
      iconBg: "bg-amber-100 dark:bg-amber-900/50",
      iconColor: "text-amber-600 dark:text-amber-400",
      statusColor: "text-amber-500",
      buttonColor: "text-amber-600 dark:text-amber-400"
    },
    {
      id: 4,
      title: "Premium Members",
      count: stats?.premiumMembers || 0, // You might want to add this to your API response
      description: "Suspended or blocked accounts",
      status: "",
      icon: Dock,
      buttonText: "Manage Memberships",
      borderColor: "border-rose-100 dark:border-rose-900/60",
      iconBg: "bg-rose-100 dark:bg-rose-900/50",
      iconColor: "text-rose-600 dark:text-rose-400",
      statusColor: "text-rose-500",
      buttonColor: "text-rose-600 dark:text-rose-400"
    }
  ]

  if (error) {
    return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600">Error loading dashboard</h2>
            <p className="text-muted-foreground">{error.message}</p>
          </div>
        </div>
    )
  }

  return (
      <div className="flex min-h-screen w-full flex-col">
        <main className="flex-1 space-y-6 p-4 xl:p-6">
          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl lg:text-3xl font-bold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Here's what's happening today.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {statsLoading ? (
                Array.from({ length: 4 }).map((_, index) => (
                    <Skeleton key={index} className="h-[180px] w-full rounded-lg" />
                ))
            ) : (
                cardData.map((card) => (
                    <div key={card.id} className={`bg-card rounded-lg overflow-hidden border shadow-md`}>
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`${card.iconBg} p-2 rounded-lg`}>
                              <card.icon className={`h-5 w-5 ${card.iconColor}`} />
                            </div>
                            <span className="font-medium text-slate-600 dark:text-slate-300">{card.title}</span>
                          </div>
                          <span className={`text-sm ${card.statusColor} font-medium`}>{card.status}</span>
                        </div>

                        <div className="mt-4">
                          <div className="text-3xl font-bold text-slate-800 dark:text-white">
                            {statsLoading ? <Skeleton className="h-8 w-16" /> : card.count}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{card.description}</p>
                        </div>

                        <div className="mt-6">
                          <Link
                              href="/members"
                              className={`flex items-center justify-between w-full text-sm ${card.buttonColor} font-medium hover:underline`}
                          >
                            <span>{card.buttonText}</span>
                            <ArrowUpRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                ))
            )}
          </div>

          <Tabs defaultValue="editor" className="space-y-4">
            <TabsList className="grid grid-cols-4 md:w-[520px]">
              <TabsTrigger value="editor">Tiptap Editor</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="new-users">New Users</TabsTrigger>
              <TabsTrigger value="best-selling">Best Selling</TabsTrigger>
            </TabsList>

            <TabsContent value="editor" className="space-y-4">
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Edit className="h-5 w-5" />
                      Tiptap Rich Text Editor Demo
                    </CardTitle>
                    <CardDescription>
                      Experience the power of the community-driven Tiptap editor. Try formatting text, creating lists, adding links, and more!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <SimpleEditor 
                        existingValue={editorContent} 
                        onChange={setEditorContent}
                      />
                      <div className="text-sm text-muted-foreground">
                        <p><strong>Features available:</strong> Bold, italic, underline, strikethrough, code, highlighting, links, headings, lists, task lists, blockquotes, code blocks, text alignment, superscript, subscript, and image uploads.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="new-users" className="space-y-4">
              <div className="md:grid max-md:space-y-4 gap-4 md:grid-cols-2">
                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>Today's Users</CardTitle>
                    <CardDescription>
                      You have {statsLoading ? (
                        <Skeleton className="inline-block h-4 w-4" />
                    ) : (
                        stats?.todayMembers || 0
                    )} new users added
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {statsLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 3 }).map((_, index) => (
                              <Skeleton key={index} className="h-20 w-full" />
                          ))}
                        </div>
                    ) : (
                        <NewMembers users={stats?.todayRegisteredUsers || []} />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="best-selling" className="space-y-4">
              <div className="md:grid max-md:space-y-4 gap-4 md:grid-cols-1">
                <Card className="">
                  <CardHeader>
                    <CardTitle>Best Selling</CardTitle>
                    <CardDescription>Top packages of this year</CardDescription>
                  </CardHeader>
                  <CardContent className="!pt-0">
                    {statsLoading ? (
                        <div className="space-y-4">
                          {Array.from({ length: 5 }).map((_, index) => (
                              <Skeleton key={index} className="h-12 w-full" />
                          ))}
                        </div>
                    ) : (
                        <BestSelling />
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Your platform's matching success and user engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  {statsLoading ? (
                      <Skeleton className="h-[400px] w-full" />
                  ) : (
                      <MemberStats monthlyData={stats?.monthlyRegistrations || []} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
  )
}

export default DashboardPage