const keys = __KEYS__;
const out = {};
for (const k of keys) {
  try {
    const r = await eda.lib_Device.search(k);
    out[k] = (r || []).filter(d => !/SMD|SOT|SOP|QFN|LGA|BGA|0402|0603|0805|1206/i.test(d.footprintName || d.footprint?.name || '')).slice(0, 6)
      .map(d => `${d.name} | ${d.supplierId || ''} | ${d.footprintName || d.footprint?.name || ''} | ${d.uuid}`);
  } catch (e) { out[k] = 'ERR ' + e.message; }
}
return out;
