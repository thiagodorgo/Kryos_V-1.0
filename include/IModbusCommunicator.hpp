#pragma once

#include <cstdint>
#include <vector>

class IModbusCommunicator {
public:
    virtual ~IModbusCommunicator() = default;
    virtual bool connect() = 0;
    virtual void disconnect() = 0;
    virtual std::vector<uint16_t> readData(int unit_id, int function_code, int offset, int count) = 0;
};
