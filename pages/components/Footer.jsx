import { Container, Divider, Link, Text } from "@chakra-ui/react";
import React from "react";

function Footer() {
  return (
    <>
      <Divider w={"80%"} mx={"auto"} />
      <Container py={"1rem"}>
        <Text textAlign={"center"} fontSize={"1rem"}>
          Build  for{" "}
          <Link isExternal href="https://fvmdataverse.devpost.com">
          FVM Dataverse Hack
          </Link>
        </Text>
      </Container>
    </>
  );
}

export default Footer;
