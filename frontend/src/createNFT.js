// Frontend que envia el archivo metadata.json a server.mjs para que lo suba a IPFS y luego recibir la URL
import FormData from "form-data";


// Crear NFT llamando a la funcion createNFT del contrato BikechainNFT.sol
/*
const createNFT = async () => {
    const createNFTTx = await contractNFT.createNFT({from:signer.address});
    createNFTTx.wait()
    console.log("NFT Created")
}
*/


export const createMetadata = async () => {
    // Subir imagen a IPFS y guardar la URL en la metadata
    const imageURL = await uploadToIPFS("./img/first_activity.webp");
    const response = await fetch("./metadata_template.json")
    if(!response.ok) {
        console.error("Error al cargar metadataTemplate");
    }
    const metadataTemplate = await response.json();
    // Crear metadata especifica del NFT a crear
    metadataTemplate.image = imageURL;
    metadataTemplate.name = "First Activity NFT";
    metadataTemplate.description = "Firts Activity NFT reward";
    
    // Crear archivo metadata para el nuevo NFT
    try {
        const formData = new FormData();
        const blob = new Blob([JSON.stringify(metadataTemplate, null, 2)], { type: "application/json" });
        const filename = "2_metadata.json";
        
        formData.append("file", blob, filename);

        const response = await fetch("http://localhost:5001/save-metadata", {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        console.log("Archivo guardado en: ", data.path);
        //const tokenURI = await uploadToIPFS(data.path);
        //console.log("tokenURI: ", tokenURI)
    } catch (error) {
        console.error("Error guardando metadata: ", error);
    }


    // Pasarle el path y llamar a uploadToIPFS

    // Devolver tokenURI para que lo reciba createNFT()
}


const uploadToIPFS = async (path) =>{
    try {
        const response = await fetch(path); // Ruta dentro de public
        if (!response.ok) {
            throw new Error(`Error al cargar archivo: ${response.statusText}`)
        }

        const fileContent = await response.blob(); // convertir json a blob
        const formData = new FormData();
        formData.append("file", fileContent, path.split("/").pop());

        // Enviar el archivo al backend
        const uploadResponse = await fetch("http://localhost:5001/upload-to-ipfs", {
            method: "POST",
            body: formData,
        });

        const data = await uploadResponse.json();
        if (!data.ipfsUrl) {
            throw new Error("No se pudo obtener la URL de IPFS");
        }
        console.log("Archivo subido a IPFS: ", data.ipfsUrl);

        return data.ipfsUrl; 
    } catch (error){
        console.error("Error en uploadToIPFS: ", error);
    }
}
