'use client';

import type React from "react";
import { PostProps } from '@/app/actions';
import { PostsList } from "./postList";
import { useState } from "react";

interface MainFeedProps {
  initialPosts: PostProps[];
  hasMore: boolean;
}

export default function Feed({ initialPosts, hasMore }: MainFeedProps) {
  const [posts, setPosts] = useState<PostProps[]>(initialPosts);
  return (
    <div className="space-y-6">
      <PostsList initialPosts={posts} initialHasMore={hasMore} />
    </div>
  );
}