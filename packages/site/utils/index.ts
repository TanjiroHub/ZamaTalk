/**
 * Render a human-readable relative time string from timestamp.
 *
 * @param {number | string | bigint} timestamp - Epoch (seconds or ms), ISO date string, or bigint.
 * @returns {string} Formatted relative time in English.
 */
export function renderTime(timestamp: number | string | bigint): string {
  let ts: number;

  if (typeof timestamp === "bigint") {
    ts = Number(timestamp);
  } else if (typeof timestamp === "string") {
    ts = new Date(timestamp).getTime();
  } else {
    ts = timestamp;
  }

  if (!ts || isNaN(ts)) return "";

  if (ts < 1e12) {
    ts = ts * 1000;
  }

  const now = Date.now();
  const diffMs = now - ts;

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);

  if (sec < 60) return "Just now";
  if (min < 60) return `${min} minute${min !== 1 ? "s" : ""} ago`;
  if (hour < 24) return `${hour} hour${hour !== 1 ? "s" : ""} ago`;
  if (day === 1) {
    const d = new Date(ts);
    return `Yesterday at ${d.getHours().toString().padStart(2, "0")}:${d
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }

  const d = new Date(ts);
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${d.getFullYear()} ${d
    .getHours()
    .toString()
    .padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}
