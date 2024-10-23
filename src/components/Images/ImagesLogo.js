import React from "react";
import { Image } from "react-bootstrap";

export default function ImagesLogo({ w, h, className, style }) {
  return (
    <>
      <Image
        src="/images/logo.png"
        alt="logo"
        width={w ? w : "100%"} //
        height={h ? h : "auto"}
        className={`${className ? className : ""}`}
        style={style}
      />
    </>
  );
}
