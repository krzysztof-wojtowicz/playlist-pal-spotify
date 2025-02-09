"use client";

import { useEffect } from "react";

import gsap from "gsap";

export default function LoadingState() {
  useEffect(() => {
    var tl = gsap.timeline({ repeat: -1 });

    // dots appearing
    tl.fromTo("#first-dot", { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo("#second-dot", { opacity: 0 }, { opacity: 1, duration: 0.3 });
    tl.fromTo("#third-dot", { opacity: 0 }, { opacity: 1, duration: 0.3 });

    // dots disappearing
    tl.to("#first-dot", { opacity: 0, duration: 0.3 });
    tl.to("#second-dot", { opacity: 0, duration: 0.3 });
    tl.to("#third-dot", { opacity: 0, duration: 0.3 });
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <div className="text-8xl flex gap-2">
        <span id="first-dot" className="opacity-0">
          .
        </span>
        <span id="second-dot" className="opacity-0">
          .
        </span>
        <span id="third-dot" className="opacity-0">
          .
        </span>
      </div>
    </div>
  );
}
