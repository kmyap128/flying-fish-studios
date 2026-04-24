import React, { useRef } from "react";
import { useEffect } from "react";

export function NarrationPlayer({ url }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || url) return;

    audio.src = url;
    audio.load();
    audio.play().catch((err) => console.warn("Autoplay blocked", err));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [url]);

  return <audio ref={audioRef}></audio>;
}
