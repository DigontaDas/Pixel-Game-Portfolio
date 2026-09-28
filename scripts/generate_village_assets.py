"""
Generate Village Assets from Pixel Crawler Free Pack
- Proper Houses (GitHub Forge, LinkedIn Embassy) with walls, windows, doors, roofs
- Vegetation decorations (bushes, flowers, grass clumps)
- Rocks and hills for cave surroundings
- Garden/farm elements
"""
from PIL import Image, ImageDraw
import os
import math
import random

PACK = "f:/New portfolio/Pixel Crawler - Free Pack"
OUT = "f:/New portfolio/public/assets/environment/clean_props"
os.makedirs(OUT, exist_ok=True)

# ============================================================
# 1. GENERATE PROPER HOUSE SPRITES
# ============================================================

def generate_proper_house(filename, roof_color, wall_color, accent_color, door_color, label_icon=None, width=128, height=128):
    """Generate a proper pixel art house with roof, walls, windows, door, and chimney."""
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    roof_dark = tuple(max(0, c - 40) for c in roof_color[:3]) + (255,)
    roof_light = tuple(min(255, c + 30) for c in roof_color[:3]) + (255,)
    wall_dark = tuple(max(0, c - 30) for c in wall_color[:3]) + (255,)
    window_blue = (173, 216, 230, 255)
    window_frame = (80, 60, 40, 255)
    
    cx = width // 2
    
    # === FOUNDATION ===
    foundation_y = height - 16
    draw.rectangle([cx - 52, foundation_y, cx + 52, height - 2], fill=(100, 90, 75, 255))
    draw.rectangle([cx - 50, foundation_y + 2, cx + 50, height - 4], fill=(120, 110, 90, 255))
    for sy in range(foundation_y + 2, height - 4, 4):
        draw.line([(cx - 48, sy), (cx + 48, sy)], fill=(90, 80, 65, 200), width=1)
    
    # === WALLS ===
    wall_top = 48
    wall_bottom = foundation_y
    draw.rectangle([cx - 48, wall_top, cx + 48, wall_bottom], fill=wall_color)
    draw.rectangle([cx - 48, wall_top, cx - 46, wall_bottom], fill=wall_dark)
    draw.rectangle([cx + 46, wall_top, cx + 48, wall_bottom], fill=wall_dark)
    for wy in range(wall_top, wall_bottom, 8):
        draw.line([(cx - 48, wy), (cx + 48, wy)], fill=wall_dark, width=1)
    draw.rectangle([cx - 2, wall_top, cx + 2, wall_bottom], fill=wall_dark)
    
    # === DOOR ===
    door_top = wall_bottom - 30
    door_left = cx - 10
    door_right = cx + 10
    draw.rectangle([door_left, door_top, door_right, wall_bottom], fill=door_color)
    draw.rectangle([door_left - 2, door_top - 2, door_right + 2, door_top], fill=(60, 45, 30, 255))
    draw.rectangle([door_left - 2, door_top, door_left, wall_bottom], fill=(60, 45, 30, 255))
    draw.rectangle([door_right, door_top, door_right + 2, wall_bottom], fill=(60, 45, 30, 255))
    draw.ellipse([door_right - 5, door_top + 14, door_right - 2, door_top + 17], fill=(200, 180, 50, 255))
    draw.arc([door_left, door_top - 6, door_right, door_top + 6], 180, 0, fill=(60, 45, 30, 255), width=2)
    
    # === WINDOWS ===
    lw_x, lw_y = cx - 32, wall_top + 18
    draw.rectangle([lw_x, lw_y, lw_x + 16, lw_y + 14], fill=window_blue)
    draw.rectangle([lw_x - 1, lw_y - 1, lw_x + 17, lw_y + 15], outline=window_frame, width=2)
    draw.line([(lw_x + 8, lw_y), (lw_x + 8, lw_y + 14)], fill=window_frame, width=1)
    draw.line([(lw_x, lw_y + 7), (lw_x + 16, lw_y + 7)], fill=window_frame, width=1)
    draw.rectangle([lw_x - 2, lw_y + 15, lw_x + 18, lw_y + 17], fill=(80, 65, 45, 255))
    
    rw_x, rw_y = cx + 16, wall_top + 18
    draw.rectangle([rw_x, rw_y, rw_x + 16, rw_y + 14], fill=window_blue)
    draw.rectangle([rw_x - 1, rw_y - 1, rw_x + 17, rw_y + 15], outline=window_frame, width=2)
    draw.line([(rw_x + 8, rw_y), (rw_x + 8, rw_y + 14)], fill=window_frame, width=1)
    draw.line([(rw_x, rw_y + 7), (rw_x + 16, rw_y + 7)], fill=window_frame, width=1)
    draw.rectangle([rw_x - 2, rw_y + 15, rw_x + 18, rw_y + 17], fill=(80, 65, 45, 255))
    
    # === ROOF ===
    roof_peak = 8
    roof_base = wall_top + 6
    for y_off in range(roof_base - roof_peak):
        row_y = roof_peak + y_off
        spread = int(56 * (y_off / (roof_base - roof_peak)))
        lx = cx - spread
        rx = cx + spread
        color = roof_color if y_off % 6 < 4 else roof_dark
        draw.line([(lx, row_y), (rx, row_y)], fill=color, width=1)
    
    draw.line([(cx, roof_peak), (cx - 56, roof_base)], fill=roof_dark, width=2)
    draw.line([(cx, roof_peak), (cx + 56, roof_base)], fill=roof_dark, width=2)
    draw.line([(cx - 56, roof_base), (cx + 56, roof_base)], fill=roof_dark, width=2)
    
    # Chimney
    chimney_x = cx + 24
    draw.rectangle([chimney_x, roof_peak - 4, chimney_x + 10, wall_top + 10], fill=(140, 80, 60, 255))
    draw.rectangle([chimney_x - 1, roof_peak - 6, chimney_x + 11, roof_peak - 3], fill=(100, 60, 40, 255))
    
    # Front porch steps
    draw.rectangle([cx - 14, wall_bottom, cx + 14, wall_bottom + 4], fill=(110, 90, 65, 255))
    draw.rectangle([cx - 18, wall_bottom + 4, cx + 18, wall_bottom + 8], fill=(100, 80, 55, 255))
    
    # Window flower boxes
    for fx in [lw_x, rw_x]:
        draw.rectangle([fx, lw_y + 17, fx + 16, lw_y + 20], fill=(80, 55, 35, 255))
        for bx in range(fx + 2, fx + 15, 4):
            draw.rectangle([bx, lw_y + 14, bx + 2, lw_y + 17], fill=(34, 139, 34, 255))
            draw.ellipse([bx - 1, lw_y + 12, bx + 3, lw_y + 15], fill=accent_color)
    
    img.save(os.path.join(OUT, filename))
    print(f"  Generated {filename}")

