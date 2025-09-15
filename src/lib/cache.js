const store = new Map(); // key -> { value, expiresAt }

export function setCache(key, value, ttlMs = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttlMs;
  store.set(key, { value, expiresAt });
}

export function getCache(key) {
  const hit = store.get(key);
  if (!hit) return null;
  if (Date.now() > hit.expiresAt) {
    store.delete(key);
    return null;
  }
  return hit.value;
}
