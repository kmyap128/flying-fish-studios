import React, { useRef, useEffect } from "react";

export function MusicPlayer({ url }) {
  const audioRef = useRef(null);
  if (audioRef.current) {
    audioRef.current.volume = 0.5;
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !url) return;

    audio.src = url;
    audio.load();
    audio.play().catch((err) => console.warn("Autoplay blocked", err));

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [url]);

  return <audio ref={audioRef} loop></audio>;
}
