export function formatDate(dateString) {
  // format date nicely
  // example: from this 👉 2025-09-16 to this 👉 Sep 16, 2025
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}