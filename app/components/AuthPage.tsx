"use client";

// next imports
import { useSearchParams, useRouter } from "next/navigation";

// react imports
import { useEffect } from "react";

// hooks
import { useLogin } from "../hooks/useLogin";
import { useAuthContext } from "../hooks/useAuthContext";

// components
import LoadingState from "./LoadingState";

// gsap
import gsap from "gsap";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const authError = searchParams.get("error");

  const { state } = useAuthContext();
  const { accessToken } = state;

  const { login, error, isLoading } = useLogin();

  const router = useRouter();

  useEffect(() => {
    if (!authError && !isLoading && code && !accessToken) {
      login(code);
    } else if (authError) {
      console.log("An error occurred: " + authError);
    } else {
      router.push("/");
    }

    gsap.to("#auth-page", { opacity: 1, duration: 0.5, delay: 1 });
  }, []);

  return (
    <div className="w-full flex justify-center pt-12 opacity-0" id="auth-page">
      {authError && <div>{authError}</div>}
      {error && <div>{error}</div>}
      {isLoading && <LoadingState />}
    </div>
  );
}
