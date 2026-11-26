# EasyEDA Pro API notes (Run API Gateway bridge)

## Scripts here (ParkingGuide)
- `scripts/sch_place.js` places all parts; `gen_wires.py <pins.json>` turns netlist.txt into `scripts/_sch_wire.js`
  (stub wire + net port per pin) from `sch_wire.tpl.js`; `sch_r6_zero.js`, `sch_sw_diag.js` were one-off edits.
- `run_layout.py scripts/pcb_place.js` / `pcb_mech.js` (outline, holes, vias, keepout, silk); `rules.js`; `renet.js`; `pours.js`;
  `drcsum.js` (counts) / `drcfull.js` (every item): start, then poll `globalThis.__d`.

## Gotchas
- Bridge calls time out at ~30 s (autorouter up to 60 s). Work in small batches. Avoid `sch_Netlist.getNetlist()` and `lib_Footprint.get()` (too slow).
- Long jobs: start without awaiting (`.then(r=>globalThis.__ar=r)`) and poll `return globalThis.__ar`.
  `autoRouting()` can report success with nets unrouted: always DRC. Its "failedNets" lists untouched nets.
- When the 3D view is active, getAll returns null.
- **Create vias BEFORE the tracks that end on them**, or DRC reports them disconnected (delete and re-create the track).
  A via only connects to a track END, not its middle: split the track.
- Round track endpoints to 3 decimals so they match via centres exactly.
- `pcb_PrimitiveVia.create(net, x, y, 12, 24)`: mil; min via 12 hole / 24 dia. Clearance rule 0.152 mm (6 mil).
  Via-to-track clearance ~ 12 + half-width + 6 mil.
- `pcb_PrimitiveLine.create(net, layer 1|2, x0, y0, x1, y1, width)`; `.modify(id,{lineWidth})` sometimes throws
  "reading 'isAsync'": try/catch and retry.
- Pour: `eda.pcb_PrimitivePour.create("GND", layer, eda.pcb_MathPolygon.createPolygon([-20,-380,"L",-20,380,3570,380,3570,-380,-20,-380]), "solid", false, name, 1, 0.2, false)`
  then `rebuildCopperRegion()`. Trust DRC for islands.
- Rules: `pcb_Drc.getCurrentRuleConfiguration()` / `overwriteCurrentRuleConfiguration(config)`; `getNetRules()` / `overwriteNetRules(list)`.
- In-place pad edits (`setState_Pad`) don't update pour clearance: edit footprints instead. Pad shape string 'OVAL'.
- Board outline with fillets: `pcb_MathPolygon.createPolygon([... 'L', x, y, 'ARC', 90, x, y ...])` on layer 11.
- Schematic: y goes up, rotation counter-clockwise. Net ports/flags can't be moved with `modify`: delete and recreate with
  `createNetPort('IN', net, x, y, rot)` / `createNetFlag('Ground','GND', x, y, rot)`. Port above a stub end: rot 90; below: rot 270
  (verify with `sch_Primitive.getPrimitivesBBox`). A port/flag exactly on a pin end connects by itself. Wires that only cross don't connect.
- Find/place parts: `eda.lib_Device.getByLcscIds('C...')`, then `sch_PrimitiveComponent.create({libraryUuid, uuid}, x, y, '', rot, false, true, true)`,
  `modify(id,{designator})`, `getAllPinsByPrimitiveId`. Swap a part: delete, create, set no-connects, rewire, then
  `eda.pcb_Document.importChanges()`; the designer clicks Apply.
- Check schematic with `eda.sch_ManufactureData.getNetlistFile()` -> `.text()` (JSON, `components[id].pinInfoMap`).
- Rendered-image calls return stale pictures: ask the designer for a screenshot.
- `eda.sch_Document.save()` saves the sheet. Library lookup gives basic/extended but not price/stock.

## Learned on BoosterTestJig (2026-11-23)
- The bridge is reachable directly at 127.0.0.1:49620-49629 (`/health`, `/eda-windows`, POST `/execute {code}`); `call.py` here skips the relay.
- A call that times out (30 s) keeps running inside EasyEDA. Never re-run a placement script after a timeout without
  checking what already exists (that is how 16 duplicate parts appeared). Use the background pattern for anything > 10 parts.
