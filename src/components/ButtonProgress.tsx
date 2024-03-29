import { FC } from "react";

interface IButtonProgress {
  title: string | number;
  progress: number;
  onClick: () => void;
}

export const ButtonProgress: FC<IButtonProgress> = ({
  title,
  progress,
  onClick,
}) => {
  return (
    <button
      className={`outline-none relative border border-purple-200 m-2 rounded-full p-1 whitespace-nowrap overflow-auto ${
        progress > 0 ? "" : "opacity-50"
      }`}
      onClick={onClick}
    >
      <p className="mx-2 z-10 relative">{title}</p>
      <div
        className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-purple-200 to-blue-200"
        style={{ width: `${progress}%` }}
      ></div>
    </button>
  );
};
