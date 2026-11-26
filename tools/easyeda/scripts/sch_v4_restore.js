// Re-apply the V4 tidy pieces removed while hunting the netlist-export failure: power flags, U1 stubs/ports,
// friendly values, block titles (no no-connect marks). Background: read globalThis.__job once.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const log = [];
const PF = [["+3V3",420,765],["+3V3",420,695],["+3V3",140,280],["+5V",475,590],["+5V",600,750],["+5V",530,335],["+3V3",560,280],["+3V3",115,730]];
for (const [net, x, y] of PF) { const f = await t(eda.sch_PrimitiveComponent.createNetFlag("Power", net, x, y, 0), 8000); if (f === "TIMEOUT") log.push("TIMEOUT pf " + x + "," + y); }
const U1 = (await eda.sch_PrimitiveComponent.getAll()).find(c => c.getState_Designator?.() === "U1");
const NET = { "1": "+5V", "4": "LED_DATA", "7": "BUZZER", "8": "OPENER_IN", "9": "TOF_LPN", "10": "TOF_INT", "11": "TOF_SDA", "12": "TOF_SCL", "13": "BTN1", "16": "BTN2" };
for (const p of await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(U1.getState_PrimitiveId())) {
  const n = p.getState_PinNumber(), net = NET[n]; if (!net) continue;
  const x = p.getState_X(), y = p.getState_Y(), r = p.getState_Rotation(), ex = r === 180 ? x - 30 : x + 30;
  await eda.sch_PrimitiveWire.create([x, y, ex, y], net);
  const f = net === "+5V" ? await t(eda.sch_PrimitiveComponent.createNetFlag("Power", net, ex, y, 0), 8000) : await t(eda.sch_PrimitiveComponent.createNetPort("BI", net, ex, y, r), 8000);
  if (f === "TIMEOUT") log.push("TIMEOUT U1." + n);
}
const VAL = { U1: "ESP32-C3 SuperMini OLED", U3: "VL53L8CX ToF (I2C)", U2: "PC817 opto", D1: "1N4148", D2: "1N4148", Q1: "2N7000",
  BZ1: "Passive buzzer 12mm", R1: "4.7k", R2: "10k", R3: "100k", R5: "330R", R6: "0R link", C1: "100uF 25V", C2: "10uF 25V",
  J2: "Opener beam (WHT, GRY)", J3: "LED strip (5V, DATA, GND)", SW1: "Button 6x6", SW2: "Button 6x6" };
for (const c of await eda.sch_PrimitiveComponent.getAll()) { const v = VAL[c.getState_Designator?.()]; if (v) await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { name: v }); }
const T = [[60, 800, "ESP32 board (SuperMini + OLED)"], [400, 800, "ToF sensor (I2C)"], [590, 800, "LED strip header"],
  [740, 800, "Opener terminal"], [1010, 800, "Buttons"], [80, 600, "Opener input (isolated)"], [440, 630, "Buzzer"],
  [520, 380, "Power filtering"], [110, 205, "LED strip data"]];
for (const s of await eda.sch_PrimitiveText.getAll()) await eda.sch_PrimitiveText.delete([s.getState_PrimitiveId()]);
for (const [x, y, s] of T) await eda.sch_PrimitiveText.create(x, y, s, 0, null, null, null, true);
await eda.sch_Document.save();
globalThis.__job = { log, flags: (await eda.sch_PrimitiveComponent.getAll()).filter(c => ["netflag","netport"].includes(c.getState_ComponentType?.())).length, wires: (await eda.sch_PrimitiveWire.getAll()).length };
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
