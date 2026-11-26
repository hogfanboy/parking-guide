// Place all ParkingGuide parts on the schematic in a grid (skips designators already present). Background job: poll globalThis.__job.
globalThis.__job = "running";
(async () => {
await eda.dmt_EditorControl.openDocument("c793a3fad343d4e3");
await new Promise(r => setTimeout(r, 800));
const SYS = "0819f05c4eef4c71ace90d822a990e87";
const U = {
  hdr9: [SYS, "c2707eb7d59543138b9a750af2cae0b7"], hdr3: [SYS, "3c2517dd0d3741b3a6071ea8b3f9b7e9"],
  term2: [SYS, "7c97b15e3c534a1ead50545f9e4cec60"], opto: [SYS, "cbd84f6e2df74f1eb604c43aee682c29"],
  d4148: [SYS, "398e723d60cb486db9a211b31f97db42"], sw: [SYS, "18611560d81245248662d0dbe7a3eb54"],
  c100u: [SYS, "3e192632e5f34273a11ff8d046a77a9b"], c10u: [SYS, "bfece76e292149748246ec2645d77454"],
  r4k7: [SYS, "f8417db3ff2c4daea181649f0dbb00e6"], r10k: [SYS, "48fa097882ff4ae29ac60dee89d4c189"],
  r100k: [SYS, "79b79ee9b058457380c545ef55661cb5"], r330: [SYS, "173621e727944754937e352bbd454983"],
  r100: [SYS, "1db8c7cb2c5f474c95c27f62aa474245"],
  bz: [SYS, "1e7825a2c2f94a6faf7494f6ed292dcb"], fet: [SYS, "c90635670bb14834b0fd0672c8144918"],
};
const P = [
  ["U1L","hdr9",100,650],["U1R","hdr9",250,650],["U3","hdr9",400,650],["JP1","hdr3",550,650],["J3","hdr3",700,650],["J2","term2",850,650],
  ["U2","opto",100,400],["D1","d4148",250,400],["D2","d4148",400,400],["BZ1","bz",550,400],["Q1","fet",700,400],["SW1","sw",850,400],["SW2","sw",1000,400],
  ["R1","r4k7",100,200],["R2","r10k",230,200],["R3","r100k",360,200],["R5","r330",490,200],["R6","r100",620,200],["R7","r10k",750,200],["R8","r10k",880,200],
  ["C1","c100u",1000,200],["C2","c10u",1000,650],
];
const have = new Set((await eda.sch_PrimitiveComponent.getAll()).map(c => c.getState_Designator?.()));
const out = {}, err = {};
for (const [des, key, x, y] of P) {
  if (have.has(des)) { out[des] = "exists"; continue; }
  try {
    const c = await eda.sch_PrimitiveComponent.create({ libraryUuid: U[key][0], uuid: U[key][1] }, x, y, "", 0, false, true, true);
    await eda.sch_PrimitiveComponent.modify(c.getState_PrimitiveId(), { designator: des });
    out[des] = c.getState_PrimitiveId();
  } catch (e) { err[des] = e.message; }
  globalThis.__job = "running " + Object.keys(out).length;
}
await eda.sch_Document.save();
globalThis.__job = { out, err };
})().catch(e => globalThis.__job = "ERR " + e.message);
return 1;
