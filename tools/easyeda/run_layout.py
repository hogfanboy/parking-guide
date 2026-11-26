#!/usr/bin/env python3
# Inject hardware/layout.json into a board script and run it through the bridge.
# usage (from tools/easyeda): python run_layout.py scripts/pcb_place.js | scripts/pcb_mech.js
import json, subprocess, sys, os, tempfile
here = os.path.dirname(os.path.abspath(__file__))
layout = json.load(open(os.path.join(here, '..', '..', 'hardware', 'layout.json'), encoding='utf-8'))
code = open(sys.argv[1], encoding='utf-8').read().replace('__LAYOUT__', json.dumps(layout))
with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False, encoding='utf-8') as f:
    f.write(code)
subprocess.run([sys.executable, os.path.join(here, 'call.py'), 'execfile', f.name, sys.argv[2] if len(sys.argv) > 2 else '90'])
os.unlink(f.name)
