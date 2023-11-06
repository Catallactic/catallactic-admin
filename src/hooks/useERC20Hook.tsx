"use client";

import { Contract } from 'ethers';
import { useContext, useState } from 'react';
import { ContractsContext } from './useContractContextHook';

export function useERC20Hook() {

	const { contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ************************************************ loadERC20Features ***************************************
	// **********************************************************************************************************
	const [TOKEN_INITIALIZED, setInitialized] = useState<Boolean>(false)
	const [TOKEN_NAME, setTokenName] = useState<string>('')
	const [TOKEN_SYMBOL, setTokenSymbol] = useState<string>('')
	const [TOKEN_SUPPLY, setTokenSupply] = useState<number>(0)

	async function loadERC20Features() {
		let name = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.name();
		console.log('name: ' + name);
		setTokenName(name);

		let symbol = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.symbol();
		console.log('symbol: ' + symbol);
		setTokenSymbol(symbol);

		let supply = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.totalSupply();
		console.log('supply: ' + supply);
		setTokenSupply(supply);

		setInitialized(supply > 0);
	}


	// ***********************************************************************************************
	// ***************************************** ERC-20 Balances **************************************
	// ***********************************************************************************************
	// Investors Available
	const [BALANCES_ERC_20_ME_WALLET, setBalancesCygasMeWallet] = useState<string>('0')
	const [BALANCES_ERC_20_SEARCH_ADDRESS, setBalancesCygasSearchAddress] = useState<string>('0')
	const [BALANCES_ERC_20_ICO_WALLET, setBalancesCygasICOWallet] = useState<string>('0')
	const [BALANCES_ERC_20_TARGET_WALLET, setBalancesCygasTargetWallet] = useState<string>('0')

	const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()
	const [PAYMENT_METHODS_SEARCH_ADDRESS, setPaymentMethodsSearchAddress] = useState<string>('')
	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [ICO_TARGET_WALLET, setTargetWallet] = useState<string | undefined>()


	async function getBalancesCygasMeWallet() {
		const balance: string = await getTokenBalanceOf(METAMASK_CURRENT_ACCOUNT!);
		setBalancesCygasMeWallet(balance);
	}

	async function getBalancesCygasSearchAddress() {
		const balance: string = await getTokenBalanceOf(PAYMENT_METHODS_SEARCH_ADDRESS);
		setBalancesCygasSearchAddress(balance);
	}

	async function getBalancesCygasICOWallet() {
		const balance: string = await getTokenBalanceOf(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		setBalancesCygasICOWallet(balance);
	}

	async function getBalancesCygasTargetWallet() {
		const balance: string = await getTokenBalanceOf(ICO_TARGET_WALLET!);
		setBalancesCygasTargetWallet(balance);
	}

	async function getTokenBalanceOf(address: string) {
		console.log('getTokenBalanceOf', address);

		console.log('SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT', contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT);
		console.log('balanceOf2');
		const balanceOf = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(address);
		console.log('balanceOf22');
		console.log('ERC-20 balanceOf ', balanceOf);
		if(!balanceOf)
			return '0';

		const balanceOfInCygas = Number(balanceOf) / 10**18;
		console.log(balanceOfInCygas.toString());
		return balanceOfInCygas.toString();
	}

	return { 
		loadERC20Features, TOKEN_INITIALIZED, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY,
		getBalancesCygasMeWallet, BALANCES_ERC_20_ME_WALLET, 
		getBalancesCygasSearchAddress, BALANCES_ERC_20_SEARCH_ADDRESS, 
		getBalancesCygasICOWallet, BALANCES_ERC_20_ICO_WALLET, 
		getBalancesCygasTargetWallet, BALANCES_ERC_20_TARGET_WALLET, 
	}
}
