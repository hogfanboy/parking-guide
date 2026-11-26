// Run DRC and list every item as "category | obj1 | obj2 @x,y mm". Poll globalThis.__d.
globalThis.__d = "running";
eda.pcb_Drc.check(true, false, true).then(d => {
  const o = [];
  const walk = (a, p) => { for (const x of a) { if (x.list && x.list.length && x.list[0].list !== undefined) walk(x.list, p + x.name + "/"); else if (x.list) for (const e of x.list) o.push(p + x.name + " | " + (e.obj1?.suffix || "") + " | " + (e.obj2?.suffix || "") + " " + JSON.stringify(e.pos || e.position || "")); } };
  walk(d, ""); globalThis.__d = o;
}).catch(e => globalThis.__d = "ERR " + e.message);
return 1;
