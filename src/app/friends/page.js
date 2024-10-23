"use client";
import ListFriends from "@/src/components/Friends/ListFriends";
import { useFriends } from "@/src/context/FriendsContext";

export default function FriendsHome() {
  const { friends } = useFriends();

  return (
    <>
      <h4>Danh sách bạn bè</h4>
      <div className="h-100">
        <ListFriends data={friends} isAddFriend left isShowOnline />
      </div>
    </>
  );
}