print("=== Generating Houses ===")
generate_proper_house(
    "house_github.png",
    roof_color=(130, 90, 55),
    wall_color=(180, 155, 120),
    accent_color=(255, 140, 50),
    door_color=(100, 70, 40),
    label_icon="github"
)

generate_proper_house(
    "house_linkedin.png",
    roof_color=(45, 100, 160),
    wall_color=(200, 190, 175),
    accent_color=(0, 119, 181),
    door_color=(80, 60, 45),
    label_icon="linkedin"
)

# ============================================================
# 2. EXTRACT VEGETATION FROM SPRITE PACK
# ============================================================

print("\n=== Extracting Vegetation ===")
veg = Image.open(f"{PACK}/Environment/Props/Static/Vegetation.png").convert("RGBA")

bush_large = veg.crop((0, 16, 32, 48))
bush_large.save(os.path.join(OUT, "bush_large.png"))
print("  Extracted bush_large.png")

bush_small = veg.crop((64, 32, 80, 48))
bush_small.save(os.path.join(OUT, "bush_small.png"))
print("  Extracted bush_small.png")

flower_1 = veg.crop((0, 80, 16, 96))
flower_1.save(os.path.join(OUT, "flower_patch_1.png"))
print("  Extracted flower_patch_1.png")

flower_2 = veg.crop((16, 80, 32, 96))
flower_2.save(os.path.join(OUT, "flower_patch_2.png"))
print("  Extracted flower_patch_2.png")

grass_tuft = veg.crop((32, 80, 48, 96))
grass_tuft.save(os.path.join(OUT, "grass_tuft.png"))
print("  Extracted grass_tuft.png")

tall_grass = veg.crop((48, 64, 64, 96))
tall_grass.save(os.path.join(OUT, "tall_grass.png"))
print("  Extracted tall_grass.png")

purple_flower = veg.crop((80, 64, 96, 80))
purple_flower.save(os.path.join(OUT, "purple_flower.png"))
print("  Extracted purple_flower.png")

# ============================================================
# 3. EXTRACT ROCKS FOR CAVE HILLS
# ============================================================

print("\n=== Extracting Rocks ===")
rocks = Image.open(f"{PACK}/Environment/Props/Static/Rocks.png").convert("RGBA")

boulder_large = rocks.crop((0, 16, 32, 48))
boulder_large.save(os.path.join(OUT, "boulder_large.png"))
print("  Extracted boulder_large.png")

rock_med = rocks.crop((32, 16, 56, 40))
rock_med.save(os.path.join(OUT, "rock_medium.png"))
print("  Extracted rock_medium.png")

rock_small = rocks.crop((0, 48, 24, 64))
rock_small.save(os.path.join(OUT, "rock_small.png"))
print("  Extracted rock_small.png")

dark_rock = rocks.crop((0, 80, 32, 112))
dark_rock.save(os.path.join(OUT, "rock_dark.png"))
print("  Extracted rock_dark.png")

# ============================================================
# 4. EXTRACT FARM/GARDEN ELEMENTS
# ============================================================

