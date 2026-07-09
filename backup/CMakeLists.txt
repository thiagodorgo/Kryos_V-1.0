cmake_minimum_required(VERSION 3.16)
project(KryosModbusAcquisitionEngine CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

enable_testing()

find_package(PkgConfig REQUIRED)
pkg_check_modules(MODBUS REQUIRED libmodbus)

find_package(pugixml REQUIRED)
find_package(GTest REQUIRED COMPONENTS gtest gmock gtest_main)

include_directories(include ${MODBUS_INCLUDE_DIRS})

set(SOURCES
    src/ModbusCommunicator.cpp
    src/DataAcquisition.cpp
    src/QueueManager.cpp
)

add_library(KryosCore ${SOURCES})
target_link_libraries(KryosCore ${MODBUS_LIBRARIES} pugixml::pugixml)

add_executable(KryosEngine src/main.cpp)
target_link_libraries(KryosEngine KryosCore pthread)

add_executable(KryosTests tests/test_engine.cpp)
target_link_libraries(KryosTests KryosCore GTest::gmock GTest::gtest_main pthread)
add_test(NAME EngineTests COMMAND KryosTests)
