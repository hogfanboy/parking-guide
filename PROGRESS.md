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
- PCB (2026-11-26): 64 x 46 mm, placed per hardware/layout.json. U1 pad 1 at (9.0, 42.5) with USB at the top edge,
  antenna keepout 8-28.5 x 18-23.5 mm. U3 header row at y 8.5 between the M2 ear holes (30.5/58.5, 12).
  U3 footprint (Hog): 9 PTH pads 1.5 x 3.5 mm oblong across the row, 1.0 mm holes, 2.54 mm pitch (1.04 mm gap).
- Routed on 2 layers, GND on tracks (no pour): +5V/+3V3/GND 1 mm, signals 0.25 mm, 27 vias. DRC 0 errors.

## Next step
1. Hog: check the 2D and 3D views (OLED facing the floor side, USB at the top edge, sensor clear).
2. Calipers on the sensor once it arrives (header position, ear-hole spacing), then re-place U3 and re-route.
3. Order 5 boards.
