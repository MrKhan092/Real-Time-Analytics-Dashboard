// backend/src/lib/rolling.js
// In-memory rolling window aggregator (simple, efficient)
const buckets = []; // circular buffer of seconds
const BUCKET_SIZE = 61; // keep 60s + current second

for (let i=0;i<BUCKET_SIZE;i++) buckets.push({ t: 0, count: 0, uniques: new Set(), routes: new Map(), errors: 0 });

function getBucketIdx(ts) {
  const s = Math.floor(ts/1000);
  return s % BUCKET_SIZE;
}

export function pushEventToMemory(ev) {
  const ts = Date.now();
  const idx = getBucketIdx(ts);
  const b = buckets[idx];
  const s = Math.floor(ts/1000);
  if (b.t !== s) {
    // reset bucket
    b.t = s;
    b.count = 0;
    b.uniques = new Set();
    b.routes = new Map();
    b.errors = 0;
  }
  b.count += 1;
  if (ev.userId) b.uniques.add(ev.userId);
  const route = ev.route || "unknown";
  b.routes.set(route, (b.routes.get(route) || 0) + 1);
  if (ev.action === "error" || (ev.metadata && ev.metadata.error)) b.errors += 1;
}

export function currentAgg() {
  const now = Date.now();
  const sNow = Math.floor(now/1000);
  let last1 = 0, last5 = 0, last60 = 0;
  const uniqs = new Set();
  const routeMap = new Map();
  let errors = 0;
  for (let i=0;i<BUCKET_SIZE;i++) {
    const b = buckets[i];
    if (!b.t) continue;
    const age = sNow - b.t;
    if (age <= 0) last1 += b.count;
    if (age <= 4) last5 += b.count;
    if (age <= 59) {
      last60 += b.count;
      // uniques
      b.uniques.forEach(u => uniqs.add(u));
      b.routes.forEach((c, r) => {
        routeMap.set(r, (routeMap.get(r)||0) + c);
      });
      errors += b.errors;
    }
  }
  // top routes
  const topRoutes = Array.from(routeMap.entries()).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([r,c]) => ({ route: r, count: c }));
  return {
    t: now,
    last1s: last1,
    last5s: last5,
    last60s: last60,
    activeUsers: uniqs.size,
    topRoutes,
    errors
  };
}

// keep a small replay buffer
const replay = [];
export function pushReplay(ev, size=200) {
  replay.push(ev);
  if (replay.length > size) replay.shift();
}
export function getReplay() {
  return replay.slice(-100);
}

export default { pushEventToMemory, currentAgg, pushReplay, getReplay };
