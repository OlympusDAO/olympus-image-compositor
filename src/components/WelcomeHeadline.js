import React from 'react';

import {
  Box,
  Typography,
} from "@material-ui/core";

export default function WelcomeHeadline(props) {
  const headlineBoxStyles = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
  };

  const welcomeTextStyles = {
    // TODO (appleseed): confirm font choice
    // fontFamily: "Proxima Nova",
    fontFamily: "Open Sans",
    fontStyle: "bold",
    fontWeight: "800",
    fontSize: "40px",
    lineHeight: "54px",
    /* identical to box height */

    display: "flex",
    alignItems: "center",
    textAlign: "center",
  }

  const optionsTextStyles = {
    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: "500",
    fontSize: "20px",
    lineHeight: "24px",
    display: "flex",
    alignItems: "center",
    textAlign: "center",
    color: "rgba(255, 255, 255, 0.6)",
  }

  return (
    <Box style={headlineBoxStyles}>
      <Typography style={welcomeTextStyles}>{props.headline}</Typography>
      <Typography style={optionsTextStyles}>{props.subText}</Typography>
    </Box>
  );
}