import React from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NewDataset from "./components/NewDataset";

function newDataset() {
  return (
    <div>
      <Navbar />
      <NewDataset />
      <Footer />
    </div>
  );
}

export default newDataset;
