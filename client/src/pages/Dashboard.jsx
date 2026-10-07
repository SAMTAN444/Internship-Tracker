import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useInternships from "../hooks/useInternships";
import VerifyEmailBanner from "../components/VerifyEmailBanner";
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

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const list = useInternships();
  const { actionLoading, saveReminder } = list;

  // UI-only state; the data itself lives in useInternships
  const [editing, setEditing] = useState(null);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusToUpdate, setStatusToUpdate] = useState("Applied");

  const handleLogout = async () => {
    // ProtectedRoute sends the signed-out user to /login
    await signOut();
    toast.success("Logged out");
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Internship",
      message: "Are you sure you want to delete this internship?",
      buttons: [
        {
          label: "Yes",
          onClick: () => list.removeInternship(id),
        },
        {
          label: "No",
        },
      ],
    });
  };

  const handleBulkUpdate = async () => {
    if (await list.updateStatus(selectedIds, statusToUpdate)) {
      setSelectedIds([]);
      // The update may have switched tabs; "Applied" is the default in both
      // (shown as "Unarchive" in the archived tab)
      setStatusToUpdate("Applied");
    }
  };

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
              {profile.username}
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

            <div className="flex items-center gap-2">
              <Link
                to="/settings"
                className="inline-flex items-center min-h-11 px-4 text-sm font-semibold rounded-lg text-gray-900 hover:bg-gray-100"
              >
                Settings
              </Link>
              <button
                disabled={actionLoading}
                className="min-h-11 px-4 text-sm font-semibold rounded-lg text-gray-900 bg-white border border-gray-300 transition hover:bg-gray-100 disabled:opacity-60"
                onClick={handleLogout}
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <VerifyEmailBanner />

      {editing && (
        <EditInternshipModal
          intern={editing}
          onClose={() => setEditing(null)}
          onSave={async () => {
            await list.refresh();
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
                reminders={list.upcomingReminders}
                onOpen={(intern) => setReminderTarget(intern)}
                onDelete={(id) => saveReminder(id, null)}
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
              <Form onSubmit={list.addInternship} />
            </div>
          </div>
        </div>
      </section>

      <main className="px-4 md:px-6 py-4 md:py-6 flex justify-center">
        <div className="w-full max-w-screen-2xl overflow-x-auto">
          <InternTable
            list={list}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            statusToUpdate={statusToUpdate}
            setStatusToUpdate={setStatusToUpdate}
            onBulkUpdate={handleBulkUpdate}
            onEdit={setEditing}
            onDelete={confirmDelete}
            onOpenReminder={setReminderTarget}
          />
        </div>
      </main>
      {reminderTarget && (
        <ReminderModal
          intern={reminderTarget}
          onClose={() => setReminderTarget(null)}
          onSave={(reminder) => {
            saveReminder(reminderTarget._id, reminder);
            setReminderTarget(null);
          }}
          onRemove={() => {
            saveReminder(reminderTarget._id, null);
            setReminderTarget(null);
          }}
          loading={actionLoading}
        ></ReminderModal>
      )}
      <Footer />
    </div>
  );
}
