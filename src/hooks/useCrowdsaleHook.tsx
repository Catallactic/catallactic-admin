"use client";

import { Contract, ethers } from 'ethers';
import { useContext, useState } from 'react';

const CFG_ERC_20_ABI = require('../abi/ERC20Facet.json');

import { ContractsContext } from './useContractContextHook';
import { useWallets } from '@web3-onboard/react';
import { LOG_METHODS } from 'config/config';

declare let window:any

export function useCrowdsaleHook() {
	const connectedWallets = useWallets()
	const { envContracts, contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ********************************************* loadICOPaymentMethod ***************************************
	// **********************************************************************************************************
	const [ICO_PAYMENT_SYMBOLS, setICOPaymentSymbols] = useState<any | undefined>()
	const [ICO_PAYMENT_METHODS, setICOPaymentMethods] = useState<MapType>({})

	type MapType = { 
		[id: string]: string; 
	}

	async function loadICOPaymentMethod() {
		console.log('%c loadICOPaymentMethod', LOG_METHODS);

		if(!contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT)
			return;

		// get read only - payment methods
		let paymentSymbols = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentSymbols();
		console.log('%c PaymentSymbols', LOG_METHODS, paymentSymbols);
		setICOPaymentSymbols(paymentSymbols);

		const map: MapType = {};
		for (var i = 0; i < paymentSymbols.length; i++) {
			let method = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(paymentSymbols[i]);
			map[paymentSymbols[i]] = method;
		}
		console.log('%c ICOPaymentMethods', LOG_METHODS, map);
		setICOPaymentMethods(map);
	}

	// **********************************************************************************************************
	// ******************************************** onICOSelectPaymentMethod ************************************
	// **********************************************************************************************************
	const [ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DECIMALS, setICOPaymentSymbolDecimals] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_ADDRESS, setICOPaymentSymbolAddress] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_PRICE, setICOPaymentSymbolPrice] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_REF, setICOPaymentSymbolRef] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DYN_PRICE, setICOPaymentSymbolDynPrice] = useState<any | undefined>()

	const onICOSelectPaymentMethod = async (symbol: any)=>{
		console.log('%c ICOSelectPaymentMethod', LOG_METHODS, symbol);

		let paymentMethod = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(symbol);
		console.log('%c paymentMethod', LOG_METHODS, paymentMethod);
		setICOPaymentSymbolSymbol(symbol);
		setICOPaymentSymbolAddress(paymentMethod[0]);
		setICOPaymentSymbolRef(paymentMethod[1]);
		setICOPaymentSymbolPrice(paymentMethod[2]);
		setICOPaymentSymbolDecimals(paymentMethod[3]);

		try {
			let dynPrice = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getUusdPerToken(symbol);
			console.log('%c dynPrice', LOG_METHODS, dynPrice);
			setICOPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setICOPaymentSymbolDynPrice(0);
		}

	}

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

	const [VESTING_SCHEDULE_PERCENTAGE, setVestingSchedulePercentage] = useState<number>(0);
	const [VESTING_CURRENT_PROGRAM_ID, setVestingCurrentProgramId] = useState<string>('');

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
		console.log('%c loadICOFeatures', LOG_METHODS);

		// get read only - crowdsale
		let hardCap = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getHardCap();
		console.log('%c hardCap', LOG_METHODS, hardCap);
		setICOHardCap(hardCap);
		let softCap = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getSoftCap();
		console.log('%c softCap', LOG_METHODS, softCap);
		setICOSoftCap(softCap);
		let price = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPriceuUSD();
		console.log('%c price', LOG_METHODS, price);
		setICOPrice(price);

		// get read only - antiwhale
		let minTransfer = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMinUSDTransfer();
		setMinTransfer(minTransfer * 10**6);
		let maxTransfer = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMaxUSDTransfer();
		setMaxTransfer(maxTransfer * 10**6);
		let maxInvestment = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMaxUSDInvestment();
		setMaxInvestment(maxInvestment * 10**6);
		let whitelistThreshold = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelistuUSDThreshold();
		setWhitelistThreshold(whitelistThreshold / 10**6);
	
		// get read only - vesting
		let percentVested = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPercentVested();
		console.log('%c percentVested', LOG_METHODS, percentVested);
		setVestingSchedulePercentage(percentVested);
		let vestingId = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVestingId();
		console.log('%c vestingId', LOG_METHODS, vestingId);
		setVestingCurrentProgramId(vestingId);
		
		let currentStage = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getCrowdsaleStage();
		console.log('%c currentStage', LOG_METHODS, currentStage);
		setCurrentState(currentStage);
		if(currentStage == 0) setCurrentStateText("NOT CREATED");
		else if(currentStage == 1) setCurrentStateText("NOT STARTED");
		else if(currentStage == 2) setCurrentStateText("ONGOING");
		else if(currentStage == 3) setCurrentStateText("ON HOLD");
		else if(currentStage == 4) setCurrentStateText("FINISHED");
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
		console.log('%c loadAntiWhale', LOG_METHODS);

		let whitelisted = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelisted();
		console.log('%c whitelisted', LOG_METHODS, whitelisted);
		setWhitelistUserList(whitelisted);
		let whitelistUserCount = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelistUserCount();
		console.log('%c whitelistUserCount', LOG_METHODS, whitelistUserCount);
		setWhitelistUserCount(whitelistUserCount);

		let isUseBlackList = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getUseBlacklist();
		console.log('%c isUseBlackList', LOG_METHODS, isUseBlackList);
		setIsUseBlacklist(isUseBlackList);
		let blacklisted = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getBlacklisted();
		console.log('%c blacklisted', LOG_METHODS, blacklisted);
		setBlacklistUserList(blacklisted);
		let blacklistUserCount = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getBlacklistUserCount();
		console.log('%c blacklistUserCount', LOG_METHODS, blacklistUserCount);
		setBlacklistUserCount(blacklistUserCount);
	}

	// ***********************************************************************************************
	// ***************************************** loadInvested ****************************************
	// ***********************************************************************************************
	const [ICO_TOTAL_uUSD_INVESTED, setTotaluUSDInvested] = useState<number>(0)
	const [ICO_INVESTORS_COUNT, setCountInvestors] = useState<number | undefined>()
	const [ICO_INVESTORS_LIST, setInvestors] = useState([]);

	async function loadInvested() {
		console.log('%c loadInvested', LOG_METHODS);

		// get read only - investors
		let totalWeiInvested = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getTotaluUSDInvested();
		console.log('%c totalWeiInvested', totalWeiInvested);
		setTotaluUSDInvested(totalWeiInvested);
		let countInvestors = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getInvestorsCount();
		console.log('%c countInvestors', countInvestors);
		setCountInvestors(countInvestors);
		let investors = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getInvestors();
		console.log('%c investors', investors);
		setInvestors(investors);
	}

	// ***********************************************************************************************
	// ***************************************** Whitelisted *****************************************
	// ***********************************************************************************************
	const [VESTING_ADDRESS, setVestingAddress] = useState<string>()

	async function loadICOVestingAddress() {
		console.log('%c loadICOVestingAddress', LOG_METHODS);

		// vesting
		let vestingAddress = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVestingAddress();
		console.log('%c vestingAddress', LOG_METHODS, vestingAddress);
		setVestingAddress(vestingAddress);

	}

	// ***********************************************************************************************
	// ***************************************** Whitelisted *****************************************
	// ***********************************************************************************************
	const [WITHDRAW_TARGET_ADDRESS, setWithdrawTargetAddress] = useState<string>('')
	async function loadWithdrawTargetAddress() {
		console.log('%c loadWithdrawTargetAddress', LOG_METHODS);
		let withdrawAddress = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getTargetWalletAddress();
		console.log('%c withdrawAddress', LOG_METHODS, withdrawAddress);
		setWithdrawTargetAddress(withdrawAddress);
	}

	// ***********************************************************************************************
	// ************************************* loadTokenAddressOnCrowdsaleContract *********************
	// ***********************************************************************************************
	const [TOKEN_ADDRESS, setTokenAddress] = useState<string>()

	async function loadTokenAddressOnCrowdsaleContract() {
		console.log('%c loadTokenAddressOnCrowdsaleContract', LOG_METHODS);
		let tokenAddress = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getTokenAddress();
		console.log('%c tokenAddress', LOG_METHODS, tokenAddress);
		setTokenAddress(tokenAddress);
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
		console.log('%c getBalancesRawICOMeWallet', LOG_METHODS);

		const address = connectedWallets[0].accounts[0].address;
		const mapBalances: MapType = await getInvestorInvestedRawInICOMap(address!);
		console.log('%c BalancesRawICOMeWallet', LOG_METHODS, mapBalances);
		setBalancesRawICOMeWallet(mapBalances);
	}
	async function getBalancesRawICOSearchAddressWallet() {
		console.log('%c BalancesRawICOSearchAddressWallet', LOG_METHODS);

		const mapBalances: MapType = await getInvestorInvestedRawInICOMap(PAYMENT_METHODS_SEARCH_ADDRESS!);
		console.log('%c BalancesRawICOSearchAddressWallet', LOG_METHODS, mapBalances);
		setBalancesRawICOSearchAddressWallet(mapBalances);
	}
	async function getInvestorInvestedRawInICOMap(address: string) {
		console.log('%c InvestorInvestedRawInICOMap', LOG_METHODS);

		const mapBalances: MapType = {};
		if(!ICO_PAYMENT_SYMBOLS) {
			console.log('no ICO_PAYMENT_SYMBOLS');
			console.log('%c ICO_PAYMENT_SYMBOLS', LOG_METHODS);
			console.log('%c mapBalances', LOG_METHODS, mapBalances);
			return mapBalances;
		}

		for (var i = 0; i < ICO_PAYMENT_SYMBOLS.length; i++) {	
			let balance = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getContribution(address!, ICO_PAYMENT_SYMBOLS[i]);
			mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance;
		}

		console.log('%c mapBalances', LOG_METHODS, mapBalances);
		return mapBalances;
	}

	async function getBalancesUSDICOMeWallet() {
		console.log('%c getBalancesUSDICOMeWallet', LOG_METHODS);

		const address = connectedWallets[0].accounts[0].address;
		const mapBalances: MapType = await getInvestorInvestedUSDInICOMap(address!);
		console.log('%c InvestorInvestedUSDInICOMe', LOG_METHODS, mapBalances);
		setBalancesUSDICOMeWallet(mapBalances);
	}
	async function getBalancesUSDICOSearchAddressWallet() {
		console.log('%c getBalancesUSDICOSearchAddressWallet', LOG_METHODS);

		const mapBalances: MapType = await getInvestorInvestedUSDInICOMap(PAYMENT_METHODS_SEARCH_ADDRESS!);
		console.log('%c InvestorInvestedUSDInICO', LOG_METHODS, mapBalances);
		setBalancesUSDICOSearchAddressWallet(mapBalances);
	}
	async function getInvestorInvestedUSDInICOMap(address: string) {
		console.log('%c InvestorInvestedUSDInICOMap', LOG_METHODS, address);

		const mapBalances: MapType = {};
		if(!ICO_PAYMENT_SYMBOLS) {
			console.log('%c mapBalances', LOG_METHODS, mapBalances);
			return mapBalances;
		}

		for (var i = 0; i < ICO_PAYMENT_SYMBOLS.length; i++) {	
			let balance = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDContribution(address!, ICO_PAYMENT_SYMBOLS[i]);
			mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance;
		}

		let uUSDToClaim = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDToClaim(address);
		console.log('%c uUSDToClaim', LOG_METHODS, uUSDToClaim);
		mapBalances['TOTAL'] = uUSDToClaim;

		console.log('%c mapBalances', LOG_METHODS, mapBalances);
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
		console.log('%c BalancesPaymentTokensMeWallet', LOG_METHODS);

		const address = connectedWallets[0].accounts[0].address;
		const mapBalances: MapType = await getPaymentTokensBalancesMap(address!);
		console.log('%c mapBalances', LOG_METHODS, mapBalances);
		setBalancesPaymentTokensMeWallet(mapBalances);
	}

	async function getBalancesPaymentMethodsSearchAddress() {
		console.log('%c BalancesPaymentMethodsSearchAddress', LOG_METHODS);

		const mapBalances: MapType = await getPaymentTokensBalancesMap(PAYMENT_METHODS_SEARCH_ADDRESS);
		console.log('%c mapBalances', LOG_METHODS, mapBalances);
		setBalancesPaymentTokensSearchAddress(mapBalances);
	}
	async function getBalancesPaymentMethodsICOWallet() {
		console.log('%c BalancesPaymentMethodsICOWallet', LOG_METHODS);

		const mapBalances: MapType = await getPaymentTokensBalancesMap(contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		console.log('%c mapBalances', LOG_METHODS, mapBalances);
		setBalancesPaymentTokensICOWallet(mapBalances);
	}
	async function getBalancesTargetWallet() {
		console.log('%c BalancesTargetWallet', LOG_METHODS);

		const mapBalances: MapType = await getPaymentTokensBalancesMap(ICO_TARGET_WALLET!);
		console.log('%c mapBalances', LOG_METHODS, mapBalances);
		setBalancesPaymentTokensTargetWallet(mapBalances);
	}

	async function getPaymentTokensBalancesMap(address: string) {
		console.log('%c PaymentTokensBalancesMap', LOG_METHODS, address);

		let paymentSymbols = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentSymbols();
		console.log('%c paymentSymbols', LOG_METHODS, paymentSymbols);
		setICOPaymentSymbols(paymentSymbols);

		const mapBalances: MapType = {};
		if(!paymentSymbols) {
			console.log('%c no ICO_PAYMENT_SYMBOLS', LOG_METHODS);
			console.log('%c paymentSymbols', LOG_METHODS, paymentSymbols);
			return mapBalances;
		}

		console.log('%c balances for address', LOG_METHODS, address);
		for (var i = 0; i < paymentSymbols.length; i++) {
			let method = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(paymentSymbols[i]);

			if(paymentSymbols[i] == 'COIN') {
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				let balance = await provider.getBalance(address!);
				mapBalances[paymentSymbols[i]] = balance.toString();

			} else {
				console.log('Token code for ', paymentSymbols[i]);
				const provider = new ethers.providers.Web3Provider(window.ethereum)
				window.ethereum.enable()
				const signer = provider.getSigner()
				const paymentToken: Contract = new ethers.Contract(method[0], CFG_ERC_20_ABI, signer);
				let balance = await paymentToken.balanceOf(address);
				mapBalances[paymentSymbols[i]] = balance;
			}
		}

		console.log('%c mapBalances', LOG_METHODS, mapBalances);
		return mapBalances;
	}

	// ***********************************************************************************************
	// ***************************************** Whitelisted *****************************************
	// ***********************************************************************************************
	async function isWhitelisted(address: any, index: any) {
		console.log('%c isWhitelisted', LOG_METHODS, address, index);

		const isWhitelisted = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.isWhitelisted(address);
		console.log('%c isWhitelisted', LOG_METHODS, isWhitelisted);

		const element = window.document.getElementById('whitelistedValue'+index);
		if (element === null) {
			return;
		}
		element.innerHTML = isWhitelisted.toString();
	}
	async function isBlacklisted(address: any, index: any) {
		console.log('%c isBlacklisted', LOG_METHODS, address, index);

		const isBlacklisted = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.isBlacklisted(address);
		console.log('%c isBlacklisted', LOG_METHODS, isBlacklisted);

		const element = window.document.getElementById('blacklistedValue'+index);
		if (element === null) {
			return;
		}
		element.innerHTML = isBlacklisted.toString();
	}

	return { 
		loadICOPaymentMethod, ICO_PAYMENT_SYMBOLS, ICO_PAYMENT_METHODS, 
		onICOSelectPaymentMethod, ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOL_DECIMALS, ICO_PAYMENT_SYMBOL_ADDRESS, ICO_PAYMENT_SYMBOL_PRICE, ICO_PAYMENT_SYMBOL_REF, ICO_PAYMENT_SYMBOL_DYN_PRICE,
		loadICOFeatures, ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_MIN_TRANSFER, ICO_MAX_TRANSFER, ICO_MAX_INVESTMENT, ICO_WHITELIST_THRESHOLD, VESTING_SCHEDULE_PERCENTAGE, VESTING_CURRENT_PROGRAM_ID, ICO_CURRENT_STAGE, ICO_CURRENT_STAGE_TEXT, STAGE,
		loadAntiWhale, ICO_WHITELIST_USER_LIST, ICO_WHITELIST_USER_COUNT, ICO_IS_USE_BLACKLIST, ICO_BLACKLIST_USER_LIST, ICO_BLACKLIST_USER_COUNT,
		loadInvested, ICO_TOTAL_uUSD_INVESTED, ICO_INVESTORS_COUNT, ICO_INVESTORS_LIST,
		loadICOVestingAddress, VESTING_ADDRESS,
		loadWithdrawTargetAddress, WITHDRAW_TARGET_ADDRESS,
		loadTokenAddressOnCrowdsaleContract, TOKEN_ADDRESS,
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
