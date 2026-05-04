import type { TableColumn } from "../../types/admin.types";

interface Props<T> {
  columns: TableColumn<T>[];
  rows: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  rows,
  keyExtractor,
  emptyMessage = "No data found",
}: Props<T>) {
  return (
    <div className="overflow-x-auto bg-white">
      <table className="w-full text-sm text-black">
        <thead>
          <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest border-b border-gray-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left px-5 py-3 font-semibold ${col.className ?? ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white">
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-12 text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-gray-100 hover:bg-gray-50 transition group"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-3.5 text-black ${col.className ?? ""}`}
                  >
                    {col.render(row, idx)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}