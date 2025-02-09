"use client";

import { ReactNode } from "react";

import { AuthContextProvider } from "../context/AuthContext";

type ProvidersProps = {
  children: ReactNode;
};

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <AuthContextProvider>{children}</AuthContextProvider>;
};
