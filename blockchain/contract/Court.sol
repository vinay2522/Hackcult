// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EvidenceChain {
    struct Evidence {
        string evidenceHash;
        string title;
        string description;
        string datetime;
        string location;
        address owner;
        bool isValid;
    }

    mapping(string => Evidence) public evidences;
    string[] public evidenceList;
    
    event EvidenceAdded(
        string evidenceHash,
        string title,
        string description,
        string datetime,
        string location,
        address owner
    );

    function addEvidence(
        string memory _evidenceHash,
        string memory _title,
        string memory _description,
        string memory _datetime,
        string memory _location
    ) public {
        require(bytes(_evidenceHash).length > 0, "Evidence hash cannot be empty");
        require(!evidences[_evidenceHash].isValid, "Evidence already exists");

        evidences[_evidenceHash] = Evidence(
            _evidenceHash,
            _title,
            _description,
            _datetime,
            _location,
            msg.sender,
            true
        );
        
        evidenceList.push(_evidenceHash);

        emit EvidenceAdded(
            _evidenceHash,
            _title,
            _description,
            _datetime,
            _location,
            msg.sender
        );
    }

    function getEvidence(string memory _evidenceHash) public view returns (
        string memory,
        string memory,
        string memory,
        string memory,
        string memory,
        address
    ) {
        require(evidences[_evidenceHash].isValid, "Evidence does not exist");
        Evidence memory evidence = evidences[_evidenceHash];
        return (
            evidence.evidenceHash,
            evidence.title,
            evidence.description,
            evidence.datetime,
            evidence.location,
            evidence.owner
        );
    }

    function getAllEvidences() public view returns (string[] memory) {
        return evidenceList;
    }
}