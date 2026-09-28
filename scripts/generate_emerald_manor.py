import os
from PIL import Image, ImageDraw

def create_emerald_manor():
    # Target image size: 208 wide by 208 high, RGBA transparent
    W, H = 208, 208
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Palette
    c_out = (26, 24, 30, 255)
    
    # Emerald roof colors
    c_roof_hi = (72, 204, 150, 255)
    c_roof_mid = (42, 160, 118, 255)
    c_roof_sh = (26, 112, 82, 255)
    c_roof_deep = (18, 76, 56, 255)
    c_roof_edge = (14, 52, 38, 255)
    
    # Wood / Timbers
    c_wood_hi = (156, 102, 54, 255)
    c_wood_mid = (118, 72, 36, 255)
    c_wood_sh = (82, 48, 24, 255)
    c_wood_dark = (52, 30, 16, 255)
    
    # Plaster / Stucco walls
    c_wall_hi = (244, 238, 230, 255)
    c_wall_mid = (230, 220, 208, 255)
    c_wall_sh = (205, 192, 178, 255)
    
    # Brick foundation wainscot
    c_brick_hi = (212, 136, 118, 255)
    c_brick_mid = (184, 104, 88, 255)
    c_brick_sh = (150, 78, 64, 255)
    c_brick_mortar = (210, 190, 180, 255)
    
    # Stone plinth
    c_stone_hi = (108, 104, 116, 255)
    c_stone_mid = (82, 78, 90, 255)
    c_stone_sh = (54, 50, 62, 255)
    
    # Shutters & foliage
    c_shutter = (112, 168, 64, 255)
    c_shutter_sh = (78, 122, 42, 255)
    c_leaf_light = (60, 180, 50, 255)
    c_leaf_dark = (32, 110, 28, 255)
    c_flower_pink = (235, 80, 120, 255)
    c_flower_red = (220, 45, 60, 255)
    c_flower_yellow = (245, 200, 50, 255)
    
    # Glass
    c_glass_hi = (175, 220, 240, 255)
    c_glass_mid = (120, 175, 205, 255)
    c_glass_sh = (75, 125, 155, 255)
    
    # -------------------------------------------------------------
    # 1. BASE STONE PLINTH (y = 158 to 170)
    # Left tower: x = 28 to 72, Main house & porch: x = 68 to 172
    # -------------------------------------------------------------
    # Left wing stone plinth
    draw.rounded_rectangle([28, 156, 74, 170], radius=4, fill=c_stone_mid, outline=c_out)
    draw.line([30, 157, 72, 157], fill=c_stone_hi)
    draw.line([30, 169, 72, 169], fill=c_stone_sh)
    
    # Main wing stone plinth
    draw.rounded_rectangle([68, 140, 172, 154], radius=4, fill=c_stone_mid, outline=c_out)
    draw.line([70, 141, 170, 141], fill=c_stone_hi)
    draw.line([70, 153, 170, 153], fill=c_stone_sh)

    # -------------------------------------------------------------
    # 2. BRICK WAINSCOT & STUCCO WALLS
    # -------------------------------------------------------------
    # Left wing wall (Tower): x = 32 to 72, y = 104 to 156
    draw.rectangle([32, 104, 72, 156], fill=c_wall_mid, outline=c_out)
    draw.rectangle([33, 105, 71, 140], fill=c_wall_mid)
    # Brick lower band on left wing (y = 140 to 156)
    draw.rectangle([32, 140, 72, 156], fill=c_brick_mid, outline=c_out)
    for by in range(141, 156, 4):
        draw.line([33, by, 71, by], fill=c_brick_mortar)
    for bx in range(36, 72, 8):
        draw.line([bx, 141, bx, 144], fill=c_brick_sh)
        draw.line([bx + 4, 145, bx + 4, 148], fill=c_brick_sh)
        draw.line([bx, 149, bx, 152], fill=c_brick_sh)
        draw.line([bx + 4, 153, bx + 4, 156], fill=c_brick_sh)
        
    # Main house wall: x = 70 to 170, y = 110 to 140
    draw.rectangle([70, 110, 170, 140], fill=c_wall_mid, outline=c_out)
    # Brick lower band on main wing (y = 126 to 140)
    draw.rectangle([70, 126, 170, 140], fill=c_brick_mid, outline=c_out)
    for by in range(127, 140, 4):
        draw.line([71, by, 169, by], fill=c_brick_mortar)
    for bx in range(74, 170, 8):
        draw.line([bx, 127, bx, 130], fill=c_brick_sh)
        draw.line([bx + 4, 131, bx + 4, 134], fill=c_brick_sh)
        draw.line([bx, 135, bx, 138], fill=c_brick_sh)

    # Upper attic stucco wall behind dormer (x = 100 to 160, y = 46 to 70)
    draw.rectangle([104, 46, 160, 70], fill=c_wall_hi, outline=c_out)
    
    # -------------------------------------------------------------
    # 3. WOODEN FRIEZE & BALCONY CORNICE
    # -------------------------------------------------------------
    # Left wing wooden balcony frieze (y = 94 to 104)
    draw.rectangle([32, 94, 72, 104], fill=c_wood_mid, outline=c_out)
    for fx in range(35, 72, 5):
        draw.line([fx, 95, fx, 103], fill=c_wood_dark)
    draw.line([33, 95, 71, 95], fill=c_wood_hi)
    
    # Main wing wooden cornice under roof (y = 104 to 110)
    draw.rectangle([70, 104, 135, 110], fill=c_wood_mid, outline=c_out)
    for fx in range(73, 135, 6):
        draw.line([fx, 105, fx, 109], fill=c_wood_dark)

    # -------------------------------------------------------------
    # 4. WINDOWS & FLOWERBOX
    # -------------------------------------------------------------
    # Left Wing Window (x = 44 to 60, y = 114 to 134)
    # Green shutters
    draw.rectangle([41, 114, 46, 130], fill=c_shutter, outline=c_out)
    draw.rectangle([58, 114, 63, 130], fill=c_shutter, outline=c_out)
    draw.line([43, 115, 43, 129], fill=c_shutter_sh)
    draw.line([60, 115, 60, 129], fill=c_shutter_sh)
    # Window frame & glass
    draw.rectangle([46, 114, 58, 130], fill=c_glass_mid, outline=c_out)
    draw.line([52, 115, 52, 129], fill=c_wood_dark)
    draw.line([47, 122, 57, 122], fill=c_wood_dark)
    draw.line([48, 116, 50, 116], fill=c_glass_hi)
    draw.line([54, 116, 56, 116], fill=c_glass_hi)
    # Flower box with lush foliage & flowers (y = 129 to 138)
    draw.rectangle([42, 130, 62, 137], fill=c_wood_dark, outline=c_out)
    for fx in range(43, 62, 2):
        draw.rectangle([fx, 128, fx + 2, 132], fill=c_leaf_light)
        draw.rectangle([fx + 1, 130, fx + 3, 134], fill=c_leaf_dark)
    # Colorful blossoms
    draw.point((45, 129), fill=c_flower_pink)
    draw.point((49, 131), fill=c_flower_red)
    draw.point((53, 129), fill=c_flower_yellow)
    draw.point((57, 130), fill=c_flower_pink)
    draw.point((60, 129), fill=c_flower_red)

    # Center-left Window (x = 78 to 94, y = 116 to 130)
    draw.rectangle([78, 116, 94, 130], fill=c_glass_mid, outline=c_out)
    draw.rectangle([76, 129, 96, 133], fill=c_stone_mid, outline=c_out)
    draw.line([86, 117, 86, 129], fill=c_wood_dark)
    draw.line([79, 123, 93, 123], fill=c_wood_dark)
    draw.line([80, 118, 83, 118], fill=c_glass_hi)

    # Porch Window (x = 146 to 162, y = 118 to 132)
    draw.rectangle([146, 118, 162, 132], fill=c_glass_mid, outline=c_out)
    draw.rectangle([144, 131, 164, 135], fill=c_stone_mid, outline=c_out)
    draw.line([154, 119, 154, 131], fill=c_wood_dark)
    draw.line([147, 125, 161, 125], fill=c_wood_dark)
    draw.line([148, 120, 151, 120], fill=c_glass_hi)

    # -------------------------------------------------------------
    # 5. ARCHED FRONT DOOR & STEPS (x = 104 to 124, y = 112 to 142)
    # -------------------------------------------------------------
    # Stone arch surround
    draw.rounded_rectangle([102, 110, 126, 142], radius=10, fill=c_stone_mid, outline=c_out)
    draw.line([104, 112, 124, 112], fill=c_stone_hi)
    # Wooden door planks
    draw.rounded_rectangle([105, 113, 123, 141], radius=8, fill=c_wood_mid, outline=c_out)
    draw.line([109, 115, 109, 140], fill=c_wood_sh)
    draw.line([114, 114, 114, 140], fill=c_wood_dark)
    draw.line([119, 115, 119, 140], fill=c_wood_sh)
    # Door latch & ring handle
    draw.rectangle([107, 127, 109, 130], fill=c_stone_hi)
    draw.point((108, 128), fill=(255, 255, 255, 255))
    
    # Wooden front door steps (y = 141 to 149)
    draw.rectangle([102, 141, 126, 145], fill=c_wood_mid, outline=c_out)
    draw.line([103, 142, 125, 142], fill=c_wood_hi)
    draw.rectangle([100, 145, 128, 149], fill=c_wood_sh, outline=c_out)
    draw.line([101, 146, 127, 146], fill=c_wood_mid)

    # -------------------------------------------------------------
    # 6. PORCH OVERHANG ROOF & TWO PILLARS
    # -------------------------------------------------------------
    # Two tall round wooden posts (x = 140 and x = 172, y = 120 to 174)
    for px in (140, 172):
        # Post shaft
        draw.rectangle([px - 2, 120, px + 2, 172], fill=c_wood_mid, outline=c_out)
        draw.line([px - 1, 121, px - 1, 171], fill=c_wood_hi)
        draw.line([px + 1, 121, px + 1, 171], fill=c_wood_sh)
        # Base and capital
        draw.rectangle([px - 4, 168, px + 4, 174], fill=c_wood_dark, outline=c_out)
        draw.rectangle([px - 4, 120, px + 4, 124], fill=c_wood_dark, outline=c_out)

    # -------------------------------------------------------------
    # 7. UPPER DORMER CROSS-GABLE (x = 100 to 166, y = 6 to 60)
    # -------------------------------------------------------------
    # Wooden gable triangle & attic window (y = 28 to 56)
    dormer_tri = [(133, 26), (105, 56), (161, 56)]
    draw.polygon(dormer_tri, fill=c_wood_mid, outline=c_out)
    for gy in range(34, 56, 5):
        draw.line([133 - int((gy - 26) * 0.9), gy, 133 + int((gy - 26) * 0.9), gy], fill=c_wood_dark)
    # Square lattice attic window
    draw.rectangle([126, 36, 140, 50], fill=c_glass_mid, outline=c_out)
    draw.line([133, 37, 133, 49], fill=c_wood_dark)
    draw.line([127, 43, 139, 43], fill=c_wood_dark)
    # Diagonals for lattice
    draw.line([128, 38, 138, 48], fill=c_wood_sh)
    draw.line([128, 48, 138, 38], fill=c_wood_sh)
    
    # Dormer green roof eaves (steep pitch pointing South)
    # Left slope
    for d in range(0, 14):
        draw.line([133 - d * 2, 6 + d * 3, 105 - d, 56], fill=c_roof_hi if d < 4 else (c_roof_mid if d < 9 else c_roof_sh))
    # Right slope
    for d in range(0, 14):
        draw.line([133 + d * 2, 6 + d * 3, 161 + d, 56], fill=c_roof_mid if d < 4 else (c_roof_sh if d < 9 else c_roof_deep))
    # Ridge caps
    draw.line([133, 6, 133, 30], fill=c_roof_hi)
    draw.polygon([(133, 6), (96, 62), (102, 64), (133, 10)], fill=c_roof_mid, outline=c_out)
    draw.polygon([(133, 6), (170, 62), (164, 64), (133, 10)], fill=c_roof_deep, outline=c_out)

    # -------------------------------------------------------------
    # 8. LEFT TOWER EMERALD ROOF (x = 26 to 76, y = 50 to 96)
    # -------------------------------------------------------------
    # Draw horizontal shingle layers
    draw.polygon([(28, 96), (28, 52), (74, 52), (74, 96)], fill=c_roof_mid, outline=c_out)
    for ry in range(54, 96, 6):
        col = c_roof_hi if ry < 68 else (c_roof_mid if ry < 84 else c_roof_sh)
        draw.line([29, ry, 73, ry], fill=col)
        # Scalloped shingle cuts
        for sx in range(32, 72, 6):
            draw.line([sx, ry, sx, ry + 5], fill=c_roof_deep)
    # Roof trim eave
    draw.rectangle([26, 92, 76, 96], fill=c_roof_edge, outline=c_out)
    draw.line([27, 93, 75, 93], fill=c_roof_hi)

    # -------------------------------------------------------------
    # 9. MAIN & PORCH EMERALD ROOF (x = 72 to 180, y = 60 to 120)
    # -------------------------------------------------------------
    draw.polygon([(72, 118), (72, 64), (178, 64), (178, 118)], fill=c_roof_mid, outline=c_out)
    # Left shadow under dormer
    for ry in range(66, 118, 6):
        col = c_roof_hi if ry < 82 else (c_roof_mid if ry < 102 else c_roof_sh)
        draw.line([73, ry, 177, ry], fill=col)
        for sx in range(76, 176, 6):
            draw.line([sx, ry, sx, ry + 5], fill=c_roof_deep)
            
    # Deep shadow cast by left tower onto main roof (x = 72 to 88)
    for y in range(65, 118):
        for x in range(73, 85):
            r, g, b, a = img.getpixel((x, y))
            if a > 0:
                img.putpixel((x, y), (max(0, r - 35), max(0, g - 40), max(0, b - 35), a))
                
    # Front eave fascia
    draw.rectangle([70, 114, 180, 120], fill=c_roof_edge, outline=c_out)
    draw.line([71, 115, 179, 115], fill=c_roof_hi)

    # Final crisp outline
    out_path = r"f:\New portfolio\public\assets\environment\clean_props\house_manor_emerald.png"
    img.save(out_path)
    print(f"Emerald Manor generated at: {out_path} ({img.size})")

if __name__ == "__main__":
    create_emerald_manor()
