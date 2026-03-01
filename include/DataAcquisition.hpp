#pragma once

#include "DataTypes.hpp"
#include "IModbusCommunicator.hpp"

#include <memory>
#include <string>
#include <vector>

class DataAcquisition {
private:
    std::shared_ptr<IModbusCommunicator> communicator_;
    uint64_t getCurrentTimeMs() const;

public:
    explicit DataAcquisition(std::shared_ptr<IModbusCommunicator> comm);
    std::vector<DTO_Telemetry> runLegacyMode(const std::string& xmlPath, int internal_device_id);
};
