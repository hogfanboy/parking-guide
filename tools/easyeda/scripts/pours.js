// GND pour on the bottom (2), board inset 0.3 mm; then rebuild. Safe to re-run (removes old pours first).
await eda.dmt_EditorControl.openDocument("a355d18183ca4a75"); await new Promise(r => setTimeout(r, 800));
const mil = v => Math.round(v / 0.0254 * 1000) / 1000;
for (const p of await eda.pcb_PrimitivePour.getAll()) await eda.pcb_PrimitivePour.delete([p.getState_PrimitiveId()]);
const [W, H] = [64, 46], e = 0.3;
const poly = () => eda.pcb_MathPolygon.createPolygon([mil(e), mil(e), "L", mil(W - e), mil(e), mil(W - e), mil(H - e), mil(e), mil(H - e), mil(e), mil(e)]);
for (const layer of [2]) await eda.pcb_PrimitivePour.create("GND", layer, poly(), "solid", false, "GND_L" + layer, 1, 0.2, false);
for (const p of await eda.pcb_PrimitivePour.getAll()) { try { await p.rebuildCopperRegion(); } catch (e) {} }
await eda.pcb_Document.save();
return (await eda.pcb_PrimitivePour.getAll()).length;
