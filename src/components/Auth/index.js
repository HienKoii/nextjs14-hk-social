"use client";

import AuthLogin from "./AuthLogin";
import AuthDefault from "./AuthDefault";
import { isToken } from "@/src/utils";

export default function Auth({ onClick, isMobile }) {
  return <>{isToken() ? <AuthLogin isMobile={isMobile} /> : <AuthDefault onClick={onClick} isMobile={isMobile} />}</>;
}
