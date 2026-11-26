// V6: swap OPENER_IN and LED_DATA on U1 (OPENER_IN -> GPIO20 pin 4, LED_DATA -> GPIO0 pin 8) so the opto sits
// top-left and the LED header bottom-left. Recreates the two labels at U1's pins.
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3"); await new Promise(r => setTimeout(r, 800));
const t = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r("TIMEOUT"), ms))]);
const U1 = (await eda.sch_PrimitiveComponent.getAll()).find(c => c.getState_Designator?.() === "U1");
const pins = await eda.sch_PrimitiveComponent.getAllPinsByPrimitiveId(U1.getState_PrimitiveId());
const at = n => { const p = pins.find(p => p.getState_PinNumber() === n); return [p.getState_X(), p.getState_Y()]; };
const SW = { "4": "OPENER_IN", "8": "LED_DATA" };
const log = [];
for (const [n, net] of Object.entries(SW)) {
  const [px, py] = at(n);
  // label may sit on the pin or on a short stub end left of it
  const lab = (await eda.sch_PrimitiveComponent.getAll()).filter(c => c.getState_ComponentType?.() === "netport" && Math.abs(c.getState_Y() - py) < 0.5 && c.getState_X() <= px + 0.5 && c.getState_X() >= px - 40);
  for (const c of lab) {
    const x = c.getState_X(), y = c.getState_Y(), r = c.getState_Rotation();
    log.push(`pin ${n}: ${c.getState_Net()} -> ${net} @${x},${y}`);
    await eda.sch_PrimitiveComponent.delete([c.getState_PrimitiveId()]);
    if (await t(eda.sch_PrimitiveComponent.createNetPort("BI", net, x, y, r), 8000) === "TIMEOUT") log.push("TIMEOUT");
  }
  if (!lab.length) log.push("no label at pin " + n);
}
await eda.sch_Document.save();
return log;
