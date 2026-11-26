// Simple BoosterTestJig schematic: wipe page, place parts (skips designators already present).
await eda.dmt_EditorControl.openDocument("1bd8bd7bf6a09b1d");
await new Promise(r => setTimeout(r, 800));
const SYS = "0819f05c4eef4c71ace90d822a990e87";
const U = {
  hdr8f: "5721cc7ce7174f548002ffa702026661", pin1: "41054977296a44b6861f2c322c6316d3",
  jst2: "465449eae63149879e2ef43e05ff6c5c", slide: "5e740139b86d4efdbdbc73257dd8c8aa",
  ldo: "30fdb41a82314ecdac8f094314fca235", c10u: "31559a1b078245eea3a1b75b97efc0d6",
  r100k: "01e0782b27b94dde9b14d52fc85c1237", r10k: "46ecb0c086ad44febdf93b059e354b72",
  btn: "a32cee6d377d410c8133f3a1430a9166",
};
const P = [["J1","hdr8f",100,700],["J2","hdr8f",300,700],["J3","pin1",500,700],["J4","pin1",650,700],["J5","pin1",800,700],["J6","pin1",950,700],["J7","jst2",1100,700],
  ["SW1","slide",100,450],["U2","ldo",300,450],["C1","c10u",500,450],["C2","c10u",650,450],["SW2","btn",800,450],["SW3","btn",1000,450],["SW4","btn",1200,450],
  ["R1","r100k",100,250],["R2","r10k",300,250],["R3","r100k",500,250],["R4","r100k",700,250]];
if (__WIPE__) {
  const comps = (await eda.sch_PrimitiveComponent.getAll()).filter(c => c.getState_ComponentType?.() !== "sheet").map(c => c.getState_PrimitiveId());
  if (comps.length) await eda.sch_PrimitiveComponent.delete(comps);
  const wires = (await eda.sch_PrimitiveWire.getAll()).map(w => w.getState_PrimitiveId());
  if (wires.length) await eda.sch_PrimitiveWire.delete(wires);
}
const have = new Set((await eda.sch_PrimitiveComponent.getAll()).map(c => c.getState_Designator?.()));
for (const [des, key, x, y] of P) {
  if (have.has(des)) continue;
  const c = await eda.sch_PrimitiveComponent.create({ libraryUuid: SYS, uuid: U[key] }, x, y, "", 0, false, true, true);
  await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { designator: des });
}
await eda.sch_Document.save();
return (await eda.sch_PrimitiveComponent.getAll()).map(c => c.getState_Designator?.()).filter(Boolean);
