await eda.dmt_EditorControl.openDocument("a355d18183ca4a75"); await new Promise(r=>setTimeout(r,1000));
for(const p of await eda.pcb_PrimitivePour.getAll()){ try{await p.rebuildCopperRegion();}catch(e){} }
await eda.pcb_Document.save();
return await eda.pcb_Drc.check(true,false,true);
