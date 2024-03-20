export function formatDate(timestamp) {
  const date = new Date(timestamp.seconds * 1000);
  return date.toLocaleDateString("en-US");
}
