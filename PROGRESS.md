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
- PCB V6 (2026-11-26): U1 centred, USB at the top edge; left-row parts on the left (J2, opto, Q1/R3, J3/R5),
  right-row parts on the right (buttons, BZ1/D2, C1/C2); U3 rotated 180 across the bottom between its M2 holes.
  Pin swap: OPENER_IN on GPIO20, LED_DATA on GPIO0. All nets routed except GND (1 mm power, 0.25 mm signals).
- GND on tracks (1 mm, autorouted), no pour: pours freeze EasyEDA on this PC, even a hand-drawn one with default
  settings (cause unknown; the API pours also used a bad 0.2 mil line width). Mounting holes have no net (plain
  plated holes, no stitching vias). DRC 0 errors (2026-11-26). 2 routing vias.

## Next step
1. Hog: check the 2D and 3D views (OLED facing the floor side, USB at the top edge, sensor clear).
2. Calipers on the sensor once it arrives (header position, ear-hole spacing), then re-place U3 and re-route.
3. Order 5 boards.
