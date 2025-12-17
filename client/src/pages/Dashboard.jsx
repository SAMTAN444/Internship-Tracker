import { useEffect, useState } from "react";
import API from "../services/api";
import InternTable from "../components/InternTable";
import Form from "../components/Form";
import robotImage from "../assets/robotimage.png";
import EditInternshipModal from "../components/EditInternshipModal";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";

export default function Dashboard() {
  const [internships, setInternships] = useState([]);
  const [editing, setEditing] = useState(null);

  const addInternship = async (formData) => {
    try {
      const { data } = await API.post("/api/internships", {
        company: formData.company,
        role: formData.role,
        cycle: formData.cycle,
        status: "Applied",
        appliedAt: formData.appliedAt,
        applicationLink: formData.link,
        notes: formData.notes,
      });
      setInternships((prev) => [data, ...prev]);
      return true;
    } catch (err) {
      console.error(err);
      alert("Faield to add internship");
      return false;
    }
  };

  const deleteInternship = async (id) => {
    try {
      await API.delete(`/api/internships/${id}`);

      setInternships((prev) => prev.filter((intern) => intern._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete internship");
    }
  };

  useEffect(() => {
    API.get("/api/internships")
      .then((res) => setInternships(res.data))
      .catch((err) => {
        console.error(err);
        alert("Failed to load internships");
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 flex flex-col">
      {/* Top Bar */}
      <header className="px-14 py-5 border-b border-gray-800 bg-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={logo}
          alt="Trackly Logo"
          className="w-12 h-12 opacity-90">
          </img>
          <span className="text-2xl font-semibold tracking-wide">
            Trackly
          </span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-gray-300 text-2xl">
            Hello, <span className="font-medium text-gray-100">Samuel</span>
          </span>

          <button 
            className="px-4 py-2 rounded-lg text-m font-bold bg-red-700 text-white hover:bg-red-600 transition"
            onClick={() => console.log("logout")}
          >Logout</button>
        </div>
      </header>
      
      {editing && (
        <EditInternshipModal
          intern={editing}
          onClose={() => setEditing(null)}
          onSave={(updated) => {
            setInternships((prev) => 
              prev.map((i) => 
                i._id === updated._id ? updated : i
            )
            );
            setEditing(null);
          }}
        />
      )}

      <section className="relative z-50 px-6 py-10 flex justify-center">
        <div className="w-full max-w-7xl  rounded-xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-14 p-12 items-center">
            <div className="flex justify-center">
              <img
                src={robotImage}
                alt="Robot"
                className="max-w-sm w-full opacity-80"
              />
            </div>
            <div className="flex justify-center">
              <Form onSubmit={addInternship} />
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 flex-1 px-6 py-6 flex justify-center">
        <div className="w-full max-w-7xl">
          <InternTable
            internships={internships}
            onEdit={setEditing}
            onDelete={deleteInternship}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
