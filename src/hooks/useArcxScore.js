import { useQuery } from "react-query";

export const useArcxScore = (walletAddress) => {
  return useQuery(walletAddress, async () => {
    const response = await fetch(`https://api.arcx.money/scores/${walletAddress}/olympus.benefits`);
    try {
      const responseJson = await response.json();
      if (response.ok) {
        return responseJson.score;
      } else {
        throw Error(JSON.stringify(responseJson));
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
};
