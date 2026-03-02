#include "../include/ModbusCommunicator.hpp"
#include "../include/QueueManager.hpp"

#include <iostream>
#include <memory>

int main(int argc, char* argv[]) {
    std::cout << "[KRYOS SPRINT 1] Iniciando Motor de Aquisicao C++..." << std::endl;

    auto communicator = std::make_shared<ModbusCommunicator>("127.0.0.1", 502);
    communicator->connect();

    auto engine = std::make_shared<DataAcquisition>(communicator);

    // O XML legado é opcional: não existe modelo default do sistema.
    const std::string modelXmlPath = (argc > 1) ? argv[1] : "";
    if (modelXmlPath.empty()) {
        std::cout << "Modo sem XML legado: nenhum mapa default foi carregado." << std::endl;
        std::cout << "Para usar legado, execute com caminho do XML como argumento." << std::endl;
    }

    QueueManager kryosQueue(engine, modelXmlPath);

    kryosQueue.startSystem();

    std::cout << "Servico em Background online. Pressione ENTER para desligamento limpo (drenagem de fila)." << std::endl;
    std::cin.get();

    kryosQueue.stopSystem();
    std::cout << "Daemon encerrado sem perdas." << std::endl;

    return 0;
}
