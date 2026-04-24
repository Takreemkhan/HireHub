import { ROLE_CONFIG } from "../../constants/admin.constants";
import type { UserRole } from "../../types/admin.types";

interface Props {
  role: UserRole;
}

export default function RoleBadge({ role }: Props) {
  const { bg, text, label } = ROLE_CONFIG[role];

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${bg} ${text}`}>
      {label}
    </span>
  );
}