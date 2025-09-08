import React from "react";

interface CustomAvatarProps {
  name: string;
  src?: string;
}

const Avatar: React.FC<CustomAvatarProps> = ({ name, src }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function onError(e: React.SyntheticEvent<HTMLImageElement, Event>): void {
    e.currentTarget.style.display = "none";
  }

  return (
    <div className="relative flex items-center justify-center w-10 h-10 rounded-full zama-bg text-black font-bold">
      {src ? (
        <img
          src={src}
          alt={name}
          className="w-full h-full rounded-full object-cover"
          onError={onError}
        />
      ) : (
        initials
      )}
    </div>
  );
};

export default Avatar;
