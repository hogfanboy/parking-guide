# PROGRESS

## Current target
Design the PCB in EasyEDA and order 5 boards (2 needed).

## Working state (2026-11-26)
- FSD written and revised with Hog's answers. Nothing built yet.
- Decisions: VL53L8CX over I2C (SPI wired, JP1 selects), soldered flat on the board; raw PC817C + 4.7k + 1N4148;
  setup by phone over Web Bluetooth (GitHub Pages); two identical boards, one per bay; buttons are spares only.
- hardware/netlist.txt and hardware/layout.json (64 x 46 mm, first guess) drafted from the FSD.
- No battery: USB only. Sensor VIN on 3V3. Units sit over each car's wall-side hood edge.

## Next step (goal: order the PCB, firmware after)
1. Calipers: C3 Zero row spacing and size, VL53L8CX header position and ear-hole spacing. Update layout.json.
2. EasyEDA session: create the ParkingGuide project, build the schematic from netlist.txt, place, route, DRC.
3. In parallel if possible: breadboard T-1/T-2 on the opener line before ordering.
