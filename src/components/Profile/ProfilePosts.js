"use client";
import PostsItem from "../Posts/PostsItem";

const ProfilePosts = ({ posts }) => {
  console.log('posts', posts)
  return (
    <div className="mt-4">
      {posts?.map((post) => {
        return <PostsItem key={post.id} post={post} />;
      })}
    </div>
  );
};

export default ProfilePosts;
