
path = r'c:\Code\Squircles\squircles.js'
with open(path, 'r') as f:
    lines = f.readlines()

new_lines = []
in_level_nine = False
inserted = False
removed_bad = False

for i, line in enumerate(lines):
    # Detect bad line (it was inserted around line 252, and contains the loop start)
    # We can identify it because it's 'this.balls.forEach' but NOT in LevelNine (yet)
    if 'this.balls.forEach(b => {' in line and not in_level_nine and not removed_bad:
        # Double check context if possible, but for now just remove strict match if found early
        # The bad line is indented 8 spaces.
        if line.strip() == 'this.balls.forEach(b => {':
             print(f"Removing bad line at {i+1}")
             removed_bad = True
             continue

    if 'class LevelNine extends Level' in line:
        in_level_nine = True
    
    new_lines.append(line)

    if in_level_nine and 'handleMouseUp(x, y) {' in line and not inserted:
        new_lines.append('        this.balls.forEach(b => {\n')
        inserted = True
        print(f"Inserted loop in LevelNine at line {len(new_lines)}")

with open(path, 'w') as f:
    f.writelines(new_lines)
