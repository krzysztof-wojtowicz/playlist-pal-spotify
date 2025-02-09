// react imports
import { useState } from "react";

const generateRandomString = (length: number) => {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], "");
};

const sha256 = async (plain: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};

const base64encode = (input: ArrayBuffer) => {
  const uint8Array = new Uint8Array(input);
  const charArray = new Array(uint8Array.length);

  for (let i = 0; i < uint8Array.length; i++) {
    charArray[i] = String.fromCharCode(uint8Array[i]);
  }

  return btoa(charArray.join(""))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
};

export const useAuthReq = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const authReq = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const codeVerifier = generateRandomString(64);
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);

      const clientId = `${process.env.NEXT_PUBLIC_SPOTIFY_SECRET}`;
      //const redirectUri = "http://localhost:3000/auth"; // local
      const redirectUri = "https://playlist-pal.vercel.app/auth"; // prod

      const scope = "ugc-image-upload playlist-modify-public user-read-private";
      const authUrl = new URL("https://accounts.spotify.com/authorize");

      // generated in the previous step
      window.localStorage.setItem("code_verifier", codeVerifier);

      const params = {
        response_type: "code",
        client_id: clientId,
        scope,
        code_challenge_method: "S256",
        code_challenge: codeChallenge,
        redirect_uri: redirectUri,
      };

      authUrl.search = new URLSearchParams(params).toString();
      window.location.href = authUrl.toString();
    } catch (err) {
      // Handle the error here
      console.error("An error occurred:", err);
      setError("An error occurred. Please try again later. :((");
    }
  };

  return { authReq, error, isLoading };
};
