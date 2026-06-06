import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import InternTable from "../components/InternTable";
import Form from "../components/Form";
import EditInternshipModal from "../components/EditInternshipModal";
import Footer from "../components/Footer";
import logo from "../assets/logo.svg";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import RemindersPanel from "../components/RemindersPanel";
import ReminderModal from "../components/ReminderModal";
import "../confirm-dark.css";
import gogginsImage from "../assets/goggins.png";

export default function Dashboard({ onLogout }) {
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
  const [actionLoading, setActionLoading] = useState(false);
  const [scope, setScope] = useState("active");

  const listParams = {
    page,
    limit,
    q: searchquery,
    field: searchField,
    sortField,
    sortOrder,
    scope,
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete API.defaults.headers.common.Authorization;
    toast.success("Successfully Logged Out");
    onLogout?.();
    navigate("/", { replace: true });
  };

  const addInternship = async (formData) => {
    setActionLoading(true);
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

      const { data } = await API.get("/api/internships", {
        params: {
          page: 1,
          limit,
          q: searchquery,
          field: searchField,
          sortField,
          sortOrder,
          scope,
        },
      });

      setPage(1);
      setInternships(data.data);
      setTotal(data.total);

      return true;
    } catch (err) {
      console.error(err);
      toast.error("Failed to add internship");
      return false;
    } finally {
      setActionLoading(false);
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
    setActionLoading(true);
    try {
      await API.delete(`/api/internships/${id}`);

      toast.success("Internship deleted");

      const { data } = await API.get("/api/internships", {
        params: listParams,
      });

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
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveReminder = async (id, reminder) => {
    setActionLoading(true);
    try {
      if (reminder) {
        await API.put(`/api/internships/${id}/reminder`, reminder);
        toast.success("Reminder saved");
      } else {
        await API.delete(`/api/internships/${id}/reminder`);
        toast.success("Reminder removed");
      }

      const { data } = await API.get("/api/internships", {
        params: listParams,
      });

      setInternships(data.data);
      setTotal(data.total);

      await fetchUpcomingReminders();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update reminder");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkUpdate = async () => {
    if (selectedIds.length === 0) {
      toast.info("No internships selected");
      return;
    }

    // If user is in archived tab, the only valid action is Unarchive (Applied)
    if (scope === "archived" && statusToUpdate !== "Applied") {
      toast.info("Select Unarchive to move items back to Active");
      return;
    }

    setActionLoading(true);

    try {
      await API.put("/api/internships/bulk-status", {
        ids: selectedIds,
        status: statusToUpdate,
      });

      toast.success("Successfully updated internships");

      // ✅ Decide where user should land AFTER the action
      const nextScope =
        statusToUpdate === "Archived"
          ? "archived"
          : scope === "archived" && statusToUpdate === "Applied"
            ? "active"
            : scope;

      // ✅ Update UI state
      setScope(nextScope);
      setPage(1);
      setSelectedIds([]);

      // ✅ Fetch using nextScope (NOT old scope)
      const { data } = await API.get("/api/internships", {
        params: {
          page: 1,
          limit,
          q: searchquery,
          field: searchField,
          sortField,
          sortOrder,
          scope: nextScope,
        },
      });

      setInternships(data.data);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update internships");
    } finally {
      setActionLoading(false);
    }
  };


  const fetchUpcomingReminders = async () => {
    try {
      const { data } = await API.get("/api/internships/reminders/upcoming");
      setUpcomingReminders(data);
    } catch (err) {
      toast.error("Failed to fetch reminders");
    }
  };

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
    API.get("/api/internships", {
      params: {
        page,
        limit,
        q: searchquery,
        field: searchField,
        sortField,
        sortOrder,
        scope, // ✅ THIS is the key
      },
    })
      .then((res) => {
        setInternships(res.data.data);
        setTotal(res.data.total);
      })
      .catch(console.error);
  }, [page, limit, searchquery, searchField, sortField, sortOrder, scope]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        <p className="mt-4 text-sm text-gray-600">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col">
      {actionLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
        >
          <div className="bg-white px-6 py-4 rounded-xl border border-gray-200 flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
            <span className="text-sm text-gray-800 font-medium">
              Processing…
            </span>
          </div>
        </div>
      )}
      {/* Top Bar */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-center justify-between px-4 py-3 md:px-6 md:py-4 gap-2 overflow-x-auto">
          {/* LEFT — Greeting */}
          <h1 className="text-lg md:text-2xl font-normal">
            Hello,{" "}
            <span className="font-medium text-gray-900">
              {user?.username || "User"}
            </span>
          </h1>

          {/* RIGHT — Logo + Text + Logout */}
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 md:gap-6">
            <div className="flex items-center gap-2.5">
              <img src={logo} alt="" className="h-9 md:h-10 w-auto" />
              <span className="text-2xl font-bold tracking-tight text-gray-900">
                Trackly
              </span>
            </div>

            <button
              disabled={actionLoading}
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
            const { data } = await API.get("/api/internships", {
              params: listParams,
            });

            setInternships(data.data);
            setTotal(data.total);
            setEditing(null);
          }}
        />
      )}

      <section className="relative z-10 px-4 py-6 md:mx-6 md:py-10 flex justify-center">
        <div className="w-full max-w-screen-2xl">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 p-4 md:p-12 items-stretch">
            {/* LEFT */}
            <div className="flex flex-col gap-6 md:h-full min-h-0">
              <RemindersPanel
                reminders={upcomingReminders}
                onOpen={(intern) => setReminderTarget(intern)}
                onDelete={(id) => handleSaveReminder(id, null)}
              />

              {/* Goggins Card (separate card below reminders) */}
              <div
                className="
                  w-full
                  bg-white border border-gray-200 rounded-2xl
                  p-6
                  md:flex-1
                  min-h-0
                  flex flex-col
                "
              >
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <img
                    src={gogginsImage}
                    alt=""
                    loading="lazy"
                    width={240}
                    height={220}
                    className="
                      w-auto
                      max-w-55 md:max-w-60
                      max-h-40 md:max-h-47.5 lg:max-h-55
                      object-contain
                      select-none
                      opacity-95
                      drop-shadow-[0_14px_24px_rgba(0,0,0,0.45)]
                    "
                    draggable="false"
                  />
                </div>

                <p className="mt-3 text-center text-xs text-gray-600">
                  Stay hard. Keep applying.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col md:h-full">
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
            loading={actionLoading}
            scope={scope}
            setScope={setScope}
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
          loading={actionLoading}
        ></ReminderModal>
      )}
      <Footer />
    </div>
  );
}
