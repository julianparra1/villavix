"use client";
import { LeftSidebar } from "@/components/left-sidebar";
import Feed from "@/components/main-feed";
import { RightSidebar } from "@/components/right-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getRecentPostsWithSummary, PostProps } from "@/app/actions";
import Post from "@/components/post";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Resumenes() {
    const [data, setData] = useState<{posts: PostProps[], hasMore: boolean, contentHtml: string | null}>({
        posts: [],
        hasMore: false,
        contentHtml: null
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            setIsLoading(true);
            try {
                const result = await getRecentPostsWithSummary();
                setData({
                    ...result,
                    contentHtml: result.contentHtml ?? null
                });
            } catch (error) {
                console.error("Error loading data:", error);
            } finally {
                setIsLoading(false);
            }
        }
        
        loadData();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-row gap-2 lg:gap-8">
                {/* Left Sidebar */}
                <div className="flex-1 md:flex-none md:w-1/4">
                    <ScrollArea className="border-none h-[600px] w-full rounded-md border p-4">
                        <LeftSidebar />
                    </ScrollArea>
                </div>

                {/* Main Feed */}
                <div className="flex-1 md:w-1/2">
                    <ScrollArea className="border-none h-[85vh] w-full rounded-md border p-4">
                        <h2 className="text-2xl font-bold">Posts de los últimos 2 días</h2>
                        
                        {isLoading ? (
                            <div className="space-y-5 px-4 py-8">
                                <Card className="w-full gap-2 mx-auto bg-white/70 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center space-x-4">
                                            <Skeleton className="w-10 h-10 rounded-full" />
                                            <Skeleton className="h-4 w-[100px]" />
                                        </div>
                                    </CardHeader>
                                    <CardTitle className="ml-6">
                                        <Skeleton className="h-6 w-[200px]" />
                                    </CardTitle>
                                    <CardContent>
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-full mb-2" />
                                        <Skeleton className="h-4 w-3/4" />
                                    </CardContent>
                                </Card>
                            </div>
                        ) : data.contentHtml ? (
                            <div className="space-y-5 px-4 py-8">
                                <Card className="w-full gap-2 mx-auto bg-white/70 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-lg">
                                    <CardHeader>
                                        <div className="flex items-center space-x-4">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src="gemini.png" />
                                                <AvatarFallback>JP</AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold not-italic">Gemini</span>
                                            <div className="flex-grow"></div>
                                            <Button size="icon" variant="ghost"></Button>
                                        </div>
                                    </CardHeader>
                                    <CardTitle className="text-xl ml-6">Resumen general:</CardTitle>
                                    <CardContent>
                                        <div className="content-html-container"
                                            dangerouslySetInnerHTML={{ __html: data.contentHtml }} />
                                        <div className="mt-2">
                                            <span className="text-gray-500">✨ Generado con Gemini</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        ) : null}

                        {!isLoading && <Feed initialPosts={data.posts} hasMore={data.hasMore} />}
                    </ScrollArea>
                </div>

                {/* Right Sidebar */}
                <div className="flex-1 md:flex-none md:w-1/4 ">
                    <ScrollArea className="border-none rounded-md border h-[85vh]">
                        <RightSidebar />
                    </ScrollArea>
                </div>
            </div>
        </div>
    );
}