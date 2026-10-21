type Entry = { count: number; resetAt: number };
const requests = new Map<string, Entry>();

export function allowRequest(key: string, limit = 12, windowMs = 60_000) {
  const now = Date.now();
  const entry = requests.get(key);
  if (!entry || entry.resetAt < now) { requests.set(key, { count: 1, resetAt: now + windowMs }); return true; }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
