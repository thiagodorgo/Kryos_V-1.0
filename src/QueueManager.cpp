#include "../include/QueueManager.hpp"

#include <chrono>
#include <iostream>

QueueManager::QueueManager(std::shared_ptr<DataAcquisition> acq, std::string xmlMap)
    : acquisitionSystem_(std::move(acq)), currentXmlMap_(std::move(xmlMap)), isRunning_(false) {}

QueueManager::~QueueManager() {
    stopSystem();
}

void QueueManager::startSystem() {
    if (isRunning_.exchange(true)) return;
    producerThread_ = std::make_unique<std::thread>(&QueueManager::producerLoop, this);
    consumerThread_ = std::make_unique<std::thread>(&QueueManager::consumerLoop, this);
}

void QueueManager::stopSystem() {
    if (!isRunning_.exchange(false)) return;
    dataCondition_.notify_all();

    if (producerThread_ && producerThread_->joinable()) producerThread_->join();
    if (consumerThread_ && consumerThread_->joinable()) consumerThread_->join();
}

void QueueManager::producerLoop() {
    while (isRunning_.load()) {
        const auto capturedArray = acquisitionSystem_->runLegacyMode(currentXmlMap_, 1);

        for (const auto& dp : capturedArray) {
            QueueItem item;
            item.payload = dp;

            if (dp.mnemonic.find("falha") != std::string::npos || dp.mnemonic.find("Trigger") != std::string::npos) {
                item.priority = PriorityLevel::REAL_TIME;
            } else {
                item.priority = PriorityLevel::HISTORY;
            }

            {
                std::lock_guard<std::mutex> lock(queueMutex_);
                dataQueue_.push(item);
            }
            dataCondition_.notify_one();
        }

        std::this_thread::sleep_for(std::chrono::milliseconds(2000));
    }
}

void QueueManager::consumerLoop() {
    while (true) {
        QueueItem item;

        {
            std::unique_lock<std::mutex> lock(queueMutex_);
            dataCondition_.wait(lock, [this]() {
                return !dataQueue_.empty() || !isRunning_.load();
            });

            if (!isRunning_.load() && dataQueue_.empty()) break;

            item = dataQueue_.top();
            dataQueue_.pop();
        }

        if (item.priority == PriorityLevel::REAL_TIME) {
            std::cout << "{\"action\":\"WSS\", \"code\":\"" << item.payload.mnemonic
                      << "\", \"val\":" << item.payload.raw_value << "}" << std::endl;
        } else {
            std::cout << "{\"action\":\"MYSQL\", \"offset\":" << item.payload.offset
                      << ", \"val\":" << item.payload.raw_value << "}" << std::endl;
        }
    }
}
