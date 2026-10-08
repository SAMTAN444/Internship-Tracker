import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import useInternships from "../hooks/useInternships";
import VerifyEmailBanner from "../components/VerifyEmailBanner";
import InternTable from "../components/InternTable";
import Form from "../components/Form";
import EditInternshipModal from "../components/EditInternshipModal";
import Footer from "../components/Footer";
import Logo from "../components/Logo";
import { btnGhost, btnSecondary } from "../components/ui";
import { toast } from "react-toastify";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import RemindersPanel from "../components/RemindersPanel";
import ReminderModal from "../components/ReminderModal";
import "../confirm-dark.css";
import PipelineCard from "../components/PipelineCard";

export default function Dashboard() {
  const { profile, signOut } = useAuth();
  const list = useInternships();
  const { actionLoading, saveReminder } = list;

  // UI-only state; the data itself lives in useInternships
  const [editing, setEditing] = useState(null);
  const [reminderTarget, setReminderTarget] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [statusToUpdate, setStatusToUpdate] = useState("Applied");
  const [addOpen, setAddOpen] = useState(false);

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

  // Opening the add panel puts the cursor straight in the first field
  useEffect(() => {
    if (!addOpen) return;
    const input = document.getElementById("company");
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  }, [addOpen]);

  const handleAdd = async (formData) => {
    const added = await list.addInternship(formData);
    if (added) setAddOpen(false);
    return added;
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
    <div className="min-h-screen bg-canvas text-fg flex flex-col">
      {actionLoading && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
        >
          <div className="bg-surface px-5 py-3 rounded-xl border border-line shadow-lg flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-line-strong border-t-fg rounded-full animate-spin" />
            <span className="text-sm text-fg font-medium">
              Processing…
            </span>
          </div>
        </div>
      )}
      {/* Top Bar */}
      <header className="w-full border-b border-line bg-surface">
        <div className="max-w-screen-2xl mx-auto flex items-center gap-3 px-4 py-3 md:px-6">
          {/* LEFT — Greeting */}
          <h1 className="text-base text-fg-muted truncate">
            Hello,{" "}
            <span className="font-semibold text-fg">
              {profile.username}
            </span>
          </h1>

          {/* RIGHT — Logo + Text + Logout */}
          <div className="ml-auto flex items-center gap-2 md:gap-4">
            <span className="hidden sm:block">
              <Logo />
            </span>

            <div className="flex items-center gap-1 md:gap-2">
              <Link
                to="/settings"
                className={btnGhost}
              >
                Settings
              </Link>
              <button
                disabled={actionLoading}
                className={btnSecondary}
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

      <section className="px-4 md:px-6 pt-6 md:pt-10 flex justify-center">
        <div className="w-full max-w-screen-2xl grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6 items-start">
          <PipelineCard stats={list.stats} />
          <RemindersPanel
            reminders={list.upcomingReminders}
            onOpen={(intern) => setReminderTarget(intern)}
            onDelete={(id) => saveReminder(id, null)}
          />
        </div>
      </section>

      <main className="px-4 md:px-6 py-6 md:py-8 flex justify-center">
        <div className="w-full max-w-screen-2xl overflow-x-auto space-y-6">
          {addOpen && <Form onSubmit={handleAdd} onCancel={() => setAddOpen(false)} />}

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
            onAddApplication={() => setAddOpen(true)}
            addOpen={addOpen}
            onToggleAdd={() => setAddOpen((open) => !open)}
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
