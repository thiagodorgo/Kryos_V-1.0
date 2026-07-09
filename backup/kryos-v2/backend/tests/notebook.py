import os
import shutil
import math

def export_ultra_fragmented():
    output_folder = "upload"
    MAX_SIZE_BYTES = 7500 * 1024  # Limite de ~7.5MB por arquivo
    
    structure = {
        "1_BACKEND_DB_MODELS": ["model", "schema", ".sql", ".prisma"],
        "2_BACKEND_HARDWARE_MODBUS": ["modbus", "hardware", "serial", "plc", "comm", "libmodbus"],
        "3_BACKEND_API_ROUTES": ["routes", "api", "controller", "endpoint", "views"],
        "4_BACKEND_DATA_PROCESSING": ["process", "calc", "transform", "parser", "buffer"],
        "5_BACKEND_SERVICES_TASKS": ["service", "task", "cron", "worker", "job"],
        "6_BACKEND_UTILS_HELPERS": ["util", "helper", "tool", "config_manager", "common", "shared"],
        "7_BACKEND_ERRORS_LOGS": ["error", "log", "exception", "handler"],
        "8_FRONTEND_UI": [".js", ".jsx", ".ts", ".tsx", ".html", ".css", ".scss", ".vue"],
        "9_DOCS_AND_CONFIG": [".md", ".txt", ".xml", ".json", ".yaml", ".yml", "Dockerfile", "requirements.txt", "package.json"]
    }

    ignore_dirs = {'.git', 'node_modules', '__pycache__', 'venv', '.next', 'build', 'dist', output_folder}

    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)
    os.makedirs(output_folder)

    # Coletor temporário para a categoria 6 antes da divisão decimal
    utils_buffer = []

    # Dicionário para as outras categorias (com o limite de 8MB padrão)
    other_outputs = {k: [""] for k in structure.keys() if k != "6_BACKEND_UTILS_HELPERS"}

    print("🛠️  Iniciando fragmentação decimal da categoria UTILS...")

    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if d not in ignore_dirs]
        for file in files:
            file_path = os.path.join(root, file)
            file_lower = file.lower()
            ext = os.path.splitext(file)[1].lower()
            
            target_cat = None
            for cat, keywords in structure.items():
                if any(kw in file_lower or kw == ext for kw in keywords):
                    target_cat = cat
                    break
            
            # Fallback para Utils
            if (not target_cat and ext in {'.py', '.js', '.ts'}) or target_cat == "6_BACKEND_UTILS_HELPERS":
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    header = f"\n\n{'='*60}\nARQUIVO: {file_path}\n{'='*60}\n\n"
                    utils_buffer.append(header + content)
                except: pass
            
            elif target_cat:
                # Processamento normal para as outras 8 categorias
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                        content = f.read()
                    header = f"\n\n{'='*60}\nFILE: {file_path}\n{'='*60}\n\n"
                    block = header + content
                    idx = len(other_outputs[target_cat]) - 1
                    if len(other_outputs[target_cat][idx].encode('utf-8')) + len(block.encode('utf-8')) > MAX_SIZE_BYTES:
                        other_outputs[target_cat].append(block)
                    else:
                        other_outputs[target_cat][idx] += block
                except: pass

    # --- LÓGICA DE DIVISÃO EM 10 PARA UTILS ---
    if utils_buffer:
        num_files = 10
        # Calcula quantos blocos de arquivos por arquivo final
        chunks_per_file = math.ceil(len(utils_buffer) / num_files)
        
        for i in range(num_files):
            start = i * chunks_per_file
            end = start + chunks_per_file
            current_chunk = utils_buffer[start:end]
            
            if current_chunk:
                filename = f"6_BACKEND_UTILS_HELPERS_PART_{i+1}_OF_10.txt"
                with open(os.path.join(output_folder, filename), "w", encoding="utf-8") as f_out:
                    f_out.write(f"--- CATEGORIA 6: UTILS (PARTE {i+1} DE 10) ---\n")
                    f_out.writelines(current_chunk)
                print(f"📦 Gerado: {filename}")

    # Escreve as outras categorias
    for cat, parts in other_outputs.items():
        for i, content in enumerate(parts):
            if content:
                suffix = f"_PART_{i+1}" if len(parts) > 1 else ""
                with open(os.path.join(output_folder, f"{cat}{suffix}.txt"), "w", encoding="utf-8") as f:
                    f.write(content)

    print(f"\n✅ Concluído! A categoria 6 foi fatiada em 10 partes na pasta '{output_folder}'.")

if __name__ == "__main__":
    export_ultra_fragmented()