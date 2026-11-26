// V5 after Hog's rearrange: LED_OUT labels -> LED_DATA (they sit on the ESP32 side of R5), sensor M1 -> U3,
// U3 not placed on the PCB (its library footprint is SMD; the PCB gets free TH pads instead), then test netlist export.
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const log = [];
for (const c of await eda.sch_PrimitiveComponent.getAll()) {
  if (c.getState_ComponentType?.() === "netport" && c.getState_Net?.() === "LED_OUT") {
    const x = c.getState_X(), y = c.getState_Y(), r = c.getState_Rotation();
    await eda.sch_PrimitiveComponent.delete([c.getState_PrimitiveId()]);
    log.push("LED_DATA@" + x + "," + y + " " + (await t(eda.sch_PrimitiveComponent.createNetPort("BI", "LED_DATA", x, y, r), 8000) === "TIMEOUT" ? "TIMEOUT" : "ok"));
  }
  if (c.getState_Designator?.() === "M1") { await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { designator: "U3", addIntoPcb: false }); log.push("M1->U3, not in PCB"); }
}
await eda.sch_Document.save();
let nl;
try { const f = await t(eda.sch_ManufactureData.getNetlistFile(), 20000); nl = f && f !== "TIMEOUT" ? "OK " + (await f.text()).length : String(f); } catch (e) { nl = "ERR " + e.message; }
log.push("netlist export: " + nl);
try { log.push("delete empty footprint: " + await t(eda.lib_Footprint.delete("218d584431e2450eb0f9939058235194", "b7392d65d61f4ecd8067afd86fe1e5e4"), 8000)); } catch (e) { log.push("fp delete " + e.message); }
return log;
