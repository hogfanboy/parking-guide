// Track widths: pwr = 0.762 mm (battery path), gnd = 0.6 mm. Signals stay default (0.254 mm).
await eda.dmt_EditorControl.openDocument("eb04a63bfb02ce56");
await new Promise(r => setTimeout(r, 800));
const c = await eda.pcb_Drc.getCurrentRuleConfiguration();
const T = c.config.Physics.Track;
T.pwr = {editName:"pwr", unit:"mm", isSetDefault:false, form:{status:1, data:{"1":{minValue:0.254, defaultValue:0.762, maxValue:2.54}}}};
T.gnd = {editName:"gnd", unit:"mm", isSetDefault:false, form:{status:1, data:{"1":{minValue:0.254, defaultValue:0.6, maxValue:2.54}}}};
await eda.pcb_Drc.overwriteCurrentRuleConfiguration(c.config);
const nr = await eda.pcb_Drc.getNetRules();
const pwr = ["VBAT_SW", "VBAT_RAW", "BAT+", "BAT-"];
for (const n of nr) { if (pwr.includes(n.name)) n.Track = "pwr"; if (n.name === "GND" || n.name === "+3V3") n.Track = "gnd"; }
await eda.pcb_Drc.overwriteNetRules(nr);
return (await eda.pcb_Drc.getNetRules()).filter(n => n.Track !== "default").map(n => [n.name, n.Track]);
