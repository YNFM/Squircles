
file_path = r'c:\Code\Squircles\squircles.js'
with open(file_path, 'r') as f:
    lines = f.readlines()

new_lines = []
inserted = False
for i, line in enumerate(lines):
    new_lines.append(line)
    if 'handleMouseUp(x, y) {' in line and not inserted:
        # Check if next line is already the loop (idempotency)
        if i + 1 < len(lines) and 'this.balls.forEach' in lines[i+1]:
            print("Loop already exists.")
            inserted = True
            continue
            
        # Insert the loop start
        new_lines.append('        this.balls.forEach(b => {\n')
        inserted = True
        print(f"Inserted loop at line {i+2}")

with open(file_path, 'w') as f:
    f.writelines(new_lines)
