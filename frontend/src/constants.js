// Board columns in order. The last column is the "done" column, which is shown in green.
export const COLUMNS = [
  { status: "Backlog" },
  { status: "Sprint Ready" },
  { status: "In Progress" },
  { status: "Code Review" },
  { status: "QA" },
  { status: "Done", done: true },
];

export const PRIORITIES = ["Low", "Medium", "High", "Urgent"];