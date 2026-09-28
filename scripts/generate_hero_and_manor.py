import os
from PIL import Image

def outfit_hero_frame(frame, direction, anim_type, f_idx):
    img = frame.copy().convert("RGBA")
    pix = img.load()
    w, h = img.size
    
    c_hair_base = (24, 28, 38, 255)
    c_hair_hi = (48, 58, 76, 255)
    c_hair_sh = (14, 16, 24, 255)
    c_hair_spikes = (32, 40, 54, 255)
    
    c_eye_green = (42, 195, 145, 255)
    
    c_tunic = (158, 142, 118, 255)
    c_tunic_sh = (120, 106, 86, 255)
    c_tunic_trim = (82, 54, 38, 255)
    
    c_belt = (52, 34, 24, 255)
    c_buckle = (225, 230, 240, 255)
    
    c_pants = (64, 52, 44, 255)
    c_pants_sh = (44, 34, 28, 255)
    
    c_boots = (36, 26, 20, 255)
    c_boots_sh = (20, 14, 10, 255)
    
    c_sword_blade = (215, 225, 235, 255)
    c_sword_sh = (140, 150, 165, 255)
    c_sword_hilt = (235, 180, 50, 255)
    c_sword_sheath = (75, 50, 35, 255)
    c_sword_wrap = (110, 35, 30, 255)
    
    char_pixels = []
    for y in range(h):
        for x in range(w):
            r, g, b, a = pix[x, y]
            if a > 0:
                char_pixels.append((x, y, r, g, b))
                
    if not char_pixels:
        return img
        
    min_y = min(p[1] for p in char_pixels)
    max_y = max(p[1] for p in char_pixels)
    min_x = min(p[0] for p in char_pixels)
    max_x = max(p[0] for p in char_pixels)
    mid_x = (min_x + max_x) // 2
    
    # 1. Apply clothing onto skin
    for x, y, r, g, b in char_pixels:
        is_skin = (r > 130 and g > 75 and b > 35 and r > b)
        
        # Legs / Pants
        if min_y + 21 <= y <= min_y + 26:
            if is_skin:
                pix[x, y] = c_pants_sh if x > mid_x else c_pants
        # Boots
        elif y >= min_y + 27:
            if is_skin:
                pix[x, y] = c_boots_sh if x > mid_x else c_boots
        # Belt
        elif min_y + 19 <= y <= min_y + 20:
            if is_skin:
                if abs(x - mid_x) <= 1 and y == min_y + 19 and direction != 'up':
                    pix[x, y] = c_buckle
                else:
                    pix[x, y] = c_belt
        # Torso Tunic
        elif min_y + 13 <= y <= min_y + 18:
            arm_dist = 4 if direction != 'side' else 3
            if abs(x - mid_x) <= arm_dist:
                if is_skin:
                    if y == min_y + 13:
                        pix[x, y] = c_tunic_trim
                    else:
                        pix[x, y] = c_tunic_sh if x > mid_x else c_tunic
                        
        # Skull base hair
        if y <= min_y + 7:
            if is_skin:
                pix[x, y] = c_hair_hi if y < min_y + 4 else c_hair_base
                
    # 2. Directional Hair & Sword features
    if direction == 'down':
        # Spiky hair tufts on top and sides
        for sx, sy in [
            (mid_x - 4, min_y - 2), (mid_x - 3, min_y - 2), (mid_x - 3, min_y - 1),
            (mid_x - 1, min_y - 3), (mid_x, min_y - 3), (mid_x + 1, min_y - 3),
            (mid_x + 3, min_y - 2), (mid_x + 4, min_y - 2), (mid_x + 3, min_y - 1),
            (mid_x - 5, min_y + 1), (mid_x + 5, min_y + 1),
            (mid_x - 5, min_y + 3), (mid_x + 5, min_y + 3)
        ]:
            if 0 <= sx < w and 0 <= sy < h:
                pix[sx, sy] = c_hair_spikes
                
        # Eyes (Green adventurer eyes)
        eye_y = min_y + 8
        if 0 <= eye_y < h:
            if 0 <= mid_x - 2 < w:
                pix[mid_x - 2, eye_y] = c_eye_green
            if 0 <= mid_x + 2 < w:
                pix[mid_x + 2, eye_y] = c_eye_green
                
        # Sword sheathed behind left shoulder
        sword_x = mid_x + 6
        sword_y = min_y + 1
        if 0 <= sword_x < w and 0 <= sword_y < h:
            pix[sword_x, sword_y] = c_sword_hilt
        for sy in range(sword_y + 1, sword_y + 4):
            if 0 <= sword_x < w and 0 <= sy < h:
                pix[sword_x, sy] = c_sword_wrap
        for sx in range(sword_x - 2, sword_x + 3):
            if 0 <= sx < w and 0 <= sword_y + 4 < h:
                pix[sx, sword_y + 4] = c_sword_hilt
                
    elif direction == 'side':
        # Spiky anime hair from side
        for sx, sy in [
            (mid_x - 2, min_y - 3), (mid_x - 1, min_y - 3), (mid_x, min_y - 3), (mid_x + 2, min_y - 2),
            (mid_x - 3, min_y - 1), (mid_x - 4, min_y + 1), (mid_x - 5, min_y + 3),
            (mid_x + 3, min_y)
        ]:
            if 0 <= sx < w and 0 <= sy < h:
                pix[sx, sy] = c_hair_spikes
                
        # Eye
        eye_y = min_y + 8
        if 0 <= eye_y < h and 0 <= mid_x + 1 < w:
            pix[mid_x + 1, eye_y] = c_eye_green
            
        # Sword angled across back
        for i in range(7):
            sx = mid_x - 4 - (i // 2)
            sy = min_y + 3 + i * 2
            if 0 <= sx < w and 0 <= sy < h:
                pix[sx, sy] = c_sword_sheath if i > 1 else c_sword_hilt
                
    elif direction == 'up':
        # Back view hair
        for y in range(min_y, min_y + 9):
            for x in range(mid_x - 5, mid_x + 6):
                if 0 <= x < w and 0 <= y < h:
                    r, g, b, a = pix[x, y]
                    if a > 0:
                        pix[x, y] = c_hair_base if y > min_y + 3 else c_hair_hi
                        
        for sx, sy in [
            (mid_x - 3, min_y - 2), (mid_x - 1, min_y - 3), (mid_x + 1, min_y - 3), (mid_x + 3, min_y - 2)
        ]:
            if 0 <= sx < w and 0 <= sy < h:
                pix[sx, sy] = c_hair_spikes
                
        # Full sword strapped diagonally across back
        for i in range(11):
            sx = mid_x - 4 + int(i * 0.7)
            sy = min_y + 3 + i * 2
            if 0 <= sx < w and 0 <= sy < h:
                if i < 2:
                    pix[sx, sy] = c_sword_hilt
                elif i == 2:
                    for ox in (-1, 0, 1):
                        if 0 <= sx + ox < w:
                            pix[sx + ox, sy] = c_sword_hilt
                else:
                    pix[sx, sy] = c_sword_sheath
                    if 0 <= sx + 1 < w:
                        pix[sx + 1, sy] = c_sword_blade
                        
    return img

def process_all_player_sheets():
    base_dir = r"f:\New portfolio\public\assets\characters"
    hero_dir = os.path.join(base_dir, "hero")
    os.makedirs(hero_dir, exist_ok=True)
    
    sheets = [
        ("Idle_Down-Sheet.png", 4, "down", "idle"),
        ("Idle_Side-Sheet.png", 4, "side", "idle"),
        ("Idle_Up-Sheet.png", 4, "up", "idle"),
        ("Run_Down-Sheet.png", 6, "down", "run"),
        ("Run_Side-Sheet.png", 6, "side", "run"),
        ("Run_Up-Sheet.png", 6, "up", "run"),
    ]
    
    for filename, frame_count, direction, anim_type in sheets:
        src_path = os.path.join(base_dir, filename)
        if not os.path.exists(src_path):
            print(f"Warning: {src_path} not found")
            continue
            
        sheet = Image.open(src_path).convert("RGBA")
        fw = 64
        fh = 64
        out_sheet = Image.new("RGBA", (fw * frame_count, fh), (0, 0, 0, 0))
        
        for i in range(frame_count):
            frame = sheet.crop((i * fw, 0, (i + 1) * fw, fh))
            outfitted = outfit_hero_frame(frame, direction, anim_type, i)
            out_sheet.paste(outfitted, (i * fw, 0))
            
        dst_path = os.path.join(hero_dir, filename)
        out_sheet.save(dst_path)
        print(f"Saved hero sheet: {dst_path} ({out_sheet.size})")

if __name__ == "__main__":
    process_all_player_sheets()
