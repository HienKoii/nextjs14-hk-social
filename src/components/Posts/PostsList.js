"use client";

import React from "react";

import { usePosts } from "@/src/context/PostsContext";

import PostsItem from "./PostsItem";
import LoadingCard from "../Loading/LoadingCard";

export default function PostsList() {
  const { posts, loading } = usePosts();

  return (
    <>
      {posts?.map((post) => (
        <React.Fragment key={post.id}>
          <PostsItem post={post} />
        </React.Fragment>
      ))}

      {loading && <div className="text-center"> <LoadingCard /></div>}
    </>
  );
}
