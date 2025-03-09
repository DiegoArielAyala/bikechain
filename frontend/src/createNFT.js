
// Lógica para creacion de un nuevo NFT. Será llamada por la funcion createActivity de Hero.js

// Revisar si es la primera actividad que se sube

// Crear NFT
/*
const createNFT = async (type) => {
    const createNFTTx = await contractNFT.createNFT(signer.address, tokenUri, type, {from:signer.address});
    createNFTTx.wait()
    console.log("NFT Created")
}
const tokenUri = createMetadata(type);

const createMetadata = async (type) => {
    const types = {
        0: "first_activity"
    }
    const imageURL = `../../img/${types[0]}.webp`
    const imageIPFSURL = uploadToIPFS(imageURL);


}
*/
export const uploadToIPFS = async (path) => {
    const fileContent = null;
    const url = "https://api.pinata.cloud/pinning/pinFileToIPFS"
    console.log("Cargando ", path);
    try {
        const response = await fetch(path);
        if (!response.ok){
            throw new Error(`Error al obtener el archivo: ${response.statusText}`)
        } 
        fileContent = await response.json();
        console.log(fileContent);
    } catch (error) {
        console.error("Error en uploadToIPFS: ", error);
        throw error;
    }

    const fromData = new FormData();

    fromData.append("FIRST_ACTIVITY", fileContent, "FIRST_ACTIVITY.json" )

    const headers = {
        "pinata_api_key": "",
        "pinata_secret_api_key": ""
    }

}
/// PREGUNTAR A CHATGPT LA EXPLICACION PASO A PASO DE ESTO
