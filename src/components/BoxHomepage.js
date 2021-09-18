import React, { useState } from "react";
import { Box, Typography, Button, Fade } from "@material-ui/core";
import { useHistory } from "react-router-dom";
// import bgImage from "../assets/bg-figma.png";

function BoxHomepage() {
  let history = useHistory();

  const [fadeTransition, setFadeTransition] = useState(true);
  const fadeOutMs = 333;

  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "0px",
  };

  const textContainerStyles = {
    /* Auto Layout */
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "40px",
    height: "100%",
    justifyContent: "space-between",
    // width: "333px",
    // height: "217px",
  }

  const pofTextStyle = {
    // position: "absolute",
    width: "324px",
    height: "112px",
    // left: "0px",
    // top: "0px",

    fontFamily: "Open Sans",
    fontStyle: "bold",
    fontWeight: "800",
    fontSize: "56px",
    lineHeight: "56px",
    /* or 100% */

    display: "flex",
    alignItems: "center",

    color: "#FFFFFF",
  };

  const stakedTextStyle = {
    // width: "333px",
    height: "25px",
    left: "0px",
    top: "132px",

    // marginTop: "20px",

    fontFamily: "Open Sans",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "18px",
    lineHeight: "25px",
    /* identical to box height */

    display: "flex",
    alignItems: "center",

    color: "#FFFFFF",

    opacity: "0.8",
  };

  /**
   * @param {String} toPath should be "/pof" or "/ohmiecard"
   */
  const clickCardTrigger = (toPath) => {
    setFadeTransition(false);
    setTimeout(() => {
      // setFadeTransition(true);
      history.push(toPath);
    }, fadeOutMs*0.75);
  };

  return (
    <Box display="flex" justifyContent="center" style={containerStyle}>
      <Fade in={fadeTransition} timeout={{enter: 333, exit: fadeOutMs}}>
        <Box id="content-1" display="flex" gap="6px">
          {/* 
            Card Box (below)
            // TODO: should have click handlers & hover
          */}
          <Box id="pof-card-trigger" className="homepage-box-trigger module-border-wrap" onClick={() => {clickCardTrigger("/pof")}}>
            <Box display="flex" alignItems="center" className="module">
              <Box className="rectangle-1-backdrop card-nav">
                <Box style={textContainerStyles}>
                  <Typography style={pofTextStyle}>Proof of Ohmie</Typography>
                  <Typography style={stakedTextStyle}>Show everyone that you're staked (3,3).</Typography>
                  <Button
                    id="create-pfp-trigger-button"
                    variant="contained"
                    // color="primary"
                    // onClick={handleCompleteAward}
                    className="ohmie-button"
                  >
                    <Typography className="btn-text">Create PFP</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* End Card Box */}

          {/* 
            Card Box (below)
            // TODO: should have click handlers & hover
          */}
          <Box id="ohmie-card-trigger" className="homepage-box-trigger module-border-wrap" onClick={() => {clickCardTrigger("/ohmiecard")}}>
            <Box display="flex" alignItems="center" className="module">
              <Box className="rectangle-1-backdrop card-nav">
                <Box style={textContainerStyles}>
                  <Typography style={pofTextStyle}>Ohmie Card</Typography>
                  <Typography style={stakedTextStyle}>Personalized card just to show off your gains.</Typography>
                  <Button
                    id="pool-complete-award-button"
                    variant="contained"
                    // color="primary"
                    // onClick={handleCompleteAward}
                    className="ohmie-button"
                  >
                    <Typography className="btn-text">Create Card</Typography>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
          {/* End Card Box */}
        </Box>
      </Fade>
    </Box>
  )
}

export default BoxHomepage;