import os
import random
from PIL import Image, ImageDraw

PACK = "f:/New portfolio/Pixel Crawler - Free Pack"
PROPS = "f:/New portfolio/public/assets/environment/clean_props"
NPCS = "f:/New portfolio/public/assets/npcs"
os.makedirs(PROPS, exist_ok=True)
os.makedirs(NPCS, exist_ok=True)

# -------------------------------------------------------------------------
# 1. SEAMLESS LUSH MEADOW GRASS (64x64)
# -------------------------------------------------------------------------
def generate_seamless_grass():
    """Generate a rich, seamless, natural RPG meadow grass tile with no banding or waffle grid."""
    w, h = 64, 64
    img = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    pix = img.load()
    
    # Palette: rich vibrant meadow green with natural depth
    c_base = (68, 142, 60, 255)       # Rich meadow green
    c_mid = (76, 155, 68, 255)        # Soft mid-tone
    c_light = (86, 172, 78, 255)      # Sunlit blade
    c_dark = (54, 118, 48, 255)       # Soil shade
    c_deep = (44, 98, 38, 255)        # Deep ground shadow
    c_clover = (112, 198, 98, 255)    # Tiny clover leaf
    
    # Base perlin-like organic noise using sinusoids
    for y in range(h):
        for x in range(w):
            # Smooth low-frequency variation
            v1 = (random.random() * 0.15)
            # Wrap-around smooth sinusoidal shading for seamlessness
            import math
            sx = math.sin(x * 2 * math.pi / w)
            sy = math.sin(y * 2 * math.pi / h)
            diag = math.sin((x + y) * 2 * math.pi / (w / 2))
            
            val = (sx * 0.1 + sy * 0.1 + diag * 0.08 + (random.random() - 0.5) * 0.18)
            if val > 0.12:
                pix[x, y] = c_light
            elif val > 0.02:
                pix[x, y] = c_mid
            elif val < -0.14:
                pix[x, y] = c_deep
            elif val < -0.04:
                pix[x, y] = c_dark
            else:
                pix[x, y] = c_base
                
    # Add subtle seamless grass blade specks
    random.seed(42)
    for _ in range(60):
        gx = random.randint(0, w - 1)
        gy = random.randint(0, h - 1)
        # Vertical blade of 2-3 pixels
        pix[gx, gy] = c_dark
        pix[gx, (gy - 1) % h] = c_light
        if random.random() < 0.3:
            pix[(gx + 1) % w, (gy - 1) % h] = c_clover

    out_path = os.path.join(PROPS, "tile_grass_solid.png")
    img.save(out_path)
    print(f"Generated seamless grass: {out_path} ({img.size})")

# -------------------------------------------------------------------------
# 2. SEAMLESS WARM DIRT & COBBLESTONE PATH (64x64)
# -------------------------------------------------------------------------
def generate_seamless_dirt():
    """Generate a warm, natural earthen dirt path with smooth pebbles and soil variation."""
    w, h = 64, 64
    img = Image.new("RGBA", (w, h), (0, 0, 0, 255))
    pix = img.load()
    
    c_base = (168, 128, 88, 255)
    c_mid = (182, 140, 98, 255)
    c_light = (196, 155, 112, 255)
    c_dark = (142, 104, 70, 255)
    c_deep = (118, 84, 54, 255)
    c_pebble_hi = (210, 185, 150, 255)
    c_pebble_sh = (105, 78, 52, 255)
    
    for y in range(h):
        for x in range(w):
            r = random.random()
            if r > 0.75:
                pix[x, y] = c_light
            elif r > 0.45:
                pix[x, y] = c_mid
            elif r < 0.15:
                pix[x, y] = c_deep
            elif r < 0.3:
                pix[x, y] = c_dark
            else:
                pix[x, y] = c_base
                
    # Add rounded stepping pebbles
    random.seed(101)
    for _ in range(16):
        px = random.randint(2, w - 4)
        py = random.randint(2, h - 4)
        pw = random.choice([2, 3, 4])
        ph = random.choice([2, 3])
        for dx in range(pw):
            for dy in range(ph):
                if dy == 0:
                    pix[(px + dx) % w, (py + dy) % h] = c_pebble_hi
                else:
                    pix[(px + dx) % w, (py + dy) % h] = c_pebble_sh

    out_path = os.path.join(PROPS, "tile_dirt_solid.png")
    img.save(out_path)
    print(f"Generated seamless dirt: {out_path} ({img.size})")

