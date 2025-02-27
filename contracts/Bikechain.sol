// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Bikechain is Ownable {
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
    uint[] deletedActivitiesIds;

    modifier onlyOwnerOf(uint _id) {
        require(msg.sender == idToAddress[_id]);
        _;
    }

    constructor() Ownable(msg.sender){}

    function createActivity(uint _time, uint _distance, uint _avgSpeed) public {
        uint id = activities.length;
        activities.push(
            Activity(id, _time, _distance, _avgSpeed)
        );
        idToAddress[id] = msg.sender;
        activitiesCounter[msg.sender]++;
        emit activityCreated(id);
    }

    function getLastActivityId() public view returns (uint) {
        return activities[activities.length - 1].id;
    }

    function retrieveAllActivities() public view onlyOwner returns (Activity[] memory) {
        // Crear un array con las actividades aun existentes para devolver
        Activity[] existingActivities;
        for(uint i = 0; i < activities.length ; i++){
            if(activities[i].id in deletedActivitiesIds){
                existingActivities.push(activities[i])
            } 
        }
        return activities;
    }

    function retrieveOwnerActivities(address _address)
        public
        view
        returns (uint[] memory, uint[] memory, uint[] memory, uint[] memory){
        uint counter;

        uint[] memory ids = new uint[](activitiesCounter[_address]);
        uint[] memory times = new uint[](activitiesCounter[_address]);
        uint[] memory distances = new uint[](activitiesCounter[_address]);
        uint[] memory avgSpeeds = new uint[](activitiesCounter[_address]);
        for (uint i = 0; i < activities.length; i++) {
            if (idToAddress[i] == _address) {
                ids[counter] = activities[i].id;
                times[counter] = activities[i].time;
                distances[counter] = activities[i].distance;
                avgSpeeds[counter] = activities[i].avgSpeed;
                counter++;
            }
        }
        return (ids,
        times,
        distances,
        avgSpeeds);
    }

    function removeActivity(uint _id) public onlyOwnerOf(_id) {
        delete activities[_id];
        activitiesCounter[msg.sender]--;
        deletedActivitiesIds.push(_id);
    }
}
