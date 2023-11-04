"use client";

import { useContext, useState } from 'react';
import { ContractsContext } from './useContractContextHook';

export function useDiamonsLoupeHook() {

	const { contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ************************************************ loadERC20Features ***************************************
	// **********************************************************************************************************
	const [SELECTED_CRYPTOCOMMODITY_FACETS, setSelectedCryptocommodityFacets] = useState<any>();

	async function loadCryptocommodityFacets() {
		console.log("contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT: ", contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT);
		let facets = await contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT?.facets();
		console.log("loadCryptocommodityFacets: ", facets);
		setSelectedCryptocommodityFacets(facets);
	}

	return { 
		loadCryptocommodityFacets, 
		SELECTED_CRYPTOCOMMODITY_FACETS,
	}
}
