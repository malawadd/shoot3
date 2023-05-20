// SPDX-License-Identifier: MIT

pragma solidity ^0.8.15;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";



library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x - y) <= x, "ds-math-sub-underflow");
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}

contract Funds is ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _fundCount;

    address payable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    struct Fund {
        uint256 id;
        string fundId;
        string fundName;
        string fundDescription;
        uint256 fundContributors;
        uint256 fundPrice;
        uint256 fundGoal;
        uint256 fundAmountRaised;
        uint256 fundFee;
        address payable uploader;
    }

    mapping(uint256 => Fund) private idToFund;

    event FundCreated(
        uint256 id,
        string fundId,
        string fundName,
        string fundDescription,
        uint256 fundContributors,
        uint256 fundPrice,
        uint256 fundGoal,
        uint256 fundAmountRaised,
        uint256 fundFee,
        address uploader
    );

    function createFund(
        string memory _fundId,
        string memory _fundName,
        string memory _fundDescription,
        uint256 _fundPrice,
        uint256 _fundGoal,
        uint256 _fundFee
    ) external nonReentrant {
        require(bytes(_fundId).length > 0, "Fund Name not found");
        require(bytes(_fundName).length > 0, "Fund Name not found");
        require(
            bytes(_fundDescription).length > 0,
            "Fund Description not found"
        );
        require(_fundPrice >= 0, "Fund Price not found");
        require(_fundGoal > 0, "Fund Goal not found");
        require(_fundFee >= 0, "Fund Fee not found");
        require(msg.sender != address(0), "Sender Address not found");

        _fundCount.increment();
        uint256 fundCount = _fundCount.current();

        idToFund[fundCount] = Fund(
            fundCount,
            _fundId,
            _fundName,
            _fundDescription,
            0,
            _fundPrice,
            _fundGoal,
            0,
            _fundFee,
            payable(msg.sender)
        );

        emit FundCreated(
            fundCount,
            _fundId,
            _fundName,
            _fundDescription,
            0,
            _fundPrice,
            _fundGoal,
            0,
            _fundFee,
            msg.sender
        );
    }

    function fundFund(string memory _fundId, uint256 _id)
        external
        payable
        nonReentrant
    {
        require(bytes(_fundId).length > 0, "Id not found");
        require(bytes(_fundId).length == bytes(idToFund[_id].fundId).length);
        require(
            msg.sender != idToFund[_id].uploader,
            "uploader cannot fund own fund"
        );
        require(
            msg.value == idToFund[_id].fundPrice,
            "Value is less or greater than price"
        );

        if (idToFund[_id].fundGoal == idToFund[_id].fundAmountRaised) {
            revert("Fund already completed");
        }

        idToFund[_id].uploader.transfer(msg.value);
        idToFund[_id].fundAmountRaised = idToFund[_id].fundAmountRaised.add(
            msg.value
        );
        idToFund[_id].fundContributors = idToFund[_id].fundContributors.add(
            1
        );
    }

    function fetchFund() external view returns (Fund[] memory) {
        uint256 totalFundCount = _fundCount.current();
        uint256 currentIndex = 0;

        Fund[] memory funds = new Fund[](totalFundCount);

        for (uint256 i = 0; i < totalFundCount; i++) {
            uint256 currentId = i.add(1);
            Fund storage currentFund = idToFund[currentId];
            funds[currentIndex] = currentFund;
            currentIndex += 1;
        }
        return funds;
    }
}
