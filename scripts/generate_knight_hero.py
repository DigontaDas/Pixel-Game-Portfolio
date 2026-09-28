import os
from PIL import Image, ImageDraw

PACK = "f:/New portfolio/Pixel Crawler - Free Pack"
OUT_DIR = "f:/New portfolio/public/assets/characters/knight"
os.makedirs(OUT_DIR, exist_ok=True)

# -------------------------------------------------------------
# PALETTE DEFINITIONS
# -------------------------------------------------------------
c_out = (20, 22, 28, 255)            # Dark ink outline
c_steel_hi = (235, 245, 255, 255)    # Specular steel highlight
c_steel_mid = (175, 195, 215, 255)   # Polished steel plate
c_steel_sh = (115, 135, 155, 255)    # Shaded steel
c_steel_deep = (70, 85, 105, 255)    # Deep armor crevices
c_mail = (85, 95, 110, 255)          # Chainmail underlayer
c_gold_hi = (255, 225, 95, 255)      # Gold trim highlight
c_gold_mid = (235, 185, 45, 255)     # Gold trim
c_gold_sh = (175, 125, 25, 255)      # Gold shade

# Shield colors (Royal Azure & Gold)
c_shield_blue = (28, 68, 145, 255)   # Royal heraldic azure
c_shield_dark = (18, 44, 98, 255)    # Deep azure shadow
c_strap = (78, 48, 28, 255)          # Leather strapping

# Knight Hair & Skin (from Digonta Hero)
c_hair_dark = (35, 30, 42, 255)
c_hair_spikes = (55, 48, 65, 255)
c_skin_hi = (235, 175, 145, 255)
c_skin_mid = (214, 142, 114, 255)
c_skin_sh = (186, 114, 90, 255)
c_eye_green = (46, 213, 115, 255)

# Sword colors
c_blade_hi = (250, 252, 255, 255)
c_blade_mid = (205, 225, 245, 255)
c_blade_sh = (135, 155, 180, 255)
c_blade_core = (170, 190, 215, 255)

def is_skin_color(r, g, b, a):
    if a < 50: return False
    # Check if within peach skin tone range
    return (170 <= r <= 245 and 100 <= g <= 185 and 75 <= b <= 155)

