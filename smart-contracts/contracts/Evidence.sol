// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Evidence {
    address public owner;

    struct EvidenceItem {
        string ipfsHash;
        string caseNumber;
        address submitter;
        uint256 timestamp;
        bool exists;
    }

    mapping(uint256 => EvidenceItem) public evidenceItems;
    uint256 public evidenceCount;

    event EvidenceAdded(
        uint256 indexed id,
        string ipfsHash,
        string caseNumber,
        address indexed submitter,
        uint256 timestamp
    );

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addEvidence(string memory _ipfsHash, string memory _caseNumber) public returns (uint256) {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_caseNumber).length > 0, "Case number cannot be empty");

        evidenceCount++;
        evidenceItems[evidenceCount] = EvidenceItem({
            ipfsHash: _ipfsHash,
            caseNumber: _caseNumber,
            submitter: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        emit EvidenceAdded(
            evidenceCount,
            _ipfsHash,
            _caseNumber,
            msg.sender,
            block.timestamp
        );

        return evidenceCount;
    }

    function getEvidence(uint256 _id) public view returns (
        string memory ipfsHash,
        string memory caseNumber,
        address submitter,
        uint256 timestamp
    ) {
        require(_id > 0 && _id <= evidenceCount, "Invalid evidence ID");
        require(evidenceItems[_id].exists, "Evidence does not exist");
        
        EvidenceItem storage item = evidenceItems[_id];
        return (item.ipfsHash, item.caseNumber, item.submitter, item.timestamp);
    }

    function getEvidenceCount() public view returns (uint256) {
        return evidenceCount;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
