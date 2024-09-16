"use client";

import { Contract } from 'ethers';
import { useContext, useState } from 'react';
import { ContractsContext } from './useContractContextHook';
import { useWallets } from '@web3-onboard/react';
import { LOG_METHODS } from 'config/config';

export function useERC20Hook() {
	const connectedWallets = useWallets()

	const { contracts } = useContext(ContractsContext);

	// **********************************************************************************************************
	// ************************************************ loadERC20Features ***************************************
	// **********************************************************************************************************
	const [TOKEN_INITIALIZED, setInitialized] = useState<Boolean>(false)
	const [TOKEN_NAME, setTokenName] = useState<string>('')
	const [TOKEN_SYMBOL, setTokenSymbol] = useState<string>('')
	const [TOKEN_SUPPLY, setTokenSupply] = useState<number>(0)

	async function loadERC20Features() {
		console.log('%c loadERC20Features', LOG_METHODS);

		let name = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.name();
		console.log('%c name', LOG_METHODS, name);
		setTokenName(name);

		let symbol = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.symbol();
		console.log('%c symbol', LOG_METHODS, symbol);
		setTokenSymbol(symbol);

		let supply = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.totalSupply();
		console.log('%c supply', LOG_METHODS, supply);
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

	const [PAYMENT_METHODS_SEARCH_ADDRESS, setPaymentMethodsSearchAddress] = useState<string>('')
	const [ICO_TARGET_WALLET, setTargetWallet] = useState<string | undefined>()


	async function getBalancesCygasMeWallet() {
		console.log('%c getBalancesCygasMeWallet', LOG_METHODS);

		const address = connectedWallets[0].accounts[0].address;
		const balance: string = await getTokenBalanceOf(address!);
		setBalancesCygasMeWallet(balance);
	}

	async function getBalancesCygasSearchAddress() {
		console.log('%c getBalancesCygasSearchAddress', LOG_METHODS);

		const balance: string = await getTokenBalanceOf(PAYMENT_METHODS_SEARCH_ADDRESS);
		console.log('%c BalancesCygasSearchAddress', LOG_METHODS, balance);
		setBalancesCygasSearchAddress(balance);
	}

	async function getBalancesCygasICOWallet() {
		console.log('%c getBalancesCygasICOWallet', LOG_METHODS);

		const balance: string = await getTokenBalanceOf(contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		console.log('%c BalancesCygasICOWallet', LOG_METHODS, balance);
		setBalancesCygasICOWallet(balance);
	}

	async function getBalancesCygasTargetWallet() {
		console.log('%c getBalancesCygasTargetWallet', LOG_METHODS);

		const balance: string = await getTokenBalanceOf(ICO_TARGET_WALLET!);
		console.log('%c BalancesCygasTargetWallet', LOG_METHODS, balance);
		setBalancesCygasTargetWallet(balance);
	}

	async function getTokenBalanceOf(address: string) {
		console.log('%c getTokenBalanceOf', LOG_METHODS, address);

		const balanceOf = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(address);
		console.log('%c TokenBalanceOf', LOG_METHODS, balanceOf);
		if(!balanceOf)
			return '0';

		const balanceOfInCygas = Number(balanceOf) / 10**18;
		console.log('%c balanceOfInCygas', LOG_METHODS, balanceOfInCygas);
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
