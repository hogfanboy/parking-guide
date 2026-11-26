# PROGRESS

## Current target
Design the PCB in EasyEDA and order 5 boards (2 needed).

## Working state (2026-11-25, schematic V5)
- EasyEDA project ParkingGuide (IDs in CLAUDE.md). Schematic laid out by Hog; matches hardware/netlist.txt
  (checked with EasyEDA's netlist export, and with tools/easyeda/sch_connectivity.py for U3).
- U1 = ESP32-C3 SuperMini 0.42" OLED (BoosterTestJig part, placed by hand: the API hangs on other-library parts).
- U3 = VL53L8CX: public-library part, footprint changed to 1x9 through-hole by Hog; in PCB and BOM.
- I2C only (SPI_I2C_N GND, NCS 3V3, MISO NC). JP1, R7, R8 and R6 removed (buzzer straight to the drain).
- Buttons: TS-1102 vertical 6x6 (C2916316), pin 1 to GPIO, diagonal pin 4 to GND, internal pull-ups.
- PCB: outline, mounting holes, stitching vias, ear holes and keepout exist; parts, tracks and pours were cleared.
  The V1 routing (C3 Zero version) had DRC 0; it is gone.
- GND pour: Shift+B freezes EasyEDA and the API rebuild does nothing. Plan: GND routed as tracks, no pour.

## Next step
1. Import Changes (Hog clicks Apply once), check pcb_Net.getAllNetsName() has every net.
2. layout.json for U1 (17.78 mm rows, pad 1 at USB/top); place, route, DRC 0, push.
3. Calipers on the sensor once it arrives (header position, ear-hole spacing).
