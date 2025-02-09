"use client";

// context
import { useAuthContext } from "../hooks/useAuthContext";

// react imports
import { useEffect } from "react";

// next imports
import { useRouter } from "next/navigation";

// components
import LoginFront from "./LoginFront";
import LoadingState from "./LoadingState";

export default function LoginPage() {
  const { state } = useAuthContext();
  const { accessToken } = state;

  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/");
    }
  }, [accessToken]);

  return (
    <>
      {accessToken && <LoadingState />}
      {!accessToken && <LoginFront />}
    </>
  );
}
