// Board outline (3 mm fillets), plated GND mounting holes + stitching vias, VL53L8CX ear holes (NPTH),
// antenna keepout region, silk outlines and labels. Reads hardware/layout.json (python run_layout.py scripts/pcb_mech.js).
// Safe to re-run: clears its own free pads, vias, polylines, regions and texts first (component pads untouched).
await eda.dmt_EditorControl.openDocument("a355d18183ca4a75");
await new Promise(r => setTimeout(r, 800));
const L = __LAYOUT__;
const mil = v => Math.round(v / 0.0254 * 1000) / 1000;
const log = [];
for (const p of await eda.pcb_PrimitivePad.getAll()) if (!p.getState_ParentPrimitiveId?.()) { try { await eda.pcb_PrimitivePad.delete([p.getState_PrimitiveId()]); } catch (e) {} }
for (const v of await eda.pcb_PrimitiveVia.getAll()) await eda.pcb_PrimitiveVia.delete([v.getState_PrimitiveId()]);
for (const p of await eda.pcb_PrimitivePolyline.getAll()) await eda.pcb_PrimitivePolyline.delete([p.getState_PrimitiveId()]);
try { for (const g of await eda.pcb_PrimitiveRegion.getAll()) await eda.pcb_PrimitiveRegion.delete([g.getState_PrimitiveId()]); } catch (e) { log.push("region clear: " + e.message); }
try { for (const s of await eda.pcb_PrimitiveString.getAll()) await eda.pcb_PrimitiveString.delete([s.getState_PrimitiveId()]); } catch (e) { log.push("text clear: " + e.message); }
// mounting holes: plated, GND pad + 6 stitching vias
const M = L.mount_holes;
let i = 0;
for (const [x, y] of M.at) {
  await eda.pcb_PrimitivePad.create(12, `MH${++i}`, mil(x), mil(y), 0, ["ELLIPSE", mil(M.pad_mm), mil(M.pad_mm)], "GND", ["ROUND", mil(M.hole_mm), mil(M.hole_mm)]);
  for (const [dx, dy] of M.via_offsets) await eda.pcb_PrimitiveVia.create("GND", mil(x + dx), mil(y + dy), mil(M.via[0]), mil(M.via[1]));  // hole, diameter
}
// sensor ear holes: non-plated
const S = L.sensor; i = 0;
for (const [x, y] of S.ear_holes) await eda.pcb_PrimitivePad.create(12, `EH${++i}`, mil(x), mil(y), 0, ["ELLIPSE", mil(S.ear_hole_mm), mil(S.ear_hole_mm)], "", ["ROUND", mil(S.ear_hole_mm), mil(S.ear_hole_mm)], 0, 0, 0, false);
// board outline with 3 mm corner fillets
const [W, H] = L.board, R = 3;
await eda.pcb_PrimitivePolyline.create("", 11, eda.pcb_MathPolygon.createPolygon([mil(R), 0, "L", mil(W - R), 0, "ARC", 90, mil(W), mil(R), "L", mil(W), mil(H - R), "ARC", 90, mil(W - R), mil(H), "L", mil(R), mil(H), "ARC", 90, 0, mil(H - R), "L", 0, mil(R), "ARC", 90, mil(R), 0]), 10);
const rect = (x0, y0, x1, y1) => eda.pcb_MathPolygon.createPolygon([mil(x0), mil(y0), "L", mil(x1), mil(y0), mil(x1), mil(y1), mil(x0), mil(y1), mil(x0), mil(y0)]);
// antenna keepout: no tracks, fills or pours on any layer
const K = L.antenna_keepout;
try { await eda.pcb_PrimitiveRegion.create(12, rect(...K), [5, 6, 7], "ANTENNA_KEEPOUT"); } catch (e) { log.push("keepout: " + e.message); }
// module outlines on top silk
for (const [x0, y0, x1, y1] of Object.values(L.outlines)) await eda.pcb_PrimitivePolyline.create("", 3, rect(x0, y0, x1, y1), 6);
for (const [txt, x, y] of L.labels) {
  try { await eda.pcb_PrimitiveString.create(3, mil(x - txt.length * 0.5), mil(y - 0.6), txt, "default", 40, 6); }
  catch (e) { log.push(`label ${txt}: ${e.message}`); break; }
}
log.push(`holes ${M.at.length}+${S.ear_holes.length}, vias ${M.at.length * M.via_offsets.length}`);
return log;
