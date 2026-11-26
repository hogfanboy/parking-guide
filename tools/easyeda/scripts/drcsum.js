// Run DRC and summarise by category (counts + 3 examples). Poll globalThis.__d.
globalThis.__d = "running";
eda.pcb_Drc.check(true, false, true).then(d => {
  const o = {};
  const walk = (a, p) => { for (const x of a) { if (x.list && x.list.length && x.list[0].list !== undefined) walk(x.list, p + x.name + "/"); else if (x.list) { o[p + x.name] = [x.list.length, ...x.list.slice(0, 3).map(e => (e.obj1?.suffix || "") + " | " + (e.obj2?.suffix || "") + " @" + Math.round((e.pos?.x||0)*0.0254*10)/10 + "," + Math.round((e.pos?.y||0)*0.0254*10)/10)]; } } };
  walk(d, ""); globalThis.__d = o;
}).catch(e => globalThis.__d = "ERR " + e.message);
return 1;
