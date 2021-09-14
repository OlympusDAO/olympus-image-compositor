import React from "react";
import sOhm from '../assets/token_sOHM.png';
import { Box } from "@material-ui/core";

function SOhmLogoBottomBar() {
  const sOhmLogoStyle = {
    position: "fixed",
    bottom: 0,
    // this doesn't work
    // background: `url(${sOhm})`,
    // mixBlendMode: "lighten",
    // height: "80px",
  };

  return (
    <Box display="flex" justifyContent="center" style={sOhmLogoStyle}>
      <img
        alt="sOhm-logo"
        src={sOhm}
        height={80}
      />
    </Box>
  )
}

export default SOhmLogoBottomBar;