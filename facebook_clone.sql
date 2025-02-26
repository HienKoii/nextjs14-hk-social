-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th2 26, 2025 lúc 02:47 PM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `facebook_clone`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comments`
--

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `like` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `comment_reactions`
--

CREATE TABLE `comment_reactions` (
  `id` int(11) NOT NULL,
  `comment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('like','love','haha','wow','sad','angry','lovelove') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `user1_id` int(11) NOT NULL,
  `user2_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `conversation_messages`
--

CREATE TABLE `conversation_messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friends`
--

CREATE TABLE `friends` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `friend_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friends`
--

INSERT INTO `friends` (`id`, `user_id`, `friend_id`, `status`, `created_at`) VALUES
(36, 1, 2, 'accepted', '2024-10-16 12:07:59'),
(37, 2, 1, 'accepted', '2024-10-16 12:07:59'),
(38, 1, 3, 'accepted', '2024-10-16 12:16:47'),
(39, 3, 1, 'accepted', '2024-10-16 12:16:47'),
(40, 1, 9, 'accepted', '2024-10-16 12:20:35'),
(41, 9, 1, 'accepted', '2024-10-16 12:20:35'),
(42, 1, 10, 'accepted', '2024-10-16 17:37:47'),
(43, 10, 1, 'accepted', '2024-10-16 17:37:47');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `friend_requests`
--

CREATE TABLE `friend_requests` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `friend_requests`
--

INSERT INTO `friend_requests` (`id`, `sender_id`, `receiver_id`, `status`, `created_at`) VALUES
(79, 3, 1, 'accepted', '2024-10-16 12:00:13'),
(80, 2, 1, 'accepted', '2024-10-16 12:06:42'),
(81, 7, 1, 'pending', '2024-10-16 12:19:39'),
(82, 9, 1, 'accepted', '2024-10-16 12:20:22'),
(83, 5, 1, 'pending', '2024-10-16 17:11:20'),
(84, 10, 1, 'accepted', '2024-10-16 17:27:12');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `img` text NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `is_deleted` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `img`, `is_read`, `is_deleted`, `created_at`) VALUES
(19, 4, 1, 'alo', '', 1, 0, '2024-10-21 22:34:57'),
(45, 1, 4, 'hi', '', 1, 0, '2024-10-22 21:48:58'),
(46, 1, 4, 'alo 123😃', '', 1, 0, '2024-10-22 21:50:49'),
(47, 1, 4, 'haiz1', '', 1, 0, '2024-10-22 21:50:55');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `actor_id` int(11) NOT NULL,
  `post_id` int(11) DEFAULT NULL,
  `type` enum('friend_request','like','comment','love','haha','wow','sad','angry','post','lovelove') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `password_resets`
--

CREATE TABLE `password_resets` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `expires_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `password_resets`
--

