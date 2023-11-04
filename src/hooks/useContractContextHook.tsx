import { Contract, ethers } from "ethers";
import { createContext, useState } from "react";

import { getMETAMASK_CHAINS, CFG_FACTORY_ABI,CFG_SELECTED_CRYPTOCOMMODITIY_ABI, CFG_DIAMOND_CUT_ABI, CFG_DIAMOND_LOUPE_ABI, CFG_COMMON_ABI, CFG_CROWDSALE_ABI, CFG_VESTING_ABI, CFG_ERC_20_ABI } from '../config/config'

declare let window:any

// context consumer hook
export function useContractContextHook() {

	const [selectedCrypto, setSelectedCryptocommodity] = useState<Cryptocommodity>();
	const [contracts, setContracts] = useState<Contracts>({} as Contracts);

  const createFactoryContract = async (chainId: number) => {

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();

		console.log("createFactoryContracto");
		console.log("createFactoryContract", chainId);

		const factory_address: string = getMETAMASK_CHAINS()!.find(function (el: any) { return parseInt(el.id) == chainId; })?.factory_address || '';
		console.log("factory_address: " + factory_address);

		const factoryContract: Contract = new ethers.Contract(factory_address, CFG_FACTORY_ABI, signer);
		console.log("factoryContract: " + factoryContract);

		contracts.FACTORY_CONTRACT = factoryContract;
		setContracts(contracts);

	}

  const updateContracts = async (cryptocommodityName: string) => {

		console.log("updateContracts: " + cryptocommodityName);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();

		let cryptocommodityAddress = await contracts.FACTORY_CONTRACT?.getCryptocommodity(cryptocommodityName);
		let selectedCryptoObject = {} as Cryptocommodity;
		selectedCryptoObject.SELECTED_CRYPTOCOMMODITY_NAME = cryptocommodityName;
		selectedCryptoObject.SELECTED_CRYPTOCOMMODITY_NAME = cryptocommodityName;
		setSelectedCryptocommodity(selectedCryptoObject);

		contracts.SELECTED_CRYPTOCOMMODITY_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_SELECTED_CRYPTOCOMMODITIY_ABI, signer);
		contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_CUT_ABI, signer);
		contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_LOUPE_ABI, signer);
		contracts.SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_COMMON_ABI, signer);
		contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_CROWDSALE_ABI, signer);
		contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_VESTING_ABI, signer);
		contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT = new ethers.Contract(cryptocommodityAddress, CFG_ERC_20_ABI, signer);
		setContracts(contracts);

		console.log("updated");

  };

	return {
		selectedCrypto,
		contracts,
		updateContracts,
		createFactoryContract
	};

};

interface Cryptocommodity {
	SELECTED_CRYPTOCOMMODITY_NAME: string;
  SELECTED_CRYPTOCOMMODITY_ADDRESS: string;
}

interface Contracts {
	FACTORY_CONTRACT: Contract;

  SELECTED_CRYPTOCOMMODITY_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT: Contract;
}

export interface ContractsContextData {
  selectedCrypto: Cryptocommodity | undefined;
  contracts: Contracts;
  updateContracts: (cryptocommodityName: string) => void;
  createFactoryContract: (chainId: number) => void;
}
 
export const contractsContextDefaultValue: ContractsContextData = {
  selectedCrypto: undefined,
  contracts: ({} as any) as Contracts,
  updateContracts: () => null,
  createFactoryContract: () => null
}
 
export const ContractsContext = createContext<ContractsContextData>(contractsContextDefaultValue);