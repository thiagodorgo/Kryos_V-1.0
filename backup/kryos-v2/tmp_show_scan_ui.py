import io 
path='frontend/src/App.jsx' 
with io.open(path,'r',encoding='utf-8',errors='replace') as f: 
    lines=f.read().splitlines() 
start=2400; end=2620 
for i in range(start,end): 
    print(str(i+1)+':' + lines[i])
