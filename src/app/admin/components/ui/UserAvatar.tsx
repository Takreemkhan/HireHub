import { AVATAR_COLORS } from "../../constants/admin.constants";

interface Props {
  /** Single character shown inside the circle */
  letter: string;
  /** Used to consistently pick a color from the palette */
  colorIndex: number;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-6 w-6 text-xs",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
};

export default function UserAvatar({ letter, colorIndex, size = "md" }: Props) {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];
  return (
    <div
      className={`${SIZE_MAP[size]} ${color} rounded-full flex items-center justify-center font-bold shrink-0`}
    >
      {letter}
    </div>
  );
}