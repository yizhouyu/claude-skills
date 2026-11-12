// Usage: write {"since":"YYYY-MM-DD"} to ~/.cache/credit-karma/job.json, then: bash run.sh fetch
const job = JSON.parse(await fs.readFile(DIR + "/job.json", "utf8").catch(() => '{"since":"2000-01-01"}'));
const tx = await fetchAll(job.since);
const cats = (await gql("getTransactionsCategories", {}))?.data?.prime?.categories?.categories?.map(c => ({ id: c.id, name: c.name, selectable: c.isSelectable }));
await fs.writeFile(DIR + "/tx.json", JSON.stringify(tx));
await fs.writeFile(DIR + "/categories.json", JSON.stringify(cats, null, 1));
await task.finish({ keep: [] });
console.log(`FETCHED ${tx.length} transactions since ${job.since} → ${DIR}/tx.json; categories → ${DIR}/categories.json`);
