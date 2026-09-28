import os
from PIL import Image, ImageDraw
import random

PROPS = "f:/New portfolio/public/assets/environment/clean_props"
os.makedirs(PROPS, exist_ok=True)

def generate_mountain_ridge():
    """
    Generate a 480x220 high-fidelity pixel art mountain cliff ridge 
    matching the palette and style of hill_cave_mountain.png.
    """
    W, H = 480, 220
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Matching palette from hill_cave_mountain.png
    c_out = (38, 38, 48, 255)
    c_stone_hi = (188, 192, 200, 255)
    c_stone_mid = (148, 152, 160, 255)
    c_stone_sh = (112, 116, 126, 255)
    c_stone_deep = (78, 80, 92, 255)
    c_stone_darkest = (52, 54, 64, 255)
    
    c_moss_hi = (112, 165, 68, 255)
    c_moss_mid = (82, 130, 48, 255)
    c_moss_sh = (54, 95, 32, 255)
    
    # -------------------------------------------------------------
    # 1. Distant High Peaks (Back Layer)
    # -------------------------------------------------------------
    back_peaks = [
        (0, 110), (35, 75), (80, 95), (130, 45), (175, 80),
        (225, 35), (280, 65), (330, 30), (385, 70), (430, 40), (480, 85),
        (480, 220), (0, 220)
    ]
    draw.polygon(back_peaks, fill=c_stone_darkest, outline=c_out)
    
    # North-west lighting ridges on peaks
    for i in range(len(back_peaks) - 3):
        p1 = back_peaks[i]
        p2 = back_peaks[i+1]
        draw.line([p1, p2], fill=c_stone_sh, width=2)
        
    # -------------------------------------------------------------
    # 2. Main Mountain Tiered Granite Cliffs (Mid Layer)
    # -------------------------------------------------------------
    cliffs = [
        (0, 140), (45, 115), (90, 130), (140, 85), (195, 105),
        (245, 75), (295, 95), (350, 70), (410, 100), (455, 80), (480, 105),
        (480, 220), (0, 220)
    ]
    draw.polygon(cliffs, fill=c_stone_deep, outline=c_out)
    
    # Layered horizontal strata & vertical rock fissures
    random.seed(999)
    for cx in range(10, W - 10, 18):
        cliff_top = 80 + int((cx % 80) * 0.7)
        cliff_bot = 215
        
        # Vertical rock column facets
        draw.line([(cx, cliff_top), (cx + 3, cliff_bot)], fill=c_stone_mid, width=3)
        draw.line([(cx + 4, cliff_top), (cx + 6, cliff_bot)], fill=c_stone_hi, width=1)
        draw.line([(cx - 2, cliff_top), (cx, cliff_bot)], fill=c_out, width=2)
        
        # Horizontal rock shelf steps
        for sy in range(cliff_top + 18, cliff_bot - 15, 26):
            rw = random.randint(22, 42)
            rx = cx - rw // 2
            # Rock ledge plate
            draw.polygon([
                (rx, sy), (rx + rw, sy),
                (rx + rw - 3, sy + 7), (rx + 2, sy + 7)
            ], fill=c_stone_mid, outline=c_out)
            draw.line([(rx + 1, sy + 1), (rx + rw - 1, sy + 1)], fill=c_stone_hi)
            
            # Lush moss topping on rock ledge
            draw.line([(rx + 2, sy), (rx + rw - 2, sy)], fill=c_moss_hi, width=2)
            draw.line([(rx + 3, sy + 2), (rx + rw - 4, sy + 2)], fill=c_moss_mid, width=1)
            
    # -------------------------------------------------------------
    # 3. Terraced Forefront Rocky Plateaus
    # -------------------------------------------------------------
    plateaus = [
        (15, 150, 75, 45), (105, 135, 85, 55), (200, 125, 95, 60),
        (305, 130, 80, 50), (395, 140, 75, 45)
    ]
    for px, py, pw, ph in plateaus:
        draw.rounded_rectangle([px, py, px + pw, py + ph], radius=6, fill=c_stone_sh, outline=c_out)
        # Top highlight
        draw.line([(px + 4, py + 2), (px + pw - 4, py + 2)], fill=c_stone_hi, width=2)
        # Moss cap
        draw.line([(px + 6, py + 1), (px + pw - 6, py + 1)], fill=c_moss_hi, width=3)
        draw.line([(px + 8, py + 4), (px + pw - 8, py + 4)], fill=c_moss_mid, width=2)
        # Crag crack
        draw.line([(px + pw // 2, py + 6), (px + pw // 2 - 4, py + ph - 8)], fill=c_out, width=1)
        draw.line([(px + pw // 2 - 4, py + ph - 8), (px + pw // 2 + 2, py + ph - 2)], fill=c_out, width=1)

    # -------------------------------------------------------------
    # 4. Mountain Pines along High Crags
    # -------------------------------------------------------------
    tree_spots = [
        (55, 65), (110, 80), (160, 40), (210, 70), (265, 30),
        (315, 60), (365, 25), (420, 35), (460, 70)
    ]
    for tx, ty in tree_spots:
        # Pine tree trunk
        draw.line([(tx, ty + 20), (tx, ty + 26)], fill=(56, 36, 22, 255), width=2)
        # Tiered conical evergreen boughs
        for b in range(4):
            bw = 4 + b * 4
            draw.polygon([
                (tx, ty + b * 5),
                (tx - bw, ty + (b + 1) * 6),
                (tx + bw, ty + (b + 1) * 6)
            ], fill=(32, 74, 40, 255), outline=c_out)
            # Sun highlight on left
            draw.line([(tx, ty + b * 5), (tx - bw, ty + (b + 1) * 6)], fill=(62, 134, 75, 255), width=1)

    out_path = os.path.join(PROPS, "mountain_cliff_ridge.png")
    img.save(out_path)
    print(f"Generated mountain cliff ridge: {out_path} ({img.size})")

if __name__ == "__main__":
    generate_mountain_ridge()
