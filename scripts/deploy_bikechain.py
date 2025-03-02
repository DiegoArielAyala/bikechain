from brownie import Bikechain
from scripts.helpful_scripts import get_account, update_frontend


def deploy_bikechain():
    # print("Deploying contract...")
    account = get_account()
    bikechain = Bikechain.deploy({"from": account})
    # print(f"Bikechain deployed at {Bikechain[-1]}")
    print("")
    return bikechain


def create_activity(time, distance, avg_speed):
    # print("Creating activity...")
    account = get_account()
    if len(Bikechain) < 1:
        Bikechain.deploy({"from": account})
    bikechain = Bikechain[-1]
    create_activity_tx = bikechain.createActivity(
        time, distance, avg_speed, {"from": account}
    )
    create_activity_tx.wait(1)
    lastActivityId = bikechain.getLastActivityId()
    # print(f"Activity created, id: {lastActivityId}")
    # print("")


def retrieve_owner_activities(address=None):
    # print("Retrieving owner activities...")
    if address == None:
        address = get_account()
    bikechain = Bikechain[-1]
    owner_activities = bikechain.retrieveOwnerActivities(address)
    print(f"Owner activities: {owner_activities}")
    print("")


def retrieve_all_activities():
    # print("Retrieving all activities...")
    account = get_account()
    bikechain = Bikechain[-1]
    activities = bikechain.retrieveAllActivities({"from": account})
    print(f"Retrieve All activities: {activities}")
    print("")

def existing_activities_ids():
    # print("Existing activities...")
    bikechain = Bikechain[-1]
    activities = bikechain.existingActivitiesIds()
    print(f"Existing activities id: {activities}")
    print("")

def remove_activity(id):
    # print(f"Removing activity {id}")
    account = get_account()
    bikechain = Bikechain[-1]
    removeTx = bikechain.removeActivity(id, {"from": account})
    removeTx.wait(1)
    print(f"Activity {id} removed")
    print("")

def retrieve_activities_counter():
    # print(f"retrieve_activities_counter")
    bikechain = Bikechain[-1]
    activitiesCounter = bikechain.retrieveActivitiesCounter()
    print(f"Retrieve Activities counter: {activitiesCounter}")
    print("")

def retrieve_existing_activities_ids_array():
    # print(f"retrieve_existing_activities_ids_array")
    bikechain = Bikechain[-1]
    existingIds = bikechain.retrieveExistingActivitiesIdsArray()
    print(f"Retrieve Existing Ids Array: {existingIds}")
    print("")

def retrieve_existing_activities_counter():
    # print(f"retrieve_existing_activities_counter")
    bikechain = Bikechain[-1]
    existingCounter = bikechain.retrieveExistingActivitiesCounter()
    print(f"Retrieve Existing counter: {existingCounter}")
    print("")

def retrieve_deleted_activities_ids():
    # print(f"retrieve_deleted_activities_ids")
    bikechain = Bikechain[-1]
    deletedActivitiesIds = bikechain.retrieveDeletedActivitiesIds()
    print(f"retrieve_deleted_activities_ids: {deletedActivitiesIds}")
    print("")

def main():
    #deploy_bikechain()
    #update_frontend()
    #create_activity(3978, 45, 25)
    #create_activity(4278, 335, 215)
    ## create_activity(5958, 685, 125)
    #retrieve_existing_activities_counter()
    #retrieve_deleted_activities_ids()
    #existing_activities_ids()
    #retrieve_activities_counter()
    #retrieve_existing_activities_ids_array()
    #retrieve_all_activities()
    #remove_activity(1)
    #retrieve_existing_activities_counter()
    #retrieve_deleted_activities_ids()
    #existing_activities_ids()
    #retrieve_activities_counter()
    #retrieve_existing_activities_ids_array()
    #retrieve_all_activities()
    retrieve_owner_activities()
    