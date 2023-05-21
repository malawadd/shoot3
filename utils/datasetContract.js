import datasetContractAbi from "./datasetContract.json";
import datasetFactoryContractAbi from "./DatasetFactory.json";
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
