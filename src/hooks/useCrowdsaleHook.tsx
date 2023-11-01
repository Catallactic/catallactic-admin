"use client";

import { Contract, ethers } from 'ethers';
import { useState } from 'react';

const CFG_ERC_20_ABI = require('../abi/ERC20Facet.json');

declare let window:any

export function useCrowdsaleHook() {

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
  const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()

	// **********************************************************************************************************
	// ************************************************ loadICOFeatures *****************************************
	// **********************************************************************************************************
	const [ICO_HARD_CAP, setICOHardCap] = useState<number>(0)
  const [ICO_SOFT_CAP, setICOSoftCap] = useState<number>(0)
	const [ICO_PRICE, setICOPrice] = useState<number>(0)

  const [ICO_MIN_TRANSFER, setMinTransfer] = useState<number>(0)
  const [ICO_MAX_TRANSFER, setMaxTransfer] = useState<number>(0)
	const [ICO_MAX_INVESTMENT, setMaxInvestment] = useState<number>(0)

	const [ICO_WHITELIST_THRESHOLD, setWhitelistThreshold] = useState<number>(0);

	const [ICO_CURRENT_STAGE, setCurrentState] = useState<number>(0);
	const [ICO_CURRENT_STAGE_TEXT, setCurrentStateText] = useState<string>('NOT CREATED')
	const STAGE: {[key: string]: number} = {
		NOT_CREATED: 0,
		NOT_STARTED: 1,
		ONGOING: 2,
		ONHOLD: 3,
		FINISHED: 4,
	}

	async function loadICOFeatures() {

		let hardCap = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getHardCap();
		console.log("hardCap: " + hardCap);
		setICOHardCap(hardCap);
		let softCap = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getSoftCap();
		console.log("softCap: " + softCap);
		setICOSoftCap(softCap);
		let price = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPriceuUSD();
		console.log("price: " + price);
		setICOPrice(price);

		// get read only - antiwhale
		let minTransfer = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMinUSDTransfer();
		setMinTransfer(minTransfer * 10**6);
		let maxTransfer = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMaxUSDTransfer();
		setMaxTransfer(maxTransfer * 10**6);
		let maxInvestment = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMaxUSDInvestment();
		setMaxInvestment(maxInvestment * 10**6);
		let whitelistThreshold = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelistuUSDThreshold();
		setWhitelistThreshold(whitelistThreshold / 10**6);

		let currentStage = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getCrowdsaleStage();
		setCurrentState(currentStage);
		if(currentStage == 0) setCurrentStateText("NOT CREATED");
		else if(currentStage == 1) setCurrentStateText("NOT STARTED");
		else if(currentStage == 2) setCurrentStateText("ONGOING");
		else if(currentStage == 3) setCurrentStateText("ON HOLD");
		else if(currentStage == 4) setCurrentStateText("FINISHED");
		console.log(currentStage);
	}

	// **********************************************************************************************************
	// ************************************************ loadICOFeatures *****************************************
	// **********************************************************************************************************
	const [ICO_PAYMENT_SYMBOLS, setICOPaymentSymbols] = useState<any | undefined>()
	const [ICO_PAYMENT_METHODS, setICOPaymentMethods] = useState<MapType>({})

	type MapType = { 
		[id: string]: string; 
	}

	async function loadICOPaymentMethod() {

		if(!SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT)
			return;

		// get read only - payment methods
		let paymentSymbols = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentSymbols();
		setICOPaymentSymbols(paymentSymbols);
		console.log("paymentSymbols: " + paymentSymbols);
		console.log(paymentSymbols);

		const map: MapType = {};
		for (var i = 0; i < paymentSymbols.length; i++) {
			console.log("paymentSymbol: " + paymentSymbols[i]);
			let method = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(paymentSymbols[i]);
			console.log("getPaymentTokenData: " + method);
			console.log(method);
			map[paymentSymbols[i]] = method;
		}
		console.log(map);
		console.log("ICO_PAYMENT_METHODS: " + map);
		//console.log("ICO_PAYMENT_METHODS44: " + map['USDT'][4]);
		setICOPaymentMethods(map);
	}

	// **********************************************************************************************************
	// ************************************************ loadAntiWhale *******************************************
	// **********************************************************************************************************
	const [ICO_WHITELIST_USER_LIST, setWhitelistUserList] = useState([])
  const [ICO_WHITELIST_USER_COUNT, setWhitelistUserCount] = useState<number>(0);
	const [ICO_IS_USE_BLACKLIST, setIsUseBlacklist] = useState<boolean | undefined>()
	const [ICO_BLACKLIST_USER_LIST, setBlacklistUserList] = useState([]);
	const [ICO_BLACKLIST_USER_COUNT, setBlacklistUserCount] = useState<number | undefined>()

	async function loadAntiWhale() {

		let whitelisted = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelisted();
		setWhitelistUserList(whitelisted);
		let whitelistUserCount = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelistUserCount();
		setWhitelistUserCount(whitelistUserCount);

		let isUseBlackList = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getUseBlacklist();
		console.log("isUseBlackList: " + isUseBlackList);
		setIsUseBlacklist(isUseBlackList);
		let blacklisted = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getBlacklisted();
		setBlacklistUserList(blacklisted);
		let blacklistUserCount = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getBlacklistUserCount();
		setBlacklistUserCount(blacklistUserCount);
	}

	// ***********************************************************************************************
	// ***************************************** ICO Balances ****************************************
	// ***********************************************************************************************
	// Investors Invested in ICO
	const [BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET, setBalancesRawICOSearchAddressWallet] = useState<MapType>({});
	const [BALANCES_RAW_ICO_ME_WALLET, setBalancesRawICOMeWallet] = useState<MapType>({});
	const [BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET, setBalancesUSDICOSearchAddressWallet] = useState<MapType>({});
	const [BALANCES_USD_ICO_ME_WALLET, setBalancesUSDICOMeWallet] = useState<MapType>({});

	const [PAYMENT_METHODS_SEARCH_ADDRESS, setPaymentMethodsSearchAddress] = useState<string>('')

	async function getBalancesRawICOMeWallet() {
		const mapBalances: MapType = await getInvestorInvestedRawInICOMap(METAMASK_CURRENT_ACCOUNT!);
		console.log('Updating InvestorInvestedRawInICOMe ', mapBalances);
		setBalancesRawICOMeWallet(mapBalances);
	}
	async function getBalancesRawICOSearchAddressWallet() {
		const mapBalances: MapType = await getInvestorInvestedRawInICOMap(PAYMENT_METHODS_SEARCH_ADDRESS!);
		console.log('Updating InvestorInvestedRawInICO ', mapBalances);
		setBalancesRawICOSearchAddressWallet(mapBalances);
	}
	async function getInvestorInvestedRawInICOMap(address: string) {
		const mapBalances: MapType = {};
		if(!ICO_PAYMENT_SYMBOLS) {
			console.log('no ICO_PAYMENT_SYMBOLS');
			return mapBalances;
		}

		for (var i = 0; i < ICO_PAYMENT_SYMBOLS.length; i++) {	
			let balance = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getContribution(address!, ICO_PAYMENT_SYMBOLS[i]);
			mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance;
		}

		console.log(mapBalances);
		return mapBalances;
	}

	async function getBalancesUSDICOMeWallet() {
		const mapBalances: MapType = await getInvestorInvestedUSDInICOMap(METAMASK_CURRENT_ACCOUNT!);
		console.log('Updating InvestorInvestedUSDInICOMe ', mapBalances);
		setBalancesUSDICOMeWallet(mapBalances);
	}
	async function getBalancesUSDICOSearchAddressWallet() {
		const mapBalances: MapType = await getInvestorInvestedUSDInICOMap(PAYMENT_METHODS_SEARCH_ADDRESS!);
		console.log('Updating InvestorInvestedUSDInICO ', mapBalances);
		setBalancesUSDICOSearchAddressWallet(mapBalances);
	}
	async function getInvestorInvestedUSDInICOMap(address: string) {
		const mapBalances: MapType = {};
		if(!ICO_PAYMENT_SYMBOLS) {
			console.log('no ICO_PAYMENT_SYMBOLS');
			return mapBalances;
		}

		for (var i = 0; i < ICO_PAYMENT_SYMBOLS.length; i++) {	
			let balance = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDContribution(address!, ICO_PAYMENT_SYMBOLS[i]);
			mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance;
		}

		let uUSDToClaim = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDToClaim(address);
		console.log('TOTAL2 ', uUSDToClaim);
		mapBalances['TOTAL'] = uUSDToClaim;

		console.log(mapBalances);
		return mapBalances;
	}

	// ***********************************************************************************************
	// ***************************************** ICO Balances ****************************************
	// ***********************************************************************************************
	// Investors Available
	const [BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS, setBalancesPaymentTokensSearchAddress] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_ME_WALLET, setBalancesPaymentTokensMeWallet] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_ICO_WALLET, setBalancesPaymentTokensICOWallet] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET, setBalancesPaymentTokensTargetWallet] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_PROJECT_WALLET, setBalancesPaymentTokensProjectWallet] = useState<MapType>({})

	const [ICO_TARGET_WALLET, setTargetWallet] = useState<string | undefined>()

	async function getBalancesPaymentTokensMeWallet() {
		const mapBalances: MapType = await getPaymentTokensBalancesMap(METAMASK_CURRENT_ACCOUNT!);
		console.log('Updating BALANCES_PAYMENT_TOKENS_ME_WALLET ', mapBalances);
		setBalancesPaymentTokensMeWallet(mapBalances);
	}

	async function getBalancesPaymentMethodsSearchAddress() {
		const mapBalances: MapType = await getPaymentTokensBalancesMap(PAYMENT_METHODS_SEARCH_ADDRESS);
		setBalancesPaymentTokensSearchAddress(mapBalances);
	}
	async function getBalancesPaymentMethodsICOWallet() {
		const mapBalances: MapType = await getPaymentTokensBalancesMap(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		console.log('Updating BALANCES_PAYMENT_TOKENS_ICO_WALLET ', mapBalances);
		setBalancesPaymentTokensICOWallet(mapBalances);
	}
	async function getBalancesTargetWallet() {
		const mapBalances: MapType = await getPaymentTokensBalancesMap(ICO_TARGET_WALLET!);
		console.log('Updating mapBalances liquidity ', mapBalances);
		setBalancesPaymentTokensTargetWallet(mapBalances);
	}

	async function getPaymentTokensBalancesMap(address: string) {
		console.log('getPaymentTokensBalancesMap -----------------');
		const mapBalances: MapType = {};
		if(!ICO_PAYMENT_SYMBOLS) {
			console.log('no ICO_PAYMENT_SYMBOLS');
			return mapBalances;
		}

		console.log('balances for address', address);
		for (var i = 0; i < ICO_PAYMENT_SYMBOLS.length; i++) {
			let method = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(ICO_PAYMENT_SYMBOLS[i]);
			console.log('ICO_PAYMENT_SYMBOL: ', ICO_PAYMENT_SYMBOLS[i]);

			if(ICO_PAYMENT_SYMBOLS[i] == 'COIN') {
				console.log('COIN code for ', ICO_PAYMENT_SYMBOLS[i]);
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				let balance = await provider.getBalance(address!);
				console.log('COIN balance ', balance);
				mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance.toString();

			} else {
				console.log('Token code for ', ICO_PAYMENT_SYMBOLS[i]);
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				const signer = provider.getSigner();
				const paymentToken: Contract = new ethers.Contract(method[0], CFG_ERC_20_ABI, signer);
				let balance = await paymentToken.balanceOf(address);
				console.log('Token balance ', ICO_PAYMENT_SYMBOLS[i], Number(balance));
				mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance;
			}

			console.log('balance ',ICO_PAYMENT_SYMBOLS[i], mapBalances[ICO_PAYMENT_SYMBOLS[i]]);
		}

		console.log('got balances');
		console.log(mapBalances);
		return mapBalances;
	}

	// ***********************************************************************************************
	// ***************************************** Whitelisted *****************************************
	// ***********************************************************************************************
	async function isWhitelisted(address: any, index: any) {

		const isWhitelisted = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.isWhitelisted(address);

		const element = window.document.getElementById('whitelistedValue'+index);
		if (element === null) {
			return;
		}
		console.log(isWhitelisted);
		element.innerHTML = isWhitelisted.toString();

	}
	async function isBlacklisted(address: any, index: any) {

		const isBlacklisted = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.isBlacklisted(address);

		const element = window.document.getElementById('blacklistedValue'+index);
		if (element === null) {
			return;
		}
		console.log(isBlacklisted);
		element.innerHTML = isBlacklisted.toString();
	}



	return { 
		loadICOFeatures, ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_MIN_TRANSFER, ICO_MAX_TRANSFER, ICO_MAX_INVESTMENT, ICO_WHITELIST_THRESHOLD, ICO_CURRENT_STAGE, ICO_CURRENT_STAGE_TEXT, STAGE,
		loadICOPaymentMethod, ICO_PAYMENT_SYMBOLS, ICO_PAYMENT_METHODS, 
		loadAntiWhale, ICO_WHITELIST_USER_LIST, ICO_WHITELIST_USER_COUNT, ICO_IS_USE_BLACKLIST, ICO_BLACKLIST_USER_LIST, ICO_BLACKLIST_USER_COUNT,
		getBalancesRawICOMeWallet,  BALANCES_RAW_ICO_ME_WALLET, 
		getBalancesRawICOSearchAddressWallet, BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET, 
		getBalancesUSDICOMeWallet, BALANCES_USD_ICO_ME_WALLET, 
		getBalancesUSDICOSearchAddressWallet, BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET, 
		getBalancesPaymentTokensMeWallet, BALANCES_PAYMENT_TOKENS_ME_WALLET,
		getBalancesPaymentMethodsSearchAddress, BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS,
		getBalancesPaymentMethodsICOWallet, BALANCES_PAYMENT_TOKENS_ICO_WALLET,
		getBalancesTargetWallet, BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET,
		isWhitelisted, 
		isBlacklisted,
	};
}
