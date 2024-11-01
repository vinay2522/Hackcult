// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Evidence {
    struct EvidenceItem {
        string ipfsHash;
        string title;
        string description;
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => EvidenceItem) public evidences;
    uint256 public evidenceCount;

    event EvidenceAdded(
        uint256 indexed id,
        string ipfsHash,
        string title,
        address owner,
        uint256 timestamp
    );

    function addEvidence(
        string memory _ipfsHash,
        string memory _title,
        string memory _description
    ) public {
        evidenceCount++;
        evidences[evidenceCount] = EvidenceItem(
            _ipfsHash,
            _title,
            _description,
            msg.sender,
            block.timestamp
        );

        emit EvidenceAdded(
            evidenceCount,
            _ipfsHash,
            _title,
            msg.sender,
            block.timestamp
        );
    }

    function getEvidence(uint256 _id)
        public
        view
        returns (
            string memory ipfsHash,
            string memory title,
            string memory description,
            address owner,
            uint256 timestamp
        )
    {
        EvidenceItem memory item = evidences[_id];
        return (
            item.ipfsHash,
            item.title,
            item.description,
            item.owner,
            item.timestamp
        );
    }
}