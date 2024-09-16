"use client";

import { useContext, useState } from 'react';
import { ContractsContext } from './useContractContextHook';
import { LOG_METHODS } from 'config/config';

export function useDiamonsLoupeHook() {

	const { contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ************************************************ loadERC20Features ***************************************
	// **********************************************************************************************************
	const [SELECTED_CRYPTOCOMMODITY_FACETS, setSelectedCryptocommodityFacets] = useState<any>();

	async function loadCryptocommodityFacets() {
		console.log('%c CryptocommodityFacets', LOG_METHODS);

		let facets = await contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT?.facets();
		console.log('%c CryptocommodityFacets', LOG_METHODS, facets);
		setSelectedCryptocommodityFacets(facets);
	}

	return { 
		loadCryptocommodityFacets, 
		SELECTED_CRYPTOCOMMODITY_FACETS,
	}
}
