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
    uint existingActivitiesCounter;

    modifier onlyOwnerOf(uint _id) {
        require(
            msg.sender == idToAddress[_id],
            "This address is not the owner"
        );
        _;
    }
    modifier idHasNotBeenRemoved(uint _id) {
        bool removed = false;
        for (uint i = 0; i < deletedActivitiesIds.length; i++) {
            if (_id == deletedActivitiesIds[i]) {
                removed = true;
            }
        }
        require(removed == false, "This id does not exist");
        _;
    }

    constructor() Ownable(msg.sender) {}

    function createActivity(uint _time, uint _distance, uint _avgSpeed) public {
        uint id = activities.length;
        activities.push(Activity(id, _time, _distance, _avgSpeed));
        idToAddress[id] = msg.sender;
        activitiesCounter[msg.sender]++;
        existingActivitiesCounter++;
        emit activityCreated(id);
    }

    function getLastActivityId() public view returns (uint) {
        return activities[activities.length - 1].id;
    }

    // Crear una funcion que cree y devuelva un array con los ids de las actividades que siguen vigentes, para lo cual hara una comparacion entre los ids de las todas las activities y le restará los id de las activities removidas
    // Esta funcion ser llamada por las funciones retrieve para recibir el array con los ids vigentes y a partir de ese, crear un array de Activities[] y devolverlo para renderizar.

    function existingActivitiesIds() public view returns (uint[] memory) {
        uint[] memory existingActivitiesIdsArray = new uint[](
            existingActivitiesCounter
        );
        require(activities.length > 0, "No activities registered");
        uint counter;
        if (deletedActivitiesIds.length < 1) {
            for (uint i = 0; i < activities.length; i++) {
                existingActivitiesIdsArray[i] = activities[i].id;
                counter++;
            }
        } else {
            for (uint i = 0; i < activities.length; i++) {
                require(
                    counter < existingActivitiesIdsArray.length,
                    "Counter out of range"
                );
                bool exist = true;
                for (uint j = 0; j < deletedActivitiesIds.length; j++) {
                    if (activities[i].id == deletedActivitiesIds[j]) {
                        exist = false;
                        break;
                    }
                }
                if (exist) {
                    existingActivitiesIdsArray[counter] = activities[i].id;
                    counter++;
                    exist = true;
                }
            }
        }
        return existingActivitiesIdsArray;
    }

    function retrieveAllActivities()
        public
        view
        onlyOwner
        returns (uint[] memory, uint[] memory, uint[] memory, uint[] memory)
    {
        return _idsToActivities(existingActivitiesIds());
    }

    function _idsToActivities(
        uint[] memory _activitiesIds
    )
        internal
        view
        returns (uint[] memory, uint[] memory, uint[] memory, uint[] memory)
    {
        uint[] memory ids = new uint[](existingActivitiesCounter);
        uint[] memory times = new uint[](existingActivitiesCounter);
        uint[] memory distances = new uint[](existingActivitiesCounter);
        uint[] memory avgSpeeds = new uint[](existingActivitiesCounter);
        uint counter;
        for (uint i = 0; i < existingActivitiesCounter; i++) {
            uint id = _activitiesIds[i];
            ids[counter] = activities[id].id;
            times[counter] = activities[id].time;
            distances[counter] = activities[id].distance;
            avgSpeeds[counter] = activities[id].avgSpeed;
            counter++;
        }
        return (ids, times, distances, avgSpeeds);
    }

    function retrieveOwnerActivities(
        address _address
    )
        public
        view
        returns (uint[] memory, uint[] memory, uint[] memory, uint[] memory)
    {
        require(activitiesCounter[_address] > 0, "User don`t have activities");
        uint[] memory ownerActivitiesIds = new uint[](
            activitiesCounter[_address]
        );
        uint counter;
        uint[] memory existingIds = existingActivitiesIds();
        require(existingIds.length > 0, "No activities registered");
        for (uint i = 0; i < existingIds.length; i++) {
            if (idToAddress[existingIds[i]] == _address) {
                ownerActivitiesIds[counter] = existingIds[i];
                counter++;
            }
        }
        return _idsToActivities(ownerActivitiesIds);
    }

    function retrieveActivitiesCounter() public view returns (uint) {
        return activitiesCounter[msg.sender];
    }

    function retrieveExistingActivitiesCounter() public view returns (uint) {
        return existingActivitiesCounter;
    }

    function retrieveExistingActivitiesIdsArray()
        public
        view
        returns (uint[] memory)
    {
        return existingActivitiesIds();
    }

    function removeActivity(
        uint _id
    ) public onlyOwnerOf(_id) idHasNotBeenRemoved(_id) {
        require(_id < activities.length, "Activity Id do not exist");
        // Agregar otra condicion si el id ya fue eliminado
        delete activities[_id];
        activitiesCounter[msg.sender]--;
        existingActivitiesCounter--;
        deletedActivitiesIds.push(_id);
    }
}
