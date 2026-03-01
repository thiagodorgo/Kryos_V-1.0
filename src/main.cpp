#include "../include/ModbusCommunicator.hpp"
#include "../include/QueueManager.hpp"

#include <iostream>
#include <memory>

int main() {
    std::cout << "[KRYOS SPRINT 1] Iniciando Motor de Aquisicao C++..." << std::endl;

    auto communicator = std::make_shared<ModbusCommunicator>("127.0.0.1", 502);
    communicator->connect();

    auto engine = std::make_shared<DataAcquisition>(communicator);

    std::string modelXmlPath = "Models/panifresh_modbus_server.xml";

    QueueManager kryosQueue(engine, modelXmlPath);

    kryosQueue.startSystem();

    std::cout << "Servico em Background online. Pressione ENTER para desligamento limpo (drenagem de fila)." << std::endl;
    std::cin.get();

    kryosQueue.stopSystem();
    std::cout << "Daemon encerrado sem perdas." << std::endl;

    return 0;
}
