"use client";
import ListFriends from "@/src/components/Friends/ListFriends";
import { useFriends } from "@/src/context/FriendsContext";
import React from "react";

export default function SuggestPage() {
  const { suggestedFriends } = useFriends();
  return (
    <>
      <h5 className="m-0 fw-bold">Gợi ý kết bạn</h5>
      <ListFriends data={suggestedFriends} scroll />
    </>
  );
}
