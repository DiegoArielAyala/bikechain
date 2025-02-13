from brownie import Bikechain
from scripts.helpful_scripts import getAccount


def deploy_bikechain():
    account = getAccount()
    bikechain = Bikechain.deploy({"from": account})
    print(f"Bikechain deployed at {Bikechain[-1]}")
    return bikechain


def create_activity(time, distance, avg_speed):
    account = getAccount()
    if len(Bikechain) < 1:
        bikechain.deploy({"from": account})
    bikechain = Bikechain[-1]
    print(f"bikechain = {bikechain}")
    create_activity_tx = bikechain.createActivity(
        time, distance, avg_speed, {"from": account}
    )
    create_activity_tx.wait(1)
    print(f"Activity saved, id: {bikechain.getLastActivityId()}")


def retrieve_all_activities():
    bikechain = Bikechain[-1]
    activities = bikechain.retrieveAllActivities()
    print(activities)


def retrieve_activity(address=None):
    if address == None:
        address = getAccount()
    bikechain = Bikechain[-1]
    print(bikechain)
    owner_activities = bikechain.retrieveActivities(address)
    print(f"These are the owner activities: {owner_activities}")


def main():
    deploy_bikechain()
    create_activity(120, 45, 25)
    retrieve_all_activities()
