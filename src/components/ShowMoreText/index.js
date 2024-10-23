import dynamic from "next/dynamic";
import React from "react";

// Import thư viện với ssr: false
const LibShowMoreText = dynamic(() => import("react-show-more-text").then((mod) => mod.default), { ssr: false });

const ShowMoreText = ({
  children,
  lines = 3,
  moreText = "Show more",
  lessText = "Show less", //
  expanded = false,
  width = 0,
  anchorClass,
  onToggle,
  className,
}) => {
  const handleOnToggle = (isExpanded) => {
    console.log(isExpanded ? "Đã mở rộng" : "Đã thu gọn");
    if (onToggle) onToggle(isExpanded); // Gọi hàm onToggle nếu có
  };

  return (
    <LibShowMoreText
      lines={lines}
      more={moreText}
      less={lessText}
      expanded={expanded}
      width={width}
      anchorClass={`cursor-pointer ${anchorClass ? anchorClass : ""}`}
      className={className ? className : ""}
      onToggle={handleOnToggle} // Sử dụng hàm custom khi toggle
    >
      {children}
    </LibShowMoreText>
  );
};

export default ShowMoreText;
