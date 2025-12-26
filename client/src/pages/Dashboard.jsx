import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InternTable from "../components/InternTable";
import Form from "../components/Form";

import EditInternshipModal from "../components/EditInternshipModal";
import Footer from "../components/Footer";
import logo from "../assets/logo.png";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import RemindersPanel from "../components/RemindersPanel";
import ReminderModal from "../components/ReminderModal";
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
  const [loading, setLoading] = useState(true);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [upcomingReminders, setUpcomingReminders] = useState([]);

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
      await fetchUpcomingReminders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete internship");
    }
  };

  const handleSaveReminder = async (id, reminder) => {
    try {
      if (reminder) {
        await API.put(`/api/internships/${id}/reminder`, reminder);
        toast.success("Reminder saved");
      } else {
        await API.delete(`/api/internships/${id}/reminder`);
        toast.success("Reminder removed");
      }

      const { data } = await API.get(
        `/api/internships?page=${page}&limit=${limit}`
      );

      setInternships(data.data);
      setTotal(data.total);

      await fetchUpcomingReminders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update reminder");
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

      setTotal(data.total);
      setInternships(data.data);
      setSelectedIds([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update internships");
    }
  };

  const fetchUpcomingReminders = async () => {
    try {
      const { data } = await API.get(
        "/api/internships/reminders/upcoming"
      );
      setUpcomingReminders(data);
    } catch (err) {
      toast.error("Failed to fetch reminders");
    }
  }

  useEffect(() => {
    async function init() {
      try {
        const res = await API.get("/api/auth/me");
        setUser(res.data);
        await fetchUpcomingReminders();
      } catch {
        navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    }
    init();
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
      });
  }, [page, searchquery, searchField, sortField, sortOrder]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-800">
        <div className="w-10 h-10 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-400">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800 text-gray-200 flex flex-col">
      {/* Top Bar */}
      <header className="w-full border-b border-gray-800 bg-gray-700">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4 gap-2 overflow-x-auto">
          {/* LEFT — Greeting */}
          <span className="text-lg md:text-2xl">
            Hello,{" "}
            <span className="font-medium text-gray-100">
              {user?.name || "User"}
            </span>
          </span>

          {/* RIGHT — Logo + Text + Logout */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 md:gap-6">
            <div className="flex items-center gap-3">
              <img
                src={logo}
                alt="Trackly Logo"
                className="w-15 h-15 md:w-10 md:h-10 opacity-90"
              />
              <span className="text-2xl font-semibold tracking-wide">
                Trackly
              </span>
            </div>

            <button
              className="px-3 py-1.5 md:px-4 md:py-2 text-sm md:text-base rounded-lg bg-red-700 text-white transition hover:bg-red-600"
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

      <section className="relative z-50 px-4 py-6 md:mx-6 md:py-10 flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 p-4 md:p-12 items-start">
            {/* LEFT */}
            <div className="flex flex-col">
              <RemindersPanel
                reminders={upcomingReminders}
                onOpen={(intern) => setReminderTarget(intern)}
                onDelete={(id) => handleSaveReminder(id, null)}
              />
            </div>

            {/* RIGHT */}
            <div className="flex flex-col">
              <Form onSubmit={addInternship} />
            </div>
          </div>
        </div>
      </section>

      <main className="px-4 md:px-6 py-4 md:py-6 flex justify-center">
        <div className="w-full max-w-screen-2xl overflow-x-auto">
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
            onSaveReminder={handleSaveReminder}
            setReminderTarget={setReminderTarget}
          />
        </div>
      </main>
      {reminderTarget && (
        <ReminderModal
          intern={reminderTarget}
          onClose={() => setReminderTarget(null)}
          onSave={(reminder) => {
            handleSaveReminder(reminderTarget._id, reminder);
            setReminderTarget(null);
          }}
          onRemove={() => {
            handleSaveReminder(reminderTarget._id, null);
            setReminderTarget(null);
          }}
        ></ReminderModal>
      )}
      <Footer />
    </div>
  );
}
