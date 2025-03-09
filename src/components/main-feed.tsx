'use client';

import type React from "react";
import { PostProps } from '@/app/actions';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NewPost } from "@/components/newpost";
import { getPosts } from "@/app/actions";
import { PostsList } from "./postList";
import { useState } from "react";

interface MainFeedProps {
  initialPosts: PostProps[];
  hasMore: boolean;
}

export default function MainFeed({ initialPosts, hasMore }: MainFeedProps) {
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 w-full pl-4">
        <Avatar>
          <AvatarImage src="/placeholder-avatar.jpg" alt="@username" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        <NewPost/>
      </div>
      
      <PostsList initialPosts={posts} initialHasMore={hasMore} />

    </div>
  );
}