"use client";

import { Contract } from 'ethers';
import { useState } from 'react';

export function useDiamonsLoupeHook() {

	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT, setSelectedCryptocommodityDiamondLoupeContract] = useState<Contract>()

	// **********************************************************************************************************
	// ************************************************ loadERC20Features ***************************************
	// **********************************************************************************************************
	const [SELECTED_CRYPTOCOMMODITY_FACETS, setSelectedCryptocommodityFacets] = useState<any>();

	async function loadCryptocommodityFacets() {
		let facets = await SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT?.facets();
		console.log("loadCryptocommodityFacets: ", facets);
		setSelectedCryptocommodityFacets(facets);
	}

	return { 
		loadCryptocommodityFacets, SELECTED_CRYPTOCOMMODITY_FACETS,
	}
}
