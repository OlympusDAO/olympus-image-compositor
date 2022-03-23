import { ethers } from "ethers";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { EnvHelper } from "../helpers/Environment";
import { trim } from "../helpers/index.js";

import { abi as OlympusStakingv2 } from "../abi/OlympusStakingv2.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";

const STAKING_ADDRESS = "0xB63cac384247597756545b500253ff8E607a8020";
const SOHM_ADDRESS = "0x04906695D6D12CF5459975d7C3C03356E4Ccd460";

const ALCHEMY_ID_LIST = EnvHelper.getAlchemyAPIKeyList();
const _alchemyURIs = ALCHEMY_ID_LIST.map(alchemyID => `https://eth-mainnet.alchemyapi.io/v2/${alchemyID}`);
const ALL_URIs = [..._alchemyURIs];

/**
 * "intelligently" loadbalances production API Keys
 * @returns string
 */
function getMainnetURI() {
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
