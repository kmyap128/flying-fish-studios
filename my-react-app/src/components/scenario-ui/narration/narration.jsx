import React, { useRef } from "react";

export function NarrationPlayer({ url }) {
  const audioRef = useRef(null);
  let narDuration;

  const handleLoadedMetadata = () => {
    narDuration = url && audioRef.current ? audioRef.current.duration : null;
  };

  return (
    <audio
      ref={audioRef}
      onLoadedMetadata={handleLoadedMetadata}
      src={url}
    ></audio>
  );
}
