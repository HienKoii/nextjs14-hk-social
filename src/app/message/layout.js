import { MessagesProvider } from "@/src/context/MessagesContext";
import React from "react";

export default function MessageLayout({ children }) {
  return <MessagesProvider>{children}</MessagesProvider>;
}
