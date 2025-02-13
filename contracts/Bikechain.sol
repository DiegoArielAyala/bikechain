// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bikechain {
    event activityCreated(uint _id);

    struct Activity {
        uint id;
        uint time;
        uint distance;
        uint avgSpeed;
    }

    mapping(uint => address) idToAddress;
    mapping(address => uint) activitiesCounter;

    Activity[] activities;

    function createActivity(uint _time, uint _distance, uint _avgSpeed) public {
        activities.push(
            Activity(activities.length, _time, _distance, _avgSpeed)
        );
        uint id = activities.length;
        idToAddress[id] = msg.sender;
        activitiesCounter[msg.sender]++;
        emit activityCreated(id);
    }

    function getLastActivityId() public view returns (uint) {
        return activities[activities.length - 1].id;
    }

    function retrieveAllActivities() public view returns (Activity[] memory) {
        return activities;
    }

    function retrieveActivities(
        address _address
    ) public view returns (Activity[] memory) {
        uint counter;
        Activity[] memory ownerActivities = new Activity[](
            activitiesCounter[_address]
        );
        for (uint i = 0; i < activities.length; i++) {
            ownerActivities[counter] = activities[i];
            counter++;
        }
        return ownerActivities;
    }
}
