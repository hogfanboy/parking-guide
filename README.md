# Parking Guide

A ceiling-mounted garage parking guide, one unit per bay. A VL53L8CX 8x8-zone time-of-flight sensor watches the
car's hood from above, and a passive buzzer tells the driver when to stop (rear bumper 12 in inside the door).

- TENSTAR ESP32-C3 Zero (soldered on with pins), USB-C power from the opener's outlet
- VL53L8CX breakout soldered flat on the board, facing the floor (I2C, SPI ready)
- PC817C opto input on the opener's safety-beam terminals as the wake trigger
- Setup from a phone: GitHub Pages web app over Web Bluetooth (`docs/`)
- All through-hole, about 60 x 45 mm, four corner holes for a 3D-printed case

Spec: [PROJECT-NOTES.md](PROJECT-NOTES.md) and the FSD (https://claude.ai/artifact/Jh811QBuL3F9L3Zn1tc5rz). Status: [PROGRESS.md](PROGRESS.md).
