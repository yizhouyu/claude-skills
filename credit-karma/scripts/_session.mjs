// Shared helper, inlined into fetch.mjs / apply.mjs by run.sh (ego-browser nodejs takes one script).
const fs = await import("node:fs/promises");
const os = await import("node:os");
const DIR = os.homedir() + "/.cache/credit-karma";
await fs.mkdir(DIR, { recursive: true });
const GQL = "https://api.creditkarma.com/graphql";
const HASH = {
  GetTransactions: "e84296c61147719ced605fbba7bb30ef847903dd07f3a4f7c2ea8d0db107338e",
  editCategory: "93997ba3df8ab3e9194b3ab6782880ac9d46b78ef477f4b9e48fce864cd4b6dc",
  getTransactionsCategories: "21073e1edc4648411c9fdaa1eb07ea6f67d44aab54b9add47977fc263ed75a04",
};
const task = await taskSpace("credit-karma skill");
const page = task.page("p1");
await page.cdp("Network.enable", {}); await page.events();
await page.goto("https://www.creditkarma.com/networth/transactions");
await page.waitForTimeout(6000);
if (!/networth\/transactions/.test(await page.url())) {
  await page.goto("https://www.creditkarma.com/auth/logon");
  await task.handOff();
  console.log("NEED_LOGIN: Credit Karma session expired. Ask the user to log in inside ego (task space '" + task.name + "'), then rerun.");
  process.exit(0);
}
const req = (await page.events()).find(e => e.method === "Network.requestWillBeSent" && /"GetTransactions"/.test(e.params?.request?.postData || ""));
if (!req) { console.log("NO_REQUEST: page loaded but no GetTransactions call captured — see SKILL.md traps."); process.exit(0); }
const H = { ...req.params.request.headers };
for (const k of Object.keys(H)) if (k.startsWith("sec-") || k === "User-Agent" || k === "Referer") delete H[k];
H.accept = "application/json";
const sent = JSON.parse(req.params.request.postData).extensions?.persistedQuery?.sha256Hash;
if (sent && sent !== HASH.GetTransactions) { console.log("HASH_CHANGED GetTransactions:", sent); HASH.GetTransactions = sent; }
async function gql(op, variables) {
  const r = await page.fetch(GQL, { method: "POST", headers: H, timeout: 30000,
    body: JSON.stringify({ extensions: { persistedQuery: { sha256Hash: HASH[op], version: 1 } }, operationName: op, variables }) });
  return JSON.parse(r.body);
}
async function fetchAll(since) {
  let after = null, all = [];
  for (let i = 0; i < 300; i++) {
    const j = await gql("GetTransactions", { input: { accountInput: {}, categoryInput: { categoryId: null, primeCategoryType: null },
      datePeriodInput: { datePeriod: null }, paginationInput: after ? { afterCursor: after } : {} } });
    const tp = j?.data?.prime?.transactionsHub?.transactionPage;
    if (!tp) { console.log("FETCH_ERROR", JSON.stringify(j).slice(0, 300)); break; }
    all.push(...tp.transactions);
    const m = JSON.stringify(j).match(/"endCursor":"([^"]+)"/);
    if (!m || !tp.transactions.length || tp.transactions.at(-1).date < since) break;
    after = m[1];
  }
  return all.filter(t => t.date >= since);
}