# -------------------------------------------------------------------------
# 3. EXTRACT AUTHENTIC TREES FROM PIXEL CRAWLER
# -------------------------------------------------------------------------
def extract_authentic_trees():
    """Extract full-fidelity summer green trees from Anokolisa's Pixel Crawler pack."""
    tree_configs = [
        # (source_rel_path, crop_box, output_filename)
        ("Environment/Props/Static/Trees/Model_01/Size_03.png", (0, 0, 52, 96), "tree_oak.png"),
        ("Environment/Props/Static/Trees/Model_01/Size_02.png", (0, 0, 40, 72), "tree_small.png"),
        ("Environment/Props/Static/Trees/Model_02/Size_03.png", (0, 0, 36, 80), "tree_pine.png"),
        ("Environment/Props/Static/Trees/Model_03/Size_03.png", (0, 0, 48, 144), "tree_spruce.png"),
    ]
    
    for rel_src, crop_box, out_name in tree_configs:
        full_src = os.path.join(PACK, rel_src)
        if not os.path.exists(full_src):
            print(f"Tree source not found: {full_src}")
            continue
        sheet = Image.open(full_src).convert("RGBA")
        tree_img = sheet.crop(crop_box)
        
        # Trim empty transparent margins if any
        bbox = tree_img.getbbox()
        if bbox:
            tree_trimmed = tree_img.crop((bbox[0], bbox[1], bbox[2], bbox[3]))
            out_path = os.path.join(PROPS, out_name)
            tree_trimmed.save(out_path)
            print(f"Saved authentic tree: {out_path} ({tree_trimmed.size})")
        else:
            out_path = os.path.join(PROPS, out_name)
            tree_img.save(out_path)

