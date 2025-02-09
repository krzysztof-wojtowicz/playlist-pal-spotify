import React, { createContext, useReducer, useEffect, ReactNode } from "react";

import {
  getLocalStorageItemWithExpiry,
  setLocalStorageItemWithExpiry,
} from "../utils/localStorage";

type AccessToken = string | Promise<string>;

type Action =
  | { type: "LOGIN"; payload: AccessToken }
  | { type: "LOGOUT" }
  | { type: "UPDATE"; payload: AccessToken };

type State = {
  accessToken: AccessToken | null;
};

const getRefreshToken = async (refreshToken: string) => {
  const url = "https://accounts.spotify.com/api/token";
  const clientId = `${process.env.NEXT_PUBLIC_SPOTIFY_SECRET}`;

  const payload = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
    }),
  };

  try {
    const body = await fetch(url, payload);
    const response = await body.json();

    if (response.access_token) {
      setLocalStorageItemWithExpiry(
        "accessToken",
        response.access_token,
        response.expires_in * 1000
      );

      localStorage.setItem("refreshToken", response.refresh_token);
    }
  } catch (err) {
    console.error("An error occurred: " + err);
  }
};

export const AuthContext = createContext<
  { state: State; dispatch: React.Dispatch<Action> } | undefined
>(undefined);

export const authReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN":
      return { accessToken: action.payload };
    case "LOGOUT":
      return { accessToken: null };
    case "UPDATE":
      return { accessToken: action.payload };
    default:
      return state;
  }
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, { accessToken: null });

  // initial auth, looking for logged accessToken in local storage and checking if it is expired
  useEffect(() => {
    const tokenInit = async (storedRefreshToken: string) => {
      await getRefreshToken(storedRefreshToken);

      if (getLocalStorageItemWithExpiry("accessToken")) {
        dispatch({
          type: "LOGIN",
          payload: getLocalStorageItemWithExpiry("accessToken"),
        });
      }
    };

    const storedAccessToken = getLocalStorageItemWithExpiry("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken) {
      dispatch({ type: "LOGIN", payload: storedAccessToken });
    } else if (storedRefreshToken) {
      tokenInit(storedRefreshToken);
    } else {
      dispatch({ type: "LOGOUT" });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
