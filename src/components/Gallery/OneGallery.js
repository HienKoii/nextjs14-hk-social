"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

// Dynamic import của Lightbox để hỗ trợ Next.js
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

export default function SingleImageLightbox({ children }) {
  const [open, setOpen] = useState(false);

  const handleImageClick = () => {
    setOpen(true);
  };

  return (
    <>
      <div className="gallery h-100" onClick={handleImageClick}>
        {children}
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          controller={{ closeOnBackdropClick: true, navigation: false }}
          slides={[
            {
              src: children.props.src, // Lấy src từ children
              width: 800,
              height: 600,
            },
          ]}
        />
      )}
    </>
  );
}
