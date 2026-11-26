// ONE bottom GND pour (board minus 0.5 mm; the keepout region's NO_POURS rule cuts the antenna area), ONE rebuild,
// 30 s limit. Never loop this: Shift+B / rebuild-all froze EasyEDA before.
await eda.dmt_EditorControl.openDocument("a355d18183ca4a75"); await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const mil = v => Math.round(v / 0.0254 * 1000) / 1000;
for (const p of await eda.pcb_PrimitivePour.getAll()) await eda.pcb_PrimitivePour.delete([p.getState_PrimitiveId()]);
const [W, H] = [64, 46], e = 0.5;
const pour = await t(eda.pcb_PrimitivePour.create("GND", 2, eda.pcb_MathPolygon.createPolygon([mil(e), mil(e), "L", mil(W - e), mil(e), mil(W - e), mil(H - e), mil(e), mil(H - e), mil(e), mil(e)]), "solid", false, "GND_BOTTOM", 1, 10, false), 10000); // lineWidth is in mil: 0.2 (as in older notes) is the likely cause of the freezes
if (pour === "TIMEOUT" || !pour) return "create: " + pour;
const rb = await t(pour.rebuildCopperRegion(), 30000);
let fills = null; try { const g = await t(pour.getCopperRegion(), 5000); fills = g && g !== "TIMEOUT" ? g.getState_PourFills().length : String(g); } catch (e) { fills = "ERR " + e.message; }
await eda.pcb_Document.save();
return { rebuild: rb === "TIMEOUT" ? "TIMEOUT" : typeof rb, fills };
