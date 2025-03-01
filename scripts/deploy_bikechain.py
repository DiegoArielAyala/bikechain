from brownie import Bikechain
from scripts.helpful_scripts import get_account


def deploy_bikechain():
    print("Deploying contract...")
    account = get_account()
    bikechain = Bikechain.deploy({"from": account})
    print(f"Bikechain deployed at {Bikechain[-1]}")
    print("")
    return bikechain


def create_activity(time, distance, avg_speed):
    print("Creating activity...")
    account = get_account()
    if len(Bikechain) < 1:
        Bikechain.deploy({"from": account})
    bikechain = Bikechain[-1]
    create_activity_tx = bikechain.createActivity(
        time, distance, avg_speed, {"from": account}
    )
    create_activity_tx.wait(1)
    lastActivityId = bikechain.getLastActivityId()
    print(f"Activity saved, id: {lastActivityId}")
    print("")


def retrieve_owner_activities(address=None):
    print("Retrieving owner activities...")
    if address == None:
        address = get_account()
    bikechain = Bikechain[-1]
    print(bikechain)
    owner_activities = bikechain.retrieveOwnerActivities(address)
    print(f"Owner activities: {owner_activities}")
    print("")


def retrieve_all_activities():
    print("Retrieving all activities...")
    account = get_account()
    bikechain = Bikechain[-1]
    activities = bikechain.retrieveAllActivities({"from": account})
    print(f"All activities: {activities}")
    print("")

def existing_activities_ids():
    print("Existing activities...")
    bikechain = Bikechain[-1]
    activities = bikechain.existingActivitiesIds()
    print(f"Existing activities: {activities}")
    print("")

def remove_activity(id):
    print(f"Removing activity {id}")
    account = get_account()
    bikechain = Bikechain[-1]
    bikechain.removeActivity(id, {"from": account})
    print(f"Activity {id} removed")
    print("")

def retrieve_activities_counter():
    print(f"retrieve_activities_counter")
    bikechain = Bikechain[-1]
    activitiesCounter = bikechain.retrieveActivitiesCounter()
    print(f"Activities counter: {activitiesCounter}")
    print("")

def retrieve_existing_activities_ids_array():
    print(f"retrieve_existing_activities_ids_array")
    bikechain = Bikechain[-1]
    existringIds = bikechain.retrieveExistingActivitiesIdsArray()
    print(f"Existing Ids: {existringIds}")
    print("")

def retrieve_existing_activities_counter():
    print(f"retrieve_existing_activities_counter")
    bikechain = Bikechain[-1]
    existringCounter = bikechain.retrieveExistingActivitiesCounter()
    print(f"Existing counter: {existringCounter}")
    print("")

def main():
    deploy_bikechain()
    create_activity(3978, 45, 25)
    create_activity(4278, 335, 215)
    # create_activity(5958, 685, 125)
    #retrieve_existing_activities_counter()
    #existing_activities_ids()
    #retrieve_all_activities()
    #retrieve_existing_activities_ids_array()
    retrieve_activities_counter()
    remove_activity(1)
    retrieve_all_activities()
    retrieve_activities_counter()
    existing_activities_ids()
    retrieve_existing_activities_ids_array()

    #retrieve_owner_activities()