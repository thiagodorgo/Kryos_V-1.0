#include "../include/DataAcquisition.hpp"
#include "../include/IModbusCommunicator.hpp"
#include <gmock/gmock.h>
#include <gtest/gtest.h>

#include <cstdio>
#include <fstream>

class MockModbusCommunicator : public IModbusCommunicator {
public:
    MOCK_METHOD(bool, connect, (), (override));
    MOCK_METHOD(void, disconnect, (), (override));
    MOCK_METHOD(std::vector<uint16_t>, readData, (int unit_id, int function_code, int offset, int count), (override));
};

using ::testing::Return;

TEST(KryosAcquisitionTest, LegacyModeExtractionAndOffsetLogic) {
    auto mockComm = std::make_shared<MockModbusCommunicator>();

    EXPECT_CALL(*mockComm, readData(1, 4, 9, 1))
        .Times(1)
        .WillOnce(Return(std::vector<uint16_t>{245}));

    const std::string fakeXmlPath = "fake_kryos_map.xml";
    std::ofstream xml_file(fakeXmlPath);

    xml_file << R"(<mbs_configuration>
  <device addr="1" name="CompressorRack">
    <reg type="holding" addr="40010" code="m05_PS_geral"></reg>
  </device>
</mbs_configuration>)";
    xml_file.close();

    DataAcquisition engine(mockComm);

    const auto results = engine.runLegacyMode(fakeXmlPath, 10);

    ASSERT_FALSE(results.empty());
    EXPECT_EQ(results[0].offset, 9);
    EXPECT_EQ(results[0].raw_value, 245);
    EXPECT_EQ(results[0].quality, DataQuality::GOOD);

    std::remove(fakeXmlPath.c_str());
}

TEST(KryosLogicTest, OffsetConversion) {
    EXPECT_EQ(convertAddressToOffset(40010), 9);
    EXPECT_EQ(convertAddressToOffset(10005), 4);
    EXPECT_EQ(convertAddressToOffset(-5), -1);
    EXPECT_EQ(convertAddressToOffset(100000), -1);
}
