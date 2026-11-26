// Place all BoosterTestJig parts on the blank schematic (grid layout), set designators/values.
await eda.dmt_EditorControl.openDocument("1bd8bd7bf6a09b1d");
await new Promise(r => setTimeout(r, 800));
const SYS = "0819f05c4eef4c71ace90d822a990e87";
const U = {
  hdr8f: "5721cc7ce7174f548002ffa702026661", pin1: "41054977296a44b6861f2c322c6316d3",
  jst2: "465449eae63149879e2ef43e05ff6c5c", hdr4: "f70eda5267b34d9799800488a27be0c6",
  slide: "c6b77b1c04e443acb11c82ac12927c58", ldo: "72b9a8a2a9f84b17871486645743d965",
  opamp: "1e6e725c57c84ef6902319be0bbcf360", fet: "57efe5bd595743e7ba176165173f5142",
  ptc: "e1483a00db7e4535a9351ffbb2f0a1b2", ws: "c1eba9f1770d41448bbae4e07caaef8e",
  enc: "d72f332cc61c472c85defc21020ca3ca", piezo: "f0e17f12aaa14f30b9862cb75561723c",
  tp: "0449f70ddb3141d2ba5bdee804074e43",
  r100k: "01e0782b27b94dde9b14d52fc85c1237", r8k2: "79d82910c982417e858ed6a696ac46f8",
  r1k: "7f561771920942739785dbe89c9a80dc", r56k: "9b7b205637154427abccb511224dc794",
  r10k: "46ecb0c086ad44febdf93b059e354b72", r100: "70e6ee3b617e45e19cd41072d7be1388",
  r330: "af0205cffb4c450f94dda37a8c56a788", rsense: "ecccd6ec075e4cc391bf2ffdec7be6b4",
  c100n: "86d898f340ee4ce9a13303510059829f", c1u: "1eaf6ecce42343989010cffcd42e7739",
  c100u: "5b3513364d364ea5a6629871633d1bc4",
};
const P = __PARTS__;
const out = {};
for (const [des, key, x, y] of P) {
  const c = await eda.sch_PrimitiveComponent.create({ libraryUuid: SYS, uuid: U[key] }, x, y, "", 0, false, true, true);
  const id = c.getState_PrimitiveId ? c.getState_PrimitiveId() : c.primitiveId;
  try { await eda.sch_PrimitiveComponent.modify(id, { designator: des }); } catch (e) {}
  out[des] = id;
}
return out;
