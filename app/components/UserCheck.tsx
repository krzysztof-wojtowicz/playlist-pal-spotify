"use client";
// context
import { useAuthContext } from "../hooks/useAuthContext";

// react imports
import { useEffect } from "react";

// next imports
import { useRouter } from "next/navigation";

export default function UserCheck() {
  const { state } = useAuthContext();
  const { accessToken } = state;

  const router = useRouter();

  useEffect(() => {
    console.log(accessToken);
    if (!accessToken) {
      router.push("/login");
    } else {
      router.push("/");
    }
  }, []);

  return <></>;
}
