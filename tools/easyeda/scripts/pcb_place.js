// Move every PCB component to hardware/layout.json positions (mm -> mil).
await eda.dmt_EditorControl.openDocument("eb04a63bfb02ce56");
await new Promise(r => setTimeout(r, 800));
const L = __LAYOUT__;
const mil = v => Math.round(v / 0.0254 * 1000) / 1000;
const byDes = {};
for (const c of await eda.pcb_PrimitiveComponent.getAll()) byDes[c.getState_Designator()] = c.getState_PrimitiveId();
const miss = [];
for (const [d, [x, y, r]] of Object.entries(L.parts)) {
  if (!byDes[d]) { miss.push(d); continue; }
  await eda.pcb_PrimitiveComponent.modify(byDes[d], { x: mil(x), y: mil(y), rotation: r });
}
return { moved: Object.keys(L.parts).length - miss.length, miss, unplaced: Object.keys(byDes).filter(d => !L.parts[d]) };
