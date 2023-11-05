import { Contract, ethers } from "ethers";
import { createContext, useState } from "react";

import { getMETAMASK_CHAINS, CFG_FACTORY_ABI,CFG_SELECTED_CRYPTOCOMMODITIY_ABI, CFG_DIAMOND_CUT_ABI, CFG_DIAMOND_LOUPE_ABI, CFG_COMMON_ABI, CFG_CROWDSALE_ABI, CFG_VESTING_ABI, CFG_ERC_20_ABI } from '../config/config'

declare let window:any

// context consumer hook
export function useContractContextHook() {

	const [selectedCrypto, setSelectedCryptocommodity] = useState<Cryptocommodity>();
	const [envContracts, setEnvContract] = useState<EnvContracts>({} as EnvContracts);
	const [contracts, setContracts] = useState<CryptoContracts>({} as CryptoContracts);

	// **********************************************************************************************************
	// ******************************************* createEnvContracts *******************************************
	// **********************************************************************************************************
  const createEnvContracts = async (chainId: number) => {
		console.log("createEnvContracts", chainId);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const factory_address: string = getMETAMASK_CHAINS()!.find(function (el: any) { return parseInt(el.id) == chainId; })?.factory_address || '';
		console.log("factory_address: " + factory_address);

		envContracts.FACTORY_CONTRACT = new ethers.Contract(factory_address, CFG_FACTORY_ABI, signer);
		setEnvContract(envContracts);
	}

	// **********************************************************************************************************
	// ******************************************* loadYourCryptocommodities ************************************
	// **********************************************************************************************************
	const [CRYPTOCOMMODITIES, setCryptocommodities] = useState([]);

	async function loadYourCryptocommodities() {
		console.log("fetching cryptocommodities for user");
		let cryptocommodities = await envContracts.FACTORY_CONTRACT?.getCryptocommodities();
		console.log("cryptocommodities: " + cryptocommodities);
		setCryptocommodities(cryptocommodities);
	}

	// **********************************************************************************************************
	// ******************************************* selectCrypto *************************************************
	// **********************************************************************************************************
  const selectCrypto = async (cryptocommodityName: string) => {

		console.log("updateContracts: " + cryptocommodityName);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();

		let cryptocommodityAddress = await envContracts.FACTORY_CONTRACT?.getCryptocommodity(cryptocommodityName);
		let selectedCryptoObject = {} as Cryptocommodity;
		selectedCryptoObject.SELECTED_CRYPTOCOMMODITY_NAME = cryptocommodityName;
		selectedCryptoObject.SELECTED_CRYPTOCOMMODITY_ADDRESS = cryptocommodityAddress;
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

  const unselectCrypto = async () => {
		setSelectedCryptocommodity(undefined);
		setContracts(({} as any) as CryptoContracts);
	}


	return {
		createEnvContracts, envContracts,
		loadYourCryptocommodities, CRYPTOCOMMODITIES,
		selectCrypto, unselectCrypto, selectedCrypto, contracts
	};

};

// **********************************************************************************************************
// **************************************************** Context *********************************************
// **********************************************************************************************************
interface Cryptocommodity {
	SELECTED_CRYPTOCOMMODITY_NAME: string;
  SELECTED_CRYPTOCOMMODITY_ADDRESS: string;
}

interface EnvContracts {
  FACTORY_CONTRACT: Contract;
}

interface CryptoContracts {
  SELECTED_CRYPTOCOMMODITY_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT: Contract;
  SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT: Contract;
}

export interface ContractsContextData {
  createEnvContracts: (chainId: number) => void;
	envContracts: EnvContracts;

  loadYourCryptocommodities: () => void;
	CRYPTOCOMMODITIES: string[],

	selectCrypto: (cryptocommodityName: string) => void;
  unselectCrypto: () => void;
  selectedCrypto: Cryptocommodity | undefined;
  contracts: CryptoContracts;

}
 
export const contractsContextDefaultValue: ContractsContextData = {
  createEnvContracts: () => null,
  envContracts: ({} as any) as EnvContracts,

  loadYourCryptocommodities: () => null,
	CRYPTOCOMMODITIES: [],

	selectCrypto: () => null,
  unselectCrypto: () => null,
  selectedCrypto: undefined,
  contracts: ({} as any) as CryptoContracts,
}
 
export const ContractsContext = createContext<ContractsContextData>(contractsContextDefaultValue);