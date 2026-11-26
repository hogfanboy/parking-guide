// V2 (I2C only, buttons on GPIO5/7): wipe all wires and net ports/flags, remove JP1/R7/R8 and the
// right-angle switches, place TS-1102 vertical 6x6 switches (C2916316). Background: read globalThis.__job once.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const w = (await eda.sch_PrimitiveWire.getAll()).map(x => x.getState_PrimitiveId());
if (w.length) await eda.sch_PrimitiveWire.delete(w);
const all = await eda.sch_PrimitiveComponent.getAll();
const kill = all.filter(c => ["netflag", "netport"].includes(c.getState_ComponentType?.()) || ["JP1", "R7", "R8", "SW1", "SW2"].includes(c.getState_Designator?.())).map(c => c.getState_PrimitiveId());
if (kill.length) await eda.sch_PrimitiveComponent.delete(kill);
for (const [des, x] of [["SW1", 850], ["SW2", 1000]]) {
  const c = await eda.sch_PrimitiveComponent.create({ libraryUuid: "0819f05c4eef4c71ace90d822a990e87", uuid: "6aa3dc054e3a4a2e8444e89a13f2a61a" }, x, 400, "", 0, false, true, true);
  await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { designator: des });
}
await eda.sch_Document.save();
const left = await eda.sch_PrimitiveComponent.getAll();
globalThis.__job = { wires: w.length, killed: kill.length, types: [...new Set(left.map(c => c.getState_ComponentType?.()))], des: left.map(c => c.getState_Designator?.()).filter(Boolean).sort().join(",") };
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
