import fs from "fs"

// Revisar si es la primera actividad que se sube

// Crear NFT

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

export const uploadToIPFS = async (path) => {
    const imageBinary = fs.readFileSync(path)
    console.log(imageBinary)
}

