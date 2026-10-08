// Class names for status and cycle chips. The colours live in index.css
// (.chip-*) as theme-aware tokens: a soft tint per stage, no border, and the
// same text colour for every stage.

export const STATUS_STYLES = {
  Applied: "chip chip-applied",
  OA: "chip chip-oa",
  Interview: "chip chip-interview",
  Offer: "chip chip-offer",
  Rejected: "chip chip-rejected",
  Archived: "chip chip-archived",
};

// Pipeline bar segments, a step stronger than the chip tints
export const STATUS_BAR = {
  Applied: "bar-applied",
  OA: "bar-oa",
  Interview: "bar-interview",
  Offer: "bar-offer",
  Rejected: "bar-rejected",
};

// Cycles are tags, not states: one neutral style for all of them
export const CYCLE_STYLES = {
  Spring: "chip chip-cycle",
  Summer: "chip chip-cycle",
  Fall: "chip chip-cycle",
  Winter: "chip chip-cycle",
  "6-Month": "chip chip-cycle",
};

// Cycle icons in the add/edit forms stay neutral too
export const CYCLE_ICON_STYLES = {
  Spring: "text-fg-muted",
  Summer: "text-fg-muted",
  Fall: "text-fg-muted",
  Winter: "text-fg-muted",
  "6-Month": "text-fg-muted",
};
