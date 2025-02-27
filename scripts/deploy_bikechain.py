from brownie import Bikechain
from scripts.helpful_scripts import get_account


def deploy_bikechain():
    print("Deploying contract...")
    account = get_account()
    bikechain = Bikechain.deploy({"from": account})
    print(f"Bikechain deployed at {Bikechain[-1]}")
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


def retrieve_owner_activities(address=None):
    print("Retrieving owner activities...")
    if address == None:
        address = get_account()
    bikechain = Bikechain[-1]
    print(bikechain)
    owner_activities = bikechain.retrieveOwnerActivities(address)
    print(f"These are the owner activities: {owner_activities}")


def retrieve_all_activities():
    print("Retrieving all activities...")
    bikechain = Bikechain[-1]
    activities = bikechain.retrieveAllActivities()
    print(f"All activities: {activities}")

def remove_activity(id):
    print(f"Removing activity {id}")
    account = get_account()
    bikechain = Bikechain[-1]
    bikechain.removeActivity(id, {"from": account})
    print(f"Activity {id} removed")


def main():
    deploy_bikechain()
    create_activity(3978, 45, 25)
    retrieve_owner_activities()
    retrieve_all_activities()
