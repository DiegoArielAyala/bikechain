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
    uint totalActivitiesCounter;

    modifier onlyOwnerOf(uint _id) {
        require(msg.sender == idToAddress[_id], "This address is not the owner");
        _;
    }
    modifier idHasNotBeenRemoved(uint _id) {
        bool removed = false;
        for(uint i = 0; i < deletedActivitiesIds.length; i++){
            if (_id == deletedActivitiesIds[i]){
                removed = true;
            }
        }
        require(removed == false, "This id does not exist");
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
        totalActivitiesCounter++;
        emit activityCreated(id);
    }

    function getLastActivityId() public view returns (uint) {
        return activities[activities.length - 1].id;
    }

    // Crear una funcion que cree y devuelva un array con los ids de las actividades que siguen vigentes, para lo cual hara una comparacion entre los ids de las todas las activities y le restará los id de las activities removidas
    // Esta funcion ser llamada por las funciones retrieve para recibir el array con los ids vigentes y a partir de ese, crear un array de Activities[] y devolverlo para renderizar.

    function existingActivities() public returns(Activity[] memory) {
        Activity[] memory existingActivities = new Activity[](totalActivitiesCounter);
        if(deletedActivitiesIds.length < 1){
            existingActivities = activities;
        }
        uint counter;
                for(uint i = 0; i < activities.length ; i++){
                    for (uint j = 0; j < deletedActivitiesIds.length; j++){
                        if(activities[i].id == deletedActivitiesIds[j]){   
                            break;
                        }
                    existingActivities[counter]=activities[i];
                    counter++;
                    }
                }
        return existingActivities;
    }

    function retrieveAllActivities() public onlyOwner returns (Activity[] memory) {
        return existingActivities();
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

    function removeActivity(uint _id) public onlyOwnerOf(_id) idHasNotBeenRemoved(_id) {
        require(_id < activities.length, "Activity Id do not exist");
        // Agregar otra condicion si el id ya fue eliminado
        delete activities[_id];
        activitiesCounter[msg.sender]--;
        totalActivitiesCounter--;
        deletedActivitiesIds.push(_id);
    }
}