def outfit_knight_frame(frame, direction, anim_type, frame_idx):
    w, h = frame.size
    img = frame.copy()
    pix = img.load()
    draw = ImageDraw.Draw(img)
    
    # 1. Detect character body pixels (skin and base body)
    skin_pts = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix[x, y]
            if a > 50 and is_skin_color(r, g, b, a):
                skin_pts.append((x, y))
                
    if not skin_pts:
        bbox = frame.getbbox()
        if not bbox: return img
        min_x, min_y, max_x, max_y = bbox
    else:
        min_x = min(p[0] for p in skin_pts)
        max_x = max(p[0] for p in skin_pts)
        min_y = min(p[1] for p in skin_pts)
        max_y = max(p[1] for p in skin_pts)
        
    mid_x = (min_x + max_x) // 2
    
    # Vertical anatomy divisions based on detected skin bounds
    body_height = max_y - min_y
    head_bottom = min_y + int(body_height * 0.36)
    torso_bottom = min_y + int(body_height * 0.68)
    
    # -------------------------------------------------------------
    # 1. BASE ARMOR COATING (Breastplate, Greaves, Sabatons)
    # -------------------------------------------------------------
    for y in range(min_y, max_y + 1):
        for x in range(min_x - 1, max_x + 2):
            if 0 <= x < w and 0 <= y < h:
                r, g, b, a = pix[x, y]
                if a > 50:
                    # TORSO (Breastplate)
                    if head_bottom <= y < torso_bottom:
                        if is_skin_color(r, g, b, a):
                            if x == mid_x or x == mid_x - 1:
                                pix[x, y] = c_steel_hi
                            elif x < mid_x:
                                pix[x, y] = c_steel_mid
                            else:
                                pix[x, y] = c_steel_sh
                    # LEGS / FEET (Greaves)
                    elif y >= torso_bottom:
                        if is_skin_color(r, g, b, a):
                            pix[x, y] = c_steel_mid if y < max_y - 2 else c_steel_sh
                            
    # -------------------------------------------------------------
    # 2. HEAD: KNIGHT HELMET WITH VISOR & GOLD CREST
    # -------------------------------------------------------------
    for y in range(max(0, min_y - 1), head_bottom):
        for x in range(min_x, max_x + 1):
            if 0 <= x < w and 0 <= y < h:
                r, g, b, a = pix[x, y]
                if a > 0:
                    if y <= min_y + 3:
                        pix[x, y] = c_steel_hi if x <= mid_x else c_steel_mid
                    elif direction != 'up' and y == min_y + 5:
                        if mid_x - 2 <= x <= mid_x + 2:
                            pix[x, y] = c_out
                    elif y >= min_y + 6:
                        if direction == 'up':
                            pix[x, y] = c_steel_mid
                        else:
                            pix[x, y] = c_steel_sh
                            
    # Golden crest plume on top of helmet
    for cy in range(max(0, min_y - 3), min_y):
        if 0 <= mid_x < w:
            pix[mid_x, cy] = c_gold_hi
            if mid_x - 1 >= 0: pix[mid_x - 1, cy] = c_gold_mid
            if mid_x + 1 < w: pix[mid_x + 1, cy] = c_gold_sh

    # Green eye glint
    if direction == 'down':
        if 0 <= mid_x - 2 < w and 0 <= min_y + 5 < h: pix[mid_x - 2, min_y + 5] = c_eye_green
        if 0 <= mid_x + 2 < w and 0 <= min_y + 5 < h: pix[mid_x + 2, min_y + 5] = c_eye_green
    elif direction == 'side':
        if 0 <= mid_x + 1 < w and 0 <= min_y + 5 < h: pix[mid_x + 1, min_y + 5] = c_eye_green

    # -------------------------------------------------------------
    # 3. PAULDRONS (STEEL SHOULDER PLATES)
    # -------------------------------------------------------------
    if 0 <= min_x - 1 < w and 0 <= head_bottom + 1 < h:
        draw.rectangle([min_x - 2, head_bottom, min_x, head_bottom + 3], fill=c_steel_hi, outline=c_out)
        draw.point((min_x - 1, head_bottom), fill=c_gold_hi)
    if 0 <= max_x + 1 < w and 0 <= head_bottom + 1 < h:
        draw.rectangle([max_x - 1, head_bottom, max_x + 1, head_bottom + 3], fill=c_steel_mid, outline=c_out)
        draw.point((max_x, head_bottom), fill=c_gold_hi)

    # -------------------------------------------------------------
    # 4. GOLDEN EMBLEM ON CHEST (Down & Side)
    # -------------------------------------------------------------
    if direction == 'down':
        draw.line([(mid_x, head_bottom + 2), (mid_x, head_bottom + 6)], fill=c_gold_hi)
        draw.line([(mid_x - 2, head_bottom + 4), (mid_x + 2, head_bottom + 4)], fill=c_gold_hi)

    # -------------------------------------------------------------
    # 5. SHIELD IN BEHIND (STRAPPED ON BACK / SIDE)
    # -------------------------------------------------------------
    # Heater shield dimensions: ~10 wide by 14 high
    if direction == 'down':
        # Shield is slung over left shoulder (knight's right, viewer's left)
        # Visible behind his left arm/torso: x = min_x - 4 to min_x, y = head_bottom + 1 to torso_bottom + 3
        sx1, sy1 = min_x - 4, head_bottom + 1
        sx2, sy2 = min_x, head_bottom + 13
        draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=2, fill=c_shield_blue, outline=c_gold_mid)
        draw.line([(sx1 + 1, sy1 + 1), (sx2 - 1, sy1 + 1)], fill=c_steel_hi)
        draw.line([(sx1 + 2, sy1 + 2), (sx1 + 2, sy2 - 2)], fill=c_gold_hi)
        
    elif direction == 'side':
        # Shield mounted on back (left side of character)
        sx1, sy1 = min_x - 5, head_bottom + 1
        sx2, sy2 = min_x - 1, head_bottom + 13
        draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=2, fill=c_shield_blue, outline=c_gold_mid)
        draw.line([(sx1 + 1, sy1 + 1), (sx2 - 1, sy1 + 1)], fill=c_steel_hi)
        # Golden cross facet
        draw.line([(sx1 + 2, sy1 + 3), (sx1 + 2, sy2 - 3)], fill=c_gold_hi)
        draw.line([(sx1, sy1 + 6), (sx2, sy1 + 6)], fill=c_gold_hi)
        
    elif direction == 'up':
        # Back view: Shield is proudly centered on back!
        sx1, sy1 = mid_x - 5, head_bottom + 1
        sx2, sy2 = mid_x + 5, head_bottom + 14
        draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=3, fill=c_shield_blue, outline=c_gold_mid)
        # Steel rim
        draw.line([(sx1 + 1, sy1 + 1), (sx2 - 1, sy1 + 1)], fill=c_steel_hi)
        # Golden Royal Cross on shield
        draw.line([(mid_x, sy1 + 3), (mid_x, sy2 - 3)], fill=c_gold_hi, width=2)
        draw.line([(sx1 + 2, sy1 + 6), (sx2 - 2, sy1 + 6)], fill=c_gold_hi, width=2)
        # Center jewel
        draw.point((mid_x, sy1 + 6), fill=(255, 255, 255, 255))
        # Leather straps over shoulders
        draw.line([(mid_x - 4, head_bottom - 1), (mid_x - 3, head_bottom + 2)], fill=c_strap, width=1)
        draw.line([(mid_x + 4, head_bottom - 1), (mid_x + 3, head_bottom + 2)], fill=c_strap, width=1)

    # -------------------------------------------------------------
    # 6. SWORD IN HAND (FOR IDLE & RUN)
    # -------------------------------------------------------------
    if anim_type in ('idle', 'run'):
        bob = (frame_idx % 2)
        if direction == 'down':
            # Right hand (viewer's right, x = max_x + 1) holding upright steel broadsword
            hx, hy = max_x + 1, head_bottom + 6 + bob
            # Steel Gauntlet
            draw.rectangle([hx - 2, hy - 1, hx + 1, hy + 2], fill=c_steel_hi, outline=c_out)
            # Gold Crossguard & Pommel
            draw.line([(hx - 4, hy - 2), (hx + 3, hy - 2)], fill=c_gold_mid)
            draw.point((hx - 1, hy + 3), fill=c_gold_sh)
            # Gleaming Steel Blade pointing up
            draw.line([(hx - 1, hy - 14), (hx - 1, hy - 3)], fill=c_blade_hi, width=2)
            draw.line([(hx, hy - 13), (hx, hy - 3)], fill=c_blade_sh, width=1)
            # Sharp tip
            draw.point((hx - 1, hy - 15), fill=(255, 255, 255, 255))
            
        elif direction == 'side':
            # Sword held forward in battle stance
            hx, hy = max_x + 1, head_bottom + 5 + bob
            # Gauntlet
            draw.rectangle([hx - 1, hy - 1, hx + 2, hy + 2], fill=c_steel_hi, outline=c_out)
            # Crossguard
            draw.line([(hx, hy - 3), (hx, hy + 3)], fill=c_gold_mid)
            # Blade pointing forward
            draw.line([(hx + 1, hy), (hx + 12, hy)], fill=c_blade_hi, width=2)
            draw.line([(hx + 1, hy + 1), (hx + 11, hy + 1)], fill=c_blade_sh, width=1)
            draw.point((hx + 13, hy), fill=(255, 255, 255, 255))
            
        elif direction == 'up':
            # Right hand holding blade ready alongside shoulder
            hx, hy = max_x, head_bottom + 4 + bob
            draw.rectangle([hx - 1, hy - 1, hx + 1, hy + 2], fill=c_steel_mid, outline=c_out)
            draw.line([(hx - 2, hy - 2), (hx + 2, hy - 2)], fill=c_gold_mid)
            draw.line([(hx, hy - 12), (hx, hy - 3)], fill=c_blade_hi, width=2)
            draw.point((hx, hy - 13), fill=(255, 255, 255, 255))

    # -------------------------------------------------------------
    # 7. ATTACK / SLICE WEAPON ENHANCEMENT
    # -------------------------------------------------------------
    elif anim_type == 'attack':
        # Replace the base axe head/wooden club with gleaming silver blade and blue energy glow
        # Also ensure shield remains on back
        if direction in ('down', 'side'):
            sx1, sy1 = min_x - 4, head_bottom + 1
            sx2, sy2 = min_x, head_bottom + 12
            draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=2, fill=c_shield_blue, outline=c_gold_mid)
        else:
            sx1, sy1 = mid_x - 5, head_bottom + 1
            sx2, sy2 = mid_x + 5, head_bottom + 13
            draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=2, fill=c_shield_blue, outline=c_gold_mid)
            draw.line([(mid_x, sy1 + 2), (mid_x, sy2 - 2)], fill=c_gold_hi)

    return img

