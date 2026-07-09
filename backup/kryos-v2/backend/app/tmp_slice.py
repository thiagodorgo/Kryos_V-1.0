from itertools import islice 
from pathlib import Path 
start=1045 
end=1105 
lines=Path('main.py').read_text(encoding='utf-8').splitlines() 
for idx,line in enumerate(islice(lines,start-1,end),start): 
    print(str(idx) + ': ' + line) 
