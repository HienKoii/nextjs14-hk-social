import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Image } from "react-bootstrap";
import { Counter, Download, Fullscreen, Thumbnails } from "yet-another-react-lightbox/plugins";
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

export default function PostGallery({ data }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleImageClick = (idx) => {
    setIndex(idx);
    setOpen(true);
  };

  // Chuyển đổi dữ liệu thành danh sách ảnh cho Lightbox
  const images = data.map((img) => ({
    src: `/uploads/posts/${img}`,
    width: 800,
    height: 600,
  }));

  return (
    <div>
      {/* Danh sách ảnh chính */}
      <div className="gallery">
        {images.map((image, idx) => (
          <Image key={idx} src={image.src} alt={`Post Image ${idx + 1}`} className="img-fluid mb-2 w-100" onClick={() => handleImageClick(idx)} width={800} height={600} />
        ))}
      </div>

      {/* Lightbox */}
      {open && (
        <Lightbox
          open={open}
          index={index}
          close={() => setOpen(false)}
          slides={images} //
          plugins={[Thumbnails, Fullscreen, Download, Counter]}
          counter={{ container: { style: { top: 0, bottom: 0 } } }}
        />
      )}
    </div>
  );
}
