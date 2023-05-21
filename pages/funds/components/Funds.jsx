import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Image,
  Tag,
  Text,
  Flex,
  Progress,
  Button,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLoadingContext } from "../../../context/loading";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import truncateMiddle from "truncate-middle";
import Blockies from "react-blockies";
import { FiArrowUpRight } from "react-icons/fi";
import { HiOutlineCash } from "react-icons/hi";
import { GrMoney } from "react-icons/gr";
import { useRouter } from "next/router";

import { useContractRead, useSigner, useWaitForTransaction } from "wagmi";
import { fundsAddress } from "../../../utils/contractAddress";
import fundContractAbi from "../../../contracts/ABI/Funds.json";
import { ethers } from "ethers";

function Datasets() {
  const [length, setLength] = useState(0);
  const { setLoading } = useLoadingContext();
  const { data: signer } = useSigner();
  const router = useRouter();
  const toast = useToast();
  const [hash, setHash] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1500);

    console.log(fetchData);
  }, []);

  const {
    data: fetchData,
    isError: fetchIsError,
    isFetching,
    isLoading: loading,
  } = useContractRead({
    addressOrName: fundsAddress,
    contractInterface: fundContractAbi,
    functionName: "fetchFund",
    watch: true,
  });

  useEffect(() => {
    setLength(fetchData?.length);
  }, [isFetching]);

  async function fund(price, fundId, numId) {
    const contract = new ethers.Contract(
      fundsAddress,
      fundContractAbi,
      signer
    );

    let overrides = {
      value: price,
    };

    const result = await contract.fundFund(fundId, numId, overrides);
    console.log(result.hash);
    setHash(result.hash);
  }

  const { data, isError, isLoading, isFetched, isSuccess } =
    useWaitForTransaction({
      hash: hash,
    });

  useEffect(() => {
    isLoading &&
      toast({
        title: "Transaction Sent",
        description: hash,
        status: "info",
        duration: 4000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });

    isSuccess &&
      toast({
        title: "Transaction Successfull",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
        variant: "subtle",
      });

    isSuccess && setHash("");
  }, [isSuccess, isLoading]);

  return (
    <>
      <Navbar />

      <Container my={"4rem"} maxW={"1200px"}>
        <Box>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <Flex alignItems={"center"}>
              <Heading fontSize={"2.25rem"} lineHeight={"2.5rem"}>
                Funds
              </Heading>
              <Heading
                w={"2rem"}
                alignItems={"center"}
                justifyContent={"center"}
                fontSize={"1.2rem"}
                lineHeight={"2rem"}
                bg={"black"}
                color={"white"}
                textAlign={"center"}
                borderRadius={"50%"}
                ml={"0.75rem"}
                fontWeight={600}
              >
                {length}
              </Heading>
            </Flex>
            <Button
              borderWidth={"2px"}
              borderColor={"rgb(10 10 10/1)"}
              borderRadius={"0.625rem"}
              bg={"rgb(10 10 10/1)"}
              py={"0.375rem"}
              px={"1rem"}
              colorScheme={"black"}
              onClick={() => {
                setLoading(true);
                router.push("/funds/new");
              }}
            >
              New Funds
            </Button>
          </Flex>

          {loading ? (
            <>
              <Flex my="10rem" justifyContent="center" alignItems="center">
                <Spinner size="xl" />
              </Flex>
            </>
          ) : fetchData?.length ? (
            <>
              <Grid
                mt={"1.5rem"}
                templateColumns={"repeat(3, minmax(0px, 1fr))"}
                gap={"2rem"}
              >
                {fetchData?.map((list, index) => {
                  return (
                    <GridItem key={index}>
                      <Box
                        borderWidth={"2px"}
                        borderColor={"rgb(10 10 10/1)"}
                        borderRadius={"0.625rem"}
                        overflow={"hidden"}
                        cursor={"pointer"}
                        transform={"scale(1)"}
                        transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                        _hover={{
                          backgroundColor: "rgb(248,248,248)",
                          transform: "scale(1.02)",
                          transition:
                            "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                        }}
                      >
                        <Box
                          h={"100px"}
                          overflow={"hidden"}
                          borderBottomWidth={"2px"}
                        >
                          <Image
                            alt={list.fundName}
                            objectFit={"cover"}
                            src={"/assets/gradiant.png"}
                            h={"100%"}
                            w={"100%"}
                          />
                        </Box>

                        <Box py={"1.2rem"} px={"1.5rem"}>
                          <Tag
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderRadius={"9999px"}
                            textTransform={"uppercase"}
                            fontWeight={600}
                            fontSize={"0.75rem"}
                            lineHeight={"1rem"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            bg={"rgb(183 234 213)"}
                          >
                            fund
                          </Tag>
                          <Heading
                            mt={"1rem"}
                            fontSize={"1.5rem"}
                            lineHeight={"2rem"}
                            color={"#1a202c"}
                          >
                            {list.fundName}
                          </Heading>
                          <Text
                            fontSize={"0.875rem"}
                            lineHeight={"1.25rem"}
                            color={"#888888"}
                            mt={"0.5rem"}
                            mb={"1em"}
                          >
                            {list.fundDescription}
                          </Text>

                          <Flex
                            bg={"#EDF2F6"}
                            fontSize={"14px"}
                            lineHeight={"17px"}
                            w={"max-content"}
                            borderRadius={"0.375rem"}
                            px={"0.5rem"}
                            py={"0.25rem"}
                            alignItems={"center"}
                            mb={"1em"}
                          >
                            <Flex
                              alignItems={"center"}
                              px={"0.5rem"}
                              py={"0.25rem"}
                              bg={"#E4E7EB"}
                              borderRadius={"0.375rem"}
                              mr={"10px"}
                            >
                              <GrMoney fontSize={"12px"} />
                              <Text ml={"8px"} fontWeight={500}>
                                Price
                              </Text>
                            </Flex>
                            <Text fontWeight={600} textTransform={"capitalize"}>
                              {ethers.utils.formatEther(
                                list.fundPrice.toString()
                              )}{" "}
                              Matic
                            </Text>
                          </Flex>

                          <Flex
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            alignItems={"center"}
                            borderRadius={"0.3125rem"}
                            bg={"rgb(198 201 246)"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            w={"max-content"}
                            mt={"1.2rem"}
                          >
                            <Box
                              borderRadius={"50%"}
                              borderWidth={"1.5px"}
                              borderColor={"rgb(10 10 10/1)"}
                              overflow={"hidden"}
                            >
                              <Blockies
                                seed={list.uploader}
                                color="#dfe"
                                bgcolor="#aaa"
                                default="-1"
                                size={10}
                                scale={2}
                              />
                            </Box>
                            <Text
                              ml={"10px"}
                              fontSize={"0.75rem"}
                              lineHeight={"1rem"}
                              fontWeight={600}
                            >
                              {truncateMiddle(list.uploader || "", 5, 4, "...")}
                              d
                            </Text>
                          </Flex>

                          <Progress
                            my={"1.7rem"}
                            size="xs"
                            hasStripe
                            value={
                              (list.fundAmountRaised.toString() /
                                list.fundGoal.toString()) *
                              100
                            }
                            borderRadius={"20px"}
                            colorScheme={"purple"}
                          />

                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            py={"0.5rem"}
                          >
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Raised
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                  {ethers.utils.formatEther(
                                    list.fundAmountRaised.toString()
                                  )}
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Goal
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                  {ethers.utils.formatEther(
                                    list.fundGoal.toString()
                                  )}
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>

                        <Box>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderTopWidth={"2px"}
                            py={"1rem"}
                            px={"2rem"}
                            bg={"rgb(250 229 195)"}
                            onClick={() =>
                              list.fundAmountRaised.toString() ===
                              list.fundGoal.toString()
                                ? toast({
                                    title: "Funded",
                                    status: "info",
                                    duration: 4000,
                                    isClosable: true,
                                    position: "top",
                                    variant: "subtle",
                                  })
                                : fund(
                                    list.fundPrice.toString(),
                                    list.fundId,
                                    list.id
                                  )
                            }
                            cursor={
                              list.fundAmountRaised.toString() ===
                              list.fundGoal.toString()
                                ? "not-allowed"
                                : "pointer"
                            }
                          >
                            <Flex alignItems={"center"}>
                              {" "}
                              <HiOutlineCash />
                              <Text ml={"5px"} fontWeight={600}>
                                {list.fundAmountRaised.toString() ===
                                list.fundGoal.toString()
                                  ? "Funded"
                                  : "Fund"}
                              </Text>
                            </Flex>

                            <FiArrowUpRight fontSize={"20px"} />
                          </Flex>
                        </Box>
                      </Box>
                    </GridItem>
                  );
                })}
              </Grid>
            </>
          ) : (
            <>
              {/* <Flex
                my="10rem"
                justifyContent="center"
                flexDir="column"
                alignItems="center"
              >
                <Image
                  src={"/assets/page-not-found.png"}
                  height={100}
                  width={100}
                />
                <Heading fontSize="1.5em" fontWeight={500} pt="1em">
                  No Funds Found
                </Heading>
              </Flex> */}

            <Grid
                mt={"1.5rem"}
                templateColumns={"repeat(3, minmax(0px, 1fr))"}
                gap={"2rem"}
              >

                <GridItem  key={1}>
                      <Box
                        borderWidth={"2px"}
                        borderColor={"rgb(10 10 10/1)"}
                        borderRadius={"0.625rem"}
                        overflow={"hidden"}
                        cursor={"pointer"}
                        transform={"scale(1)"}
                        transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                        _hover={{
                          backgroundColor: "rgb(248,248,248)",
                          transform: "scale(1.02)",
                          transition:
                            "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                        }}
                      >
                        <Box
                          h={"100px"}
                          overflow={"hidden"}
                          borderBottomWidth={"2px"}
                        >
                          <Image
                            alt={"" }
                            objectFit={"cover"}
                            src={"/assets/var2.png"}
                            h={"100%"}
                            w={"100%"}
                          />
                        </Box>

                        <Box py={"1.2rem"} px={"1.5rem"}>
                          <Tag
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderRadius={"9999px"}
                            textTransform={"uppercase"}
                            fontWeight={600}
                            fontSize={"0.75rem"}
                            lineHeight={"1rem"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            bg={"rgb(183 234 213)"}
                          >
                            fund
                          </Tag>
                          <Heading
                            mt={"1rem"}
                            fontSize={"1.5rem"}
                            lineHeight={"2rem"}
                            color={"#1a202c"}
                          >
                            {"25k+ Matches Football European Database" }
                          </Heading>
                          <Text
                            fontSize={"0.875rem"}
                            lineHeight={"1.25rem"}
                            color={"#888888"}
                            mt={"0.5rem"}
                            mb={"1em"}
                          >
                            {"Players and Teams' attributes* sourced from EA Sports' FIFA video game series,\
                             including the weekly updates - - Team line up with squad formation (X, Y coordinates), Seasons 2008 to 2016 "}
                          </Text>

                          <Flex
                            bg={"#EDF2F6"}
                            fontSize={"14px"}
                            lineHeight={"17px"}
                            w={"max-content"}
                            borderRadius={"0.375rem"}
                            px={"0.5rem"}
                            py={"0.25rem"}
                            alignItems={"center"}
                            mb={"1em"}
                          >
                            <Flex
                              alignItems={"center"}
                              px={"0.5rem"}
                              py={"0.25rem"}
                              bg={"#E4E7EB"}
                              borderRadius={"0.375rem"}
                              mr={"10px"}
                            >
                              <GrMoney fontSize={"12px"} />
                              <Text ml={"8px"} fontWeight={500}>
                                Price
                              </Text>
                            </Flex>
                            <Text fontWeight={600} textTransform={"capitalize"}>
                              {"10"}{" "}
                              FIL
                            </Text>
                          </Flex>

                          <Flex
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            alignItems={"center"}
                            borderRadius={"0.3125rem"}
                            bg={"rgb(198 201 246)"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            w={"max-content"}
                            mt={"1.2rem"}
                          >
                            <Box
                              borderRadius={"50%"}
                              borderWidth={"1.5px"}
                              borderColor={"rgb(10 10 10/1)"}
                              overflow={"hidden"}
                            >
                              <Blockies
                                seed={"0X123456789"}
                                color="#dfe"
                                bgcolor="#aaa"
                                default="-1"
                                size={10}
                                scale={2}
                              />
                            </Box>
                            <Text
                              ml={"10px"}
                              fontSize={"0.75rem"}
                              lineHeight={"1rem"}
                              fontWeight={600}
                            >
                              0x1b7e08....75dB632
                              
                            </Text>
                          </Flex>

                          <Progress
                            my={"1.7rem"}
                            size="xs"
                            hasStripe
                            value={
                             "50"
                            }
                            borderRadius={"20px"}
                            colorScheme={"purple"}
                          />

                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            py={"0.5rem"}
                          >
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Raised
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                  300
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Goal
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                 600
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>

                        <Box>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderTopWidth={"2px"}
                            py={"1rem"}
                            px={"2rem"}
                            bg={"rgb(250 229 195)"}
                            onClick={() =>
                                 fund(
                                  "10",
                                  "5",
                                 " 1"
                                  )
                            }
                            
                            
                          >
                            <Flex alignItems={"center"}>
                              {" "}
                              <HiOutlineCash />
                              <Text ml={"5px"} fontWeight={600}>
                                {"FUND"}
                              </Text>
                            </Flex>

                            <FiArrowUpRight fontSize={"20px"} />
                          </Flex>
                        </Box>
                      </Box>
                      
                    </GridItem>
                
                    <GridItem  key={2}>
                      <Box
                        borderWidth={"2px"}
                        borderColor={"rgb(10 10 10/1)"}
                        borderRadius={"0.625rem"}
                        overflow={"hidden"}
                        cursor={"pointer"}
                        transform={"scale(1)"}
                        transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                        _hover={{
                          backgroundColor: "rgb(248,248,248)",
                          transform: "scale(1.02)",
                          transition:
                            "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                        }}
                      >
                        <Box
                          h={"100px"}
                          overflow={"hidden"}
                          borderBottomWidth={"2px"}
                        >
                          <Image
                            alt={"" }
                            objectFit={"cover"}
                            src={"/assets/var1.png"}
                            h={"100%"}
                            w={"100%"}
                          />
                        </Box>

                        <Box py={"1.2rem"} px={"1.5rem"}>
                          <Tag
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderRadius={"9999px"}
                            textTransform={"uppercase"}
                            fontWeight={600}
                            fontSize={"0.75rem"}
                            lineHeight={"1rem"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            bg={"rgb(183 234 213)"}
                          >
                            fund
                          </Tag>
                          <Heading
                            mt={"1rem"}
                            fontSize={"1.5rem"}
                            lineHeight={"2rem"}
                            color={"#1a202c"}
                          >
                            {"Nottingham Forest VIP Tactical Camera" }
                          </Heading>
                          <Text
                            fontSize={"0.875rem"}
                            lineHeight={"1.25rem"}
                            color={"#888888"}
                            mt={"0.5rem"}
                            mb={"1em"}
                          >
                            {"Includes Tactical camera for all Nottingham Forest matches season 22/23 "}
                          </Text>

                          <Flex
                            bg={"#EDF2F6"}
                            fontSize={"14px"}
                            lineHeight={"17px"}
                            w={"max-content"}
                            borderRadius={"0.375rem"}
                            px={"0.5rem"}
                            py={"0.25rem"}
                            alignItems={"center"}
                            mb={"1em"}
                          >
                            <Flex
                              alignItems={"center"}
                              px={"0.5rem"}
                              py={"0.25rem"}
                              bg={"#E4E7EB"}
                              borderRadius={"0.375rem"}
                              mr={"10px"}
                            >
                              <GrMoney fontSize={"12px"} />
                              <Text ml={"8px"} fontWeight={500}>
                                Price
                              </Text>
                            </Flex>
                            <Text fontWeight={600} textTransform={"capitalize"}>
                              {"50"}{" "}
                              FIL
                            </Text>
                          </Flex>

                          <Flex
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            alignItems={"center"}
                            borderRadius={"0.3125rem"}
                            bg={"rgb(198 201 246)"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            w={"max-content"}
                            mt={"1.2rem"}
                          >
                            <Box
                              borderRadius={"50%"}
                              borderWidth={"1.5px"}
                              borderColor={"rgb(10 10 10/1)"}
                              overflow={"hidden"}
                            >
                              <Blockies
                                seed={"0X123456"}
                                color="#dfe"
                                bgcolor="#aaa"
                                default="-1"
                                size={10}
                                scale={2}
                              />
                            </Box>
                            <Text
                              ml={"10px"}
                              fontSize={"0.75rem"}
                              lineHeight={"1rem"}
                              fontWeight={600}
                            >
                              0x7efd51....yto128r
                              
                            </Text>
                          </Flex>

                          <Progress
                            my={"1.7rem"}
                            size="xs"
                            hasStripe
                            value={
                             "100"
                            }
                            borderRadius={"20px"}
                            colorScheme={"purple"}
                          />

                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            py={"0.5rem"}
                          >
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Raised
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                  7500
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Goal
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                 7500
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>

                        <Box>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderTopWidth={"2px"}
                            py={"1rem"}
                            px={"2rem"}
                            bg={"rgb(183 234 213)"}
                            
                            
                          >
                            <Flex alignItems={"center"}>
                              {" "}
                              <HiOutlineCash />
                              <Text ml={"5px"} fontWeight={600}>
                                {"FUNDED"}
                              </Text>
                            </Flex>

                            {/* <FiArrowUpRight fontSize={"20px"} /> */}
                          </Flex>
                        </Box>
                      </Box>
                      
                    </GridItem>
                    
                    <GridItem  key={3}>
                      <Box
                        borderWidth={"2px"}
                        borderColor={"rgb(10 10 10/1)"}
                        borderRadius={"0.625rem"}
                        overflow={"hidden"}
                        cursor={"pointer"}
                        transform={"scale(1)"}
                        transition={"transform 0.2s cubic-bezier(0.4, 0, 1, 1)"}
                        _hover={{
                          backgroundColor: "rgb(248,248,248)",
                          transform: "scale(1.02)",
                          transition:
                            "transform 0.2s cubic-bezier(0.4, 0, 1, 1)",
                        }}
                      >
                        <Box
                          h={"100px"}
                          overflow={"hidden"}
                          borderBottomWidth={"2px"}
                        >
                          <Image
                            alt={"" }
                            objectFit={"cover"}
                            src={"/assets/var3.png"}
                            h={"100%"}
                            w={"100%"}
                          />
                        </Box>

                        <Box py={"1.2rem"} px={"1.5rem"}>
                          <Tag
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderRadius={"9999px"}
                            textTransform={"uppercase"}
                            fontWeight={600}
                            fontSize={"0.75rem"}
                            lineHeight={"1rem"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            bg={"rgb(183 234 213)"}
                          >
                            fund
                          </Tag>
                          <Heading
                            mt={"1rem"}
                            fontSize={"1.5rem"}
                            lineHeight={"2rem"}
                            color={"#1a202c"}
                          >
                            {"Football Data from Transfermarkt" }
                          </Heading>
                          <Text
                            fontSize={"0.875rem"}
                            lineHeight={"1.25rem"}
                            color={"#888888"}
                            mt={"0.5rem"}
                            mb={"1em"}
                          >
                            {"Clean, structured and automatically updated football (soccer) data from Transfermarkt"}
                          </Text>

                          <Flex
                            bg={"#EDF2F6"}
                            fontSize={"14px"}
                            lineHeight={"17px"}
                            w={"max-content"}
                            borderRadius={"0.375rem"}
                            px={"0.5rem"}
                            py={"0.25rem"}
                            alignItems={"center"}
                            mb={"1em"}
                          >
                            <Flex
                              alignItems={"center"}
                              px={"0.5rem"}
                              py={"0.25rem"}
                              bg={"#E4E7EB"}
                              borderRadius={"0.375rem"}
                              mr={"10px"}
                            >
                              <GrMoney fontSize={"12px"} />
                              <Text ml={"8px"} fontWeight={500}>
                                Price
                              </Text>
                            </Flex>
                            <Text fontWeight={600} textTransform={"capitalize"}>
                              {"40"}{" "}
                              FIL
                            </Text>
                          </Flex>

                          <Flex
                            borderWidth={"2px"}
                            borderColor={"rgb(10 10 10/1)"}
                            alignItems={"center"}
                            borderRadius={"0.3125rem"}
                            bg={"rgb(198 201 246)"}
                            py={"0.25rem"}
                            px={"0.75rem"}
                            w={"max-content"}
                            mt={"1.2rem"}
                          >
                            <Box
                              borderRadius={"50%"}
                              borderWidth={"1.5px"}
                              borderColor={"rgb(10 10 10/1)"}
                              overflow={"hidden"}
                            >
                              <Blockies
                                seed={"0X457"}
                                color="#dfe"
                                bgcolor="#aaa"
                                default="-1"
                                size={10}
                                scale={2}
                              />
                            </Box>
                            <Text
                              ml={"10px"}
                              fontSize={"0.75rem"}
                              lineHeight={"1rem"}
                              fontWeight={600}
                            >
                              0xhu456uw....tr1be45q
                              
                            </Text>
                          </Flex>

                          <Progress
                            my={"1.7rem"}
                            size="xs"
                            hasStripe
                            value={
                             "100"
                            }
                            borderRadius={"20px"}
                            colorScheme={"purple"}
                          />

                          <Flex
                            alignItems={"center"}
                            justifyContent={"space-around"}
                            py={"0.5rem"}
                          >
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Raised
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                  3100
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                            <Box>
                              <Text fontSize={"15px"} fontWeight={600}>
                                Fund Goal
                              </Text>
                              <Flex mt={"5px"} alignItems={"center"}>
                                <Text
                                  fontWeight={500}
                                  mr={"5px"}
                                  fontSize={"17px"}
                                >
                                 3100
                                </Text>
                                <Image w="20px" src={"/assets/FIL.svg"} />
                              </Flex>
                            </Box>
                          </Flex>
                        </Box>

                        <Box>
                          <Flex
                            justifyContent={"space-between"}
                            alignItems={"center"}
                            borderColor={"rgb(10 10 10/1)"}
                            borderTopWidth={"2px"}
                            py={"1rem"}
                            px={"2rem"}
                            bg={"rgb(183 234 213)"}
                            
                            
                          >
                            <Flex alignItems={"center"}>
                              {" "}
                              <HiOutlineCash />
                              <Text ml={"5px"} fontWeight={600}>
                                {"FUNDED"}
                              </Text>
                            </Flex>

                            {/* <FiArrowUpRight fontSize={"20px"} /> */}
                          </Flex>
                        </Box>
                      </Box>
                      
                    </GridItem>


                    </Grid>

                    
            </>
          )}
        </Box>
      </Container>

      <Footer />
    </>
  );
}
// export const fundsAddress = "0x8837757bF4733aA1CF3C50cD601F50617F665FdA";

export default Datasets;
