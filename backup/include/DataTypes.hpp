#pragma once

#include <cstdint>
#include <string>

enum class PriorityLevel { HISTORY = 0, REAL_TIME = 1 };
enum class DataQuality { GOOD = 0, BAD_TIMEOUT = 1, BAD_CHECKSUM = 2 };
enum class SourceMode { DISCOVERY = 0, LEGACY_XML = 1 };

struct DTO_Telemetry {
    uint64_t timestamp_ms;
    int device_id;
    int unit_id;
    int function_code;
    int offset;
    uint16_t raw_value;
    DataQuality quality;
    SourceMode source_mode;
    std::string mnemonic;
};

struct QueueItem {
    PriorityLevel priority;
    DTO_Telemetry payload;

    bool operator<(const QueueItem& other) const {
        return static_cast<int>(priority) < static_cast<int>(other.priority);
    }
};

inline int convertAddressToOffset(int raw_address) {
    if (raw_address <= 0) return -1;

    const int base = raw_address % 100000;
    if (base == 0) return -1;

    return base - 1;
}
