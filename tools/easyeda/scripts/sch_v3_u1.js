// V3: U1 becomes the ESP32-C3 SuperMini OLED as two 1x8 headers (C492407), rows 17.78 mm apart on the PCB.
// (Placing the BoosterTestJig ESP32-C3-OLED library device hangs.) Wipes all wires and net ports/flags for re-wiring.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const w = (await eda.sch_PrimitiveWire.getAll()).map(x => x.getState_PrimitiveId());
if (w.length) await eda.sch_PrimitiveWire.delete(w);
const kill = (await eda.sch_PrimitiveComponent.getAll()).filter(c => ["netflag", "netport"].includes(c.getState_ComponentType?.()) || ["U1L", "U1R"].includes(c.getState_Designator?.())).map(c => c.getState_PrimitiveId());
if (kill.length) await eda.sch_PrimitiveComponent.delete(kill);
for (const [des, x] of [["U1L", 100], ["U1R", 250]]) {
  const c = await eda.sch_PrimitiveComponent.create({ libraryUuid: "0819f05c4eef4c71ace90d822a990e87", uuid: "90ef759e0bc54e7080ee6b830d962fa0" }, x, 650, "", 0, false, true, true);
  await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { designator: des });
}
await eda.sch_Document.save();
globalThis.__job = { wires: w.length, killed: kill.length, des: (await eda.sch_PrimitiveComponent.getAll()).map(c => c.getState_Designator?.()).filter(Boolean).sort().join(",") };
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
