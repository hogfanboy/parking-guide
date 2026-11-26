// Track widths: pwr (+5V, +3V3, GND) = 1.0 mm (min 0.5), signals default 0.3 mm.
await eda.dmt_EditorControl.openDocument("a355d18183ca4a75");
await new Promise(r => setTimeout(r, 800));
const c = await eda.pcb_Drc.getCurrentRuleConfiguration();
const T = c.config.Physics.Track;
T.pwr = {editName:"pwr", unit:"mm", isSetDefault:false, form:{status:1, data:{"1":{minValue:0.5, defaultValue:1.0, maxValue:2.54}}}};
await eda.pcb_Drc.overwriteCurrentRuleConfiguration(c.config);
const nr = await eda.pcb_Drc.getNetRules();
for (const n of nr) if (["+5V", "+3V3", "GND"].includes(n.name)) n.Track = "pwr";
await eda.pcb_Drc.overwriteNetRules(nr);
return { tracks: Object.keys(T), def: JSON.stringify(T[Object.keys(T).find(k => T[k].isSetDefault)]?.form), nets: (await eda.pcb_Drc.getNetRules()).filter(n => n.Track !== "default").map(n => [n.name, n.Track]) };
