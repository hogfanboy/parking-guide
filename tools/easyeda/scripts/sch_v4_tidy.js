// V4 tidy after Hog placed U1 (ESP32-C3-OLED) by hand: remove zero-length wires, power ports -> power flags,
// wire U1 with stubs + net ports, no-connect marks on unused pins, friendly values, block titles.
// Background: read globalThis.__job once after ~40 s.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const log = [];
// 1. zero-length wires
for (const w of await eda.sch_PrimitiveWire.getAll()) {
  const l = w.getState_Line(); const f = (Array.isArray(l[0]) ? l.flat() : l);
  const xs = f.filter((_, i) => i % 2 === 0), ys = f.filter((_, i) => i % 2 === 1);
  if (Math.max(...xs) - Math.min(...xs) < 0.01 && Math.max(...ys) - Math.min(...ys) < 0.01) { await eda.sch_PrimitiveWire.delete([w.getState_PrimitiveId()]); log.push("zero wire " + f.slice(0, 2)); }
}
// 2. power net ports -> power flags (pointing up)
for (const c of await eda.sch_PrimitiveComponent.getAll()) {
  if (c.getState_ComponentType?.() !== "netport") continue;
  const net = c.getState_Net?.() ?? c.getState_Name?.();
  if (net !== "+5V" && net !== "+3V3") continue;
  const x = c.getState_X(), y = c.getState_Y();
  await eda.sch_PrimitiveComponent.delete([c.getState_PrimitiveId()]);
  const f = await t(eda.sch_PrimitiveComponent.createNetFlag("Power", net, x, y, 0), 8000);
  log.push((f === "TIMEOUT" ? "TIMEOUT " : "") + "power " + net + "@" + x + "," + y);
}
// 3. U1 stubs + ports
const U1 = (await eda.sch_PrimitiveComponent.getAll()).find(c => c.getState_Component?.()?.name === "ESP32-C3-OLED");
await eda.sch_PrimitiveComponent.modify(U1.getState_PrimitiveId(), { designator: "U1" });
const NET = { "1": "+5V", "4": "LED_DATA", "7": "BUZZER", "8": "OPENER_IN", "9": "TOF_LPN", "10": "TOF_INT", "11": "TOF_SDA", "12": "TOF_SCL", "13": "BTN1", "16": "BTN2" };
const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(U1.getState_PrimitiveId());
for (const p of pins) {
  const n = p.getState_PinNumber(), net = NET[n]; if (!net) continue;
  const x = p.getState_X(), y = p.getState_Y(), r = p.getState_Rotation();
  const ex = r === 180 ? x - 30 : x + 30;
  await eda.sch_PrimitiveWire.create([x, y, ex, y], net);
  const f = net === "+5V" ? await t(eda.sch_PrimitiveComponent.createNetFlag("Power", net, ex, y, 0), 8000)
                          : await t(eda.sch_PrimitiveComponent.createNetPort("BI", net, ex, y, r), 8000);
  log.push((f === "TIMEOUT" ? "TIMEOUT " : "") + "U1." + n + " " + net);
}
// 4. no-connect marks
const NC = { U1: ["5", "6", "14", "15"], U3: ["5"], SW1: ["2", "3"], SW2: ["2", "3"] };
const all = await eda.sch_PrimitiveComponent.getAll();
for (const [des, list] of Object.entries(NC)) {
  const c = all.find(x => x.getState_Designator?.() === des); if (!c) { log.push("no " + des); continue; }
  for (const p of await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId())) {
    if (!list.includes(p.getState_PinNumber())) continue;
    try { p.toAsync(); p.setState_NoConnected(true); await p.done(); } catch (e) { log.push("nc " + des + "." + p.getState_PinNumber() + " " + e.message); }
  }
}
// 5. friendly values
const VAL = { U1: "ESP32-C3 SuperMini OLED", U3: "VL53L8CX ToF (I2C)", U2: "PC817 opto", D1: "1N4148", D2: "1N4148", Q1: "2N7000",
  BZ1: "Passive buzzer 12mm", R1: "4.7k", R2: "10k", R3: "100k", R5: "330R", R6: "0R link", C1: "100uF 25V", C2: "10uF 25V",
  J2: "Opener beam (WHT, GRY)", J3: "LED strip (5V, DATA, GND)", SW1: "Button 6x6", SW2: "Button 6x6" };
for (const c of await eda.sch_PrimitiveComponent.getAll()) {
  const v = VAL[c.getState_Designator?.()]; if (!v) continue;
  try { await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { name: v }); } catch (e) { log.push("val " + e.message); }
}
// 6. block titles
for (const s of await eda.sch_PrimitiveText.getAll()) await eda.sch_PrimitiveText.delete([s.getState_PrimitiveId()]);
const T = [[60, 800, "ESP32 board (SuperMini + OLED)"], [400, 800, "ToF sensor (I2C)"], [590, 800, "LED strip header"],
  [740, 800, "Opener terminal"], [1010, 800, "Buttons"], [80, 600, "Opener input (isolated)"], [440, 630, "Buzzer"],
  [520, 380, "Power filtering"], [110, 205, "LED strip data"]];
for (const [x, y, s] of T) { try { await eda.sch_PrimitiveText.create(x, y, s, 0, null, null, null, true); } catch (e) { log.push("text " + e.message); break; } }
await eda.sch_Document.save();
globalThis.__job = log;
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
