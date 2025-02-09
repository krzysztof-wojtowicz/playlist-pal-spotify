// react imports
import { useState } from "react";

// next imports
import { useRouter } from "next/navigation";

import { useAuthContext } from "./useAuthContext";
import { setLocalStorageItemWithExpiry } from "../utils/localStorage";

export const useLogin = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();
  const router = useRouter();

  const login = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // stored in the previous step
      let verifier = localStorage.getItem("code_verifier");
      let codeVerifier = verifier ? verifier : "";

      const clientId = `${process.env.NEXT_PUBLIC_SPOTIFY_SECRET}`;
      //const redirectUri = "http://localhost:3000/auth"; // local
      const redirectUri = "https://playlist-pal.vercel.app/auth"; // prod

      const url = new URL("https://accounts.spotify.com/api/token");

      const payload = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: clientId,
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
          code_verifier: codeVerifier,
        }),
      };

      const body = await fetch(url, payload);
      const response = await body.json();

      if (response.access_token) {
        setLocalStorageItemWithExpiry(
          "accessToken",
          response.access_token,
          response.expires_in * 1000
        );

        localStorage.setItem("refreshToken", response.refresh_token);

        dispatch({ type: "LOGIN", payload: response.access_token });

        router.push("/");
      }

      if (!response.access_token) {
        setError("An error occurred. Please try again later. :((");
      }
      setIsLoading(false);
    } catch (err) {
      // Handle the error here
      console.error("An error occurred:", err);
      setError("An error occurred. Please try again later. :((");
      setIsLoading(false);
    }
  };

  return { login, error, isLoading };
};
