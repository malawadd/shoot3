// SPDX-License-Identifier: MIT

import "./Dataset.sol";

pragma solidity ^0.8.15;

contract DatasetFactory {
    //Init the array of deployed contract addresses
    address[] public deployedDatasets;
    mapping(address => address[]) public studentsDatasets;

    function createDataset(
        string memory name,
        string memory description,
        string memory imageHash,
        uint256 price,
        string[] memory moduleNames,
        string[] memory moduleDescriptions,
        string[] memory materialHashes,
        string[] memory questionHashes
    ) public {
        //creates a new dataset, deploys a new dataset contract and pushes its address onto the address array
        DatasetContract newDataset = new DatasetContract(
            msg.sender,
            name,
            description,
            imageHash,
            price,
            moduleNames,
            moduleDescriptions,
            materialHashes,
            questionHashes
        );
        deployedDatasets.push(address(newDataset));
    }

    function joinDataset(address datasetAddress) public payable {
        DatasetContract dataset = DatasetContract(payable(datasetAddress));
        studentsDatasets[msg.sender].push(datasetAddress);
        dataset.enroll{value: msg.value}(msg.sender);
    }

    function returnEnrolledDatasets() public view returns (address[] memory) {
        address[] memory datasets = studentsDatasets[msg.sender];
        return (datasets);
    }

    function getDeployedDatasets() public view returns (address[] memory) {
        //returns the full array on deployed contracts
        return deployedDatasets;
    }
}
