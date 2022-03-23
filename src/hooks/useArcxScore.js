import { useQuery } from "react-query";

export const useArcxScore = (walletAddress) => {
  return useQuery(walletAddress, async () => {
    return await fetch(`https://api.arcx.money/scores/${walletAddress}/olympus.benefits`);
  });
};
