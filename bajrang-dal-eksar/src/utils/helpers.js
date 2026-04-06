/** Generate a simple unique ID */
export function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/** Format today's date in Hindi locale */
export function todayHindi() {
  return new Date().toLocaleDateString('hi-IN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  });
}

/** Validate Indian mobile number (10 digits) */
export function isValidMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile);
}

/** Calculate percentage, rounded to 1 dp */
export function pct(score, total) {
  if (!total) return 0;
  return Math.round((score / total) * 1000) / 10;
}

/** Sort participants by score descending */
export function sortByScore(arr) {
  return [...arr].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

/** Get current year as string */
export function currentYear() {
  return String(new Date().getFullYear());
}
