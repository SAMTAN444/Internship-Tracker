import { useNavigate } from "react-router-dom";
import InternToolbar from "./InternToolbar";
import InternTableDesktop from "./InternTableDesktop";
import InternListMobile from "./InternListMobile";
import InternEmptyState from "./InternEmptyState";
import { btnSecondary, card } from "./ui";

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
  onAddApplication,
  addOpen,
  onToggleAdd,
}) {
  const navigate = useNavigate();
  const { internships, total, loaded, query, setPage, setSortField, setSortOrder, setScope } = list;
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

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const isEmpty = loaded && internships.length === 0;

  const clearSearch = () => {
    list.setSearchQuery("");
    list.setSearchField("");
    setPage(1);
  };

  return (
    <div className={card}>
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
        addOpen={addOpen}
        onToggleAdd={onToggleAdd}
      />

      {isEmpty ? (
        <InternEmptyState
          searchquery={query.searchquery}
          scope={query.scope}
          onClearSearch={clearSearch}
          onShowActive={() => changeScope("active")}
          onAddApplication={onAddApplication}
        />
      ) : (
        <>
          <InternListMobile internships={internships} {...rowActions} />

          <InternTableDesktop
            internships={internships}
            sortField={sortField}
            sortOrder={sortOrder}
            onSort={handleSort}
            allSelected={internships.length > 0 && selectedIds.length === internships.length}
            onToggleSelectAll={toggleSelectAll}
            {...rowActions}
          />
        </>
      )}

      {/* Pagination (hidden when there's only one page) */}
      {totalPages > 1 && (
        <div className="px-5 md:px-6 py-3 border-t border-line flex items-center justify-between text-sm text-fg-muted">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              aria-label="Previous page"
              className={btnSecondary}
            >
              Prev
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              aria-label="Next page"
              className={btnSecondary}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
