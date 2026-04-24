import { STATUS_CONFIG } from "../../constants/admin.constants";
import type { DocumentStatus } from "../../types/admin.types";

interface Props {
  status: DocumentStatus;
}

export default function StatusBadge({ status }: Props) {
  const { icon: Icon, color, bg } = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 ${bg} ${color} rounded-full px-2.5 py-0.5 text-xs font-medium`}
    >
      <Icon className="text-xs shrink-0" />
      {status}
    </span>
  );
}