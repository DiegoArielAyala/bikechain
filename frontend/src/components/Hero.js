import { Contract } from "ethers";
import { useState, useEffect } from "react";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"
import BikechainNFTsContract from "../chain-info/contracts/BikechainNFTs.json"
import { createNFT } from "../createNFT.js"
import "../style.css";


const abi = BikechainContract.abi
const abiNFT = BikechainNFTsContract.abi

// Recibe signer desde App.js
const Hero = ({ signer, provider, setUserNotConnected }) => {

    const [contract, setContract] = useState(null);
    const [contractNFT, setContractNFT] = useState(null);
    const [contractAddress, setContractAddress] = useState(null);
    const [contractNFTAddress, setContractNFTAddress] = useState(null);
    const [renderActivities, setRenderActivities] = useState([]);
    const [creatingActivity, setCreatingActivity] = useState(false);
    const [activityCreated, setActivityCreated] = useState(false);
    const [showNoActivities, setShowNoActivities ] = useState(false);
    const [deletingActivity, setDeletingActivity] = useState(false);
    const [deletedActivity, setDeletedActivity] = useState(false);
    const [errors, setErrors] = useState({});
    const [errorCreating, setErrorCreating] = useState(false);
    const [deleteError, setDeleteError] = useState(false);

    useEffect(() => {
        if (signer) {
            const contractAddress = Contracts[11155111].Bikechain[0];
            const contractAddressNFT = Contracts[11155111].BikechainNFTs[0];
            if (!contractAddress){
                console.log("Error: Contract not found");
                return;
            }
            const bikechain = new Contract(contractAddress, abi, signer);
            const bikechainNFT = new Contract(contractAddressNFT, abiNFT, signer);
            setContract(bikechain);
            setContractNFT(bikechainNFT);
            setContractAddress(contractAddress);
            setContractNFTAddress(contractAddressNFT);
            setDeleteError(false);
            setErrorCreating(false);
            setErrors({});
            setDeletedActivity(false);
            setDeletingActivity(false);
            setShowNoActivities(false);
            setActivityCreated(false);
            setCreatingActivity(false);
            setRenderActivities([]);
        }
    }, [signer]);
    
    const isUserConnected = () => {
        if (!signer){
            console.log("User is not connected");
            setUserNotConnected(true)
            return false;
        }
        return true;
    }

    const isContractConnected = () => {
        if (contract == null) {
            console.log("Contract is not connected");
            return false;
        }
    }

    const createActivity = async (time, distance, avgSpeed) => {
        if (!isUserConnected()){
            return;
        }
        if (isContractConnected() === false) return;
        
        try {
            setCreatingActivity(true);
            const tx = await contract.createActivity(time, distance, avgSpeed);
            await tx.wait();
            console.log("Activity created", tx);
            setCreatingActivity(false);
            setActivityCreated(true)
            // Revisar si es la primera actividad que se sube
            console.log("Revisando si es primera actividad")
            const ownerActivitiesCount = Number(await contract.retrieveActivitiesCounter());
            console.log("ownerActivitiesCount ", ownerActivitiesCount)
            // Corregir el if === 1
            if(ownerActivitiesCount === 4){
                try {
                    console.log("Creando nft");
                    const network = await provider.getNetwork()
                    const linkNFT = await createNFT(contractNFT, signer, contractNFTAddress, network.name ) 
                    console.log(linkNFT);
                }catch(error) {
                    console.log(error);
                }
            }
        } catch (error) {
            console.error(error);
            setCreatingActivity(false);
            setErrorCreating(true)
        }
        
    } 

    const retrieveOwnerActivities = async () => {
        if (!isUserConnected()){
            return;
        }
        if(!contractAddress){
            console.error("Contract address not set yet");
            return;
        }
        const activityCounter = await contract.retrieveActivitiesCounter()
        if (Number(activityCounter)  === 0){
            console.log("No hay actividades");
            setShowNoActivities(true)
            return (<di>No hay actividades</di>);
        }
        try {
            //Verificar si la funcion retrieveActivities existe en la ABI
            if(!contract.retrieveOwnerActivities) {
                console.error("retrieveOwnerActivities no existe");
                return;
            }
            // Llamar a retrieveOwnerActivities 
            setShowNoActivities(false)
            console.log("Calling retrieveOwnerActivities...")
            const [ids, times, distances, avgSpeeds] = await contract.retrieveOwnerActivities(signer.address);
            console.log(ids, times, distances, avgSpeeds);
            const activities = [];
            for (let i = 0; i < ids.length; i++) {
                const activity = [];
                activity.push(Number(ids[i]));
                activity.push(Number(times[i]));
                activity.push(Number(distances[i]));
                activity.push(Number(avgSpeeds[i]));
                activities.push(activity);
            }
            console.log("activities: ", activities);
            setRenderActivities(activities);
            return activities;

        } catch (error) {
            console.error("Error: ", error);
        }
    }
    
    /*
    const retrieveAllActivities = async () => {
        if (!isUserConnected()){
            return;
        }
        if (isContractConnected() === false) return;
        
        try {
            console.log("Retrieve all activities...")
            const [ids, times, distances, avgSpeeds] = await contract.retrieveAllActivities();
            const allActivities = [];
            for (let i = 0; i < ids.length; i++) {
                const activity = [];
                activity.push(Number(ids[i]));
                activity.push(Number(times[i]));
                activity.push(Number(distances[i]));
                activity.push(Number(avgSpeeds[i]));
                allActivities.push(activity);
            }
            console.log("allActivities: ", allActivities);
            setRenderActivities(allActivities);
        } catch (error) {
            console.error(error);
        }
        
    }
    */

    const deleteActivity = async (id) => {
        setDeleteError(false);
        setDeletedActivity(false);
        if (!isUserConnected()){
            return;
        }
        console.log("Deleting activity: ", id);
        if(!contract.deleteActivity){
            console.log("DeleteActivity does not exist");
        }
        const deletedActivitiesIds = await contract.retrieveDeletedActivitiesIds();
        const activitiesCount = await contract.retrieveActivitiesCount();
        if(deletedActivitiesIds.includes(id) || id > activitiesCount){
            console.log("La actividad que se quiere eliminar no existe");
            return;
        }
        try {
            setDeletingActivity(true);
            const tx = await contract.deleteActivity(id, {from: signer.address});
            tx.wait();
            console.log("Activity " + {id} + " deleted");
            setDeletingActivity(false);
            setDeletedActivity(true);
            document.querySelector(".input-delete-id").value = null;
        }catch(error){
            setDeleteError(true);
            setDeletingActivity(false);
            console.log(error);
        }
    }
    

    const validarDatos = async (e) => {
        e.preventDefault();
        setErrors({})

        let hours = parseInt(document.querySelector(".input-hours").value || 0);
        let minutes = parseInt(document.querySelector(".input-minutes").value || 0);
        let seconds = parseInt(document.querySelector(".input-seconds").value || 0);
        let distance = parseFloat(document.querySelector(".input-distance").value);
        let avgSpeed = parseFloat(document.querySelector(".input-avg-speed").value);
        
        const totalTime = hours * 3600 + minutes * 60 + seconds;
        
        const newErrors = {};
        if (minutes < 0 || minutes > 59) newErrors.minutes = "Minutes must be between 0 and 59.";
        if (seconds < 0 || seconds > 59) newErrors.seconds = "Seconds must be between 0 and 59.";
        if (totalTime <= 0) newErrors.totalTime = "Duration must be greater than 0.";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await createActivity(totalTime, Math.round(distance * 100), Math.round(avgSpeed * 10));
            if(activityCreated){
                [hours, minutes, seconds, distance, avgSpeed] = ["", "", "", "", ""];
            }
        } catch (error) {
            console.error("Error creating activity: ", error);
            setErrors({ general: "An error occurred. Please check your input."});
            
        }
    }

    return (
        <div className="div-hero">            
            <form onSubmit={validarDatos} className="form-create-activity">
                <h3>Create New Activity</h3>

                <div className="div-duration">
                    <label>Duration:</label>
                    <input className="input-hours" type="number" placeholder="H" min={0} />
                    <input className="input-minutes" type="number" placeholder="MM" min="0" max="59" required />
                    <input className="input-seconds" type="number" placeholder="SS" min="0" max="59" required />
                </div>

                {Object.values(errors).map((err, i) => (
                    <p key={i} className="error-message">{err}</p>
                ))}

                <div className="div-distance">
                    <label>Distance (Km):</label>
                    <input className="input-distance" type="number" step="0.01" min="0.01" required />
                </div>

                <div className="div-avg-speed">
                    <label>Average Speed (Km/h)</label>
                    <input className="input-avg-speed" type="number" step="0.1" min="0.1" required />
                </div>

                <button type="submit" disabled={creatingActivity}>
                    {creatingActivity ? "Creating..." : "Create Activity"}
                </button>

                {activityCreated && <p>Activity created! 🚴‍♂️</p>}
                {errorCreating && <p className="error-message">Error creating activity.</p>}
            </form>

            <form onSubmit={(e) => {
                e.preventDefault();
                const id = document.querySelector(".input-delete-id").value;
                deleteActivity(id);
                }}>
                <h3>Delete Activity</h3>
                <label>Activity ID to delete</label>
                <input className="input-delete-id" type="number" placeholder="Enter ID" required />

                <button type="submit" disabled={deletingActivity}>
                    {deletingActivity ? "Deleting..." : "Delete Activity"}
                </button>

                {deletedActivity && <p className="success-message">Activity deleted ✅</p>}
                {deleteError && <p className="error-message">Could not delete this activity</p>}
            </form>

            <section className="activities-display">
                <h3>My Activities</h3>
                <button onClick={retrieveOwnerActivities}>View My Activities</button>

                {renderActivities.length > 0 ? (
                    renderActivities.map(([id, time, distance, speed]) => {
                    const h = Math.floor(time / 3600);
                    const m = Math.floor((time % 3600) / 60);
                    const s = time % 60;

                    return (
                        <div key={id} className="div-activity">
                        <div className="div-activity-info">
                            <p>{id}</p>
                            <p className="p-data">ID</p>
                        </div>
                        <div className="div-activity-info">
                            <p>{`${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}</p>
                            <p className="p-data">TIME</p>
                        </div>
                        <div className="div-activity-info">
                            <p>{distance / 100} Km</p>
                            <p className="p-data">DISTANCE</p>
                        </div>
                        <div className="div-activity-info">
                            <p>{speed / 10} Km/h</p>
                            <p className="p-data">AVG SPEED</p>
                        </div>
                        </div>
                    );
                    })
                ) : showNoActivities ? (
                    <p>No activities registered yet.</p>
                ) : null}
            </section>
        </div>
    )
}

export default Hero