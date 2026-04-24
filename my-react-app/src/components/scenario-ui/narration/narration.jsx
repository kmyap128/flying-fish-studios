import React, { useRef } from "react";
import { useEffect } from "react";

export function NarrationPlayer({ url }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || url) retur
  })

  return (
    <audio
      ref={audioRef}
      onLoadedMetadata={handleLoadedMetadata}
      src={url}
    ></audio>
  );
}
