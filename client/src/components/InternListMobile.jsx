import InternCard from "./InternCard.jsx";

// Card list for screens below md.
export default function InternListMobile({
  internships,
  isSelected,
  onToggleSelect,
  onEdit,
  onDelete,
  onOpenNotes,
  onOpenReminder,
}) {
  return (
    <div className="block md:hidden px-5 divide-y divide-line">
      {internships.map((intern) => (
        <InternCard
          key={intern._id}
          intern={intern}
          selected={isSelected(intern._id)}
          onToggleSelect={() => onToggleSelect(intern._id)}
          onEdit={() => onEdit(intern)}
          onDelete={() => onDelete(intern._id)}
          onOpenNotes={() => onOpenNotes(intern)}
          onOpenReminder={() => onOpenReminder(intern)}
        />
      ))}
    </div>
  );
}
