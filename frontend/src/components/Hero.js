import { Contract } from "ethers";
import { useState, useEffect } from "react";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"
import e from "express";

// Recibe provider y signer desde App.js
const Hero = ({ signer }) => {

    const [contract, setContract] = useState(null);
    const [activities, setActivities] = useState([]);

    console.log("BikechainContract", BikechainContract);
    const abi = BikechainContract.abi
    console.log("abi",abi);
    //setActivities(contract.retrieveActivities());
    console.log("activities", activities);
    

    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain.at(-1);
            const bikechain = new Contract(contractAddress, abi, signer);
            setContract(bikechain);
            console.log("Contrato conectado:", bikechain);
            console.log("signer", signer.address);
        }
    }, [signer]);
    
    console.log("contract: ", contract);

    const retrieveMyActivities = async () => {
        try {
            const signerAddress = await signer.getAddress();
            console.log("signerAddress: ", signerAddress)
            const result = await contract.retrieveActivities(signerAddress);
            if(result.length === 0) {
                console.log("No activities found for this address");
                return
            }
            setActivities(result);
            console.log("My Activities:", activities);
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const createActivity = async (time, distance, avgSpeed) => {
        if (!contract) return console.log("Contract not connected");
        try {
            const tx = await contract.createActivity(time, distance, avgSpeed)
            await tx.wait;
            console.log("Activity created", tx);
        } catch (error) {
            console.error(error);
        }
    }

    const retrieveAllActivities = async () => {
        if(!contract) return console.log("Contract not connected");
        try {
            const result = contract.retrieveAllActivities();
            console.log("All activities: ", result)
        } catch (error) {
            console.error(error);
        }
        
    }


    const getFunction = async (name) => {
        abi.forEach(item => {
            if(item.name === name){
                console.log(item)
                return item;
            }
        });
        /*
        try {
            const retrieveActivities = await contract[name]();
            console.log(`Resultado  de ${name}`, retrieveActivities )
        } catch (error) {
            console.error(`Error ejecutando ${name}` ,error);
        }
            */
    }
    
    return (
        <div>
            Hero
            <button onClick={() => {retrieveMyActivities()}}>View My Activities</button>
            <button onClick={() => {retrieveAllActivities()}}>View All Activities</button>
            <button onClick={() => {getFunction("getLastActivityId")}}>View Last Activity Id</button>
            <button onClick={() => {createActivity(60, 105, 25)}}>Create Activity</button>
            <div>
                <h3>Activities</h3>
                <p>{activities}</p>
            </div>
        </div>
    )
}

export default Hero