import React, { useEffect } from "react";
import { Flex, Heading, Image, Link, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { useLoadingContext } from "../../context/loading";

function Navbar() {
  const router = useRouter();
  const { isDisconnected, address } = useAccount();
  const { setLoading } = useLoadingContext();

  useEffect(() => {
    if (isDisconnected) {
      setLoading(true);
      router.replace("/");
    }
  }, [isDisconnected]);

  return (
    <>
      <Flex
        px={"4em"}
        py={"1.5em"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Link href="/" _hover={{ textDecoration: "none" }}>
          <Flex alignItems={"center"}>
            <Image
              className="rotate"
              alt="logo"
              boxSize={"30px"}
              src={"/assets/ball.png"}
            />
            <Heading
              ml={"5px"}
              fontWeight={700}
              className={"h-shadow-black"}
              fontFamily={"Philosopher !important"}
            >
              SHOOT3
            </Heading>
          </Flex>
        </Link>

         {router.asPath === "/" || router.asPath === "/membership" ? null : (
            <Flex alignItems={"center"}>
              
              <Link href="/funds" _hover={{ textDecoration: "none" }}>
                <Text
                  fontSize={"1.125rem"}
                  color={"#0a0a0a"}
                  lineHeight={"1.625rem"}
                  mx={"1em"}
                  transition="color 0.2s ease"
                  _hover={{ color: "gray", transition: "color 0.2s ease" }}
                  fontWeight={router.asPath === "/funds" ? 600 : 400}
                >
                  funds
                </Text>
              </Link>
              
            </Flex>
          )}


        {router.asPath === "/" ? null : <ConnectButton />}
      </Flex>
    </>
  );
}

export default Navbar;
