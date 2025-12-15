export default function InternTable({ internships }) {
  const cycleStyles = {
    Spring: "bg-green-400/20 text-green-300",
    Summer: "bg-yellow-400/20 text-yellow-300",
    Fall: "bg-orange-400/20 text-orange-300",
    Winter: "bg-blue-400/20 text-blue-300",
    SixMonth: "bg-purple-400/20 text-purple-300",
  };

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-6 border-b border-gray-700">
        <h2 className="text-2xl font-semibold tracking-wide text-gray-200">
          Internships
        </h2>
        <p className="text-lg text-gray-400">
          Track and manage your applications
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-700/50 text-gray-300 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-3 text-left text-sm">Company</th>
              <th className="px-6 py-3 text-left text-sm">Role</th>
              <th className="px-6 py-3 text-left text-sm">Cycle</th>
              <th className="px-6 py-3 text-left text-sm">Date Applied</th>
              <th className="px-6 py-3 text-left text-sm">Status</th>
              <th className="px-6 py-3 text-left text-sm">Notes</th>
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
                <td className="px-6 py-4 text-gray-300">{intern.company}</td>
                <td className="px-6 py-4 text-gray-300">{intern.role}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-md ${cycleStyles[intern.cycle] || "bg-gray-600/30 text-gray-300"}`}>
                    {intern.cycle === "SixMonth" ? "6-Month" : intern.cycle}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {new Date(intern.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-400/20 text-blue-400">
                    {intern.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-300">
                  {intern.notes || "-"}
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
          <button className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            Prev
          </button>
          <button className="px-3 py-1 rounded-md bg-gray-700 hover:bg-gray-600">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
