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
    mapping(address => uint) activitiesCounter;

    Activity[] activities;

    function createActivity(uint _time, uint _distance, uint _avgSpeed) public {
        activities.push(
            Activity(activities.length, _time, _distance, _avgSpeed)
        );
        idToAddress[activities.length] = msg.sender;
        activitiesCounter[msg.sender]++;
    }

    function retrieveActivities(
        address _address
    ) public view returns (Activity[]) {
        uint counter;
        Activity[] ownerActivities = new Activity[](
            activitiesCounter[msg.sender]
        );
        for (i = 0; i < activities.length; i++) {
            ownerActivities[counter] = activities[i];
            counter++;
        }

        return ownerActivities;
    }
}
