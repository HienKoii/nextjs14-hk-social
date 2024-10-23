import React from "react";
import { Image } from "react-bootstrap";
import ImagesLogo from "./ImagesLogo";

export default function ImagesLoading({ className }) {
  return (
    <div className="d-flex justify-content-center align-items-center">
      <div className="position-relative">
        <Image src="/images/loading.svg" alt="Loading..." width={200} height={200} />
        <ImagesLogo w={40} className={"position-absolute"} style={{top:"80px" , right:"80px"}} />
      </div>
    </div>
  );
}
