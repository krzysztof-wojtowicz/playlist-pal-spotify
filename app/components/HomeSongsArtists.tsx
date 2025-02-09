"use client";
// next imports
import Image from "next/image";

// react imports
import { useState, useEffect } from "react";

// fonts
import { cousine } from "../layout";

// context
import { useAuthContext } from "../hooks/useAuthContext";

// gsap
import gsap from "gsap";

// components
import PrivacyPolicy from "./PrivacyPolicy";

type Props = {
  handleFormWindow: Function;
  handleUserList: Function;
};

export default function HomeSongsArtists({
  handleFormWindow,
  handleUserList,
}: Props) {
  const [list, setList] = useState<any[]>([]);
  const [query, setQuery] = useState<string>("");
  const [resList, setResList] = useState<any[]>([]);

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [blank, setBlank] = useState<number>(4);

  const { state } = useAuthContext();
  const { accessToken } = state;

  function getValuesForKey(arr: any[], key: string) {
    let temp = arr.map((obj) => obj[key]);

    let artistString: string = "";

    for (let artist of temp) {
      artistString += artist + ",";
    }

    return artistString.slice(0, -1);
  }

  const handleSearch = async (e: any) => {
    e.preventDefault();

    if (!query) {
      setError("please write something...");
    } else {
      try {
        setIsLoading(true);
        setError("");

        const json = await fetch(
          `https://api.spotify.com/v1/search?q=${query}&type=artist,track&limit=3`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const response = await json.json();

        if (response.error) {
          setError("An error occurred. Please try again later. :((");
        } else {
          let tempList = [];

          for (const track of response.tracks.items) {
            let id = track.id;
            let artists = getValuesForKey(track.artists, "name");
            let uri = track.uri;
            let name = track.name;
            let type = track.type;
            let image =
              track.album.images.length > 0 ? track.album.images[0].url : null;
            let url = track.external_urls.spotify;

            tempList.push({
              name,
              artists,
              uri,
              id,
              type,
              image,
              url,
            });
          }

          for (const artist of response.artists.items) {
            let id = artist.id;
            let image = artist.images.length > 0 ? artist.images[0].url : null;
            let name = artist.name;
            let type = artist.type;
            let uri = artist.uri;
            let url = artist.external_urls.spotify;

            tempList.push({ name, uri, id, type, image, url });
          }

          setResList(tempList);
        }

        setQuery("");
        setIsLoading(false);
      } catch (err) {
        // Handle the error here
        console.error("An error occurred:", err);
        setError("An error occurred. Please try again later. :((");
        setIsLoading(false);
      }
    }
  };

  const handleAdd = async (e: any, element: any, id: number) => {
    e.preventDefault();

    setError("");

    if (list.length < 4) {
      if (!list.includes(element)) {
        setList((prev) => [...prev, element]);

        gsap.to(`#element-${id}`, {
          scale: 1.1,
          duration: 0.1,
          ease: "power2",
        });
        gsap.to(`#element-${id}`, {
          scale: 1,
          duration: 0.1,
          delay: 0.1,
        });
      } else {
        setError("You already added this element!");
      }
    } else {
      setError("You can add only 4 tracks/artists!");
    }
  };

  const handleDel = async (e: any, element: any) => {
    e.preventDefault();

    setList((prev) => prev.filter((item) => item !== element));
  };

  const handleGenerate = async (e: any) => {
    e.preventDefault();

    handleUserList(list);

    gsap.to("#page", {
      scale: 10,
      opacity: 0,
      duration: 0.5,
      onComplete() {
        handleFormWindow(3);
      },
    });
  };

  // button hover animation
  var buttonTl = gsap.timeline({ paused: true });

  // initial page anim
  useEffect(() => {
    gsap.fromTo("#page", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1 });

    buttonTl.to("#start", {
      text: "click me!",
      duration: 0.7,
      ease: "none",
    });
  }, []);

  // res list anim
  useEffect(() => {
    if (resList.length > 0) {
      var listTl = gsap.timeline({});

      listTl.fromTo(
        ".res-list-title",
        { opacity: 0 },
        { opacity: 1, duration: 0.2 }
      );
      listTl.fromTo(
        ".res-list-item",
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 0.2, stagger: 0.1 }
      );
    }
  }, [resList]);

  const btnEnter = () => {
    if (list.length > 0) {
      buttonTl.play();
    }
  };

  const btnLeave = () => {
    if (list.length > 0) {
      buttonTl.reverse();
    }
  };

  useEffect(() => {
    if (error) {
      gsap.fromTo(
        "#error",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, ease: "back" }
      );
    }
  }, [error]);

  useEffect(() => {
    if (list.length >= 0) {
      setBlank(4 - list.length);
    }
  }, [list]);

  const generateBlanks = (blank: number) => {
    let blanks = [];

    for (let i = 0; i < blank; i++) {
      blanks.push(
        <div key={i} className="bg-secondary w-full aspect-[6/1] h-full"></div>
      );
    }

    return blanks;
  };

  return (
    <div className="w-full flex flex-col items-center py-6 opacity-0" id="page">
      <div className="px-10">
        <Image
          src="/images/spotify-logo-green.png"
          height={90}
          width={300}
          alt="spotify full logo"
        />
      </div>

      <div className={cousine.className}>
        <div className="text-xl lg:text-4xl mt-6 px-10 lg:px-0 text-center">
          Choose your{" "}
          <span className="text-primary underline font-bold">favourite</span>{" "}
          songs and artists
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center w-full">
        <form onSubmit={(e) => handleSearch(e)} className="flex flex-col gap-6">
          <span className="text-center">Search for songs and/or artists</span>
          <div className="flex gap-8 lg:gap-10 lg:flex-row flex-col items-center">
            <input
              type="text"
              className="input-field h-[45px]"
              placeholder="title/name"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
            <button
              className="btn-primary h-[45px] w-[125px] lg:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "loading..." : "search"}
            </button>
          </div>
          <div className="relative">
            {error && (
              <div
                className="text-sm text-accent text-center opacity-0 absolute"
                id="error"
              >
                {error}
              </div>
            )}
          </div>
        </form>

        {/* PRINT RESULTS */}
        {resList.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 mt-4 w-full px-6 md:px-12 lg:px-20">
            {/* tracks */}
            <div className="flex flex-col gap-4">
              <div className="text-center font-bold opacity-0 res-list-title">
                Tracks
              </div>
              {resList
                .filter((item) => item.type === "track")
                .map((element, index) => (
                  <div
                    key={index}
                    className="res-list-item opacity-0 p-3 bg-secondary flex items-center justify-between"
                    id={`element-${index}`}
                  >
                    <div className="flex gap-4 items-center">
                      {element.image && (
                        <Image
                          src={element.image}
                          height={75}
                          width={75}
                          alt={`${element.name}' album cover`}
                        />
                      )}
                      {!element.image && (
                        <div className="w-[75px] aspect-square bg-accent"></div>
                      )}
                      <div className="flex flex-col items-start">
                        <a
                          className="hover:underline"
                          href={element.url}
                          target="_blank"
                        >
                          {element.name}
                        </a>
                        <span className="text-sm text-accent">
                          {element.artists}
                        </span>
                      </div>
                    </div>

                    <div className="flex pe-6">
                      <button
                        className="bg-accent text-text hover:bg-primary hover:text-secondary rounded-full px-2 py-1"
                        onClick={(e) => {
                          handleAdd(e, element, index);
                        }}
                      >
                        add
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* artists */}
            <div className="flex flex-col gap-4">
              <div className="text-center font-bold opacity-0 res-list-title mt-6 lg:mt-0">
                Artists
              </div>
              {resList
                .filter((item) => item.type === "artist")
                .map((element, index) => (
                  <div
                    key={index}
                    className="res-list-item opacity-0 p-3 bg-secondary flex items-center justify-between"
                    id={`element-${index + 3}`}
                  >
                    <div className="flex gap-4 items-center">
                      {element.image && (
                        <Image
                          src={element.image}
                          height={75}
                          width={75}
                          alt={`${element.name}' profile picture`}
                          className="aspect-square object-cover rounded-full"
                        />
                      )}
                      {!element.image && (
                        <div className="w-[75px] aspect-square bg-accent rounded-full"></div>
                      )}
                      <div className="flex flex-col items-start">
                        <a
                          className="hover:underline"
                          href={element.url}
                          target="_blank"
                        >
                          {element.name}
                        </a>
                      </div>
                    </div>

                    <div className="flex pe-6">
                      <button
                        className="bg-accent text-text hover:bg-primary hover:text-secondary rounded-full px-2 py-1"
                        onClick={(e) => {
                          handleAdd(e, element, index + 3);
                        }}
                      >
                        add
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={
          resList.length > 0
            ? "flex flex-col gap-8 mt-6"
            : "flex flex-col gap-8 mt-20"
        }
      >
        <div className="flex flex-col gap-4 items-center">
          <div className="text-center text-lg">
            Your choices {list.length}/4
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-4 gap-x-16 w-screen px-6 md:px-12 lg:px-60 h-[400px] lg:h-[200px]">
            {list.length > 0 &&
              list.map((element, index) => (
                <div
                  key={index}
                  className="p-3 bg-secondary flex items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    {element.image && (
                      <Image
                        src={element.image}
                        height={75}
                        width={75}
                        alt={
                          element.type === "track"
                            ? `${element.name}' album cover`
                            : `${element.name}' profile picture`
                        }
                        className={
                          element.type === "track"
                            ? ""
                            : "aspect-square object-cover rounded-full"
                        }
                      />
                    )}
                    {!element.image && (
                      <div className="w-[75px] aspect-square bg-accent"></div>
                    )}
                    <div className="flex flex-col items-start">
                      <a
                        className="hover:underline"
                        href={element.url}
                        target="_blank"
                      >
                        {element.name}
                      </a>
                      {element.type === "track" && (
                        <span className="text-sm text-accent">
                          {element.artists}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="ms-4">
                    <button
                      className="bg-accent text-text hover:bg-primary hover:text-secondary rounded-full px-2 py-1"
                      onClick={(e) => {
                        handleDel(e, element);
                      }}
                    >
                      del
                    </button>
                  </div>
                </div>
              ))}
            {blank > 0 && generateBlanks(blank)}
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            className={list.length > 0 ? "btn-primary" : "btn-secondary"}
            onClick={(e) => {
              handleGenerate(e);
            }}
            disabled={!(list.length > 0)}
            onMouseEnter={btnEnter}
            onMouseLeave={btnLeave}
            id="start"
          >
            generate
          </button>
        </div>

        <div className="text-sm text-accent text-center px-6">
          you need to select 1-4 songs and/or artists
        </div>

        {/* FOOTER */}
        <div className="mt-16 text-primary w-full flex flex-col gap-10 justify-center items-center text-xs pb-8 px-6 text-center footer">
          <div className="">PlaylistPal made by Krzysztof Wójtowicz</div>
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
}
