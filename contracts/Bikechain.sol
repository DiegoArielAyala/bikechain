// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bikechain {
    struct Activity {
        uint id;
        uint time;
        uint distance;
        uint avgSpeed;
    }

    mapping(uint => address) idToAddress;

    Activity[] activities;

    function createActivity(uint _time, uint _distance, uint _avgSpeed) public {
        activities.push(
            Activity(activities.length, _time, _distance, _avgSpeed)
        );
        idToAddress[activities.length] = msg.sender;
    }
}