- Wiring by name works: `sch_PrimitiveWire.create([x1,y1,x2,y2], "NET")` on each pin end (pin rotation 0/90/180/270 = stub +x/+y/-x/-y).
- `sch_ManufactureData.getNetlistFile()` keys components by Unique ID; duplicate `""` keys collapse in JSON.parse: save first.
- PCB units are mil, y up. Free pads: `pcb_PrimitivePad.create(12, num, x, y, 0, ["ELLIPSE",w,h], net, ["ROUND",d,d], 0,0,0, plated)`.
- `lib_Footprint.getDocumentSource` on system library parts hangs; `lib_Device.search` finds no MT3608/SX1308/TP4056 modules.
- `pcb_Drc.overwriteNetRules` only keeps nets already in `pcb_Net.getAllNetsName()`.
- Wire with net name alone gives a correct schematic netlist, but the PCB import then brings no nets. Use
  `createNetPort("BI", net, x, y, rot)` / `createNetFlag("Ground","GND",x,y,0)` at stub ends: import then registers the nets.
- `sch_PrimitiveAttribute.createNetLabel` never resolves (hangs the script). Don't use it.
- `pcb_Net.setNetlist` returns true but changes nothing.
- `autoRouting()` and DRC only saw the nets on free pads (pcb_PrimitivePad); component pads were treated as no-net,
  even with nets in the import. `startAutoRouting()` never resolves (likely waits on a dialog). Unsolved.
- Other projects: `eda.dmt_Project.getAllProjectsUuid(teamUuid)` (Personal team `b7392d65d61f4ecd8067afd86fe1e5e4`) lists them;
  `openProject(uuid)` switches the window (wait ~4 s). ESP NOW Controller = `baa48745702a46cfaa6ad273d2c09b39`, PCB3 `36b9ffdf4d06a85f`.
- PCB text: only the 7-argument form works: `pcb_PrimitiveString.create(layer, x, y, text, "default", height, lineWidth)`; anchors lower-left.
- After the designer applies Import Changes, component pads carry their nets on the PCB.
- Board scripts take hardware/layout.json via `python run_layout.py scripts/<file>.js`.
- Wires to a pin marked no-connect fail with "create failed!": clear it with pin.toAsync(); pin.setState_NoConnected(false); await pin.done().
- PCB component pad nets can be changed directly: `pcb_PrimitivePad.modify(padId, {net})` (no Import Changes needed).

## Learned on ParkingGuide (2026-11-25)
- `dmt_Project.createProject(name, name)` works; with a teamUuid argument it silently returns nothing. New projects come with
  Board1 (schematic + PCB). `getCurrentProjectInfo().data` gives the page and PCB IDs.
- Parts from another project's library (BoosterTestJig's BUZZER / 2N7000) hang `sch_PrimitiveComponent.create`: use the
  system-library device with the same LCSC number.
- **PCB nets are registered only when Import Changes first ADDS a component.** Re-importing changed parts does not register
  them, and the net list can drop to only the free-pad nets (`pcb_Net.getAllNetsName()` shows it). Then autorouter and DRC
  ignore those pads. Fix: delete all PCB components, `importChanges()`, designer clicks Apply, then re-place
  (`pcb_PrimitiveComponent.modify` x/y/rotation keeps the nets). Check getAllNetsName after every step.
- With nets registered, `pcb_Document.autoRouting({layers:[1,2], ignoreNets:["GND"]})` routed everything in seconds, then
  `{RoutingNets:["GND"]}` for GND. The RPC times out but the job finishes: poll globalThis. It obeys net track rules and keepout regions.
- Keepout: `pcb_PrimitiveRegion.create(12, polygon, [5,6,7], name)` (no wires, fills, pours on all layers).
- `pcb_PrimitiveVia.create(net, x, y, holeDiameter, diameter)`: hole first.
- `pcb_PrimitivePad.getAll()` returns only free pads. Component pads: `pcb_PrimitiveComponent.getAllPinsByPrimitiveId`.
- `rebuildCopperRegion()` returned undefined and no fill on this board: the designer rebuilds pours by hand.
- `pcb_Drc.getNetRules()` lists only registered nets.
