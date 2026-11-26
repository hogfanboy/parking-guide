#!/usr/bin/env python3
# Talk to EasyEDA Pro through the Run API Gateway bridge (127.0.0.1:49620-49629).
# usage: python call.py health | windows | exec '<js code>' | execfile <file.js>
import sys, json, urllib.request, urllib.error

def find_port():
    for p in range(49620, 49630):
        try:
            with urllib.request.urlopen(f'http://127.0.0.1:{p}/health', timeout=1.5) as r:
                if json.load(r).get('service') == 'easyeda-bridge':
                    return p
        except Exception:
            pass
    sys.exit('EasyEDA bridge not found: is the API server running and API Gateway connected?')

def req(path, body=None, timeout=90):
    url = f'http://127.0.0.1:{find_port()}{path}'
    data = None if body is None else json.dumps(body).encode()
    r = urllib.request.Request(url, data=data, method='POST' if body else 'GET',
                               headers={'Content-Type': 'application/json'})
    try:
        with urllib.request.urlopen(r, timeout=timeout) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        return {'success': False, 'http': e.code, 'body': e.read().decode('utf-8', 'replace')[:3000]}

cmd = sys.argv[1]
if cmd == 'health': out = req('/health')
elif cmd == 'windows': out = req('/eda-windows')
elif cmd in ('exec', 'execfile'):
    code = sys.argv[2] if cmd == 'exec' else open(sys.argv[2], encoding='utf-8').read()
    out = req('/execute', {'code': code}, timeout=int(sys.argv[3]) if len(sys.argv) > 3 else 90)
else: sys.exit('unknown command')
print(json.dumps(out, indent=1, ensure_ascii=False))
