// Stub wire + net port (GND: ground flag) on every netlist pin. Generated items from gen_wires.py. Poll globalThis.__job.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3");
await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const bad = []; let n = 0;
for (const [a, b, c, d, net, r] of __ITEMS__) {
  try { await eda.sch_PrimitiveWire.create([a, b, c, d], net); } catch (e) { bad.push("wire " + net + "@" + a + "," + b + " " + e.message); }
  const p = net === "GND" ? await t(eda.sch_PrimitiveComponent.createNetFlag("Ground", "GND", c, d, 0), 8000)
                          : await t(eda.sch_PrimitiveComponent.createNetPort("BI", net, c, d, r), 8000);
  if (p === "TIMEOUT") bad.push(net + "@" + c + "," + d);
  globalThis.__job = "running " + (++n);
}
await eda.sch_Document.save();
globalThis.__job = { n, bad };
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
