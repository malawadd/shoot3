import datasetContractAbi from "../contracts/ABI/DatasetContract.json";
import datasetFactoryContractAbi from "../contracts/ABI/DatasetFactory.json";
import { ethers } from "ethers";

export const getDatasetContract = (datasetAddress, signerOrProvider) => {
  return new ethers.Contract(
    datasetAddress,
    datasetContractAbi,
    signerOrProvider
  );
};

export const getDatasetFactoryContract = (datasetAddress, signerOrProvider) => {
  return new ethers.Contract(
    datasetAddress,
    datasetFactoryContractAbi,
    signerOrProvider
  );
};
