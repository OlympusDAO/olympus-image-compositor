import React from "react";
import {
  Box,
  Zoom,
} from "@material-ui/core";

import WelcomeHeadline from "./WelcomeHeadline";
import BoxHomepage from "./BoxHomepage";

// const compositorPaper = {
//   padding: "15px",
//   textAlign: "center",
//   // marginBottom: "20px",
// }

function MainNavLinksV4() {
  return (
    <Box>
      <WelcomeHeadline headline={"Welcome Ohmie"} subText={"Select an Option"}/>
      <Zoom in={true}>
        <BoxHomepage />
      </Zoom>
    </Box>
  );
}

export default MainNavLinksV4;