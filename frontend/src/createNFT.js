// Frontend que envia el archivo metadata.json a server.mjs para que lo suba a IPFS y luego recibir la URL


// Crear NFT llamando a la funcion createNFT del contrato BikechainNFT.sol
/*
const createNFT = async () => {
    const createNFTTx = await contractNFT.createNFT({from:signer.address});
    createNFTTx.wait()
    console.log("NFT Created")
}
*/

const createMetadata = async () => {
    // Crear metadata especifica del NFT a crear

    // Pasarle el path y llamar a uploadToIPFS

    // Devolver tokenURI para que lo reciba createNFT()
}


export const uploadToIPFS = async (path) =>{
    try {
        console.log("Path: ", path)
        const metadataPath = path;
        const response = await fetch(metadataPath); // Ruta dentro de public
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
