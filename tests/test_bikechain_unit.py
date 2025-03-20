import pytest
from brownie import Bikechain, network, exceptions  
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENT, get_account
from scripts.deploy_bikechain import deploy_bikechain
import json

def test_create_activity():
    if(network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENT):
        pytest.skip()
    # Arrange
    bikechain = deploy_bikechain()
    # Act
    existing_activities_counter = bikechain.retrieveExistingActivitiesCounter()
    bikechain.createActivity(7342, 871, 256)
    expected = bikechain.retrieveExistingActivitiesCounter()
    activity_counter = bikechain.retrieveActivitiesCounter()
    # Assert
    assert expected == existing_activities_counter + 1
    assert activity_counter == 1


def test_remove_activity():
    if(network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENT):
        pytest.skip()
    bikechain = deploy_bikechain()
    bikechain.createActivity(7342, 871, 256)
    bikechain.createActivity(6342, 771, 286)
    existing_activities_before = bikechain.retrieveExistingActivitiesCounter()
    deleted_activities_before = bikechain.retrieveDeletedActivitiesIds()
    bikechain.removeActivity(0)
    existing_activities_after = bikechain.retrieveExistingActivitiesCounter()
    deleted_activities_after = bikechain.retrieveDeletedActivitiesIds()
    assert existing_activities_before == 2
    assert existing_activities_after == 1
    assert len(deleted_activities_before) == 0
    assert len(deleted_activities_after) == 1

def test_cant_remove_unexisting_activity():
    bikechain = deploy_bikechain()
    with pytest.raises(exceptions.VirtualMachineError): 
        bikechain.removeActivity(0)

def test_cant_remove_deleted_activity():
    bikechain = deploy_bikechain()
    bikechain.createActivity(6342, 771, 286)
    bikechain.removeActivity(0)
    with pytest.raises(exceptions.VirtualMachineError):
        bikechain.removeActivity(0)

def test_retrieve_only_owner_activities():
    account = "0x1BD2d0303B2D9bC2D303aFfc5083083Dc7242B5f"
    bikechain = deploy_bikechain()
    bikechain.createActivity(6342, 771, 286)
    bikechain.createActivity(4242, 841, 386)
    bikechain.createActivity(8342, 911, 186, {"from": account})
    existingActivities = bikechain.existingActivitiesIds()
    existingActivitiesCounter = bikechain.retrieveExistingActivitiesCounter()
    ownerActivitiesCounter = bikechain.retrieveActivitiesCounter()
    ownerActivities = bikechain.retrieveOwnerActivities(get_account())
    assert len(existingActivities) == 3
    assert existingActivitiesCounter == 3
    assert ownerActivitiesCounter == 2
    assert len(ownerActivities[0]) == 2