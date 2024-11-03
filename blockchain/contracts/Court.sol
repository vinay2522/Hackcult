// contracts/Court.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Court {
    struct Evidence {
        uint256 id;
        string caseNumber;
        string evidenceHash;
        string description;
        address submitter;
        uint256 timestamp;
        bool isValid;
    }

    mapping(uint256 => Evidence) public evidences;
    uint256 public evidenceCount;
    
    event EvidenceSubmitted(
        uint256 indexed id,
        string caseNumber,
        string evidenceHash,
        address indexed submitter
    );

    function submitEvidence(
        string memory _caseNumber,
        string memory _evidenceHash,
        string memory _description
    ) public returns (uint256) {
        evidenceCount++;
        
        evidences[evidenceCount] = Evidence(
            evidenceCount,
            _caseNumber,
            _evidenceHash,
            _description,
            msg.sender,
            block.timestamp,
            true
        );

        emit EvidenceSubmitted(
            evidenceCount,
            _caseNumber,
            _evidenceHash,
            msg.sender
        );

        return evidenceCount;
    }

    function getEvidence(uint256 _id) public view returns (
        uint256 id,
        string memory caseNumber,
        string memory evidenceHash,
        string memory description,
        address submitter,
        uint256 timestamp,
        bool isValid
    ) {
        Evidence memory e = evidences[_id];
        return (
            e.id,
            e.caseNumber,
            e.evidenceHash,
            e.description,
            e.submitter,
            e.timestamp,
            e.isValid
        );
    }
}