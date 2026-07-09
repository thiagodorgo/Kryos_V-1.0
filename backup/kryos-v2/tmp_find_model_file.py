import io 
path='backend/app/main.py' 
with io.open(path,'r',encoding='utf-8',errors='replace') as f: 
    for i,line in enumerate(f,1): 
        if 'model_file' in line: 
            print(i, line.rstrip())
