'use client';

import { LeftSidebar } from "@/components/left-sidebar";
import Feed from "@/components/main-feed";
import { RightSidebar } from "@/components/right-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PostProps } from "@/app/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PostComponent from "@/components/post"; // Adjust the path as necessary
import { Skeleton } from "@/components/ui/skeleton";
import { SearchBar } from "@/components/search-bar";

interface ResumenesClientProps {
    initialData: {
        posts: PostProps[];
        hasMore: boolean;
        contentHtml: string;
    };
    searchQuery?: string;
}

export default function ResumenesClient({ 
    initialData,
    searchQuery = ""
}: ResumenesClientProps) {
    const [data, setData] = useState({
        posts: initialData.posts,
        hasMore: initialData.hasMore,
        contentHtml: initialData.contentHtml ?? null
    });
    
    // No need for loading state since we already have initialData
    const isLoading = false;

    return (
        <div className="container mx-auto py-6">
            <h1 className="text-3xl font-bold mb-6">Resúmenes de Publicaciones</h1>
            
            {/* Add the search bar */}
            <div className="mb-6">
                <SearchBar defaultValue={searchQuery} />
            </div>
            
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

                       {data.contentHtml ? (
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

                         <div className="space-y-5 px-4">
                              {data.posts.map((post) => (
                                <PostComponent key={`${post.id}-${post.createdAt}`} {...post}/>
                              ))}
                            </div>
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