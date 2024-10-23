"use client";
import ImagesAvatar from "@/src/components/Images/ImagesAvatar";
import { useNotifications } from "@/src/context/NotificationsContext";
import { getIconTypeNotifications, getNotificationIcon, timeAgo } from "@/src/utils";
import React, { useEffect } from "react";
import { ListGroup, Badge } from "react-bootstrap";

export default function NotificationPage() {
  const { notifications, markAllNotificationsAsRead } = useNotifications();

  useEffect(() => {
    markAllNotificationsAsRead();
  }, [notifications]);

  return (
    <div className="mb-4 mt-2">
      <h5>Thông báo</h5>
      <ListGroup>
        {notifications.map((notification) => (
          <ListGroup.Item
            key={notification.id} //
            className={`d-flex justify-content-between align-items-center ${notification.is_read ? "" : "bg-light"}`}
          >
            <div className="d-flex align-items-center">
              <div style={{ position: "relative" }}>
                <ImagesAvatar id={notification.actor_id} url={notification.actor_avatar} isCircle />
                <div style={{ position: "absolute", right: "0px", bottom: "0px" }}>{getIconTypeNotifications(notification.type)}</div>
              </div>
              <div className="ms-2">
                <div>
                  <strong>{notification.actor_name}</strong> {notification.content}
                </div>
                <small className="text-muted">{timeAgo(notification.created_at)}</small>
              </div>
            </div>
            <div className="ms-auto">
              {getNotificationIcon(notification.type)}
              {!notification.is_read && (
                <Badge bg="danger" pill className="ms-2">
                  New
                </Badge>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}