INSERT INTO `password_resets` (`email`, `token`, `expires_at`) VALUES
('khien1892002@gmail.com', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtoaWVuMTg5MjAwMkBnbWFpbC5jb20iLCJpYXQiOjE3Mjk2MTg5NjQsImV4cCI6MTcyOTYyMjU2NH0.A1nRCd7chvc8gBJXpcOuJv2cNHGqKlcW_U4ybOPMwiY', '2024-10-23 01:42:44');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `posts`
--

CREATE TABLE `posts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `posts`
--

INSERT INTO `posts` (`id`, `user_id`, `content`, `images`, `status`, `created_at`, `updated_at`) VALUES
(270, 1, 'Chào mừng bạn đến với mạng xã hội HK', '[\"userID1-logo.png\"]', 0, '2024-10-16 17:51:29', '2024-10-17 08:49:08'),
(276, 1, 'hi', NULL, 0, '2024-10-29 14:34:25', '2024-10-29 14:34:25');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reactions`
--

CREATE TABLE `reactions` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('like','love','haha','wow','sad','angry','lovelove') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `background` varchar(255) NOT NULL,
  `biography` varchar(255) NOT NULL,
  `tick` tinyint(4) NOT NULL,
  `profile_pic` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gender` varchar(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `fullName`, `email`, `avatar`, `background`, `biography`, `tick`, `profile_pic`, `created_at`, `gender`) VALUES
(1, 'admin', '$2b$10$dJgzCkHa.AWMkkndhSpuMuRM4YaaOIuNew8aNCWV8LRIY0D1n11pW', 'Mạng xã hội HK', 'khien1892002@gmail.com', '1.png', '', 'Hiến Kòii', 1, NULL, '2024-10-03 12:39:59', NULL),
(2, 'ad1', '$2b$10$.qEZmE3h4yQbmNFwTPLDcOgov8NJuS97gG6VG2LBGAmKGCnPaR6na', 'Nguyễn Văn Anh', '1@gmail.com', 'wallpaperflare.com_wallpaper.jpg', '1683113781560.jpg', '', 0, NULL, '2024-10-05 03:44:48', NULL),
(3, 'ad', '$2b$10$NBTTNa9MOyAZQt6/YtndguY6mQrORzi7uwOtuvhpEwM5tq5dxOWFm', 'Nguyễn Văn B', '2@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:44:56', NULL),
(4, 'ad2', '$2b$10$vw1T9Ddl1X7jqRJvJA3wm.7p5oSQ4qkCN19KQkloAx2uj4L4Lt5wG', 'Nguyễn Văn C', '12@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:45:23', NULL),
(5, 'ad4', '$2b$10$WsNJqdxiuCBUpd5jbHizoeJJLm9abJ2g6l0M87GpSqodPItvIdU12', 'Nguyễn Văn D', '4@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:45:40', NULL),
(6, 'ad5', '$2b$10$dQVwXfsHOERHI9pa3TACsudlxfVNZAcOQD0y3ilqGLR8L1hny4CK2', 'Nguyễn Văn E', '5@gmail.com', 'download.png', 'img1.jpg', '', 0, NULL, '2024-10-05 03:45:44', NULL),
(7, 'ad6', '$2b$10$QcIikO69naQ5MsIErzEtjOGRV6ktCCg0ZXQkfCR.Gs3jxG7WdH0t6', 'Nguyễn Văn F', '6@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:01', NULL),
(8, 'ad7', '$2b$10$YJ9Gc.obFqORe4D8F1Gl5OehaOzW1lEdIxcfG3ooVlKXa8r7L8RtS', 'Nguyễn Văn N', '7@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:06', NULL),
(9, 'ad8', '$2b$10$eJ.ptmbLSivpr2Ju82v9WOyxA52XHKp0o1E7TdpyardPEnqhoaoLC', 'Nguyễn Văn Q', '8@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:21', NULL),
(10, 'ad9', '$2b$10$nodIFS04riU/rqkYCCaM5ezACyhRm/Skn8MBM4pPuJLgGmxGX7jpa', 'Nguyễn Văn Y', '9@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:25', NULL),
(11, 'ad10', '$2b$10$5HxruG7naDsfY9vAGS560eTsderp.xztjFB74YkqPeDgwsGNZzT8a', 'Nguyễn Văn U', '10@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:31', NULL),
(12, 'ad11', '$2b$10$8ujnU/4iLnr4dxRl2R4Qs.SubQZKzmPAxwleomDRZcuA1/JP8Ya4S', 'Nguyễn Văn P', '11@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:35', NULL),
(13, 'ad12', '$2b$10$TkW96GyRTUA4jg4YNCIMhOSuDnd3jf171mtRq63r9nqYO07fKTG8m', 'Nguyễn Văn P', '125@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 03:46:44', NULL),
(14, 'hiendz', '$2b$10$RKDf26p2ctDhCrV7wSHHYuM.g9x9gVH86a9/hWUaOnpMb3b8CDANa', 'Hiến dz nhất ', 'hiendz@gmail.com', NULL, '', '', 0, NULL, '2024-10-05 12:03:48', NULL),
(15, 'hoài', '$2b$10$EKKEBGEd9KgR6YJNtwGRj.0iNPvvZew6CXNIpW5rY1/8Mz5Kn.KOS', 'Nguyễn Hàm Hoài', 'hamhoai2006@gamil.com', NULL, '', '', 0, NULL, '2024-10-07 13:10:14', NULL),
(16, 'hienkoii', '$2b$10$HVucXXZrNOOb0T185OIp0eLBHfWMyqb2OQps4igfSnihLpmA/NJDa', 'Hiến Kòii', 'hienkoii@gmail.com', NULL, '', '', 0, NULL, '2024-10-10 09:12:09', NULL);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Chỉ mục cho bảng `comment_reactions`
--
ALTER TABLE `comment_reactions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `comment_id` (`comment_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user1_id` (`user1_id`,`user2_id`),
  ADD KEY `user2_id` (`user2_id`);

--
-- Chỉ mục cho bảng `conversation_messages`
--
ALTER TABLE `conversation_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversation_id` (`conversation_id`),
  ADD KEY `sender_id` (`sender_id`);

--
-- Chỉ mục cho bảng `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`friend_id`),
  ADD KEY `friend_id` (`friend_id`);

--
-- Chỉ mục cho bảng `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sender_id` (`sender_id`,`receiver_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Chỉ mục cho bảng `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `actor_id` (`actor_id`),
  ADD KEY `post_id` (`post_id`);

--
-- Chỉ mục cho bảng `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`email`);

--
-- Chỉ mục cho bảng `posts`
--
ALTER TABLE `posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `reactions`
--
ALTER TABLE `reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `post_id` (`post_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `comment_reactions`
--
ALTER TABLE `comment_reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT cho bảng `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `conversation_messages`
--
ALTER TABLE `conversation_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `friends`
--
ALTER TABLE `friends`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT cho bảng `friend_requests`
--
ALTER TABLE `friend_requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT cho bảng `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT cho bảng `posts`
--
ALTER TABLE `posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=277;

--
-- AUTO_INCREMENT cho bảng `reactions`
--
ALTER TABLE `reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`),
  ADD CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `comments_ibfk_3` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `comment_reactions`
--
ALTER TABLE `comment_reactions`
  ADD CONSTRAINT `comment_reactions_ibfk_1` FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `comment_reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `conversation_messages`
--
ALTER TABLE `conversation_messages`
  ADD CONSTRAINT `conversation_messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversation_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `friends`
--
ALTER TABLE `friends`
  ADD CONSTRAINT `friends_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friends_ibfk_2` FOREIGN KEY (`friend_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `friend_requests`
--
ALTER TABLE `friend_requests`
  ADD CONSTRAINT `friend_requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `friend_requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`actor_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `posts`
--
ALTER TABLE `posts`
  ADD CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `reactions`
--
ALTER TABLE `reactions`
  ADD CONSTRAINT `reactions_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reactions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
