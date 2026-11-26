#!/usr/bin/env python3
# Offline schematic connectivity check (when EasyEDA's netlist export fails).
# usage: python call.py execfile <schdump.js> > dump.json ; python sch_connectivity.py dump.json
# Joins pins, wire vertices and port/flag points that coincide (or lie on a wire segment); names nets from ports/flags.
import json, sys, os, re
r = json.load(open(sys.argv[1], encoding='utf-8'))['result']
R = lambda v: round(float(v), 1)
parent = {}
def find(a):
    parent.setdefault(a, a)
    while parent[a] != a: parent[a] = parent[parent[a]]; a = parent[a]
    return a
def union(a, b): parent[find(a)] = find(b)
segs, pts, names, pins = [], set(), {}, {}
for w in r['wires']:
    line = json.loads(w.rsplit(' ', 1)[0] if w.rstrip().endswith(']') is False else w[:w.rindex(']') + 1])
    flat = [x for x in (line if not isinstance(line[0], list) else sum(line, []))]
    vs = [(R(flat[i]), R(flat[i + 1])) for i in range(0, len(flat), 2)]
    for a, b in zip(vs, vs[1:]): segs.append((a, b)); union(('p',) + a, ('p',) + b)
    pts.update(vs)
for f in r['flags']:
    ty, net, x, y, rot = f.split(' ')
    p = (R(x), R(y)); pts.add(p); names.setdefault(('p',) + p, set()).add(net)
for line in r['parts']:
    des, _, _, _, _, pl = [s.strip() for s in line.split(' | ')]
    for m in re.finditer(r'(\S+)@([-\d.]+),([-\d.]+)r', pl):
        p = (R(m.group(2)), R(m.group(3))); pins[f'{des}.{m.group(1)}'] = p; pts.add(p)
def on(p, a, b):
    (x, y), (x1, y1), (x2, y2) = p, a, b
    return min(x1, x2) - .05 <= x <= max(x1, x2) + .05 and min(y1, y2) - .05 <= y <= max(y1, y2) + .05 and abs((x2 - x1) * (y - y1) - (y2 - y1) * (x - x1)) < .05
for p in pts:
    for a, b in segs:
        if on(p, a, b): union(('p',) + p, ('p',) + a)
netname = {}
for k, ns in names.items():
    root = find(k); netname.setdefault(root, set()).update(ns)
groups = {}
for pin, p in pins.items():
    groups.setdefault(find(('p',) + p), []).append(pin)
out = {}
for root, members in groups.items():
    ns = netname.get(root, set())
    label = '/'.join(sorted(ns)) if ns else ('' if len(members) == 1 else '?' + members[0])
    for m in members: out[m] = label
for k in sorted(out): print(k, out[k])
