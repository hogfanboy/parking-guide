#!/usr/bin/env python3
# Build scripts/_sch_wire.js from hardware/netlist.txt and a pin dump (python call.py execfile pins.js > pins.json).
# Each pin gets a short stub wire and a net port (GND: ground flag) at its end.
import json, sys, os
here = os.path.dirname(os.path.abspath(__file__))
pins = json.load(open(sys.argv[1], encoding='utf-8'))['result']
# library pin numbers differ from netlist pin numbers for these parts (netlist: diode 1 = K, 2 = A; library: 1 = A, 2 = C)
REMAP = {'D1': {'1': '2', '2': '1'}, 'D2': {'1': '2', '2': '1'}}
want = []
for line in open(os.path.join(here, '..', '..', 'hardware', 'netlist.txt'), encoding='utf-8'):
    line = line.split('#')[0].strip()
    if not line: continue
    ref, net = line.split()
    des, pn = ref.split('.')
    pn = REMAP.get(des, {}).get(pn, pn)
    want.append((des, pn, net))
L = 30
step = {0: (L, 0), 90: (0, L), 180: (-L, 0), 270: (0, -L)}
items = []
for des, pn, net in want:
    ps = {p.split()[0]: p.split() for p in pins[des].split(' | ')}
    _, _, x, y, r = ps[pn]
    x, y, r = float(x), float(y), int(float(r)) % 360
    dx, dy = step[r]
    items.append([x, y, x + dx, y + dy, net, r])
js = open(os.path.join(here, 'scripts', 'sch_wire.tpl.js'), encoding='utf-8').read().replace('__ITEMS__', json.dumps(items))
open(os.path.join(here, 'scripts', '_sch_wire.js'), 'w', encoding='utf-8').write(js)
print(len(items), 'stubs')
