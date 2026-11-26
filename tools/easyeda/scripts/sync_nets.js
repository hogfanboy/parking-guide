// Copy pin nets from hardware/netlist.txt (verified against the schematic) into the PCB netlist.
await eda.dmt_EditorControl.openDocument("eb04a63bfb02ce56");
await new Promise(r => setTimeout(r, 800));
const WANT = __WANT__;
const d = JSON.parse(await eda.pcb_Net.getNetlist());
let set = 0;
for (const c of Object.values(d.components)) {
  const des = c.props.Designator;
  for (const [pn, info] of Object.entries(c.pinInfoMap || {})) {
    const n = WANT[`${des}.${info.number || pn}`];
    if (n) { info.net = n; set++; }
  }
}
const r = await eda.pcb_Net.setNetlist(JSON.stringify(d));
await new Promise(r => setTimeout(r, 1500));
return { set, r, nets: (await eda.pcb_Net.getAllNetsName()).length };
