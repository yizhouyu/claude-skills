// Usage: write [{"id":"urn:transaction:...","cid":"167"}, ...] to ~/.cache/credit-karma/plan.json, then: bash run.sh apply
const plan = JSON.parse(await fs.readFile(DIR + "/plan.json", "utf8"));
const fail = [];
for (const p of plan) {
  const j = await gql("editCategory", { input: { category: { id: String(p.cid) }, transactionId: p.id } });
  if (j?.data?.prime?.updateTransaction?.transactionUpdated !== true) fail.push({ ...p, err: JSON.stringify(j).slice(0, 200) });
}
const tx = await fetchAll((await fs.readFile(DIR + "/job.json", "utf8").then(s => JSON.parse(s).since).catch(() => "2000-01-01")));
const byId = Object.fromEntries(tx.map(t => [t.id, t.category?.id]));
const mismatch = plan.filter(p => byId[p.id] !== undefined && byId[p.id] !== String(p.cid));
await fs.writeFile(DIR + "/tx.json", JSON.stringify(tx));
await task.finish({ keep: [] });
console.log(`APPLIED ${plan.length - fail.length}/${plan.length}; server mismatches after refetch: ${mismatch.length}`);
if (fail.length) console.log("FAILED", JSON.stringify(fail, null, 1));
if (mismatch.length) console.log("MISMATCH", JSON.stringify(mismatch, null, 1));
