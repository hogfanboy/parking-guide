// Buttons: GND moves from pin 2 to pin 4 (diagonal to pin 1), which switches whichever way the 4 legs are paired.
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const near = (a, b) => Math.abs(a - b) < 0.5;
const log = [];
for (const [x2, y2, x4, y4] of [[870, 410, 830, 400], [1020, 410, 980, 400]]) {
  for (const w of await eda.sch_PrimitiveWire.getAll()) {
    const l = w.getState_Line(); const f = Array.isArray(l[0]) ? l[0] : l;
    if ((near(f[0], x2) && near(f[1], y2)) || (near(f[2], x2) && near(f[3], y2))) { await eda.sch_PrimitiveWire.delete([w.getState_PrimitiveId()]); log.push("wire@" + x2); }
  }
  for (const c of await eda.sch_PrimitiveComponent.getAll()) {
    if (c.getState_ComponentType?.() === "netflag" || c.getState_ComponentType?.() === "netport") {
      if (near(c.getState_X(), x2 + 30) && near(c.getState_Y(), y2)) { await eda.sch_PrimitiveComponent.delete([c.getState_PrimitiveId()]); log.push("flag@" + (x2 + 30)); }
    }
  }
  await eda.sch_PrimitiveWire.create([x4, y4, x4 - 30, y4], "GND");
  log.push(await t(eda.sch_PrimitiveComponent.createNetFlag("Ground", "GND", x4 - 30, y4, 0), 8000) === "TIMEOUT" ? "flag TIMEOUT" : "flag ok");
}
await eda.sch_Document.save();
return log;
