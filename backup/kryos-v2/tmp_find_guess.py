import io 
path='backend/app/main.py' 
with io.open(path,'r',encoding='utf-8',errors='replace') as f: 
    for i,line in enumerate(f,1): 
        if 'guess_model_file_for_codes' in line: 
            print(i, line.rstrip())
