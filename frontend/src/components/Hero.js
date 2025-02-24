import { Contract } from "ethers";
import { useState, useEffect } from "react";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"
import Web3 from "web3";

// Recibe provider y signer desde App.js
const Hero = ({ signer }) => {

    const [contract, setContract] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [activities, setActivities] = useState([]);
    const abi = BikechainContract.abi


    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain.at(-1);
            console.log("Contract Address: ", contractAddress);
            console.log("Signer: ", signer);
            if (!contractAddress){
                console.log("Error: Contract not found");
                return;
            }
            const bikechain = new Contract(contractAddress, abi, signer);
            setContract(bikechain);
            setContractAddress(contractAddress);
        }
    }, [signer]);
    

    const isContractConnected = () => {
        if (contract) {
            return true;
        } else {
            console.log("Contract is not connected");
            return false;
        }
    }

    const retrieveOwnerActivities = async () => {
        if(!contractAddress){
            console.error("Contract address not set yet");
            return;
        }
        try {
            //Verificar si la funcion retrieveActivities existe en la ABI
            if(!contract.retrieveOwnerActivities) {
                console.error("retrieveOwnerActivities no existe");
                return;
            }
            // Llamar a retrieveOwnerActivities 
            console.log("Calling retrieveOwnerActivities...")
            const signerAddress = await signer.getAddress();
            const [ids, times, distances, avgSpeeds] = await contract.retrieveOwnerActivities(signerAddress);
            console.log("Resultado retrieveOwnerActivities: ", ids, times, distances, avgSpeeds);
            /*
            const parsedActivities = result.map(activity => ({
                id: activity.id,
                time: activity.time,
                distance: activity.distance,
                avgSpeed: activity.avgSpeed
            }))
            
            setActivities(parsedActivities);
*/
        } catch (error) {
            console.error("Error: ", error);
        }
    }

    const createActivity = async (time, distance, avgSpeed) => {
        if (isContractConnected() == false) return;
        try {
            const tx = await contract.createActivity(time, distance, avgSpeed)
            await tx.wait();
            console.log("Activity created", tx);
        } catch (error) {
            console.error(error);
        }
    }

    const retrieveAllActivities = async () => {
        if (isContractConnected() == false) return;
        try {
            console.log("Retrieve all activities...")
            const result = contract.retrieveAllActivities();
            
            console.log("All activities: ", result)
        } catch (error) {
            console.error(error);
        }
        
    }


    const getFunction = async (name) => {
        if (isContractConnected() == false) return;
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
            <button onClick={() => {retrieveOwnerActivities()}}>retrieveOwnerActivities</button>
            <button onClick={() => {retrieveAllActivities()}}>retrieveAllActivities</button>
            <button onClick={() => {getFunction("getLastActivityId")}}>View Last Activity Id</button>
            <button onClick={() => {createActivity(60, 105, 25)}}>Create Activity</button>
            <div>
                <h3>Activities</h3>
                {Array.isArray(activities) && activities.length > 0 ? (
                    activities.map((activity, idx) => (
                        <div key={idx} className="activity">
                            <ul>
                                <li> ID: {activity.id.toString()} </li>
                                <li> Time: {activity.time.toString()} </li>
                                <li> Distance: {activity.distance.toString()} </li>
                                <li> AvgSpeed: {activity.avgSpeed.toString()} </li>
                            </ul>
                        </div>
                    ))
                ) : <p>No activities registered</p>}
            </div>
        </div>
    )
}

export default Hero