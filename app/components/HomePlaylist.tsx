"use client";
// next imports
import Image from "next/image";

// fonts
import { cousine } from "../layout";

// react imports
import { useEffect } from "react";

// gsap
import gsap from "gsap";

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

type Props = {
  playlistData: PlaylistData | undefined;
};

export default function HomePlaylist({ playlistData }: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });

    var tl = gsap.timeline({});

    tl.fromTo(
      "#playlist-info",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 1 }
    );
    tl.fromTo(
      "#explore-spotify",
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 1, ease: "back" }
    );
    tl.fromTo("#want-more", { opacity: 0 }, { opacity: 1, duration: 0.8 });
    tl.fromTo(
      ".playlist-item",
      { opacity: 0, x: -100 },
      { opacity: 1, x: 0, duration: 0.3, stagger: 0.3 },
      "-=1.0"
    );
  }, []);

  return (
    <div className="w-full flex flex-col py-6 lg:py-16 gap-6 px-8 md:px-12 lg:px-20">
      <div
        className="flex flex-col lg:flex-row text-center lg:text-start items-center gap-4 justify-center opacity-0"
        id="explore-spotify"
      >
        <div className={cousine.className}>
          <span className="text-3xl font-bold">
            Explore your new playlist on
          </span>
        </div>
        <a
          className="bg-primary px-4 py-3 shadow-[9px_9px_0px_0px_rgba(23,55,33,1)]"
          target="_blank"
          href={playlistData?.playlistInfo.url}
        >
          <Image
            src="/images/spotify-logo-white.png"
            width={100}
            height={30}
            alt="spotify logo white"
          />
        </a>
      </div>

      <div className="text-sm text-accent text-center opacity-0" id="want-more">
        You want more? Just refresh this page.
      </div>

      {/* PLAYLIST INFO */}
      <div
        className="flex flex-col lg:flex-row items-center gap-4 opacity-0"
        id="playlist-info"
      >
        {/* playlist cover */}
        <div className="aspect-square w-[150px] h-[150px] object-cover relative">
          <Image
            src="/images/PlaylistCover.jpg"
            alt="PlaylistPal playlist cover"
            className="object-cover"
            fill={true}
          />
        </div>

        <div className="flex flex-col gap-4 lg:gap-2 px-6 lg:px-auto">
          {/* playlist title */}
          <div className={cousine.className}>
            <div className="text-xl lg:text-2xl font-bold">
              {playlistData?.playlistInfo.name}
            </div>
          </div>

          <Image
            src="/images/spotify-logo-green.png"
            width={200}
            height={60}
            alt="spotify logo green"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {playlistData?.trackList.map((track, index) => (
          <div
            key={index}
            className="bg-secondary p-3 flex gap-4 items-center playlist-item opacity-0 overflow-hidden"
          >
            {track.image && (
              <Image
                src={track.image}
                width={75}
                height={75}
                alt={`${track.name}'s album cover`}
              />
            )}
            {!track.image && (
              <div className="w-[75px] aspect-square bg-secondary"></div>
            )}

            <div className="flex flex-col gap-2">
              <a
                className="hover:underline test-lg"
                href={track.url}
                target="_blank"
              >
                {track.name}
              </a>
              <div className="text-accent">{track.artists}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