def process_all_knight_sheets():
    # 1. Idle & Run sheets
    sheets = [
        ("Entities/Characters/Body_A/Animations/Idle_Base/Idle_Down-Sheet.png", 4, "down", "idle", "Idle_Down-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Idle_Base/Idle_Side-Sheet.png", 4, "side", "idle", "Idle_Side-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Idle_Base/Idle_Up-Sheet.png", 4, "up", "idle", "Idle_Up-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Run_Base/Run_Down-Sheet.png", 6, "down", "run", "Run_Down-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Run_Base/Run_Side-Sheet.png", 6, "side", "run", "Run_Side-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Run_Base/Run_Up-Sheet.png", 6, "up", "run", "Run_Up-Sheet.png"),
        # Attack / Slice sheets (8 frames each)
        ("Entities/Characters/Body_A/Animations/Slice_Base/Slice_Down-Sheet.png", 8, "down", "attack", "Attack_Down-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Slice_Base/Slice_Side-Sheet.png", 8, "side", "attack", "Attack_Side-Sheet.png"),
        ("Entities/Characters/Body_A/Animations/Slice_Base/Slice_Up-Sheet.png", 8, "up", "attack", "Attack_Up-Sheet.png"),
    ]
    
    fw = 64
    fh = 64
    
    for rel_src, frame_count, direction, anim_type, out_filename in sheets:
        full_src = os.path.join(PACK, rel_src)
        if not os.path.exists(full_src):
            print(f"Source not found: {full_src}")
            continue
            
        sheet = Image.open(full_src).convert("RGBA")
        out_sheet = Image.new("RGBA", (fw * frame_count, fh), (0, 0, 0, 0))
        
        for i in range(frame_count):
            frame = sheet.crop((i * fw, 0, (i + 1) * fw, fh))
            outfitted = outfit_knight_frame(frame, direction, anim_type, i)
            out_sheet.paste(outfitted, (i * fw, 0))
            
        dst_path = os.path.join(OUT_DIR, out_filename)
        out_sheet.save(dst_path)
        print(f"Saved Knight sheet: {dst_path} ({out_sheet.size})")

if __name__ == "__main__":
    process_all_knight_sheets()
