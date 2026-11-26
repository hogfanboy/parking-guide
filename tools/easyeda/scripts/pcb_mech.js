await eda.dmt_EditorControl.openDocument("eb04a63bfb02ce56");
await new Promise(r => setTimeout(r, 800));
// Pogo pads, TP4056 support pads, controller-style mounting holes, board outline, silkscreen.
// Reads hardware/layout.json (injected as __LAYOUT__ by run_layout.py). Safe to re-run: it clears its own items first.
const L = __LAYOUT__;
const mil = v => Math.round(v / 0.0254 * 1000) / 1000;
const log = [];
// clear free pads, vias, outline/silk polylines and texts from earlier runs (component pads are not touched)
for (const p of await eda.pcb_PrimitivePad.getAll()) if (!p.getState_ParentPrimitiveId?.()) { try { await eda.pcb_PrimitivePad.delete([p.getState_PrimitiveId()]); } catch (e) {} }
for (const v of await eda.pcb_PrimitiveVia.getAll()) await eda.pcb_PrimitiveVia.delete([v.getState_PrimitiveId()]);
for (const p of await eda.pcb_PrimitivePolyline.getAll()) await eda.pcb_PrimitivePolyline.delete([p.getState_PrimitiveId()]);
try { for (const s of await eda.pcb_PrimitiveString.getAll()) await eda.pcb_PrimitiveString.delete([s.getState_PrimitiveId()]); } catch (e) { log.push("text clear: " + e.message); }
// pogo pads (6: shared input in the middle, MT3608 output left, SX1308 output right)
const pg = L.pogo;
for (const [name, x, y, net] of pg.pads) {
  await eda.pcb_PrimitivePad.create(12, name, mil(x), mil(y), 0, ["ELLIPSE", mil(pg.pad_mm), mil(pg.pad_mm)], net, ["ROUND", mil(pg.hole_mm), mil(pg.hole_mm)]);
}
// TP4056 unconnected support pads (module IN+/IN- end)
const T = L.tp4056;
for (const [name, x, y] of T.free_pads) {
  await eda.pcb_PrimitivePad.create(12, name, mil(x), mil(y), 0, ["ELLIPSE", mil(T.pad_mm), mil(T.pad_mm)], "", ["ROUND", mil(T.hole_mm), mil(T.hole_mm)]);
}
// mounting holes like the controller: plated, GND pad + 6 stitching vias
const M = L.mount_holes;
let i = 0;
for (const [x, y] of M.at) {
  await eda.pcb_PrimitivePad.create(12, `MH${++i}`, mil(x), mil(y), 0, ["ELLIPSE", mil(M.pad_mm), mil(M.pad_mm)], "GND", ["ROUND", mil(M.hole_mm), mil(M.hole_mm)]);
  for (const [dx, dy] of M.via_offsets) await eda.pcb_PrimitiveVia.create("GND", mil(x + dx), mil(y + dy), mil(M.via[1]), mil(M.via[0]));
}
// board outline with 3 mm corner fillets
const [W, H] = L.board, R = 3;
await eda.pcb_PrimitivePolyline.create("", 11, eda.pcb_MathPolygon.createPolygon([mil(R), 0, "L", mil(W - R), 0, "ARC", 90, mil(W), mil(R), "L", mil(W), mil(H - R), "ARC", 90, mil(W - R), mil(H), "L", mil(R), mil(H), "ARC", 90, 0, mil(H - R), "L", 0, mil(R), "ARC", 90, mil(R), 0]), 10);
const box = (layer, x0, y0, x1, y1) => eda.pcb_PrimitivePolyline.create("", layer, eda.pcb_MathPolygon.createPolygon([mil(x0), mil(y0), "L", mil(x1), mil(y0), mil(x1), mil(y1), mil(x0), mil(y1), mil(x0), mil(y0)]), 6);
// station outlines + ESP32 outline on top silk (3); TP4056 outline on bottom silk (4)
for (const st of Object.values(L.stations)) { const [cx, cy] = st.center, [w, h] = st.size; await box(3, cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2); }
for (const [x0, y0, x1, y1] of Object.values(L.outlines)) await box(3, x0, y0, x1, y1);
await box(4, ...T.outline_bottom_silk);
// labels on top silk
for (const [txt, x, y] of L.labels) {
  // 7-arg form only (more args fail); text anchors at its lower-left, so shift to centre it roughly
  try { await eda.pcb_PrimitiveString.create(3, mil(x - txt.length * 0.5), mil(y - 0.6), txt, "default", 50, 7); }
  catch (e) { log.push(`label ${txt}: ${e.message}`); break; }
}
log.push(`pads ${pg.pads.length + T.free_pads.length + M.at.length}, vias ${M.at.length * M.via_offsets.length}`);
return log;
