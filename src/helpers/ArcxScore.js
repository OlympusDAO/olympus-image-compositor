export const getArcxScore = async (walletAddress) => {
  fetch(`https://api.arcx.money/scores/${walletAddress}/olympus.benefits`)
    .then((response) => {
      console.log("response", response);
      return response;
    });
};