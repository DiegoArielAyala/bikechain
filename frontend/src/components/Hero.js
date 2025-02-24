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

    console.log("BikechainContract", BikechainContract);
    const abi = BikechainContract.abi
    console.log("abi",abi);
    //setActivities(contract.retrieveActivities());
    console.log("activities", activities);
    
    

    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain.at(-1);
            console.log("Contract Address: ", contractAddress);
            if (!contractAddress){
                console.log("Error: Contract not found");
                return;
            }
            const bikechain = new Contract(contractAddress, abi, signer);
            setContract(bikechain);
            console.log("Contrato conectado:", bikechain);
            console.log("signer", signer.address);
        }
    }, [signer]);
    
    // console.log("contract: ", contract);

    const isContractConnected = () => {
        if (contract) {
            return true;
        } else {
            console.log("Contract is not connected");
            return false;
        }
    }

    const retrieveMyActivities = async () => {
        try {
            // Obtener la cuenta conectada desde Metamask
            const accounts = await window.ethereum.request({ method: 'eth_accounts'});
            const account = accounts[0];
            console.log("Cuenta conectada: ", account);
            // Crear instancia de web3
            const web3 = new Web3(window.ethereum);
            const contractAddress = Contracts[11155111].Bikechain.at(1);
            if (!contractAddress) {
                console.error("Contract address not found (web3)");
                return;
            }
            // Crear  contrato con web3
            const web3Contract = new web3.eth.Contract(abi, contractAddress);
            // Llamar a retrieveActivities con web3
            const result = await web3Contract.methods.retrieveActivities(account).call();
            console.log("Resultado retrieveActivities web3: ", result);
            const parsedActivities = result.map(activity => ({
                id: activity.id,
                time: activity.time,
                distance: activity.distance,
                avgSpeed: activity.avgSpeed
            }))
            
            setActivities(parsedActivities);

            /* 1
            const result = await contract.retrieveActivities(signerAddress);
            console.log(result);
            if(result.length === 0) {
                console.log("No activities found for this address");
                return
            }
            setActivities(result);
            console.log("My Activities:", activities);
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
            <button onClick={() => {retrieveMyActivities()}}>retrieveMyActivities</button>
            <button onClick={() => {retrieveAllActivities()}}>retrieveAllActivities</button>
            <button onClick={() => {getFunction("getLastActivityId")}}>View Last Activity Id</button>
            <button onClick={() => {createActivity(60, 105, 25)}}>Create Activity</button>
            <div>
                <h3>Activities</h3>
                {activities.length === 0 ? (<p>No activities registered</p>) : (
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
                ) }
            </div>
        </div>
    )
}

export default Hero