import { useQuery } from "react-query";

export const useArcxScore = (walletAddress) => {
  return useQuery(walletAddress, async () => {
    const response = await fetch(`https://api.arcx.money/scores/${walletAddress}/olympus.benefits`);
    if (!response.ok) {
      throw Error(JSON.stringify(response));
    }
    const responseJson = await response.json();
    return responseJson.score || "0";
  }, { refetchOnWindowFocus: false });
};
