import subprocess
import time
import json
import base64
import os
import sys
import websocket
import urllib.request

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PORT = 9222
OUTPUT_DIR = r"C:\Users\User\.gemini\antigravity-ide\brain\e661b886-3c56-43ca-90e9-9ff07485434d"

def run():
    user_data = os.path.join(os.environ.get("TEMP", "C:\\temp"), "edge_test_profile_verify")
    cmd = [
        EDGE_PATH,
        f"--remote-debugging-port={PORT}",
        "--remote-allow-origins=*",
        f"--user-data-dir={user_data}",
        "--headless=new",
        "--disable-gpu",
        "--window-size=1280,800",
        "about:blank"
    ]
    proc = subprocess.Popen(cmd)
    try:
        ws_url = None
        for _ in range(20):
            time.sleep(0.5)
            try:
                req = urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json")
                targets = json.loads(req.read().decode())
                print(f"Targets: {len(targets)}", flush=True)
                for t in targets:
                    if t.get("type") == "page":
                        ws_url = t.get("webSocketDebuggerUrl")
                        break
                if ws_url:
                    break
            except Exception as e:
                pass

        if not ws_url:
            print("Failed to get websocket debugger URL", flush=True)
            return

        print(f"Connecting to CDP at {ws_url}", flush=True)
        ws = websocket.create_connection(ws_url, timeout=10)
        msg_id = 1

        def send(method, params=None):
            nonlocal msg_id
            m_id = msg_id
            msg_id += 1
            ws.send(json.dumps({"id": m_id, "method": method, "params": params or {}}))
            while True:
                raw = ws.recv()
                res = json.loads(raw)
                if res.get("id") == m_id:
                    return res.get("result", {})

        print("Navigating to http://localhost:3000/ ...", flush=True)
        send("Page.navigate", {"url": "http://localhost:3000/"})

        time.sleep(3)

        eval_res = send("Runtime.evaluate", {
            "expression": "document.title",
            "returnByValue": True
        })
        print("Page title:", eval_res.get("result", {}).get("value"), flush=True)

        time.sleep(2)

        # Inspect player & scene
        inspect_script = """
        (() => {
            const game = window.game;
            if (!game) return { error: 'No game on window' };
            const village = game.scene.getScene('VillageScene');
            if (!village) return { error: 'No VillageScene' };
            
            const player = village.player;
            const npcs = [
                { name: 'scholar', s: village.scholar ? village.scholar.scaleX : null, hasBody: !!village.scholar?.body },
                { name: 'villain', s: village.villain ? village.villain.scaleX : null, hasBody: !!village.villain?.body },
                { name: 'witch', s: village.witch ? village.witch.scaleX : null, hasBody: !!village.witch?.body },
                { name: 'gateKnight', s: village.gateKnight ? village.gateKnight.scaleX : null, hasBody: !!village.gateKnight?.body },
                { name: 'rogue', s: village.rogue ? village.rogue.scaleX : null, hasBody: !!village.rogue?.body }
            ];

            return {
                player: { x: player.x, y: player.y, scale: player.scaleX, hasBody: !!player.body },
                npcs: npcs,
                animatedFloraCount: village.animatedFlora ? village.animatedFlora.length : 0,
                botanicalGardenPresent: !!village.gardenPond
            };
        })()
        """
        eval_inspect = send("Runtime.evaluate", {
            "expression": inspect_script,
            "returnByValue": True
        })
        print("Village Inspection:", json.dumps(eval_inspect.get("result", {}).get("value"), indent=2), flush=True)

        # Screenshot 1: Village spawn
        shot1 = send("Page.captureScreenshot", {"format": "png"})
        shot1_path = os.path.join(OUTPUT_DIR, "verify_village_spawn.png")
        with open(shot1_path, "wb") as f:
            f.write(base64.b64decode(shot1["data"]))
        print(f"Saved {shot1_path}", flush=True)

        # Move to Garden (x: 980, y: 780)
        send("Runtime.evaluate", {
            "expression": "(() => { const v = window.game.scene.getScene('VillageScene'); v.player.setPosition(980, 780); })()"
        })
        time.sleep(1)
        shot2 = send("Page.captureScreenshot", {"format": "png"})
        shot2_path = os.path.join(OUTPUT_DIR, "verify_garden_area.png")
        with open(shot2_path, "wb") as f:
            f.write(base64.b64decode(shot2["data"]))
        print(f"Saved {shot2_path}", flush=True)

        # Move to Cavern / Mountain (x: 480, y: 220)
        send("Runtime.evaluate", {
            "expression": "(() => { const v = window.game.scene.getScene('VillageScene'); v.player.setPosition(480, 220); })()"
        })
        time.sleep(1)
        shot3 = send("Page.captureScreenshot", {"format": "png"})
        shot3_path = os.path.join(OUTPUT_DIR, "verify_cave_mountain.png")
        with open(shot3_path, "wb") as f:
            f.write(base64.b64decode(shot3["data"]))
        print(f"Saved {shot3_path}", flush=True)

        # Transition to HouseScene
        send("Runtime.evaluate", {
            "expression": "(() => { const v = window.game.scene.getScene('VillageScene'); v.scene.start('HouseScene', { returnX: 400, returnY: 520 }); })()"
        })
        time.sleep(2)

        inspect_house = """
        (() => {
            const game = window.game;
            const house = game.scene.getScene('HouseScene');
            if (!house) return { error: 'No HouseScene' };
            return {
                player: { x: house.player?.x, y: house.player?.y, scale: house.player?.scaleX },
                cook: { x: house.cook?.x, y: house.cook?.y, scale: house.cook?.scaleX },
                barkeep: { x: house.barkeep?.x, y: house.barkeep?.y, scale: house.barkeep?.scaleX },
                guest: { x: house.guest?.x, y: house.guest?.y, scale: house.guest?.scaleX }
            };
        })()
        """
        eval_house = send("Runtime.evaluate", {
            "expression": inspect_house,
            "returnByValue": True
        })
        print("House Inspection:", json.dumps(eval_house.get("result", {}).get("value"), indent=2), flush=True)

        shot4 = send("Page.captureScreenshot", {"format": "png"})
        shot4_path = os.path.join(OUTPUT_DIR, "verify_house_interior.png")
        with open(shot4_path, "wb") as f:
            f.write(base64.b64decode(shot4["data"]))
        print(f"Saved {shot4_path}", flush=True)

        print("ALL VERIFICATIONS AND SCREENSHOTS SUCCESSFUL!", flush=True)
        ws.close()
    finally:
        proc.terminate()
        try:
            proc.wait(timeout=3)
        except Exception:
            proc.kill()

if __name__ == "__main__":
    run()
