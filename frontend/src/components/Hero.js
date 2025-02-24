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

    //console.log("BikechainContract", BikechainContract);
    const abi = BikechainContract.abi
    //console.log("abi",abi);
    //setActivities(contract.retrieveActivities());
    //console.log("activities", activities);
    
    

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
            setContractAddress(contractAddress);
            //console.log("Contrato conectado:", bikechain);
            //console.log("signer", signer.address);
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
        if(!contractAddress){
            console.error("Contract address not set yet");
            return;
        }
        try {
            // Obtener la cuenta conectada desde Metamask
            const accounts = await window.ethereum.request({ method: 'eth_accounts'});
            const account = accounts[0];
            console.log("Cuenta conectada: ", account);
            // Crear instancia de web3
            const web3 = new Web3(window.ethereum);
            if (!contractAddress) {
                console.error("Contract address not found (web3)");
                return;
            }
            // Crear  contrato con web3
            const web3Contract = new web3.eth.Contract(abi, contractAddress);
            console.log("web3: ", web3);
            console.log("web3Contract: ", web3Contract);
            //Verificar si la funcion retrieveActivities existe en la ABI
            if(!web3Contract.methods.retrieveActivities) {
                console.error("retrieveActivities no existe");
                return;
            }
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