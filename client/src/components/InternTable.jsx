import { useNavigate } from "react-router-dom";
import InternToolbar from "./InternToolbar";
import InternTableDesktop from "./InternTableDesktop";
import InternListMobile from "./InternListMobile";

// The applications panel: toolbar, the list (table on desktop, cards on
// mobile) and pagination. `list` is the object returned by useInternships.
export default function InternTable({
  list,
  selectedIds,
  setSelectedIds,
  statusToUpdate,
  setStatusToUpdate,
  onBulkUpdate,
  onEdit,
  onDelete,
  onOpenReminder,
}) {
  const navigate = useNavigate();
  const { internships, total, query, setPage, setSortField, setSortOrder, setScope } = list;
  const { page, limit, sortField, sortOrder } = query;

  const isSelected = (id) => selectedIds.includes(id);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === internships.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(internships.map((i) => i._id));
    }
  };

  const changeScope = (scope) => {
    setScope(scope);
    setPage(1);
    setSelectedIds([]);
    setStatusToUpdate("Applied");
  };

  // Toggles order on the active field, else selects it.
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setPage(1);
  };

  const rowActions = {
    isSelected,
    onToggleSelect: toggleSelect,
    onEdit,
    onDelete,
    onOpenNotes: (intern) => navigate(`/notes/${intern._id}`),
    onOpenReminder,
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg">
      <InternToolbar
        query={query}
        setPage={setPage}
        setSearchQuery={list.setSearchQuery}
        setSearchField={list.setSearchField}
        setSortField={setSortField}
        setSortOrder={setSortOrder}
        onScopeChange={changeScope}
        selectedCount={selectedIds.length}
        statusToUpdate={statusToUpdate}
        setStatusToUpdate={setStatusToUpdate}
        onBulkUpdate={onBulkUpdate}
      />

      <InternListMobile internships={internships} {...rowActions} />

      <InternTableDesktop
        internships={internships}
        searchquery={query.searchquery}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
        allSelected={internships.length > 0 && selectedIds.length === internships.length}
        onToggleSelectAll={toggleSelectAll}
        {...rowActions}
      />

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between text-sm text-gray-700">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            aria-label="Previous page"
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-gray-100 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            aria-label="Next page"
            className="inline-flex items-center justify-center min-h-11 px-4 rounded-md bg-gray-100 hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
