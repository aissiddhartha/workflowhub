// Board columns in order. `wip` is a work-in-progress limit that is shown on the column
// (the badge turns red when the column holds more cards than the limit).
export const COLUMNS = [
  { status: "Backlog" },
  { status: "Sprint Ready" },
  { status: "In Progress", wip: 3 },
  { status: "Code Review", wip: 2 },
  { status: "QA" },
  { status: "Done", done: true },
];

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];