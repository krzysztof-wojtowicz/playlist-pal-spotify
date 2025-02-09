"use client";

// react imports
import { useEffect } from "react";

// next imports
import Image from "next/image";

// fonts
import { cousine } from "../layout";

// gsap
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// components
import PrivacyPolicy from "./PrivacyPolicy";

type Props = {
  handleFormWindow: Function;
};

export default function HomeStart({ handleFormWindow }: Props) {
  const handleButton = (e: any) => {
    e.preventDefault();

    gsap.to("#page", {
      scale: 10,
      opacity: 0,
      duration: 0.5,
      onComplete() {
        handleFormWindow(2);
      },
    });
  };

  // button hover animation
  var buttonTl = gsap.timeline({ paused: true });

  // initial animations
  useEffect(() => {
    gsap.registerPlugin(TextPlugin);

    var tl = gsap.timeline({ delay: 0.7 });

    // add button anim
    buttonTl.to("#start", { text: "click me!", duration: 0.7, ease: "none" });

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
    tl.fromTo("#welcome-text", { opacity: 0 }, { opacity: 1, duration: 0.4 });
    tl.fromTo(
      "#start",
      { opacity: 0, scale: 0.5 },
      { opacity: 1, duration: 0.5, scale: 1, ease: "back" }
    );
    tl.fromTo(".footer", { opacity: 0 }, { opacity: 1, duration: 0.4 });
  }, []);

  const btnEnter = () => {
    buttonTl.play();
  };

  const btnLeave = () => {
    buttonTl.reverse();
  };

  return (
    <div className="w-full flex flex-col items-center py-8 lg:py-16" id="page">
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

      <div className="pt-4 lg:pt-12 flex flex-col items-center gap-16 lg:gap-10 px-10 lg:px-0">
        <div className="opacity-0" id="welcome-text">
          Now, that you&apos;re logged, we can start creating your playlist!
        </div>
        <button
          id="start"
          className="btn-primary opacity-0"
          onClick={(e) => {
            handleButton(e);
          }}
          onMouseEnter={btnEnter}
          onMouseLeave={btnLeave}
        >
          start creating
        </button>
        {/* FOOTER */}
        <div className="mt-16 text-primary w-full flex flex-col gap-10 justify-center items-center text-xs pb-8 opacity-0 px-6 text-center footer">
          <div className="">PlaylistPal made by Krzysztof Wójtowicz</div>
          <PrivacyPolicy />
        </div>
      </div>
    </div>
  );
}
