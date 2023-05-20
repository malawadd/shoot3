import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewFunds from "./components/NewFunds";

function newFunds() {
  return (
    <>
      <Navbar />
      <NewFunds />
      <Footer />
    </>
  );
}

export default newFunds;
