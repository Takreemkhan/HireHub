import type { StatCard } from "../../types/admin.types";

interface Props extends StatCard {}

export default function StatCard({ label, value, accent, gradient }: Props) {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-xl p-4 border border-white/5`}
    >
      <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
        {label}
      </p>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}