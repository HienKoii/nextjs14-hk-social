"use client";
import React, { useState } from "react";
import { Card, Image, Button } from "react-bootstrap";
import { AiOutlineComment, AiOutlineDown, AiOutlineShareAlt } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CommentsProvider } from "@/src/context/CommentsContext";
import CommentsModal from "../Comments/CommentsModal";
import Reactions from "../reactions";
import ReactionsShow from "../reactions/ReactionsShow";
import PostMenu from "./PostMenu";
import ImagesAvatar from "../Images/ImagesAvatar";
import { formatContent, formatDateProfile, getIconStatusPost, timeAgo } from "@/src/utils";
import PostGallery from "../Gallery/PostGallery";
import ShowMoreText from "../ShowMoreText";

export default function PostsItem({ post }) {
  const pathname = usePathname();
  const isProfilePage = /^\/profile\/\w+$/.test(pathname);

  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const [expandedPostId, setExpandedPostId] = useState(null);
  const [totalReactions, setTotalReactions] = useState(post.totalReactions || 0);
  const [totalComments, setTotalComments] = useState(post.totalComments || 0);
  const [reactionsData, setReactionsData] = useState(post.reactions || []);

  const handleReactionsData = (data) => {
    switch (data.status) {
      case "INSERT":
        setReactionsData((pre) => [data.data, ...pre]);
        break;
      case "UPDATE":
        setReactionsData((prev) =>
          prev.map((reaction) => {
            if (reaction.post_id === data.data.post_id && reaction.user_id === data.data.userId) {
              const newReaction = { ...reaction, type: data.data.type };
              return newReaction;
            }
            return reaction;
          })
        );
        break;
    }
  };

  const handleTotalReactions = (number) => {
    setTotalReactions((prevTotal) => prevTotal + number);
  };

  const handleTotalComments = (number) => {
    setTotalComments((prevTotal) => prevTotal + number);
  };

  const handleIsExpanded = (postId) => {
    setExpandedPostId(expandedPostId === postId ? null : postId);
  };

  const renderImages = (images, postId) => {
    const postImgs = JSON.parse(images || "[]");

    return (
      <>
        <div
          className="mb-2"
          style={{
            maxHeight: expandedPostId === postId ? "none" : `550px`,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <PostGallery data={postImgs} />
        </div>
        {postImgs.length >= 2 && expandedPostId !== postId && (
          <div className="d-flex justify-content-center align-items-center w-100" style={{ position: "absolute", bottom: "20%", right: "0%" }}>
            <Button variant="light" className="d-flex align-items-center" onClick={() => handleIsExpanded(postId)}>
              <AiOutlineDown className="me-1" /> Xem thêm
            </Button>
          </div>
        )}
      </>
    );
  };

  const handleShowComments = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };
  return (
    <>
      <Card className="mb-3">
        <Card.Body className="hk-custom-card pt-4 p-0">
          <div className="d-flex mb-3 px-4">
            <Link href={isProfilePage ? "#" : `/profile/${post?.user_id}`}>
              <ImagesAvatar id={post?.user_id} url={post?.avatar} isCircle className={"me-2 object-fit-cover"} />
            </Link>
            <div className="d-flex flex-column justify-content-center w-100">
              <div className="d-flex justify-content-between align-items-center">
                <Link href={`/profile/${post?.user_id}`} className="d-flex justify-content-center align-items-center gap-1">
                  <strong>{post.fullName}</strong>
                  {post.tick ? (
                    <Image
                      src={`/images/tick.png`} //
                      alt="Avatar"
                      width={15}
                      className="rounded-circle"
                    />
                  ) : null}
                </Link>
                <PostMenu post={post} />
              </div>
              <div className="d-flex justify-content-start align-items-center gap-1">
                <span className="text-muted">{isProfilePage ? formatDateProfile(post.created_at) : timeAgo(post.created_at)}</span>
                {getIconStatusPost(post.status, 14)}
              </div>
            </div>
          </div>
          <ShowMoreText className={"px-4"} moreText={"Xem thêm"} lessText={"Ẩn bớt"} anchorClass="text-muted">
            <div dangerouslySetInnerHTML={{ __html: formatContent(post.content) }} />
          </ShowMoreText>
          {post?.images?.length > 0 && renderImages(post?.images, post.id)}

          <div className="d-flex justify-content-between my-3 px-4">
            <div className="d-flex justify-content-center align-items-center">
              {totalReactions > 0 && (
                <>
                  <ReactionsShow reactions={reactionsData} totalReactions={totalReactions} showInfo />
                </>
              )}
            </div>
            <div>
              <span className="me-1 text-muted">{totalComments}</span> {/* Hiển thị số comment */}
              <AiOutlineComment size={24} />
            </div>
          </div>

          <div className="d-flex justify-content-between border-t-hk gap-2 px-4 pb-3">
            <Reactions
              post={post} ///
              handleTotalReactions={handleTotalReactions}
              handleReactionsData={handleReactionsData}
            />
            <Button
              variant="light" //
              className="d-flex align-items-center justify-content-center w-100"
              onClick={() => handleShowComments(post)}
            >
              <AiOutlineComment className="me-1" /> Bình luận
            </Button>
            <Button variant="light" className="d-flex align-items-center justify-content-center w-100">
              <AiOutlineShareAlt className="me-1" /> Chia sẻ
            </Button>
          </div>
        </Card.Body>
      </Card>
      {/* show modal cmt */}
      <CommentsProvider selectedPost={selectedPost}>
        <CommentsModal show={showModal} handleClose={handleClose} handleTotalComments={handleTotalComments} />
      </CommentsProvider>
    </>
  );
}
