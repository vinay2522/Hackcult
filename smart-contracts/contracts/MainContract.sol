// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MainContract {
    struct Record {
        string data;
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => Record) public records;
    uint256 public recordCount;

    event RecordAdded(uint256 indexed id, string data, address owner, uint256 timestamp);

    function addRecord(string memory _data) public {
        recordCount++;
        records[recordCount] = Record({
            data: _data,
            owner: msg.sender,
            timestamp: block.timestamp
        });

        emit RecordAdded(recordCount, _data, msg.sender, block.timestamp);
    }

    function getRecord(uint256 _id) public view returns (string memory data, address owner, uint256 timestamp) {
        require(_id > 0 && _id <= recordCount, "Invalid record ID");
        Record memory record = records[_id];
        return (record.data, record.owner, record.timestamp);
    }

    function getRecordCount() public view returns (uint256) {
        return recordCount;
    }
}
