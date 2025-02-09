"use client";

// react imports
import { useEffect } from "react";

// next imports
import Image from "next/image";

// headline font
import { cousine } from "../layout";

// hooks
import { useAuthReq } from "../hooks/useAuthReq";

// gsap
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// components
import PrivacyPolicy from "./PrivacyPolicy";

export default function LoginFront() {
  const { authReq, error, isLoading } = useAuthReq();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    authReq();
  };

  // button hover animation
  var buttonTl = gsap.timeline({ paused: true });

  // initial animations
  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    var tl = gsap.timeline({ delay: 0.7 });

    // add button anim
    buttonTl.to("#start", {
      text: "    click me!    ",
      duration: 0.7,
      ease: "none",
    });

    tl.fromTo(
      "#discover",
      { opacity: 1 },
      { duration: 0.7, text: "Discover", ease: "none" }
    );
    tl.fromTo(
      "#new",
      { opacity: 1 },
      { duration: 0.3, text: "new", ease: "none" }
    );
    tl.fromTo(
      "#songs",
      { opacity: 1 },
      { duration: 0.4, text: "songs", ease: "none" }
    );
    tl.fromTo(
      "#on",
      { opacity: 1 },
      { duration: 0.2, text: "on", ease: "none" }
    );
    tl.fromTo(
      "#spotify",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, duration: 0.8, delay: 0.2, scale: 1, ease: "back" }
    );
    tl.fromTo("#welcome-text", { opacity: 0 }, { opacity: 1, duration: 0.8 });
    tl.fromTo(
      "#you-are",
      { opacity: 1 },
      { duration: 0.5, text: "you are in the", ease: "none" }
    );
    tl.fromTo(
      "#right",
      { opacity: 0, scale: 0.2 },
      { opacity: 1, scale: 1, ease: "back", duration: 0.7 }
    );
    tl.fromTo(
      "#place",
      { opacity: 1 },
      { duration: 0.4, text: "place!", ease: "none" }
    );
    tl.fromTo(
      "#start",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, duration: 0.8, scale: 1, ease: "back", delay: 0.2 }
    );
    tl.fromTo("#comment", { opacity: 0 }, { opacity: 1, duration: 0.8 });
    tl.fromTo(".footer", { opacity: 0 }, { opacity: 1, duration: 0.8 });
  }, []);

  const btnEnter = () => {
    buttonTl.play();
  };

  const btnLeave = () => {
    buttonTl.reverse();
  };

  return (
    <>
      {/* TEXT CONTENT */}
      <div className="w-full h-full flex flex-col items-center py-4 lg:py-16">
        {/* TITLE */}
        <div className="flex gap-4 items-center text-center z-20 scale-[0.6] lg:scale-[1.0]">
          <div className={cousine.className}>
            <div className="flex flex-col items-start gap-4">
              <div className="font-bold text-8xl opacity-0" id="discover"></div>{" "}
              <div className="text-6xl">
                <span className="text-accent opacity-0" id="new"></span>{" "}
                <span className="opacity-0" id="songs"></span>
              </div>
              <div className="flex gap-10 items-center font-bold text-7xl">
                <span className="opacity-0" id="on"></span>
                <Image
                  src="/images/spotify-logo-green.png"
                  width={300}
                  height={90}
                  alt="spotify logo green"
                  priority
                  id="spotify"
                  className="opacity-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* QUESTIONS */}
        <div className="lg:pt-12 flex flex-col gap-8 lg:gap-12 items-center z-20 px-10 lg:px-0 text-sm lg:text-base">
          <div
            className="flex flex-col gap-2 text-start opacity-0"
            id="welcome-text"
          >
            <span>
              You want to find{" "}
              <span className="text-accent">more tracks similiar</span> to your
              favourite song?
            </span>
            <span>
              You&apos;re bored with your{" "}
              <span className="text-accent">
                Spotify&apos;s recommendations
              </span>
              ?
            </span>
            <span>
              You want to <span className="text-accent">explore new songs</span>
              ?
            </span>
          </div>

          <div className="text-center">
            <div className={cousine.className}>
              <span className="text-2xl flex flex-col lg:flex-row gap-1 lg:gap-3">
                <span id="you-are" className="opacity-0"></span>
                <span className="text-primary font-bold opacity-0" id="right">
                  right
                </span>
                <span id="place" className="opacity-0"></span>
              </span>
            </div>
          </div>

          {/* LOG IN BUTTON */}
          <div className="justify-center flex flex-col items-center">
            <button
              id="start"
              className="btn-primary opacity-0"
              onClick={(e) => {
                handleLogin(e);
              }}
              onMouseEnter={btnEnter}
              onMouseLeave={btnLeave}
              disabled={isLoading}
            >
              {isLoading ? "loading..." : "log in with spotify"}
            </button>
            {error && <div className="pt-6 font-bold">{error}</div>}
          </div>

          {/* COMMENT */}
          <div className="mt-4 lg:mt-0 text-accent w-full flex justify-center">
            <div className="lg:w-1/2 text-center text-sm">
              <span className="opacity-0" id="comment">
                You are one step away from exploring personalized playlist made
                for you based on your songs & artists
              </span>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-16 text-primary w-full flex flex-col gap-10 justify-center items-center text-xs pb-8 opacity-0 px-6 text-center footer">
            <div className="">PlaylistPal made by Krzysztof Wójtowicz</div>
            <PrivacyPolicy />
          </div>
        </div>
      </div>
    </>
  );
}
