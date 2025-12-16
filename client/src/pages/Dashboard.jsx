import { useEffect, useState } from "react";
import API from "../services/api";
import InternTable from "../components/InternTable";
import Form from "../components/Form";

export default function Dashboard() {
  const [internships, setInternships] = useState([]);

  useEffect(() => {
    API.get("/api/internships")
      .then((res) => setInternships(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load internships");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Top Bar */}
      <header className="px-13 py-6 border-b border-gray-800 bg-gray-700 rounded">
        <h1 className="text-2xl font-semibold tracking-wide">Dashboard</h1>
        <p className="text-m text-gray-400">Overview of your data</p>
      </header>
      {/* Form */}
        <Form />
      {/* Main Content */}
      <main className="flex-1 px-6 py-6 flex justify-center">
        <div className="w-full max-w-7xl">
          <InternTable internships={internships} />
        </div>
      </main>
    </div>
  );
}
