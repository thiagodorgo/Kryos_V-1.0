#pragma once

#include "DataAcquisition.hpp"
#include "DataTypes.hpp"

#include <atomic>
#include <condition_variable>
#include <memory>
#include <mutex>
#include <queue>
#include <string>
#include <thread>

class QueueManager {
private:
    std::priority_queue<QueueItem> dataQueue_;
    std::mutex queueMutex_;
    std::condition_variable dataCondition_;
    std::atomic<bool> isRunning_;

    std::unique_ptr<std::thread> producerThread_;
    std::unique_ptr<std::thread> consumerThread_;
    std::shared_ptr<DataAcquisition> acquisitionSystem_;
    std::string currentXmlMap_;

    void producerLoop();
    void consumerLoop();

public:
    QueueManager(std::shared_ptr<DataAcquisition> acq, std::string xmlMap);
    ~QueueManager();

    void startSystem();
    void stopSystem();
};