# -------------------------------------------------------------------------
# 4. GRAND MOUNTAIN CLIFF BACKDROP BEHIND CAVERN (540x240)
# -------------------------------------------------------------------------
def generate_mountain_backdrop():
    """Generate a majestic layered rocky mountain cliff backdrop to flank and frame the cavern."""
    W, H = 540, 240
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Palette
    c_out = (32, 30, 38, 255)
    c_rock_light = (142, 138, 150, 255)
    c_rock_mid = (112, 108, 120, 255)
    c_rock_dark = (84, 80, 92, 255)
    c_rock_deep = (58, 54, 66, 255)
    c_moss_hi = (76, 145, 62, 255)
    c_moss_mid = (52, 108, 44, 255)
    c_moss_dark = (36, 78, 30, 255)
    
    # 1. Distant high jagged peak silhouette (y = 20 to 120)
    peaks = [
        (0, 140), (40, 90), (90, 110), (140, 50), (190, 85),
        (240, 40), (290, 75), (340, 35), (400, 70), (460, 45), (510, 80), (540, 110),
        (540, 240), (0, 240)
    ]
    draw.polygon(peaks, fill=c_rock_deep, outline=c_out)
    
    # Shading on high ridges
    for i in range(len(peaks) - 3):
        p1 = peaks[i]
        p2 = peaks[i+1]
        # Sunlit north/west facet
        draw.line([p1, p2], fill=c_rock_mid, width=2)
        
    # 2. Mid-range tiered granite crags (y = 70 to 190)
    tier1 = [
        (0, 160), (30, 140), (70, 125), (120, 135), (170, 110),
        (220, 125), (280, 105), (330, 120), (390, 95), (440, 115), (490, 130), (540, 145),
        (540, 240), (0, 240)
    ]
    draw.polygon(tier1, fill=c_rock_dark, outline=c_out)
    
    # Cliff rock strata and vertical cleavage lines
    random.seed(777)
    for cx in range(15, W - 15, 14):
        cliff_top = 100 + int((cx % 60) * 0.8)
        cliff_bot = 220
        # Draw vertical rocky facets
        draw.line([(cx, cliff_top), (cx + 2, cliff_bot)], fill=c_rock_mid, width=2)
        draw.line([(cx + 3, cliff_top), (cx + 5, cliff_bot)], fill=c_rock_light, width=1)
        draw.line([(cx - 2, cliff_top), (cx, cliff_bot)], fill=c_out, width=1)
        
        # Horizontal rock strata ledges
        for sy in range(cliff_top + 15, cliff_bot - 10, 24):
            lw = random.randint(18, 36)
            draw.rectangle([cx - lw // 2, sy, cx + lw // 2, sy + 4], fill=c_rock_light, outline=c_out)
            # Moss capping on ledges
            draw.rectangle([cx - lw // 2, sy - 2, cx + lw // 2, sy], fill=c_moss_hi)
            
    # 3. Terraced mossy rock plateaus along base
    for px in range(20, W - 20, 50):
        py = random.randint(160, 200)
        pw = random.randint(45, 75)
        ph = random.randint(25, 40)
        draw.rounded_rectangle([px, py, px + pw, py + ph], radius=4, fill=c_rock_mid, outline=c_out)
        draw.line([(px + 2, py + 2), (px + pw - 2, py + 2)], fill=c_moss_hi, width=3)
        draw.line([(px + 4, py + 5), (px + pw - 4, py + 5)], fill=c_moss_mid, width=2)
        
    # 4. Rugged mountain pine trees along high crags
    for tx in [45, 95, 155, 230, 310, 375, 435, 495]:
        ty = random.randint(65, 115)
        # Small evergreen silhouette on ridge
        for d in range(6):
            bw = 4 + d * 3
            draw.polygon([(tx, ty + d * 5), (tx - bw, ty + (d + 1) * 6), (tx + bw, ty + (d + 1) * 6)], fill=(28, 62, 34, 255))
        draw.line([(tx, ty + 30), (tx, ty + 36)], fill=(54, 34, 18, 255), width=2)

    out_path = os.path.join(PROPS, "mountain_cave_backdrop.png")
    img.save(out_path)
    print(f"Generated mountain backdrop: {out_path} ({img.size})")

# -------------------------------------------------------------------------
# 5. FULLY ARMORED KNIGHT NPC WITH SWORD & SHIELD
# -------------------------------------------------------------------------
def generate_knight_npc():
    """Outfit the Palace Knight NPC with full steel armor, winged helmet, great broadsword, and heraldic shield."""
    src_path = os.path.join(PACK, "Entities/Npc's/Knight/Idle/Idle-Sheet.png")
    if not os.path.exists(src_path):
        print("Knight NPC source not found")
        return
        
    sheet = Image.open(src_path).convert("RGBA")
    fw, fh = 32, 32
    frames = 4
    out_sheet = Image.new("RGBA", (fw * frames, fh), (0, 0, 0, 0))
    
    # Colors
    c_out = (20, 22, 28, 255)
    c_steel_hi = (220, 235, 248, 255)
    c_steel_mid = (165, 185, 205, 255)
    c_steel_sh = (105, 125, 148, 255)
    c_steel_dark = (65, 80, 102, 255)
    c_gold = (245, 195, 65, 255)
    c_gold_sh = (185, 135, 35, 255)
    c_cape = (185, 30, 45, 255)
    c_cape_sh = (125, 15, 28, 255)
    
    for i in range(frames):
        frame = sheet.crop((i * fw, 0, (i + 1) * fw, fh))
        draw = ImageDraw.Draw(frame)
        
        # Breathing offset
        bob = 1 if (i == 1 or i == 2) else 0
        
        # 1. Regal Red Cape behind shoulders
        draw.polygon([(8, 12 + bob), (5, 28), (11, 28)], fill=c_cape_sh)
        draw.polygon([(24, 12 + bob), (21, 28), (27, 28)], fill=c_cape)
        
        # 2. Golden Winged Crest / Horns on Greathelm
        draw.line([(10, 5 + bob), (7, 1 + bob)], fill=c_gold, width=2)
        draw.line([(22, 5 + bob), (25, 1 + bob)], fill=c_gold, width=2)
        draw.point((16, 3 + bob), fill=c_gold)
        
        # 3. Steel Pauldrons with Gold Trim
        draw.rectangle([8, 12 + bob, 12, 16 + bob], fill=c_steel_hi, outline=c_out)
        draw.line([8, 12 + bob, 12, 12 + bob], fill=c_gold)
        draw.rectangle([20, 12 + bob, 24, 16 + bob], fill=c_steel_hi, outline=c_out)
        draw.line([20, 12 + bob, 24, 12 + bob], fill=c_gold)
        
        # 4. Right Arm holding Gleaming Upright Broadsword
        # Gauntlet
        draw.rectangle([21, 17 + bob, 25, 21 + bob], fill=c_steel_mid, outline=c_out)
        # Sword Hilt & Crossguard
        draw.rectangle([20, 15 + bob, 26, 16 + bob], fill=c_gold, outline=c_out)
        draw.point((23, 17 + bob), fill=c_gold_sh)
        # Silver Blade extending vertically
        draw.line([(23, 2 + bob), (23, 14 + bob)], fill=c_steel_hi, width=2)
        draw.line([(24, 3 + bob), (24, 14 + bob)], fill=c_steel_sh, width=1)
        draw.point((23, 1 + bob), fill=(255, 255, 255, 255))
        
        # 5. Left Arm holding Tower Shield
        # Shield at left (x = 4 to 10, y = 14 to 26)
        draw.rounded_rectangle([4, 14 + bob, 10, 26 + bob], radius=2, fill=(35, 75, 145, 255), outline=c_gold)
        draw.line([(7, 15 + bob), (7, 25 + bob)], fill=c_gold)
        draw.line([(4, 19 + bob), (10, 19 + bob)], fill=c_gold)
        
        out_sheet.paste(frame, (i * fw, 0))
        
    out_path = os.path.join(NPCS, "Knight_Idle.png")
    out_sheet.save(out_path)
    print(f"Saved Knight NPC sheet: {out_path} ({out_sheet.size})")

if __name__ == "__main__":
    generate_seamless_grass()
    generate_seamless_dirt()
    extract_authentic_trees()
    generate_mountain_backdrop()
    generate_knight_npc()
