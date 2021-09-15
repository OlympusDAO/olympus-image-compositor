import { ethers } from "ethers";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { EnvHelper } from "../helpers/Environment";
import { trim } from "../helpers/index.js";

import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";

const STAKING_ADDRESS = "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a";
const SOHM_ADDRESS = "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F";

// Use the mainnet
// const network = "homestead";

const ALCHEMY_ID_LIST = EnvHelper.getAlchemyAPIKeyList();
// const SELF_HOSTED_LIST = EnvHelper.getSelfHostedSockets();
// const _selfHostedURIs = SELF_HOSTED_LIST;
const _alchemyURIs = ALCHEMY_ID_LIST.map(alchemyID => `https://eth-mainnet.alchemyapi.io/v2/${alchemyID}`);
const ALL_URIs = [..._alchemyURIs];

// console.log("self hosted", SELF_HOSTED_LIST);
/**
 * "intelligently" loadbalances production API Keys
 * @returns string
 */
function getMainnetURI(): string {
  // Shuffles the URIs for "intelligent" loadbalancing
  const allURIs = ALL_URIs.sort(() => Math.random() - 0.5);

  // There is no lightweight way to test each URL. so just return a random one.
  // if (workingURI !== undefined || workingURI !== "") return workingURI as string;
  const randomIndex = Math.floor(Math.random() * allURIs.length);
  return allURIs[randomIndex];
};

// console.log("self hosted", getMainnetURI());


// const provider = new WebSocketProvider(getMainnetURI());
const provider = new StaticJsonRpcProvider(getMainnetURI());

export const getStakingAPY = async () => {
  const stakingContract = new ethers.Contract(STAKING_ADDRESS, OlympusStakingv2, provider);
  const sohmMainContract = new ethers.Contract(SOHM_ADDRESS, sOHMv2, provider);
  
  const epoch = await stakingContract.epoch();
  const circ = await sohmMainContract.circulatingSupply();

  const stakingReward = epoch.distribute;
  const stakingRebase = stakingReward / circ;
  const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;
  const trimmedStakingAPY = trim(stakingAPY * 100, 0);
  return {raw: stakingAPY, formatted: trimmedStakingAPY};  
};

// export const getFormattedStakingAPY = async () => {
//   getStakingAPY().then(rawStakingAPY => {

//     const trimmedStakingAPY = trim(rawStakingAPY * 100, 1);
//     console.log("formatted, raw", trimmedStakingAPY, rawStakingAPY);

//     return trimmedStakingAPY;
//   });
// }