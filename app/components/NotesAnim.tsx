"use client";

// next imports
import Image from "next/image";

// react imports
import { useEffect, useState } from "react";

// gsap
import gsap from "gsap";

const generateNote = (color: string, size: number, noteClass: string) => {
  return (
    <Image
      src={`/svg/note-${color}.svg`}
      width={size}
      height={size}
      alt="music note"
      className={`${noteClass} absolute`}
    />
  );
};

export default function NotesAnim() {
  const [notes, setNotes] = useState<any[]>([]);

  // generate notes array
  useEffect(() => {
    const { innerHeight: height } = window;

    var note_size = height / 10;

    const note_primary = generateNote("primary", note_size, "note");
    const note_secondary = generateNote("secondary", note_size, "note");
    const note_accent = generateNote("accent", note_size, "note");
    const note_darker = generateNote("darker", note_size, "note");

    var temp: any[] = [];

    for (let i = 0; i < 10; i++) {
      let random = Math.floor(Math.random() * 4) + 1;
      if (random === 1) {
        temp.push(note_primary);
      } else if (random === 2) {
        temp.push(note_secondary);
      } else if (random === 3) {
        temp.push(note_darker);
      } else if (random === 4) {
        temp.push(note_accent);
      }
    }

    setNotes(temp);
  }, []);

  useEffect(() => {
    if (notes.length > 0) {
      const { innerHeight: height } = window;

      gsap.set(".note", {
        y: (i) => i * (height / 10),
      });

      const tl = gsap.timeline({});

      tl.fromTo(
        ".notes",
        { y: height },
        { y: -0.2 * height, duration: 8, ease: "none" }
      );

      tl.to(".note", {
        duration: 8,
        ease: "none",
        y: `-=${height}`,
        modifiers: {
          y: gsap.utils.unitize(gsap.utils.wrap(0, height)),
        },
        repeat: -1,
      });
    }
  }, [notes]);

  return (
    <div className="absolute overflow-hidden h-screen w-screen">
      <div className="mt-32 notes ms-20">
        {notes.map((note, index) => (
          <div key={index}>{note}</div>
        ))}
      </div>
    </div>
  );
}
