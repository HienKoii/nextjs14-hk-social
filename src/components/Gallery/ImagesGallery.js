import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Col, Image, Row } from "react-bootstrap";
import ImagesDropdown from "../Images/ImagesDropdown";
import { Counter, Thumbnails } from "yet-another-react-lightbox/plugins";

// Dynamic import của Lightbox để hỗ trợ Next.js
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

const ImagesGallery = ({ data, className, classImg, isDropdown = false }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleImageClick = (index) => {
    setIndex(index);
    setOpen(true);
  };

  // Chuyển đổi data thành format được yêu cầu
  const slides = data?.url?.map((image) => ({
    src: `/uploads/${data.type}/${data.userId}/${image}`,
    width: 800,
    height: 600,
  }));

  return (
    <>
      <div className={`${className ? className : ""} gallery`}>
        <Row className="">
          {slides?.map((image, idx) => (
            <Col
              key={idx} //
              xs={data.type === "background" ? 12 : 6}
              md={4}
              lg={data.type === "background" ? 6 : 3}
              className="mb-2"
            >
              <div style={{ position: "relative" }}>
                <Image
                  src={image.src}
                  alt={`Image ${idx + 1}`} //
                  className={classImg ? classImg : `img-wrapper-item`}
                  onClick={() => handleImageClick(idx)}
                  thumbnail
                />
                {isDropdown && <ImagesDropdown data={data} item={idx} />}
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {open && (
        <Lightbox
          plugins={[Thumbnails, Counter]}
          open={open}
          index={index} //
          close={() => setOpen(false)}
          slides={slides}
          counter={{ container: { style: { top: 0, bottom: 0 } } }}
        />
      )}
    </>
  );
};

export default ImagesGallery;
