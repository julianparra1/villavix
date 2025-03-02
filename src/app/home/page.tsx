'use client';
import { LeftSidebar } from "@/components/left-sidebar";
import { MainFeed } from "@/components/main-feed";
import { RightSidebar } from "@/components/right-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";



export default function HomeGo() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-3">
            <ScrollArea className="border-none h-[600px] w-[350px] rounded-md border p-4">
             <LeftSidebar />
             
            </ScrollArea>
        </div>
        <div className="md:col-span-6">
            <ScrollArea className="border-none h-[600px] w-[700px] rounded-md border p-4">
             <MainFeed />
             <MainFeed />
             <MainFeed />
            </ScrollArea>
        </div>
        <div className="md:col-span-3">
            <ScrollArea className="border-none h-[600px] w-[350px] rounded-md border p-4">
             <RightSidebar />
             <RightSidebar />
             <RightSidebar />
            </ScrollArea>
        </div>
      </div>
    </div>
  )
}