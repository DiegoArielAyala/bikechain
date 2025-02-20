import { ethers } from "ethers";
import Contracts from "../chain-info/deployments/map.json";
import BikechainContract from "../chain-info/contracts/Bikechain.json"


const Hero = () => {

    const contractAddress = Contracts[11155111].Bikechain.at(-1);
    console.log(BikechainContract)
    const abi = BikechainContract.abi

    console.log(abi)

    const getFunction = async (name) => {
        abi.forEach(item => {
            if(item.name == name){
                console.log(item)
                return item;
            }
        });
    }

    const retrieveActivities = () => {
        // una vez encontrada la funcion que corresponde, ejecutar cada una
    }

    return (
        <div>
            Hero
            <button onClick={() => {getFunction("retrieveActivities")}}>View My Activities</button>
            <button onClick={() => {getFunction("retrieveAllActivities")}}>View All Activities</button>
            <button onClick={() => {getFunction("getLastActivityId")}}>View Last Activity Id</button>
        </div>
    )
}

export default Hero