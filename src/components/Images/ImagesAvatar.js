import React from "react";
import { Image } from "react-bootstrap";

export default function ImagesAvatar({ id, url, w, h, isCircle = false, className, style }) {
  return (
    <>
      <Image
        src={id && url ? `/uploads/avatar/${id}/${url}` : `/uploads/avatar/avatar-default.jpg`} //
        alt="Avatar"
        width={w ? w : 50}
        className={`images-avatar ${className ? className : ""} ${isCircle ? "rounded-circle" : "rounded"}`}
        height={h ? h : 50}
        style={style}
      />
    </>
  );
}
