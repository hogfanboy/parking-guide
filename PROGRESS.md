# PROGRESS

## Current target
Design the PCB in EasyEDA and order 5 boards (2 needed).

## Working state (2026-11-25)
- EasyEDA project ParkingGuide built through the API (IDs in CLAUDE.md). Schematic matches hardware/netlist.txt pin for pin.
- PCB 64 x 46 mm, 3 mm fillets, placed per hardware/layout.json. Four 3.2 mm plated GND holes with 6 stitching vias each,
  two 2.2 mm NPTH ear holes for the sensor, antenna keepout region (no tracks/fills/pours) under the C3 Zero antenna end.
- Fully autorouted on 2 layers: +5V/+3V3/GND 1 mm, signals 0.254 mm. DRC 0 errors.
- Bottom GND pour exists but is NOT filled (the API rebuild returns nothing): Hog rebuilds it by hand, then DRC again.
- Parts (LCSC, all through-hole): U1L/U1R/U3 PZ254V-11-09P 1x9 headers (C3 Zero rows 15.24 mm apart; sensor header),
  JP1/J3 PZ254V-11-03P, J2 KF128-5.08-2P, U2 PC817 C60965, D1/D2 1N4148 C14516, Q1 2N7000 C900717, BZ1 C9900006103,
  SW1/SW2 KH-6X6X5H-ZJ C2837541, C1 100 uF 25 V C44589, C2 10 uF 25 V C43846, R1 4.7k, R2/R7/R8 10k, R3 100k,
  R5 330, R6 0 ohm link C119982 (all CF1/4W, 10.5 mm pitch).
- Decisions: BoosterTestJig's ESP32 part is the 2x8 C3 SuperMini OLED, not a C3 Zero, so U1 is two 1x9 headers.
  Buttons use diagonal pins 1 and 4 (switches whichever way the legs are paired). R6 = 0 ohm.
- No battery: USB only. Sensor VIN on 3V3.

## Next step
1. Hog: in EasyEDA rebuild the pour (Shift+B, or right-click the pour > Rebuild Copper Region), then Design > Check DRC.
2. Calipers: C3 Zero row spacing, VL53L8CX header position and ear-hole spacing once the part arrives. Update layout.json,
   re-place, re-route, DRC.
3. Order the PCB. Breadboard T-1/T-2 on the opener line before ordering if possible.
