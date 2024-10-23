// Hàm tính thời gian đã đăng
import Cookies from "js-cookie";
import { Image } from "react-bootstrap";
import { FaComment, FaGlobe, FaLock, FaThumbsUp, FaUserFriends, FaUserPlus } from "react-icons/fa";

export const timeAgo = (createdAt) => {
  const now = new Date();
  const createdTime = new Date(createdAt);
  const diffInSeconds = Math.floor((now - createdTime) / 1000);

  // Các mốc thời gian cơ bản tính bằng giây
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;
  const year = day * 365;

  if (diffInSeconds < minute) {
    return `${diffInSeconds} giây trước`;
  } else if (diffInSeconds < hour) {
    const diffInMinutes = Math.floor(diffInSeconds / minute);
    return `${diffInMinutes} phút trước`;
  } else if (diffInSeconds < day) {
    const diffInHours = Math.floor(diffInSeconds / hour);
    return `${diffInHours} giờ trước`;
  } else if (diffInSeconds < day * 2) {
    return `hôm qua`;
  } else if (diffInSeconds < month) {
    const diffInDays = Math.floor(diffInSeconds / day);
    return `${diffInDays} ngày trước`;
  } else if (diffInSeconds < year) {
    const diffInMonths = Math.floor(diffInSeconds / month);
    return `${diffInMonths} tháng trước`;
  } else {
    const diffInYears = Math.floor(diffInSeconds / year);
    return `${diffInYears} năm trước`;
  }
};

export const formatDateProfile = (createdAt) => {
  const date = new Date(createdAt);

  const day = date.getDate(); // Lấy ngày
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear(); // Lấy năm

  return `${day} ${month}/${year}`;
};

export const timeAgoComments = (dateString) => {
  const now = new Date();
  const commentDate = new Date(dateString);
  const diffInSeconds = Math.floor((now - commentDate) / 1000);

  const timeFrames = [
    { unit: "năm", seconds: 31536000 },
    { unit: "tháng", seconds: 2592000 },
    { unit: "tuần", seconds: 604800 },
    { unit: "ngày", seconds: 86400 },
    { unit: "giờ", seconds: 3600 },
    { unit: "phút", seconds: 60 },
  ];

  for (const { unit, seconds } of timeFrames) {
    const interval = Math.floor(diffInSeconds / seconds);
    if (interval >= 1) {
      return `${interval} ${unit} trước`;
    }
  }

  return "vừa xong";
};
export const formatContent = (text) => {
  // Thay thế tất cả các ký tự xuống dòng \r\n và \n bằng thẻ <br />
  return text.replace(/(\r\n|\n|\r)/g, "<br />");
};

export const isToken = (isThongBao = false) => {
  const token = Cookies.get("token");
  const check = token ? true : false;
  if (isThongBao) {
    alert("Vui lòng đăng nhập trước");
  }
  return check;
};
export const convertReactionTypeContent = (type) => {
  switch (type) {
    case "like":
      return "Thích";
    case "love":
      return "Yêu thích";
    case "haha":
      return "Haha";
    case "wow":
      return "Wow";
    case "sad":
      return "Buồn";
    case "angry":
      return "Phẫn nộ";
    case "lovelove":
      return "Thương thuong";
    default:
      return "";
  }
};
export const getColorReactionType = (type) => {
  switch (type) {
    case "like":
      return "rgb(8, 102, 255)";
    case "love":
      return "rgb(243, 62, 88)";
    case "lovelove":
    case "haha":
    case "wow":
    case "sad":
      return "rgb(247, 177, 37)";
    case "angry":
      return "rgb(233, 113, 15)";
    default:
      return "";
  }
};
// Available reactions
export const AvailableReactions = [
  { type: "like", label: "Thích" },
  { type: "love", label: "Yêu thích" },
  { type: "lovelove", label: "Thương thương" },
  { type: "haha", label: "Haha" },
  { type: "wow", label: "Wow" },
  { type: "sad", label: "Buồn" },
  { type: "angry", label: "Giận dữ" },
];

export const getIconStatusPost = (status, size) => {
  switch (status) {
    case 0:
      return <FaGlobe size={size ? size : null} />;
    case 1:
      return <FaUserFriends size={size ? size : null} />;
    case 2:
      return <FaLock size={size ? size : null} />;
  }
};

export const validateInput = (input) => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(input);
};

export const getNotificationIcon = (type) => {
  switch (type) {
    case "like":
      return <FaThumbsUp className="text-primary" />;
    case "comment":
      return <FaComment className="text-success" />;
    case "friend_request":
      return <FaUserPlus className="text-info" />;
    default:
      return null;
  }
};

export const convertContentNotifications = (type) => {
  let action = "";
  switch (type) {
    case "friend_request":
      return (action = "gửi lời mời kết bạn");
    case "like":
      return (action = "thích bài viết của bạn");
    case "comment":
      return (action = "bình luận về bài viết của bạn");
    case "love":
      return (action = "thả tim bài viết của bạn");
    case "lovelove":
      return (action = "thả thương thương bài viết của bạn");
    case "haha":
      return (action = "thả haha vào bài viết của bạn");
    case "wow":
      return (action = "ngạc nhiên về bài viết của bạn");
    case "sad":
      return (action = "cảm thấy buồn về bài viết của bạn");
    case "angry":
      return (action = "phản ứng giận dữ với bài viết của bạn");
    case "post":
      return (action = "đăng một bài viết mới");
    default:
      action = "đã thực hiện một hành động";
  }
};
export const getIconTypeNotifications = (type) => {
  switch (type) {
    case "friend_request":
      return (
        <Image
          src={`/images/3437315.png`} //
          alt={type}
          width={20}
          height={"auto"}
          className="reaction-img"
        />
      );
    case "comment":
    case "like":
    case "love":
    case "lovelove":
    case "haha":
    case "wow":
    case "sad":
    case "angry":
      return (
        <Image
          src={`/images/${type}.svg`} //
          alt={type}
          width={20}
          height={"auto"}
          className="reaction-img"
        />
      );
  }
};
export const getLastName = (fullName) => {
  // Sử dụng hàm split để tách các từ trong chuỗi
  const nameParts = fullName.trim().split(" ");

  // Trả về từ cuối cùng trong mảng
  return nameParts[nameParts.length - 1];
};
