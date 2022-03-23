import React from "react";
import { Box, Button, Typography } from "@material-ui/core";
import twitterCircleWhite from "../assets/twitterCircleWhite.svg";
import discordLogo from "../assets/discord-logo.svg";

function ShareOnTwitter(props) {

  const urlString = () => {
    var text;
    if (props.inOhmieCard) {
      // text = "When you're ready, come on over at @OlympusDAO and earn rewards every 8 hours. #OHMISBACKED #OHMIECARD"
      text = "When you're ready, come on over at @OlympusDAO and earn rewards every 8 hours. #OHMISBACKED #OHMIECARD";  
    } else if (props.inCitizenship) {
      text = "What's your Ohmie Score, anon? #Ohmieversary @OlympusDAO";
    } else {
      // text = "I'm an Ohmie, are you anon? #OHMISBACKED #PROOFOFOHMIE @OlympusDAO";
      text = "I'm an Ohmie, are you anon? #OHMISBACKED #PROOFOFOHMIE @OlympusDAO";
    }
    return `https://twitter.com/intent/tweet?url=https%3A%2F%2Fproofof.ohmie.xyz&text=${encodeURIComponent(text)}`;
  };

  const discordString = () => {
    return "https://discord.gg/tbaQVt6P2S";
  };
  
  return (
    <Box display="flex" className="share-btns">
      <Button
        id="share-on-twitter-button"
        variant="contained"
        // color="primary"
        // onClick={handleCompleteAward}
        className="ohmie-button"
        href={urlString()}
        target="_blank"
        data-text="w"
        data-hashtags="olympus"
        // endIcon={<TwitterIcon />}
      >
        <Typography className="btn-text" style={{marginRight: "6px"}}>Share on Twitter</Typography>
        <img alt="test" height="24" src={twitterCircleWhite}/>
      </Button>
      <Button
        id="connect-on-discord-button"
        variant="contained"
        // color="primary"
        // onClick={handleCompleteAward}
        className="ohmie-button"
        href={discordString()}
        target="_blank"
        data-text="w"
        data-hashtags="olympus"
      >
        <img alt="test" height="24" src={discordLogo}/>
      </Button>
    </Box>
  )
}

export default ShareOnTwitter;