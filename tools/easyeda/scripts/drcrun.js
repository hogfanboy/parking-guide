await eda.dmt_EditorControl.openDocument("eb04a63bfb02ce56"); await new Promise(r=>setTimeout(r,1000));
for(const p of await eda.pcb_PrimitivePour.getAll()){ try{await p.rebuildCopperRegion();}catch(e){} }
await eda.pcb_Document.save();
return await eda.pcb_Drc.check(true,false,true);
