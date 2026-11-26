// Swap R6 (buzzer series resistor) for a 0 ohm link, same footprint (C119982). Pins land on the existing stubs.
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const old = (await eda.sch_PrimitiveComponent.getAll()).filter(c => c.getState_Designator?.() === "R6");
if (old.length) await eda.sch_PrimitiveComponent.delete(old.map(c => c.getState_PrimitiveId()));
const c = await eda.sch_PrimitiveComponent.create({ libraryUuid: "0819f05c4eef4c71ace90d822a990e87", uuid: "8335bf14d4544e00810d65c0d65a5f5d" }, 620, 200, "", 0, false, true, true);
await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { designator: "R6" });
await eda.sch_Document.save();
const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(c.getState_PrimitiveId());
return { removed: old.length, pins: pins.map(p => [p.getState_PinNumber(), p.getState_X(), p.getState_Y()]) };
