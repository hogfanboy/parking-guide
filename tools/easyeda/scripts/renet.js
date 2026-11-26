// Re-assert every component pad's net (registers the nets with DRC/autorouter after Import Changes). Poll globalThis.__job.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("a355d18183ca4a75"); await new Promise(r => setTimeout(r, 800));
let n = 0; const err = [];
for (const c of await eda.pcb_PrimitiveComponent.getAll()) {
  for (const p of await eda.pcb_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId())) {
    const net = p.getState_Net(); if (!net) continue;
    try { await eda.pcb_PrimitivePad.modify(p.getState_PrimitiveId(), { net }); n++; } catch (e) { err.push(c.getState_Designator() + "." + p.getState_PadNumber() + " " + e.message); }
  }
}
globalThis.__job = { n, err: err.slice(0, 5), nets: (await eda.pcb_Net.getAllNetsName()).length };
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
