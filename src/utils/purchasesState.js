const KEY_PREFIX = 'falkon_my_purchases_user_';

function storageKey(userId) {
  return `${KEY_PREFIX}${userId}`;
}

export function loadPurchasedProductIds(userId) {
  if (!userId) return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map((x) => String(x));
  } catch {
    return [];
  }
}

export function savePurchasedProductIds(userId, productIds) {
  if (!userId) return;
  const normalized = Array.from(new Set((productIds || []).map((x) => String(x))));
  localStorage.setItem(storageKey(userId), JSON.stringify(normalized));
}

export function togglePurchasedProductId(userId, productId) {
  const pid = String(productId);
  const current = loadPurchasedProductIds(userId);
  const has = current.includes(pid);
  const next = has ? current.filter((x) => x !== pid) : [...current, pid];
  savePurchasedProductIds(userId, next);
  return next;
}

