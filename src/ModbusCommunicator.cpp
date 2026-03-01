#include "../include/ModbusCommunicator.hpp"

#include <cerrno>
#include <chrono>
#include <iostream>
#include <stdexcept>
#include <thread>

ModbusCommunicator::ModbusCommunicator(std::string ip, int port)
    : ipAddress_(std::move(ip)), port_(port), context_(nullptr) {}

void ModbusCommunicator::logStructured(const std::string& level, const std::string& event, const std::string& detail) const {
    const auto now = std::chrono::system_clock::now().time_since_epoch();
    const auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(now).count();

    std::cerr << "{\"timestamp\":" << ms << ", \"level\":\"" << level
              << "\", \"event\":\"" << event << "\", \"host\":\"" << ipAddress_
              << "\", \"detail\":\"" << detail << "\"}" << std::endl;
}

bool ModbusCommunicator::connect() {
    modbus_t* rawCtx = modbus_new_tcp(ipAddress_.c_str(), port_);
    if (!rawCtx) return false;

    context_.reset(rawCtx);
    modbus_set_response_timeout(context_.get(), 2, 0);

    if (modbus_connect(context_.get()) == -1) {
        logStructured("ERROR", "CONNECT_FAILED", modbus_strerror(errno));
        return false;
    }
    return true;
}

void ModbusCommunicator::disconnect() {
    if (context_) {
        modbus_close(context_.get());
        context_.reset();
    }
}

std::vector<uint16_t> ModbusCommunicator::readData(int unit_id, int function_code, int offset, int count) {
    if (function_code != 3 && function_code != 4) {
        throw std::invalid_argument("Function Code Invalido: Apenas FC3 e FC4 suportados.");
    }

    if (count <= 0 || count > 125) {
        throw std::invalid_argument("Quantidade de registradores (count) invalida.");
    }
    if (offset < 0 || offset > 65535) {
        throw std::invalid_argument("Offset de barramento fora dos limites permitidos (0-65535).");
    }

    std::vector<uint16_t> buffer(count, 0);
    int backoff_delay_ms = 500;

    for (int attempt = 1; attempt <= 3; ++attempt) {
        try {
            if (!context_) throw std::runtime_error("Contexto TCP nulo");
            if (modbus_set_slave(context_.get(), unit_id) == -1) throw std::runtime_error("Falha ao definir Slave ID");

            const int result = (function_code == 3)
                                   ? modbus_read_registers(context_.get(), offset, count, buffer.data())
                                   : modbus_read_input_registers(context_.get(), offset, count, buffer.data());

            if (result < 0) throw std::runtime_error(modbus_strerror(errno));

            return buffer;

        } catch (const std::exception& e) {
            logStructured("WARN", "READ_RETRY", std::string("Tentativa ") + std::to_string(attempt) + " Falhou: " + e.what());

            disconnect();
            std::this_thread::sleep_for(std::chrono::milliseconds(backoff_delay_ms));

            if (!connect()) {
                logStructured("ERROR", "RECONNECT_FAILED", "Falha de reabertura do socket TCP.");
            }
            backoff_delay_ms *= 2;
        }
    }
    return {};
}
