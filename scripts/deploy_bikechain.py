from brownie import Bikechain
from scripts.helpful_scripts import getAccount


def deploy_bikechain():
    account = getAccount()
    bikechain = Bikechain.deploy({"from": account})
    print(f"Bikechain deployed at {Bikechain[-1]}")
    return bikechain


def create_activity(time, distance, avg_speed):
    account = getAccount()
    if Bikechain.length < 1:
        bikechain.deploy({"from": account})
    bikechain = Bikechain[-1]
    print(f"bikechain = {bikechain}")
    create_activity_tx = bikechain.createActivity(
        time, distance, avg_speed, {"from": account}
    )
    create_activity_tx.wait(1)
    print("Activity saved")


def retrieve_activity(address):
    bikechain = Bikechain[-1]
    bikechain.retrieveActivities(address)


def main():
    deploy_bikechain()
    create_activity()
    retrieve_activity()
