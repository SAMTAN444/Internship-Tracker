import { useState } from "react";
import { FileText } from "lucide-react";

export default function InternTable({ internships }) {
  const cycleStyles = {
    Spring: "bg-green-500/15 text-green-300",
    Summer: "bg-yellow-500/15 text-yellow-300",
    Fall: "bg-orange-500/15 text-orange-300",
    Winter: "bg-blue-500/15 text-blue-300",
    "6-Month": "bg-purple-500/15 text-purple-300",
  };

  const [selectedNotes, setSelectedNotes] = useState(null);

  return (
    <div className="bg-gray-900/60 backdrop-blur border border-gray-700/60 rounded-xl shadow-lg">
      {/* Table Header */}
      <div className="px-6 py-6 border-b border-gray-700/60 bg-gray-800/60">
        <h2 className="text-3xl font-semibold tracking-wide">
          Internships
        </h2>
        <p className="text-xl text-gray-400">
          Track and manage your applications
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-base">
          <thead className="bg-gray-800/80 text-gray-300 uppercase tracking-wider text-sm">
            <tr className="odd:bg-gray-800/40 even:bg-transparent hover:bg-gray-700/40 transition">
              <th className="px-6 py-4 text-left text-sm">Company</th>
              <th className="px-6 py-4 text-left text-sm">Role</th>
              <th className="px-6 py-4 text-left text-sm">Cycle</th>
              <th className="px-6 py-4 text-left text-sm">Date Applied</th>
              <th className="px-6 py-4 text-left text-sm">Status</th>
              <th className="px-6 py-4 text-left text-sm">Notes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {internships.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-6 text-center text-gray-400">
                  No internships yet
                </td>
              </tr>
            )}

            {internships.map((intern) => (
              <tr key={intern._id} className="hover:bg-gray-700/40 transition">
                <td className="px-6 py-5 text-gray-100 font-semibold text-lg">{intern.company}</td>
                <td className="px-6 py-5 text-gray-300 text-base">{intern.role}</td>
                <td className="px-6 py-5">
                  <span
                    className={`px-3 py-1.5 text-sm font-medium rounded-md ${
                      cycleStyles[intern.cycle] ||
                      "bg-gray-600/30 text-gray-300"
                    }`}
                  >
                    {intern.cycle.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(intern.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1.5 text-sm rounded-full bg-blue-500/15 text-blue-300 font-medium">
                    {intern.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {intern.notes ? (
                    <button
                      onClick={() => setSelectedNotes(intern)}
                      className="p-2 rounded-md hover:bgg-gray-700/50 text-gray-400 hover:text-gray-200 transition"
                      title="View Notes"
                    >
                      <FileText size={20} />
                    </button>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between text-sm text-gray-400">
        <span>Showing 1-2 of 50</span>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-sm">
            Prev
          </button>
          <button className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-sm">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
