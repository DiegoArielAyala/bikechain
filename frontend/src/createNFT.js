// Frontend que envia el archivo metadata.json a server.mjs para que lo suba a IPFS y luego recibir la URL
import FormData from "form-data";


// Crear NFT llamando a la funcion createNFT del contrato BikechainNFT.sol



export const createNFT = async (contractNFT, signer) => {
    const [tokenURI, imageURL] = await createMetadata();
    const type = 0;
    console.log()
    const createNFTTx = await contractNFT.createNFT(signer, tokenURI, type, imageURL, {from:signer.address});
    createNFTTx.wait()
    const nftCounterTx = Number(await contractNFT.retrieveNFTIdsCounter());
    // const linkNFT = `NFT Created https://testnets.opensea.io/assets/${network}/${contractNFTAddress}/${nftCounterTx}`
    console.log("imageURL: ", imageURL);
    console.log("NFT creado numero: ", nftCounterTx);
    await contractNFT.saveNFTUrl(nftCounterTx - 1, imageURL);
    console.log("URL del NFT nº " + nftCounterTx + " guardado en " + imageURL);
    return tokenURI;
}



const createMetadata = async () => {
    // Subir imagen a IPFS y guardar la URL en la metadata
    console.log("Creando metadata...")
    const imageURL = await uploadToIPFS("./img/100_activities.webp");
    console.log("imageURL: ", imageURL)
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
        const filename = "3_metadata.json";
        let tokenURI;
        
        formData.append("file", blob, filename);

        const response = await fetch("http://localhost:5001/save-metadata", {
            method: "POST",
            body: formData,
        });

        if(!response.ok) {
            const errorData = await response.json();
            console.error("Error al guardar el archivo: ", errorData);

            if(response.status===400) {
                console.warn("El archivo ya existe y no se ha sobrescrito");
                tokenURI = await uploadToIPFS(`/metadata/${filename}`);
                console.log("imageURL: ", imageURL)
                return [tokenURI, imageURL];
            }
            throw new Error(`Error en la subida: ${response.statusText}`)
        }

        const data = await response.json();
        console.log("Archivo guardado en: ", data.path);
        
        tokenURI = await uploadToIPFS(data.path);
        return [tokenURI, imageURL];
    } catch (error) {
        console.error("Error guardando metadata: ", error);
    }

}


const uploadToIPFS = async (path) =>{
    console.log("Subiendo archivo " + path + " a IPFS...")
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
