#pragma once

#include "IModbusCommunicator.hpp"
#include <modbus/modbus.h>

#include <memory>
#include <string>

struct ModbusContextDeleter {
    void operator()(modbus_t* ctx) const {
        if (ctx) {
            modbus_close(ctx);
            modbus_free(ctx);
        }
    }
};

class ModbusCommunicator : public IModbusCommunicator {
private:
    std::unique_ptr<modbus_t, ModbusContextDeleter> context_;
    std::string ipAddress_;
    int port_;

    void logStructured(const std::string& level, const std::string& event, const std::string& detail) const;

public:
    ModbusCommunicator(std::string ip, int port);
    bool connect() override;
    void disconnect() override;
    std::vector<uint16_t> readData(int unit_id, int function_code, int offset, int count) override;
};
