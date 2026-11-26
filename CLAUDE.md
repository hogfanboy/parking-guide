# CLAUDE.md

ParkingGuide: two identical ceiling units (one per bay) that guide each car to its stop spot by sound.
TENSTAR ESP32-C3 Zero + VL53L8CX, passive buzzer, PC817C on the opener safety-beam line. PCB designed in EasyEDA Pro
through its API (same bridge as hogfanboy/booster-test-jig). Phone setup app on GitHub Pages (Web Bluetooth).

**Read [PROGRESS.md](PROGRESS.md) first.** [PROJECT-NOTES.md](PROJECT-NOTES.md) is the spec and settled truth; the full FSD
is the Claude Doc linked in the README.

## Docs (four files, one job each)
- `CLAUDE.md`: permanent rules and commands only. No brainstorming.
- `PROGRESS.md`: current target, what just broke, next step. Under 60 lines.
- `PROJECT-NOTES.md`: the spec and settled truth. Add only things that are built and verified.
- `IDEAS.md`: backlog. When the user says "park this", append one line and go back to the current task.
- `tools/easyeda/API-NOTES.md`: EasyEDA Pro API gotchas. **Read it before writing any EasyEDA script.**

## Rules
- The user is a beginner with Arduino code and toolchain settings: explain in plain-language steps.
- Through-hole parts only. Keep the PCB simple; features go in firmware. Board under 70 x 50 mm.
- `hardware/netlist.txt` is the source of truth for connections; `hardware/layout.json` for positions (mm),
  until the design moves into EasyEDA. Module pad positions are estimates until measured with calipers.
- The units only LISTEN to the opener's safety-beam line. Never drive or short it.
- Always run DRC after any PCB change, and trust DRC over the autorouter's report.
- Never commit `media/`. Commit as hogfanboy (noreply), never a personal email.
- After any design change, feature or bug fix, update PROGRESS.md. Then say: "Task complete and PROGRESS.md updated. Ready for /clear."

## Layout
- `hardware/`: netlist.txt, layout.json. `tools/easyeda/`: `call.py` (bridge on 127.0.0.1:49620-49629) and `scripts/`.
- `firmware/`: Arduino sketch (none yet). `docs/`: GitHub Pages phone setup app + ESP Web Tools installer (none yet).

## EasyEDA bridge
1. User: EasyEDA Pro open with the ParkingGuide project; Run API Gateway extension has "Allow interact with external" on.
2. API server: `cd %USERPROFILE%\Documents\EasyEDA-Claude\easyeda-api-skill-main` then `npm run server`.
3. User: EasyEDA menu API Gateway > Reconnect.
4. From `tools/easyeda`: `python call.py health` (also `windows`, `exec '<js>'`, `execfile <file.js> [timeout_s]`).

IDs: project `TBD`; schematic page `TBD`; PCB `TBD`. Start every PCB script with
`await eda.dmt_EditorControl.openDocument("<PCB id>")` plus a short wait.
The scripts in `tools/easyeda/scripts/` came from booster-test-jig: their document IDs and layout fields must be
updated for this board before use.

## Build (firmware, once it exists)
Arduino CLI: `/c/Users/hogfa/AppData/Local/Programs/arduino-cli/arduino-cli.exe` (not on PATH).
Board: ESP32C3 Dev Module with USB CDC on boot enabled (to confirm on the TENSTAR C3 Zero).
