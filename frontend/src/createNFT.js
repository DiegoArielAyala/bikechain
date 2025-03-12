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
    const formData = new FormData();
    formData.append("First Activity NFT", metadataTemplate);
    console.log("formData: ", formData)

    // Pasarle el path y llamar a uploadToIPFS

    // Devolver tokenURI para que lo reciba createNFT()
}


export const uploadToIPFS = async (path) =>{
    try {
        const response = await fetch(path); // Ruta dentro de public
        console.log("Response: ", response)
        console.log("Response.statusText: ", response.statusText)
        if (!response.ok) {
            throw new Error(`Error al cargar archivo: ${response.statusText}`)
        }

        const fileContent = await response.blob(); // convertir json a blob
        console.log("fileContent: ", fileContent)
        const formData = new FormData();
        formData.append("file", fileContent, path.split("/").pop());
        console.log("formData:", formData)

        // Enviar el archivo al backend
        const uploadResponse = await fetch("http://localhost:5001/upload-to-ipfs", {
            method: "POST",
            body: formData,
        });

        const data = await uploadResponse.json();
        console.log("data: ", data)
        if (!data.ipfsUrl) {
            throw new Error("No se pudo obtener la URL de IPFS");
        }
        console.log("Archivo subido a IPFS: ", data.ipfsUrl);

        return data.ipfsUrl; 
    } catch (error){
        console.error("Error en uploadToIPFS: ", error);
    }
}
