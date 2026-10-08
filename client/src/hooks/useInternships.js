import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as internshipsApi from "../services/internships";

const LIMIT = 10;

// Owns the dashboard's data: the current page of internships, the list query
// (page/search/sort/scope), upcoming reminders, and every mutation. Each
// mutation re-fetches the list so the table always reflects the server.
export default function useInternships() {
  const [internships, setInternships] = useState([]);
  const [total, setTotal] = useState(0);
  // False until the first page arrives, so empty states don't flash on load
  const [loaded, setLoaded] = useState(false);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  // Pipeline counts for active applications; null until loaded
  const [stats, setStats] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [searchquery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [scope, setScope] = useState("active");

  const params = { page, limit: LIMIT, q: searchquery, field: searchField, sortField, sortOrder, scope };

  // Fetches with the current query, optionally overridden (e.g. page 1 after an add).
  const fetchList = async (overrides = {}) => {
    const data = await internshipsApi.listInternships({ ...params, ...overrides });
    setInternships(data.data);
    setTotal(data.total);
    return data;
  };

  const fetchUpcomingReminders = useCallback(async () => {
    try {
      setUpcomingReminders(await internshipsApi.getUpcomingReminders());
    } catch {
      toast.error("Failed to fetch reminders");
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      setStats(await internshipsApi.getStats());
    } catch {
      // Non-critical: the pipeline card keeps its last numbers
    }
  }, []);

  useEffect(() => {
    fetchUpcomingReminders();
    fetchStats();
  }, [fetchUpcomingReminders, fetchStats]);

  useEffect(() => {
    // Drop responses for a query the user has already moved past
    let stale = false;
    internshipsApi
      .listInternships({ page, limit: LIMIT, q: searchquery, field: searchField, sortField, sortOrder, scope })
      .then((data) => {
        if (stale) return;
        setInternships(data.data);
        setTotal(data.total);
        setLoaded(true);
      })
      .catch((err) => {
        console.error(err);
        if (!stale && err.response?.status !== 401) {
          toast.error("Failed to load internships");
        }
      });
    return () => {
      stale = true;
    };
  }, [page, searchquery, searchField, sortField, sortOrder, scope]);

  // Wraps a mutation with the shared loading flag and error toast.
  const run = async (errorMessage, fn) => {
    setActionLoading(true);
    try {
      return await fn();
    } catch (err) {
      console.error(err);
      toast.error(errorMessage);
      return false;
    } finally {
      setActionLoading(false);
    }
  };

  const addInternship = (formData) =>
    run("Failed to add internship", async () => {
      await internshipsApi.createInternship({
        company: formData.company,
        role: formData.role,
        cycle: formData.cycle,
        status: "Applied",
        appliedAt: formData.appliedAt,
        applicationLink: formData.link,
        notes: formData.notes,
      });
      toast.success("Internship added");
      fetchStats();
      await fetchList({ page: 1 });
      setPage(1);
      return true;
    });

  const removeInternship = (id) =>
    run("Failed to delete internship", async () => {
      await internshipsApi.deleteInternship(id);
      toast.success("Internship deleted");
      fetchStats();

      const data = await internshipsApi.listInternships(params);
      // Deleted the last row on this page: step back instead of showing an empty page
      if (data.data.length === 0 && page > 1) {
        setPage(page - 1);
      } else {
        setInternships(data.data);
        setTotal(data.total);
      }
      await fetchUpcomingReminders();
    });

  // reminder = null removes it
  const saveReminder = (id, reminder) =>
    run("Failed to update reminder", async () => {
      if (reminder) {
        await internshipsApi.setReminder(id, reminder);
        toast.success("Reminder saved");
      } else {
        await internshipsApi.clearReminder(id);
        toast.success("Reminder removed");
      }
      await fetchList();
      await fetchUpcomingReminders();
    });

  // Returns true when the update went through, so the caller can clear its selection.
  const updateStatus = async (ids, status) => {
    if (ids.length === 0) {
      toast.info("No internships selected");
      return false;
    }
    // In the archived tab the only valid action is Unarchive (Applied)
    if (scope === "archived" && status !== "Applied") {
      toast.info("Select Unarchive to move items back to Active");
      return false;
    }

    return run("Failed to update internships", async () => {
      await internshipsApi.bulkUpdateStatus(ids, status);
      toast.success("Successfully updated internships");
      fetchStats();

      // Follow the items: archiving goes to the archived tab, unarchiving back to active
      const nextScope =
        status === "Archived" ? "archived" : scope === "archived" && status === "Applied" ? "active" : scope;

      setScope(nextScope);
      setPage(1);
      await fetchList({ page: 1, scope: nextScope });
      return true;
    });
  };

  // After an edit made elsewhere (e.g. the edit modal) has already been saved
  const refresh = () => {
    fetchStats();
    return fetchList().catch(() => toast.error("Failed to load internships"));
  };

  return {
    internships,
    total,
    loaded,
    upcomingReminders,
    stats,
    actionLoading,
    query: { page, limit: LIMIT, searchquery, searchField, sortField, sortOrder, scope },
    setPage,
    setSearchQuery,
    setSearchField,
    setSortField,
    setSortOrder,
    setScope,
    addInternship,
    removeInternship,
    saveReminder,
    updateStatus,
    refresh,
  };
}
