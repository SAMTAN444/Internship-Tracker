export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">

      {/* Top Bar */}
      <header className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-400">
          Overview of your data
        </p>
      </header>

      {/* Controls / Inputs area (empty for now) */}
      <section className="px-6 py-4 border-b border-gray-800">
        {/* Later: filters, add item form, search, etc */}
      </section>

      {/* Main Content */}
      <main className="flex-1 px-6 py-6 flex items-center justify-center">
        <div className="w-full max-w-6xl">
          {/* Components go here later */}
          <div className="rounded-lg border border-gray-800 bg-gray-800/50 p-8 text-center text-gray-400">
            Dashboard content coming soon
          </div>
        </div>
      </main>

    </div>
  );
}
