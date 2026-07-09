from pathlib import Path 
target='/api/plants' 
lines=Path('main.py').read_text(encoding='utf-8').splitlines() 
for i,line in enumerate(lines,1): 
    if target in line: 
        print(i, line.strip()) 
