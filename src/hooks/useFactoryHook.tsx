"use client";

import { useContext, useState } from 'react';
import { ContractsContext } from './useContractContextHook';
import { LOG_METHODS, MapType } from 'config/config';
import { ethers } from 'ethers';

import { getMETAMASK_CHAINS, CFG_FACTORY_ABI,CFG_SELECTED_CRYPTOCOMMODITIY_ABI, CFG_DIAMOND_CUT_ABI, CFG_DIAMOND_LOUPE_ABI, CFG_COMMON_ABI, CFG_CROWDSALE_ABI, CFG_VESTING_ABI, CFG_ERC_20_ABI } from '../config/config'

export function useFactoryHook() {

	const { envContracts, contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ************************************************ loadFactoryFacets ***************************************
	// **********************************************************************************************************
	const [FACTORY_FACET_TYPES, setFactoryFacetTypes] = useState([]);
	const [FACTORY_FACETS, setFactoryFacets] = useState<MapType>({})

	async function loadFactoryFacets() {
		console.log('%c loadFactoryFacets', LOG_METHODS);

		// get read only - payment methods
		let facetTypes = await envContracts.FACTORY_CONTRACT?.getFacetTypes();
		console.log("%c FactoryFacetTypes: ", LOG_METHODS, facetTypes);
		setFactoryFacetTypes(facetTypes);

		const map: MapType = {};
		for (var i = 0; i < facetTypes.length; i++) {
			let facetType = await envContracts.FACTORY_CONTRACT?.getFacetVersions(facetTypes[i]);
			map[facetTypes[i]] = facetType[0];
		}
		console.log("%c FactoryFacets: ", LOG_METHODS, map);
		setFactoryFacets(map);
	}

	// **********************************************************************************************************
	// ******************************************* loadFactoryPaymentMethod *************************************
	// **********************************************************************************************************
	const [FACTORY_PAYMENT_SYMBOLS, setFactoryPaymentSymbols] = useState<any | undefined>()
	const [FACTORY_PAYMENT_METHODS, setFactoryPaymentMethods] = useState<MapType>({})

	async function loadFactoryPaymentMethod() {
		console.log('%c loadFactoryPaymentMethod', LOG_METHODS);

		// get read only - payment methods
		let paymentSymbols = await envContracts.FACTORY_CONTRACT?.getPaymentSymbols();
		console.log("%c PaymentSymbols: ", LOG_METHODS, paymentSymbols);
		setFactoryPaymentSymbols(paymentSymbols);

		const map: MapType = {};
		for (var i = 0; i < paymentSymbols.length; i++) {
			let method = await envContracts.FACTORY_CONTRACT?.getPaymentToken(paymentSymbols[i]);
			map[paymentSymbols[i]] = method;
		}
		console.log("%c FactoryPaymentMethods: ", LOG_METHODS, map);
		setFactoryPaymentMethods(map);
	}

	// **********************************************************************************************************
	// ***************************************** FactorySelectPaymentMethod *************************************
	// **********************************************************************************************************
	const [FACTORY_PAYMENT_SYMBOL_SYMBOL, setFactoryPaymentSymbolSymbol] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DECIMALS, setFactoryPaymentSymbolDecimals] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_ADDRESS, setFactoryPaymentSymbolAddress] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_PRICE, setFactoryPaymentSymbolPrice] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_REF, setFactoryPaymentSymbolRef] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DYN_PRICE, setFactoryPaymentSymbolDynPrice] = useState<any | undefined>()

	const onFactorySelectPaymentMethod = async (symbol: any)=>{
		console.log('%c onFactorySelectPaymentMethod', LOG_METHODS, symbol);

		let paymentMethod = await await envContracts.FACTORY_CONTRACT?.getPaymentToken(symbol);
		console.log('%c paymentMethod', LOG_METHODS, paymentMethod);
		setFactoryPaymentSymbolSymbol(symbol);
		setFactoryPaymentSymbolAddress(paymentMethod[0]);
		setFactoryPaymentSymbolRef(paymentMethod[1]);
		setFactoryPaymentSymbolPrice(paymentMethod[2]);
		setFactoryPaymentSymbolDecimals(paymentMethod[3]);

		/*try {
			let dynPrice = await FACTORY_CONTRACT?.getUusdPerToken(symbol);
			console.log('dynPrice' + dynPrice);
			setFactoryPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setFactoryPaymentSymbolDynPrice(0);
		}*/

	}

	// **********************************************************************************************************
	// ******************************************* handleShowFunctions ******************************************
	// **********************************************************************************************************
	const [SHOW_FUNCTIONS, showFunctionsModal] = useState(false);
	const [INTERFACE_MODAL, setInterfaceModal] = useState<ethers.utils.Interface>();

	async function handleShowFunctions(facet: string) {
		console.log('%c handleShowFunctions', LOG_METHODS, facet);

		let facetInterface: ethers.utils.Interface = new ethers.utils.Interface(CFG_SELECTED_CRYPTOCOMMODITIY_ABI);
		if(facet == 'DiamondCutFacet') facetInterface = new ethers.utils.Interface(CFG_DIAMOND_CUT_ABI)!;
		else if(facet == 'DiamondLoupeFacet') facetInterface = new ethers.utils.Interface(CFG_DIAMOND_LOUPE_ABI)!;
		else if(facet == 'CommonFacet') facetInterface = new ethers.utils.Interface(CFG_COMMON_ABI)!;
		else if(facet == 'CrowdsaleFacet') facetInterface = new ethers.utils.Interface(CFG_CROWDSALE_ABI)!;
		else if(facet == 'VestingFacet') facetInterface = new ethers.utils.Interface(CFG_VESTING_ABI)!;
		else if(facet == 'ERC20Facet') facetInterface = new ethers.utils.Interface(CFG_ERC_20_ABI)!;
		console.log('%c facetInterface', LOG_METHODS, facetInterface);

		setInterfaceModal(facetInterface);

		showFunctionsModal(true);
	}

	return { 
		loadFactoryFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, FACTORY_PAYMENT_METHODS,
		onFactorySelectPaymentMethod, FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_DECIMALS, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_DYN_PRICE,
		handleShowFunctions, showFunctionsModal, SHOW_FUNCTIONS, INTERFACE_MODAL,
	}
}
