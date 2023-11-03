import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";

//import { useNetwork, useSigner } from 'wagmi'

import { getMETAMASK_CHAINS, CFG_FACTORY_ABI,CFG_SELECTED_CRYPTOCOMMODITIY_ABI, CFG_DIAMOND_CUT_ABI, CFG_DIAMOND_LOUPE_ABI, CFG_COMMON_ABI, CFG_CROWDSALE_ABI, CFG_VESTING_ABI, CFG_ERC_20_ABI } from '../config/config'

declare let window:any

// context consumer hook
const useContractContextHook = (cryptocommodityName: any) => {

	const [SELECTED_CRYPTOCOMMODITY_NAME, setSelectedCryptocommodityName] = useState<string>('');
	const [SELECTED_CRYPTOCOMMODITY_ADDRESS, setSelectedCryptocommodityAddress] = useState<string>('');

	const [SELECTED_CRYPTOCOMMODITY_CONTRACT, setSelectedCryptocommodityContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT, setSelectedCryptocommodityDiamondCutContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT, setSelectedCryptocommodityDiamondLoupeContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT, setSelectedCryptocommodityCommonContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT, setSelectedCryptocommodityVestingContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT, setSelectedCryptocommodityTokenContract] = useState<Contract>()

  const getContracts = async () => {

		/*const { chain } = useNetwork()
		const { signer } = useSigner()
		const factory_address: string = getMETAMASK_CHAINS()!.find(function (el: any) { return parseInt(el.id) == chain?.id; })?.factory_address || '';
		const factoryContract: Contract = new ethers.Contract(factory_address, CFG_FACTORY_ABI, signer);

		let cryptocommodityAddress = await factoryContract?.getCryptocommodity(cryptocommodityName);
		setSelectedCryptocommodityName(cryptocommodityName);
		setSelectedCryptocommodityAddress(cryptocommodityAddress);

		const cryptocommodityContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_SELECTED_CRYPTOCOMMODITIY_ABI, signer);
		setSelectedCryptocommodityContract(cryptocommodityContract);
	
		const diamondCutContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_CUT_ABI, signer);
		setSelectedCryptocommodityDiamondCutContract(diamondCutContract);
	
		const diamondLoupeContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_LOUPE_ABI, signer);
		setSelectedCryptocommodityDiamondLoupeContract(diamondLoupeContract);
	
		const commonContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_COMMON_ABI, signer);
		setSelectedCryptocommodityCommonContract(commonContract);
	
		const crowdsaleContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_CROWDSALE_ABI, signer);
		setSelectedCryptocommodityCrowdsaleContract(crowdsaleContract);
	
		const vestingContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_VESTING_ABI, signer);
		setSelectedCryptocommodityVestingContract(vestingContract);
	
		const tokenContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_ERC_20_ABI, signer);
		setSelectedCryptocommodityTokenContract(tokenContract);*/

  };

  useEffect(() => {
    getContracts();
  }, []);

	return { 
		SELECTED_CRYPTOCOMMODITY_CONTRACT,
		SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT,
		SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT,
		SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT,
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT,
		SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT,
		SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT,
	};
};