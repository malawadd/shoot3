import { upload } from "@spheron/browser-upload";



export const getTextFromIPFS = async (url) => {
 
};

export const newUploadMarkdownData = async (text) => {
  
};

let currentlyUploaded = 0;

export const uploadToIpfs = async (file) => {

  try {

    console.log("file name", file[0].name);
    const response = await fetch(`/api/upload`)
    console.log("resonse", response);
    const resJson = await response.json();
    const token =  resJson.uploadToken;
    console.log("token", token);

    const { uploadId, bucketId, protocolLink, dynamicLinks } = await upload(file, {
      token,
      onChunkUploaded: (uploadedSize, totalSize) => {
        currentlyUploaded += uploadedSize;
        console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
      },
    });

    // const added = await client.add(file);
    // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
    const url = `https://shoot3-b39975.spheron.app/${file[0].name}`
    console.log("man", dynamicLinks);
    console.log("protocol", protocolLink);
    console.log("bucketId", bucketId);
    console.log("id", uploadId);
    console.log("link", url)

    return url;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
  
};
