import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../../../context/loading";
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import Backward from "./Backward";
import { AiOutlineInbox } from "react-icons/ai";
import { message, Upload } from "antd";
import "antd/dist/antd.css";
import Module from "./Module";

import { newUploadMarkdownData, uploadToIpfs } from "../../../utils/ipfs";
import { useSigner } from "wagmi";
import { datasetFactoryAddress } from "../../../utils/contractAddress";
import { getDatasetFactoryContract } from "../../../utils/datasetContract";
import { useRouter } from "next/router";

const { Dragger } = Upload;

function NewDataset() {
  const { setLoading } = useLoadingContext();
  const [datasetDetails, setDatasetDetails] = useState({
    title: "test",
    description: "test",
    image: "",
  });
  const [datasetModuleList, setDatasetModuleList] = useState([]);
  const [datasetLoading, setDatasetLoading] = useState(false);
  const [moduleSave, setModuleSave] = useState(true);
  const { data: signer } = useSigner();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  function onChange(e) {
    setDatasetDetails(() => ({
      ...datasetDetails,
      [e.target.name]: e.target.value,
    }));
  }

  const props = {
    name: "file",
    multiple: false,

    onChange(e) {
      const { status } = e.file;
      console.log(e.file);
      // if (status !== "uploading") {
      //   console.log(info.file, info.fileList);
      setDatasetDetails({ image: e.file.originFileObj });
      // }

      if (status === "done") {
        message.success(`${e.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${e.file.name} file upload failed.`);
      }
    },

    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files[0]);
      setDatasetDetails({ image: e.dataTransfer.files[0] });
    },
  };

  // ////////////////////
  // ////////////////////
  // ////////////////////
  // ////////////////////

  const processModuleData = async () => {
    let names = [];
    let descriptions = [];
    let materials = [];
    let questions = [];

    for (const modulii of datasetModuleList) {
      names.push(modulii.moduleName);
      descriptions.push(modulii.moduleDes);
      const materialsURL = await newUploadMarkdownData(modulii.moduleMaterial);
      const questionsURL = await newUploadMarkdownData(modulii.moduleQues);
      materials.push(materialsURL);
      questions.push(questionsURL);
    }
    return { names, descriptions, materials, questions };
  };

  const getModuleIndex = (id) => {
    let moduleIndex = 0;
    modules.forEach((module, index) => {
      if (module.id === id) moduleIndex = index;
    });
    return moduleIndex;
  };
  

  async function letsCreateDataset() {
    setDatasetLoading(true);
    const { names, descriptions, materials, questions } =
      await processModuleData();

      console.log("starting")
      const image = [datasetDetails.image]
    const imageUrl = await uploadToIpfs(image);

    console.log(names, descriptions, materials, questions);
    // console.log(imageUrl);
    const contract = await getDatasetFactoryContract(
      datasetFactoryAddress,
      signer
    );

    console.log(datasetDetails.title, datasetDetails.description);
    const tx = await contract.createDataset(
      "test",
      "test",
      "https://bafybeibsxr5nat7f55kw4gyf3qjryieg3t4fsf3hq53c4bcorcxsxj2mvu.ipfs.sphn.link/vezga_logo_football_event_5_against_5_crypto_related_with_playe_dc72db82-2bbc-4bf5-8bde-b4b43da94ca2.png",
      0,
      names,
      descriptions,
      materials,
      questions
    );
    await tx.wait();
    setTimeout(() => {
      toast({
        title: "Transaction Success",
        description: "wait for indexing..",
        status: "success",
        variant: "subtle",
        position: "top",
        duration: 2000,
      });
      setDatasetLoading(false);
    }, 500);
    setTimeout(() => {
      setLoading(true);
      router.push("/datasets");
    }, 3000);
  }

  return (
    <>
      <Container my={"3.5em"} maxW={"1200px"}>
        <Backward />

        <Heading>Create New Dataset</Heading>
        <Divider />

        <Box mt={"2em"}>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              name="title"
              value={datasetDetails.title}
              onChange={onChange}
            />
          </FormControl>
          <FormControl mt={"1em"} isRequired>
            <FormLabel>Description</FormLabel>
            <Input
              name="description"
              value={datasetDetails.description}
              onChange={onChange}
            />
          </FormControl>
        </Box>

        <Box mt={"2em"}>
          <Dragger {...props}>
            <Box align={"center"} className="ant-upload-drag-icon">
              <AiOutlineInbox
                style={{
                  fontSize: "3rem",
                  color: "#3FA9FF",
                  marginBottom: "10px",
                }}
              />
            </Box>
            <Text
              color={"blackAlpha.700 !important"}
              className="ant-upload-text"
            >
              Click or drag cover image to this area to upload
            </Text>
          </Dragger>
        </Box>

        <Box mt={"2em"}>
          <Dragger {...props}>
            <Box align={"center"} className="ant-upload-drag-icon">
              <AiOutlineInbox
                style={{
                  fontSize: "3rem",
                  color: "#3FA9FF",
                  marginBottom: "10px",
                }}
              />
            </Box>
            <Text
              color={"blackAlpha.700 !important"}
              className="ant-upload-text"
            >
              added files 
            </Text>
          </Dragger>
        </Box>

        <Box>
          <Module
            setModuleSave={setModuleSave}
            setDatasetModuleList={setDatasetModuleList}
          />{" "}
        </Box>

        <Button
          borderWidth={"2px"}
          borderColor={"rgb(10 10 10/1)"}
          borderRadius={"0.625rem"}
          bg={"rgb(10 10 10/1)"}
          py={"0.375rem"}
          px={"1rem"}
          colorScheme={"black"}
          mt={"1.5em"}
          onClick={letsCreateDataset}
          isLoading={datasetLoading}
         
        >
          Create
        </Button>
      </Container>
    </>
  );
}

export default NewDataset;
