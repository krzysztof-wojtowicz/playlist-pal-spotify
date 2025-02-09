"use client";

// context
import { useAuthContext } from "../hooks/useAuthContext";

// react imports
import { useEffect, useState } from "react";

// next imports
import { useRouter } from "next/navigation";

// components
import HomeStart from "./HomeStart";
import HomeSongsArtists from "./HomeSongsArtists";
import HomeCooking from "./HomeCooking";
import HomePlaylist from "./HomePlaylist";
import LoadingState from "./LoadingState";

type UserInfo = {
  country: string;
  display_name: string;
  id: string;
  image: string;
};

type PlaylistInfo = {
  name: string;
  description: string | null;
  id: string;
  url: string;
};

type PlaylistData = {
  userInfo: UserInfo;
  playlistInfo: PlaylistInfo;
  trackList: any[];
};

export default function HomePage() {
  // redirecting if not authorized
  const { state } = useAuthContext();
  const { accessToken } = state;

  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push("/login");
    }
  }, [accessToken]);

  // home page logic
  const [formWindow, setFormWindow] = useState<number>(1);
  const [userList, setUserList] = useState<any[]>([]);

  const [playlistData, setPlaylistData] = useState<PlaylistData | undefined>(
    undefined
  );

  const handleFormWindow = (value: number) => {
    setFormWindow(value);
  };

  const handleUserList = (value: any[]) => {
    setUserList(value);
  };

  const handlePlaylistData = (value: PlaylistData) => {
    setPlaylistData(value);
  };

  return (
    <>
      {!accessToken && <LoadingState />}
      {accessToken && (
        <>
          {formWindow === 1 && (
            <HomeStart handleFormWindow={handleFormWindow} />
          )}
          {formWindow === 2 && (
            <HomeSongsArtists
              handleFormWindow={handleFormWindow}
              handleUserList={handleUserList}
            />
          )}
          {formWindow === 3 && (
            <HomeCooking
              userList={userList}
              handleFormWindow={handleFormWindow}
              handlePlaylistData={handlePlaylistData}
            />
          )}
          {formWindow === 4 && <HomePlaylist playlistData={playlistData} />}
        </>
      )}
    </>
  );
}
