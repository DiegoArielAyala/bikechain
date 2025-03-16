from brownie import Bikechain
from scripts.helpful_scripts import get_account


def deploy_bikechain():
    account = get_account()
    bikechain = Bikechain.deploy({"from": account})
    print("")
    return bikechain


def create_activity(time, distance, avg_speed):
    account = get_account()
    if len(Bikechain) < 1:
        Bikechain.deploy({"from": account})
    bikechain = Bikechain[-1]
    create_activity_tx = bikechain.createActivity(
        time, distance, avg_speed, {"from": account}
    )
    create_activity_tx.wait(1)


def retrieve_owner_activities(address=None):
    if address == None:
        address = get_account()
    bikechain = Bikechain[-1]
    owner_activities = bikechain.retrieveOwnerActivities(address)
    print(f"Owner activities: {owner_activities}")
    print("")


def retrieve_all_activities():
    account = get_account()
    bikechain = Bikechain[-1]
    activities = bikechain.retrieveAllActivities({"from": account})
    print(f"Retrieve All activities: {activities}")
    print("")

def existing_activities_ids():
    bikechain = Bikechain[-1]
    activities = bikechain.existingActivitiesIds()
    print(f"Existing activities id: {activities}")
    print("")

def remove_activity(id):
    account = get_account()
    bikechain = Bikechain[-1]
    removeTx = bikechain.removeActivity(id, {"from": account})
    removeTx.wait(1)
    print(f"Activity {id} removed")
    print("")

def retrieve_activities_counter():
    bikechain = Bikechain[-1]
    activitiesCounter = bikechain.retrieveActivitiesCounter()
    print(f"Retrieve Activities counter: {activitiesCounter}")
    print("")

def retrieve_existing_activities_ids_array():
    bikechain = Bikechain[-1]
    existingIds = bikechain.retrieveExistingActivitiesIdsArray()
    print(f"Retrieve Existing Ids Array: {existingIds}")
    print("")

def retrieve_existing_activities_counter():
    bikechain = Bikechain[-1]
    print(Bikechain[-1].address)
    print(Bikechain)
    existingCounter = bikechain.retrieveExistingActivitiesCounter()
    print(f"Retrieve Existing counter: {existingCounter}")
    print("")

def retrieve_deleted_activities_ids():
    bikechain = Bikechain[-1]
    deletedActivitiesIds = bikechain.retrieveDeletedActivitiesIds()
    print(f"retrieve_deleted_activities_ids: {deletedActivitiesIds}")
    print("")

def main():
    deploy_bikechain()
    create_activity(4782, 668, 312)

    