print("\n=== Extracting Farm/Garden ===")
farm = Image.open(f"{PACK}/Environment/Props/Static/Farm.png").convert("RGBA")

scarecrow = farm.crop((192, 0, 208, 32))
scarecrow.save(os.path.join(OUT, "scarecrow.png"))
print("  Extracted scarecrow.png")

fence = farm.crop((208, 16, 240, 48))
fence.save(os.path.join(OUT, "fence_section.png"))
print("  Extracted fence_section.png")

crate = farm.crop((224, 0, 240, 16))
crate.save(os.path.join(OUT, "crate.png"))
print("  Extracted crate.png")

garden_row = farm.crop((0, 0, 80, 16))
garden_row.save(os.path.join(OUT, "garden_row.png"))
print("  Extracted garden_row.png")

# ============================================================
# 5. GENERATE HILL / ROCKY CLIFF FOR CAVE
# ============================================================

print("\n=== Generating Hills ===")

def generate_hill_terrain():
    hill = Image.new("RGBA", (128, 64), (0, 0, 0, 0))
    draw = ImageDraw.Draw(hill)
    
    colors = [
        (85, 75, 60, 255),
        (105, 95, 75, 255),
        (125, 115, 90, 255),
        (75, 65, 50, 255),
    ]
    
    for i, y_base in enumerate([40, 32, 24, 18]):
        color = colors[i % len(colors)]
        points = []
        for x in range(0, 129, 2):
            y = y_base + int(12 * math.sin(x * 0.05 + i) + 6 * math.sin(x * 0.12 + i * 2))
            points.append((x, max(y, 8)))
        points.append((128, 64))
        points.append((0, 64))
        draw.polygon(points, fill=color)
    
    random.seed(42)
    for _ in range(30):
        rx = random.randint(4, 124)
        ry = random.randint(20, 58)
        rs = random.randint(2, 5)
        rc = random.choice(colors)
        draw.ellipse([rx, ry, rx + rs, ry + rs], fill=rc)
    
    for x in range(4, 124, 6):
        gy = 16 + int(4 * math.sin(x * 0.1))
        draw.line([(x, gy), (x, gy - 4)], fill=(60, 120, 40, 255), width=1)
        draw.line([(x + 2, gy), (x + 1, gy - 5)], fill=(80, 140, 50, 255), width=1)
    
    hill.save(os.path.join(OUT, "hill_rocky.png"))
    print("  Generated hill_rocky.png")
    
    cliff = Image.new("RGBA", (64, 48), (0, 0, 0, 0))
    draw2 = ImageDraw.Draw(cliff)
    for i, y_base in enumerate([28, 22, 16]):
        color = colors[i % len(colors)]
        points = []
        for x in range(0, 65, 2):
            y = y_base + int(8 * math.sin(x * 0.08 + i * 1.5))
            points.append((x, max(y, 6)))
        points.append((64, 48))
        points.append((0, 48))
        draw2.polygon(points, fill=color)
    cliff.save(os.path.join(OUT, "cliff_small.png"))
    print("  Generated cliff_small.png")

generate_hill_terrain()

# ============================================================
# 6. GENERATE GARDEN BED & POND
# ============================================================

print("\n=== Generating Decorations ===")

garden = Image.new("RGBA", (64, 32), (0, 0, 0, 0))
draw_g = ImageDraw.Draw(garden)
draw_g.rectangle([4, 16, 60, 28], fill=(90, 65, 40, 255))
draw_g.rectangle([6, 18, 58, 26], fill=(110, 80, 50, 255))
random.seed(7)
flower_colors = [(255, 100, 100, 255), (255, 220, 80, 255), (180, 100, 255, 255), (255, 180, 200, 255), (100, 200, 255, 255)]
for x in range(8, 56, 7):
    stem_h = random.randint(6, 12)
    draw_g.line([(x, 18), (x, 18 - stem_h)], fill=(50, 130, 40, 255), width=1)
    draw_g.rectangle([x - 1, 18 - stem_h + 2, x + 1, 18 - stem_h + 4], fill=(60, 150, 50, 255))
    fc = random.choice(flower_colors)
    draw_g.ellipse([x - 2, 18 - stem_h - 2, x + 2, 18 - stem_h + 2], fill=fc)
garden.save(os.path.join(OUT, "garden_flower_bed.png"))
print("  Generated garden_flower_bed.png")

pond = Image.new("RGBA", (48, 32), (0, 0, 0, 0))
draw_p = ImageDraw.Draw(pond)
draw_p.ellipse([2, 4, 46, 28], fill=(90, 75, 55, 255))
draw_p.ellipse([4, 6, 44, 26], fill=(60, 120, 180, 200))
draw_p.ellipse([8, 8, 24, 16], fill=(100, 160, 220, 150))
draw_p.ellipse([28, 14, 38, 22], fill=(50, 140, 50, 200))
pond.save(os.path.join(OUT, "pond_small.png"))
print("  Generated pond_small.png")

print("\nAll village assets generated successfully!")
