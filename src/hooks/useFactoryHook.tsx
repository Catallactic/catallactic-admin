"use client";

import { Contract } from 'ethers';
import { useState } from 'react';

export function useFactoryHook() {

	const [FACTORY_CONTRACT, setFactoryContract] = useState<Contract>()

	type MapType = { 
		[id: string]: string; 
	}

	// **********************************************************************************************************
	// ************************************************ loadFacets **********************************************
	// **********************************************************************************************************
	const [FACTORY_FACET_TYPES, setFactoryFacetTypes] = useState([]);
	const [FACTORY_FACETS, setFactoryFacets] = useState<MapType>({})

	async function loadFacets() {
		// get read only - payment methods
		let facetTypes = await FACTORY_CONTRACT?.getFacetTypes();
		setFactoryFacetTypes(facetTypes);
		console.log("facetTypes: " + facetTypes);
		console.log(facetTypes);

		const map: MapType = {};
		for (var i = 0; i < facetTypes.length; i++) {
			console.log("facetType: " + facetTypes[i]);
			let facetType = await FACTORY_CONTRACT?.getFacetVersions(facetTypes[i]);
			console.log("facetType: " + facetType);
			console.log(facetType);
			map[facetTypes[i]] = facetType[0];
		}
		console.log(map);
		console.log("facetTypes: " + map);
		setFactoryFacets(map);
	}

	// **********************************************************************************************************
	// ******************************************* loadFactoryPaymentMethod *************************************
	// **********************************************************************************************************
	const [FACTORY_PAYMENT_SYMBOLS, setFactoryPaymentSymbols] = useState<any | undefined>()
	const [FACTORY_PAYMENT_METHODS, setFactoryPaymentMethods] = useState<MapType>({})

	async function loadFactoryPaymentMethod() {
		// get read only - payment methods
		let paymentSymbols = await FACTORY_CONTRACT?.getPaymentSymbols();
		setFactoryPaymentSymbols(paymentSymbols);
		console.log("paymentSymbols: " + paymentSymbols);
		console.log(paymentSymbols);

		const map: MapType = {};
		for (var i = 0; i < paymentSymbols.length; i++) {
			console.log("paymentSymbol: " + paymentSymbols[i]);
			let method = await FACTORY_CONTRACT?.getPaymentToken(paymentSymbols[i]);
			console.log("getPaymentTokenData: " + method);
			console.log(method);
			map[paymentSymbols[i]] = method;
		}
		console.log(map);
		console.log("FACTORY_PAYMENT_METHODS: " + map);
		//console.log("FACTORY_PAYMENT_METHODS44: " + map['USDT'][4]);
		setFactoryPaymentMethods(map);
	}

	// **********************************************************************************************************
	// ******************************************* loadYourCryptocommodities ************************************
	// **********************************************************************************************************
	const [CRYPTOCOMMODITIES, setCryptocommodities] = useState([]);

	async function loadYourCryptocommodities() {
		console.log("fetching cryptocommodities for user");

		let cryptocommodities = await FACTORY_CONTRACT?.getCryptocommodities();
		console.log("cryptocommodities: " + cryptocommodities);
		setCryptocommodities(cryptocommodities);
	}

	return { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, FACTORY_PAYMENT_METHODS,
		loadYourCryptocommodities, CRYPTOCOMMODITIES,
	}
}
