import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InternTable from "../components/InternTable";
import Form from "../components/Form";
import robotImage from "../assets/robotimage.png";
import EditInternshipModal from "../components/EditInternshipModal";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import "../confirm-dark.css";

export default function Dashboard() {
  const [internships, setInternships] = useState([]);
  const [editing, setEditing] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusToUpdate, setStatusToUpdate] = useState("Applied");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [searchquery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const addInternship = async (formData) => {
    try {
      await API.post("/api/internships", {
        company: formData.company,
        role: formData.role,
        cycle: formData.cycle,
        status: "Applied",
        appliedAt: formData.appliedAt,
        applicationLink: formData.link,
        notes: formData.notes,
      });
      toast.success("Internship added");

      const { data } = await API.get(
        `/api/internships?page=1&limit=${limit}&q=${searchquery}&field=${searchField}&sortField=${sortField}&sortOrder=${sortOrder}`
      );

      setPage(1);
      setInternships(data.data);
      setTotal(data.total);
      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to add internship");
      return false;
    }
  };

  const deleteInternship = (id) => {
    confirmAlert({
      title: "Delete Internship",
      message: "Are you sure you want to delete this internship?",
      buttons: [
        {
          label: "Yes",
          onClick: () => actuallyDelete(id),
        },
        {
          label: "No",
        },
      ],
    });
  };
  const actuallyDelete = async (id) => {
    try {
      await API.delete(`/api/internships/${id}`);

      toast.success("Internship deleted");

      const { data } = await API.get(
        `/api/internships?page=${page}&limit=${limit}`
      );

      if (data.data.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        setInternships(data.data);
        setTotal(data.total);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete internship");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Successfully Logged Out");
    navigate("/login");
  };

  const handleBulkUpdate = async () => {
    try {
      await API.put("/api/internships/bulk-status", {
        ids: selectedIds,
        status: statusToUpdate,
      });
      toast.success("Successfully updated internships");
      const { data } = await API.get(
        `/api/internships?page=${page}&limit=${limit}`
      );
      setInternships(data.data);
      setTotal(data.total);

      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update internships");
    }
  };

  useEffect(() => {
    API.get("/api/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        setUser(null);
        navigate("/login");
      });
  }, []);

  useEffect(() => {
    API.get(
      `/api/internships?page=${page}&limit=${limit}&q=${searchquery}&field=${searchField}&sortField=${sortField}&sortOrder=${sortOrder}`
    )
      .then((res) => {
        setInternships(res.data.data);
        setTotal(res.data.total);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load internships");
      });
  }, [page, searchquery, searchField, sortField, sortOrder]);

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 flex flex-col">
      {/* Top Bar */}
      <header className="w-full border-b border-gray-800 bg-gray-700 flex justify-center">
        <div className="w-full max-w-7xl flex items-center justify-between px-14 py-5">
          {/* LEFT — Greeting */}
          <span className="text-gray-300 text-2xl">
            Hello,{" "}
            <span className="font-medium text-gray-100">
              {user?.name || "User"}
            </span>
          </span>

          {/* RIGHT — Logo + Text + Logout */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Trackly Logo"
                className="w-10 h-10 opacity-90"
              />
              <span className="text-2xl font-semibold tracking-wide">
                Trackly
              </span>
            </div>

            <button
              className="px-4 py-2 rounded-lg text-m font-bold bg-red-700 text-white hover:bg-red-600 transition"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {editing && (
        <EditInternshipModal
          intern={editing}
          onClose={() => setEditing(null)}
          onSave={async () => {
            const { data } = await API.get(
              `/api/internships?page=${page}&limit=${limit}`
            );
            setInternships(data.data);
            setTotal(data.total);
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
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            statusToUpdate={statusToUpdate}
            setStatusToUpdate={setStatusToUpdate}
            onBulkUpdate={handleBulkUpdate}
            onEdit={setEditing}
            onDelete={deleteInternship}
            page={page}
            setPage={setPage}
            total={total}
            limit={limit}
            searchquery={searchquery}
            setSearchQuery={setSearchQuery}
            searchField={searchField}
            setSearchField={setSearchField}
            sortField={sortField}
            setSortField={setSortField}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
