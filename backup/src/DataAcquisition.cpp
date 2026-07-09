#include "../include/DataAcquisition.hpp"

#include <chrono>
#include <pugixml.hpp>

DataAcquisition::DataAcquisition(std::shared_ptr<IModbusCommunicator> comm)
    : communicator_(std::move(comm)) {}

uint64_t DataAcquisition::getCurrentTimeMs() const {
    return std::chrono::duration_cast<std::chrono::milliseconds>(
               std::chrono::system_clock::now().time_since_epoch())
        .count();
}

std::vector<DTO_Telemetry> DataAcquisition::runLegacyMode(const std::string& xmlPath, int internal_device_id) {
    std::vector<DTO_Telemetry> results;
    pugi::xml_document doc;

    if (!doc.load_file(xmlPath.c_str())) return results;

    const pugi::xml_node root = doc.child("mbs_configuration");
    if (!root) return results;

    for (const pugi::xml_node device : root.children("device")) {
        const int unit_id = device.attribute("addr").as_int();

        for (const pugi::xml_node node : device.children("reg")) {
            const int raw_address = node.attribute("addr").as_int();
            const std::string code = node.attribute("code").as_string();

            const int offset = convertAddressToOffset(raw_address);
            if (offset < 0) continue;

            const int function_code = 4;
            const std::vector<uint16_t> readBuffer = communicator_->readData(unit_id, function_code, offset, 1);

            DTO_Telemetry dto{};
            dto.timestamp_ms = getCurrentTimeMs();
            dto.device_id = internal_device_id;
            dto.unit_id = unit_id;
            dto.function_code = function_code;
            dto.offset = offset;
            dto.mnemonic = code;
            dto.source_mode = SourceMode::LEGACY_XML;

            if (!readBuffer.empty()) {
                dto.raw_value = readBuffer[0];
                dto.quality = DataQuality::GOOD;
            } else {
                dto.raw_value = 0;
                dto.quality = DataQuality::BAD_TIMEOUT;
            }
            results.push_back(dto);
        }
    }
    return results;
}
