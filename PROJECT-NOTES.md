# PROJECT-NOTES (spec)

Settled truth only. Items marked **[unverified]** are designed but not yet built or measured.
Full FSD: https://claude.ai/artifact/Jh811QBuL3F9L3Zn1tc5rz

## 1. Garage
19 ft x 25 ft, one 16 ft door, one Chamberlain opener on the centre line (logic board 41AB050-2, 2008, purple LEARN
button = Security+), ceiling 112 in, 4 in curb 224 in from the door. Seen from the driver's seat: bay 1 (left) Honda CR-V,
bay 2 (right) 2026 Toyota bZ. Target: rear bumper 12 in inside the door. Each unit about 180 in from the door, above
its car's wall-side hood edge (CR-V left edge, bZ right edge), 8-10 in inboard of it **[unverified]**.

## 2. Power
USB-C 5 V from a dual-port charger in the opener's outlet, one cable per unit. No battery (decided 2026-11-26: the
sensor must be awake whenever a car may arrive, the opener line pulses constantly so it cannot wake a sleeping ESP32
without extra parts, and recharging means a ladder).
Sensor VIN is wired to the C3 Zero's 3V3 pin: its level shifter drives I/O at VIN level, so 5 V there would put 5 V
on ESP32 pins. Pololu rates the same design for 3.2-5.5 V **[unverified on this module]**.

## 3. Pins (ESP32-C3 SuperMini with 0.42" OLED) [unverified]
BoosterTestJig library part ESP32-C3-OLED (footprint ESP32_C3_42OLED, two 1x8 rows 17.78 mm apart, pin 1 at USB).
Mounted on the parts side so the OLED faces the floor; USB at the board's top edge.
| GPIO | Net | Use |
|---|---|---|
| 0 | OPENER_IN | PC817C output, internal pull-up (R2 10k optional) |
| 1 | BUZZER | 2N7000 gate (R3 100k pull-down) |
| 3 | TOF_LPN | Sensor enable |
| 4 | TOF_INT | Sensor data ready |
| 5 | TOF_SDA | I2C data, shared with the on-board OLED |
| 6 | TOF_SCL | I2C clock, shared with the on-board OLED |
| 7 | BTN1 | Spare button to GND, internal pull-up |
| 10 | BTN2 | Spare button to GND, internal pull-up |
| 20 | LED_DATA | Future LED strip, 330 ohm |
Leave GPIO2, GPIO8 (on-board LED), GPIO9 (BOOT) and GPIO21 unconnected.

## 4. Sensor [unverified]
VL53L8CX red breakout, 33 x 10 mm, 1x9 header: VIN, GND, SDA/MOSI, SCL/CLK, MISO, LPn, INT, NCS, SPI_I2C_N.
Soldered flat on the board with its own straight header, facing the floor; two M2 nylon screws through its ears.
I2C only: SPI_I2C_N tied to GND, NCS tied to 3V3, MISO not connected. Schematic symbol from the public library
with its footprint changed to 1x9 through-hole by Hog (2026-11-26).

## 5. Opener input [unverified]
J2 screw terminal -> R1 4.7k -> PC817C LED (D1 1N4148 reversed across it) -> back to J2. Both units in parallel on the
opener's safety-sensor terminals (white = signal, grey = common on this opener). The push-in terminals take one wire
each, so splice with lever nuts. Beam clear = ~156 Hz pulses; broken = no pulses. Units only listen.

## 6. Buzzer [unverified]
Passive 12 mm buzzer from +5V to the 2N7000 drain with no series resistor (loudest), 1N4148 flyback across it.
