import pytest
from brownie import Bikechain, network
from scripts.helpful_scripts import get_account, LOCAL_BLOCKCHAIN_ENVIRONMENT
from scripts.deploy_bikechain import deploy_bikechain

def test_create_activity():
    if(network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENT):
        pytest.skip()
    # Arrange
    bikechain = deploy_bikechain()
    # Act
    existing_activities_counter = bikechain.retrieveExistingActivitiesCounter()
    bikechain.createActivity(7342, 871, 256)
    expected = bikechain.retrieveExistingActivitiesCounter()
    print("existing_activities_counter: ", existing_activities_counter)
    print("bikechain: ", bikechain)
    # Assert
    assert expected == existing_activities_counter + 1