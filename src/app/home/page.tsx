import { LeftSidebar } from "@/components/left-sidebar";
import MainFeed from "@/components/main-feed";
import { RightSidebar } from "@/components/right-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPosts } from "@/app/actions";

export default async function HomeGo() {
  const {posts, hasMore} = await getPosts();

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
            <MainFeed initialPosts={posts} hasMore={hasMore} />
          </ScrollArea>
        </div>
        
        {/* Right Sidebar */}
        <div className="flex-1 md:flex-none md:w-1/4 ">
          <ScrollArea className="border-none rounded-md border h-[85vh]">
            
          <RightSidebar />
          <RightSidebar />
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}