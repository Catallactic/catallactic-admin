// src/pages/index.tsx
import type { NextPage } from 'next'
import { useState, useEffect } from 'react'
import {Contract, ethers} from "ethers"

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

declare let window:any

const Home: NextPage = () => {

	// ***********************************************************************************************
	// ******************************************** Config *******************************************
	// ***********************************************************************************************
	const KEY_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 300 300" fill="#FFF">
				<path d="M287.305,243.005c-0.136-1.772-0.928-3.476-2.227-4.747L172.835,126.015c4.416-10.403,6.747-21.669,6.747-33.312
					c0-22.754-8.875-44.163-24.938-60.266C138.558,16.366,117.164,7.5,94.397,7.5c-22.778,0-44.135,8.869-60.247,24.95
					C0.907,65.675,0.9,119.716,34.145,152.938c16.111,16.115,37.475,24.99,60.241,24.99c11.646,0,22.884-2.35,33.312-6.772
					l36.874,36.902c1.534,1.515,3.557,2.319,5.74,2.248l20.095-0.705l-0.656,20.145c-0.062,2.125,0.705,4.193,2.245,5.706
					c1.484,1.512,3.569,2.334,5.685,2.248l20.169-0.689l-0.724,20.123c-0.063,2.127,0.754,4.199,2.238,5.712
					c1.534,1.512,3.321,2.325,5.74,2.251l20.119-0.684l-0.674,20.126c-0.118,2.232,0.822,4.379,2.418,5.903
					c1.472,1.339,3.309,2.06,5.245,2.06c0.278,0,0.563-0.012,0.847-0.037l30.851-3.426c4.169-0.455,7.205-4.175,6.847-8.353
					L287.305,243.005z M84.106,82.415c-9.476,9.466-24.796,9.466-34.252,0c-9.47-9.469-9.47-24.786,0-34.246
					c9.456-9.46,24.771-9.469,34.252-0.003C93.563,57.625,93.557,72.952,84.106,82.415z M260.97,245.575
					c-1.126,1.126-2.635,1.688-4.101,1.688s-2.976-0.563-4.101-1.688l-95.501-95.529c2.659-2.867,5.077-5.885,7.273-9.058l96.429,96.41
					C263.221,239.65,263.221,243.324,260.97,245.575z"/>
			</svg>
		);
	}
	const COIN_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 212.755 212.755">
				<g>
					<path fill="#FFFFFF" d="M106.377,0C47.721,0,0,47.721,0,106.377s47.721,106.377,106.377,106.377s106.377-47.721,106.377-106.377   S165.034,0,106.377,0z M106.377,198.755C55.44,198.755,14,157.314,14,106.377S55.44,14,106.377,14s92.377,41.44,92.377,92.377   S157.314,198.755,106.377,198.755z"/>
					<path fill="#FFFFFF" d="m113.377,100.096v-39.744c3.961,1.471 7.417,4.17 9.82,7.82 2.127,3.229 6.468,4.123 9.696,1.997 3.229-2.126 4.123-6.467 1.996-9.696-5.029-7.636-12.778-12.82-21.512-14.647v-11.12c0-3.866-3.134-7-7-7s-7,3.134-7,7v11.099c-15.493,3.23-27.168,16.989-27.168,33.426 0,16.437 11.676,30.198 27.168,33.428v39.744c-3.961-1.471-7.417-4.17-9.82-7.82-2.127-3.229-6.468-4.124-9.696-1.997-3.229,2.126-4.123,6.467-1.996,9.696 5.029,7.636 12.778,12.82 21.512,14.647v11.119c0,3.866 3.134,7 7,7s7-3.134 7-7v-11.098c15.493-3.23 27.168-16.989 27.168-33.426-2.84217e-14-16.437-11.675-30.198-27.168-33.428zm-27.168-20.865c0-8.653 5.494-16.027 13.168-18.874v37.748c-7.674-2.847-13.168-10.221-13.168-18.874zm27.168,73.166v-37.748c7.674,2.847 13.168,10.221 13.168,18.874s-5.493,16.027-13.168,18.874z"/>
				</g>
			</svg>
		);
	}

	var METAMASK_CHAINS:any;
	const getMETAMASK_CHAINS = function() {
		if(!METAMASK_CHAINS && process.env.NEXT_PUBLIC_METAMASK_CHAINS) {
			METAMASK_CHAINS = JSON.parse(process.env.NEXT_PUBLIC_METAMASK_CHAINS ? process.env.NEXT_PUBLIC_METAMASK_CHAINS : '[]' )
		}
		return METAMASK_CHAINS;
	}

	const truncateRegex = '^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$';
	const truncateEthAddress = (address: string) => {
		if (!address) return '';
		const match = address.match(truncateRegex);
		if (!match) return address;
		return `${match[1]}…${match[2]}`;
	};

	// ***********************************************************************************************
	// ****************************************** Metamask *******************************************
	// ***********************************************************************************************
  const [METAMASK_INSTALLED, setMetamaskInstalled] = useState<boolean | undefined>()
  const [METAMASK_PROVIDER, setMetamaskProvider] = useState<ethers.providers.Web3Provider | undefined>()
  const [METAMASK_SIGNER, setMetamaskSigner] = useState<any | undefined>()
  const [METAMASK_CHAIN_ID, setChainId] = useState<number | undefined>()
	const [METAMASK_CHAIN_NAME, setChainName] = useState<string | undefined>()

  // openMetamaskInstall
  const openMetamaskInstall = () => {
		
		let userAgent = navigator.userAgent;
		if(userAgent.match(/chrome|chromium|crios/i)){
			window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank', 'noopener,noreferrer');
		}
		
		if(userAgent.match(/firefox|fxios/i)){
			window.open('https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/', '_blank', 'noopener,noreferrer');
		} 

		console.log('Unsupported platform')
	}

	useEffect(() => {
		console.log("MetaMask installed " + window.ethereum !== undefined);
		setMetamaskInstalled(window.ethereum !== undefined);
	}, [METAMASK_CHAIN_ID]);

	// ***********************************************************************************************
	// ************************************** Metamask Network ***************************************
	// ***********************************************************************************************
	useEffect(() => {
		console.log('METAMASK_INSTALLED', METAMASK_INSTALLED);
		console.log('METAMASK_INSTALLED', getMETAMASK_CHAINS());
		if(!METAMASK_INSTALLED) {
			console.log("please install MetaMask")
			return
		}

		// get network
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getNetwork().then((result)=>{
			console.log("setChain ", result.chainId);
			setChainId(result.chainId)
			setChainName(getMETAMASK_CHAINS()!.find(function (el: any) { return parseInt(el.id) == result.chainId; })?.name );
		}).catch((e)=>console.log(e))

		window.ethereum.on('chainChanged', (chainId: any) => {
			// Handle the new chain.
			// Correctly handling chain changes can be complicated.
			// We recommend reloading the page unless you have good reason not to.
			window.location.reload();
		});

	},[METAMASK_INSTALLED])

	useEffect(() => {
		console.log('METAMASK_CHAIN_ID', METAMASK_CHAIN_ID);
		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const ico_address: string = getMETAMASK_CHAINS()!.find(function (el: any) { return parseInt(el.id) == METAMASK_CHAIN_ID; })?.ico_address || '';
		const ico: Contract = new ethers.Contract(ico_address, CFG_ICO_ABI, signer);
		setICOContract(ico);

		const vesting: Contract = new ethers.Contract(ico_address, CFG_VESTING_ABI, signer);
		setVestingContract(vesting);
	}, [METAMASK_CHAIN_ID]);

	const isContract = async (provider: ethers.providers.Web3Provider, address: string)=>{
		try {
			const code = await provider.getCode(address);
			if (code !== '0x') return true;
		} catch (error) {}
		// if it comes here, then it's not a contract.
		return false;
	}

	const onSwitchNetwork = async (networkdId: any)=>{
		console.log('switching to network ' + networkdId);
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ 
					chainId: networkdId
				}],
			});

			window.location.reload();

			console.log('switched to network ' + networkdId);
		} catch (error) {
			console.error(error);
		}
	}

	// ***********************************************************************************************
	// ************************************* Metamask Account ****************************************
	// ***********************************************************************************************
  const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()
	const [METAMASK_CURRENT_ACCOUNT_BALANCE, setBalance] = useState<string | undefined>()

  // click connect
  const onClickConnect = () => {
    console.log("onClickConnect")

    // we can do it using ethers.js
    const provider = new ethers.providers.Web3Provider(window.ethereum)
		provider
			.send("eth_requestAccounts", [])
    	.then((accounts)=>{
				console.log(accounts);
				if(accounts.length>0)
					setCurrentAccount(accounts[0])

			})
			.catch((e)=>console.log(e))
  }

  // click disconnect
  const onClickDisconnect = () => {
    console.log("onClickDisConnect")
    setBalance(undefined)
		setCurrentAccount(undefined)
		resetICOContractData();
	}

	useEffect(() => {
		console.log('METAMASK_CURRENT_ACCOUNT', METAMASK_CURRENT_ACCOUNT);

		// account balance
    if(!METAMASK_CURRENT_ACCOUNT || !ethers.utils.isAddress(METAMASK_CURRENT_ACCOUNT)) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(METAMASK_CURRENT_ACCOUNT).then((result)=>{
      setBalance(ethers.utils.formatEther(result))
		}).catch((e)=>console.log(e))

		window.ethereum.on('accountsChanged', (accounts: any) => {
			// Handle the new accounts, or lack thereof "accounts" will always be an array, but it can be empty.
			window.location.reload();
		});

	},[METAMASK_CURRENT_ACCOUNT])

	// ***********************************************************************************************
	// **************************************** Payments Tokens **************************************
	// ***********************************************************************************************
	const [ICO_PAYMENT_SYMBOLS, setPaymentSymbols] = useState<any | undefined>()
	const [ICO_PAYMENT_METHODS, setPaymentMethods] = useState<MapType>({})
	const [ICO_PAYMENT_SYMBOL_SYMBOL, setPaymentSymbolSymbol] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DECIMALS, setPaymentSymbolDecimals] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_ADDRESS, setPaymentSymbolAddress] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_PRICE, setPaymentSymbolPrice] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_REF, setPaymentSymbolRef] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DYN_PRICE, setPaymentSymbolDynPrice] = useState<any | undefined>()

	const [ICO_PAYMENT_METHOD_SEARCH_ADDRESS, setPaymentMethodSearchAddress] = useState<string | undefined>()
	const [ICO_PAYMENT_METHOD_SEARCH_BALANCE, setPaymentMethodSearchBalance] = useState<string | undefined>()

	const onSelectPaymentMethod = async (symbol: any)=>{
		console.log('selectPaymentMethod', symbol);

		let paymentMethod = await ICO_CONTRACT?.getPaymentToken(symbol);
		console.log('paymentMethod', paymentMethod);
		setPaymentSymbolSymbol(symbol);
		setPaymentSymbolAddress(paymentMethod[0]);
		setPaymentSymbolRef(paymentMethod[1]);
		setPaymentSymbolPrice(paymentMethod[2]);
		setPaymentSymbolDecimals(paymentMethod[3]);

		try {
			let dynPrice = await ICO_CONTRACT?.getUusdPerToken(symbol);
			console.log('dynPrice' + dynPrice);
			setPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setPaymentSymbolDynPrice(0);
		}

	}
	async function cancelPaymentMethod() {
		console.log('cancelPaymentMethod');

		setPaymentSymbolSymbol(undefined);
		setPaymentSymbolAddress(undefined);
		setPaymentSymbolRef(undefined);
		setPaymentSymbolPrice(undefined);
		setPaymentSymbolDecimals(undefined);
	}

	async function savePaymentMethod() {
		console.log('savePaymentMethod', ICO_PAYMENT_SYMBOL_SYMBOL);

		await ICO_CONTRACT?.setPaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOL_ADDRESS, ICO_PAYMENT_SYMBOL_REF, ICO_PAYMENT_SYMBOL_PRICE, ICO_PAYMENT_SYMBOL_DECIMALS);

		populateICOContractData();
		cancelPaymentMethod();
	}

	async function deletePaymentMethod() {
		console.log('deletePaymentMethod', ICO_PAYMENT_SYMBOL_SYMBOL);

		await ICO_CONTRACT?.deletePaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(ICO_PAYMENT_SYMBOL_SYMBOL));

		populateICOContractData();
		cancelPaymentMethod();
	}

	async function getPaymentMethodBalance() {
		console.log('ICO_PAYMENT_METHOD_SEARCH_ADDRESS', ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log('ICO_PAYMENT_SYMBOL_ADDRESS', ICO_PAYMENT_SYMBOL_ADDRESS);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const paymentToken: Contract = new ethers.Contract(ICO_PAYMENT_SYMBOL_ADDRESS, CFG_ERC_20_ABI, signer);
		console.log(paymentToken);

		console.log('balanceOf4');
		let balance = await paymentToken.balanceOf(ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log(balance);
		setPaymentMethodSearchBalance(balance);
	}

	// ***********************************************************************************************
	// *********************************** Payment Tokens Balances ***********************************
	// ***********************************************************************************************
	type MapType = { 
		[id: string]: string; 
	}
	const [PAYMENT_METHODS_SEARCH_ADDRESS, setPaymentMethodsSearchAddress] = useState<string>('')

	// Investors Available
	const [BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS, setBalancesPaymentTokensSearchAddress] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_ME_WALLET, setBalancesPaymentTokensMeWallet] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_ICO_WALLET, setBalancesPaymentTokensICOWallet] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET, setBalancesPaymentTokensTargetWallet] = useState<MapType>({})
	const [BALANCES_PAYMENT_TOKENS_PROJECT_WALLET, setBalancesPaymentTokensProjectWallet] = useState<MapType>({})

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
		const mapBalances: MapType = await getPaymentTokensBalancesMap(ICO_CONTRACT?.address!);
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
			let method = await ICO_CONTRACT?.getPaymentToken(ICO_PAYMENT_SYMBOLS[i]);
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
	// ***************************************** ICO Balances ****************************************
	// ***********************************************************************************************
	// Investors Invested in ICO
	const [BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET, setBalancesRawICOSearchAddressWallet] = useState<MapType>({});
	const [BALANCES_RAW_ICO_ME_WALLET, setBalancesRawICOMeWallet] = useState<MapType>({});
	const [BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET, setBalancesUSDICOSearchAddressWallet] = useState<MapType>({});
	const [BALANCES_USD_ICO_ME_WALLET, setBalancesUSDICOMeWallet] = useState<MapType>({});

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
			let balance = await ICO_CONTRACT?.getContribution(address!, ICO_PAYMENT_SYMBOLS[i]);
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
			let balance = await ICO_CONTRACT?.getuUSDContribution(address!, ICO_PAYMENT_SYMBOLS[i]);
			mapBalances[ICO_PAYMENT_SYMBOLS[i]] = balance;
		}

		let uUSDToClaim = await ICO_CONTRACT?.getuUSDToClaim(address);
		console.log('TOTAL2 ', uUSDToClaim);
		mapBalances['TOTAL'] = uUSDToClaim;

		console.log(mapBalances);
		return mapBalances;
	}

	// ***********************************************************************************************
	// ***************************************** ERC-20 Balances **************************************
	// ***********************************************************************************************
	// Investors Available
	const [BALANCES_ERC_20_ME_WALLET, setBalancesCygasMeWallet] = useState<string>('0')
	const [BALANCES_ERC_20_SEARCH_ADDRESS, setBalancesCygasSearchAddress] = useState<string>('0')
	const [BALANCES_ERC_20_ICO_WALLET, setBalancesCygasICOWallet] = useState<string>('0')
	const [BALANCES_ERC_20_TARGET_WALLET, setBalancesCygasTargetWallet] = useState<string>('0')

	async function getBalancesCygasMeWallet() {
		const balance: string = await getTokenBalanceOf(METAMASK_CURRENT_ACCOUNT!);
		setBalancesCygasMeWallet(balance);
	}

	async function getBalancesCygasSearchAddress() {
		const balance: string = await getTokenBalanceOf(PAYMENT_METHODS_SEARCH_ADDRESS);
		setBalancesCygasSearchAddress(balance);
	}

	async function getBalancesCygasICOWallet() {
		const balance: string = await getTokenBalanceOf(ICO_CONTRACT?.address!);
		setBalancesCygasICOWallet(balance);
	}

	async function getBalancesCygasTargetWallet() {
		const balance: string = await getTokenBalanceOf(ICO_TARGET_WALLET!);
		setBalancesCygasTargetWallet(balance);
	}

	async function getTokenBalanceOf(address: string) {
		console.log('getTokenBalanceOf', address);

		console.log('TOKEN_CONTRACT', TOKEN_CONTRACT);
		console.log('balanceOf2');
		const balanceOf = await TOKEN_CONTRACT?.balanceOf(address);
		console.log('balanceOf22');
		console.log('ERC-20 balanceOf ', balanceOf);
		if(!balanceOf)
			return '0';

		const balanceOfInCygas = Number(balanceOf) / 10**18;
		console.log(balanceOfInCygas.toString());
		return balanceOfInCygas.toString();
	}

	// ***********************************************************************************************
	// ******************************************* Antiwhale *****************************************
	// ***********************************************************************************************
  const [ICO_MIN_TRANSFER, setMinTransfer] = useState<number>(0)
  const [ICO_MAX_TRANSFER, setMaxTransfer] = useState<number>(0)
	const [ICO_MAX_INVESTMENT, setMaxInvestment] = useState<number>(0)
	
	const [ICO_WHITELIST_THRESHOLD, setWhitelistThreshold] = useState<number | undefined>()
  const [ICO_WHITELIST_USER_COUNT, setWhitelistUserCount] = useState<number | undefined>()
	const [ICO_WHITELIST_USER_LIST, setWhitelistUserList] = useState([])

	const [ICO_USER_TO_WHITELIST, setUserToWhitelist] = useState<string | undefined>()

	const [ICO_IS_USE_BLACKLIST, setIsUseBlacklist] = useState<boolean | undefined>()
	const [ICO_BLACKLIST_USER_COUNT, setBlacklistUserCount] = useState<number | undefined>()
	const [ICO_BLACKLIST_USER_LIST, setBlacklistUserList] = useState([]);

	async function setMinTransferOnSC() {
		await ICO_CONTRACT?.setMinuUSDTransfer(ICO_MIN_TRANSFER).then(await handleICOReceipt).catch(handleError);
	}
	async function setMaxTransferOnSC() {
		await ICO_CONTRACT?.setMaxuUSDTransfer(ICO_MAX_TRANSFER).then(await handleICOReceipt).catch(handleError);
	}
	async function setMaxInvestmentOnSC() {
		console.log('ICO_MAX_INVESTMENT ' + ICO_MAX_INVESTMENT);
		await ICO_CONTRACT?.setMaxuUSDInvestment(ICO_MAX_INVESTMENT).then(await handleICOReceipt).catch(handleError);
	}

	// whitelist user
	async function setWhitelistThresholdOnSC() {
		await ICO_CONTRACT?.setWhitelistuUSDThreshold(Number(ICO_WHITELIST_THRESHOLD) * 10**6).then(await handleICOReceipt).catch(handleError);
	}

	// whitelist user
	async function setIsBlacklist(event:any) {

		// process transaction
		await ICO_CONTRACT?.setUseBlacklist(event.target.checked).then(await handleICOReceipt).catch(handleError);
	}

	async function isWhitelisted(address: any, index: any) {

		const isWhitelisted = await ICO_CONTRACT?.isWhitelisted(address);

		const element = window.document.getElementById('whitelistedValue'+index);
		if (element === null) {
			return;
		}
		console.log(isWhitelisted);
		element.innerHTML = isWhitelisted.toString();

	}

	// whitelist user
	async function whitelistUser(flag: boolean) {
		console.log("ICO_CONTRACT " + ICO_CONTRACT);

		if(flag) {
			await ICO_CONTRACT?.whitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
		} else {
			await ICO_CONTRACT?.unwhitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
		}
	}

	async function isBlacklisted(address: any, index: any) {

		const isBlacklisted = await ICO_CONTRACT?.isBlacklisted(address);

		const element = window.document.getElementById('blacklistedValue'+index);
		if (element === null) {
			return;
		}
		console.log(isBlacklisted);
		element.innerHTML = isBlacklisted.toString();
	}

	// blacklist user
	async function blacklistUser(elementId: string, flag: boolean) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var user = element.value;

		// process transaction
		if(flag) {
			await ICO_CONTRACT?.blacklistUser(user).then(await handleICOReceipt).catch(handleError);
		} else {
			await ICO_CONTRACT?.unblacklistUser(user).then(await handleICOReceipt).catch(handleError);
		}
	}


	// ***********************************************************************************************
	// ******************************************* ICO Contract **************************************
	// ***********************************************************************************************
	const CFG_ICO_ABI = require('../abi/CrowdsaleFacet.json');
	const CFG_ERC_20_ABI = require('../abi/ERC20Facet.json');
	const [ICO_CONTRACT, setICOContract] = useState<Contract>()

  const [ICO_OWNER, setICOOwner] = useState<string | undefined>()
  const [ICO_PENDING_OWNER, setICOPendingOwner] = useState<string | undefined>()
  const [ICO_BALANCE, setICOBalance] = useState<string | undefined>()
  const [ICO_HARD_CAP, setICOHardCap] = useState<number | undefined>()
  const [ICO_SOFT_CAP, setICOSoftCap] = useState<number | undefined>()
	const [ICO_PRICE, setICOPrice] = useState<number>(0)
	const [ICO_CURRENT_STAGE, setCurrentState] = useState<number>(0);
	const [ICO_CURRENT_STAGE_TEXT, setCurrentStateText] = useState<string>('NOT CREATED')
	const STAGE: {[key: string]: number} = {
		NOT_CREATED: 0,
		NOT_STARTED: 1,
		ONGOING: 2,
		ONHOLD: 3,
		FINISHED: 4,
	}
	
	const [ICO_TOTAL_uUSD_INVESTED, setTotaluUSDInvested] = useState<number>(0)
	const [ICO_INVESTORS_COUNT, setCountInvestors] = useState<number | undefined>()
	const [ICO_INVESTORS_LIST, setInvestors] = useState([]);

	useEffect(() => {
		console.log('ICO_CONTRACT', ICO_CONTRACT);
	}, [ICO_CONTRACT]);

	// populateICOContract
	async function connectICOContract(event:React.FormEvent) {
		event.preventDefault();

		populateICOContractData();
	}

	async function setICOHardCapOnSC() {
		console.log(`ICO_HARD_CAP: ` + ICO_HARD_CAP);
		await ICO_CONTRACT?.setHardCapuUSD(ICO_HARD_CAP! * 10**6).then(await handleICOReceipt).catch(handleError);
	}
	async function setICOSoftCapOnSC() {
		console.log(`ICO_SOFT_CAP: ` + ICO_SOFT_CAP);
		await ICO_CONTRACT?.setSoftCapuUSD(ICO_SOFT_CAP! * 10**6).then(await handleICOReceipt).catch(handleError);
	}
	async function setICOSPriceOnSC() {
		console.log(`ICO_PRICE: ` + ICO_PRICE);
		await ICO_CONTRACT?.setPriceuUSD(ICO_PRICE).then(await handleICOReceipt).catch(handleError);
	}

	// ICO Ownr
	async function setNewICOOwner() {
		await ICO_CONTRACT?.transferOwnership(ICO_PENDING_OWNER).then(await handleICOReceipt).catch(handleError);
	}
	async function acceptNewICOOwner() {
		await ICO_CONTRACT?.acceptOwnership().then(await handleICOReceipt).catch(handleError);
	}

	// click purchase
	async function setCrowdsaleStage(stage: number) {
		await ICO_CONTRACT?.setCrowdsaleStage(stage).then(await handleICOReceipt).catch(handleError);
	}

	// click purchase
	async function populateICOContractData() {
		console.log("populateICOContractData");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
		let icoBalance = await provider.getBalance(ICO_CONTRACT?.address!);
		console.log("icoBalance: " + icoBalance);
		setICOBalance(icoBalance + '');

		console.log("ICO_CONTRACT: " + ICO_CONTRACT?.address);
		let icoOwner = await ICO_CONTRACT?.owner();
		console.log("icoOwner: " + icoOwner);
		setICOOwner(icoOwner + '');
		let icoPendingOwner = await ICO_CONTRACT?.pendingOwner();
		console.log("icoPendingOwner: " + icoPendingOwner);
		if(icoPendingOwner != '0x0000000000000000000000000000000000000000')
			setICOPendingOwner(icoPendingOwner + '');
		let hardCap = await ICO_CONTRACT?.getHardCap();
		console.log("hardCap: " + hardCap);
		setICOHardCap(hardCap);
		let softCap = await ICO_CONTRACT?.getSoftCap();
		console.log("softCap: " + softCap);
		setICOSoftCap(softCap);
		let price = await ICO_CONTRACT?.getPriceuUSD();
		console.log("price: " + price);
		setICOPrice(price);

		// token address
		let tokenAddress = await ICO_CONTRACT?.getTokenAddress();
		console.log("tokenAddress: " + tokenAddress);
		setTokenAddress(tokenAddress);
		const signer = provider.getSigner()
		const tokenContract: Contract = new ethers.Contract(tokenAddress, CFG_ERC_20_ABI, signer);
		setTokenContract(tokenContract);

		// get stage
		let currentStage = await ICO_CONTRACT?.getCrowdsaleStage();
		setCurrentState(currentStage);
		if(currentStage == 0) setCurrentStateText("NOT CREATED");
		else if(currentStage == 1) setCurrentStateText("NOT STARTED");
		else if(currentStage == 2) setCurrentStateText("ONGOING");
		else if(currentStage == 3) setCurrentStateText("ON HOLD");
		else if(currentStage == 4) setCurrentStateText("FINISHED");
		console.log(currentStage);

		// get read only - investors
		let totalWeiInvested = await ICO_CONTRACT?.getTotaluUSDInvested();
		setTotaluUSDInvested(totalWeiInvested);
		let countInvestors = await ICO_CONTRACT?.getInvestorsCount();
		setCountInvestors(countInvestors);
		let investors = await ICO_CONTRACT?.getInvestors();
		setInvestors(investors);
		console.log("investors: " + investors);

		// get read only - payment methods
		let paymentSymbols = await ICO_CONTRACT?.getPaymentSymbols();
		setPaymentSymbols(paymentSymbols);
		console.log("paymentSymbols: " + paymentSymbols);
		console.log(paymentSymbols);

		const map: MapType = {};
		for (var i = 0; i < paymentSymbols.length; i++) {
			console.log("paymentSymbol: " + paymentSymbols[i]);
			let method = await ICO_CONTRACT?.getPaymentToken(paymentSymbols[i]);
			console.log("getPaymentTokenData: " + method);
			console.log(method);
			map[paymentSymbols[i]] = method;
		}
		console.log(map);
		console.log("ICO_PAYMENT_METHODS: " + map);
		//console.log("ICO_PAYMENT_METHODS44: " + map['USDT'][4]);
		setPaymentMethods(map);

		// get read only - antiwhale
		let minTransfer = await ICO_CONTRACT?.getMinUSDTransfer();
		setMinTransfer(minTransfer * 10**6);
		let maxTransfer = await ICO_CONTRACT?.getMaxUSDTransfer();
		setMaxTransfer(maxTransfer * 10**6);
		let maxInvestment = await ICO_CONTRACT?.getMaxUSDInvestment();
		setMaxInvestment(maxInvestment * 10**6);

		let whitelistThreshold = await ICO_CONTRACT?.getWhitelistuUSDThreshold();
		setWhitelistThreshold(whitelistThreshold / 10**6);
		let whitelisted = await ICO_CONTRACT?.getWhitelisted();
		setWhitelistUserList(whitelisted);
		let whitelistUserCount = await ICO_CONTRACT?.getWhitelistUserCount();
		setWhitelistUserCount(whitelistUserCount);

		let isUseBlackList = await ICO_CONTRACT?.getUseBlacklist();
		console.log("isUseBlackList: " + isUseBlackList);
		setIsUseBlacklist(isUseBlackList);
		let blacklisted = await ICO_CONTRACT?.getBlacklisted();
		setBlacklistUserList(blacklisted);
		let blacklistUserCount = await ICO_CONTRACT?.getBlacklistUserCount();
		setBlacklistUserCount(blacklistUserCount);

		// get read only - finalize
		let withdrawAddress = await ICO_CONTRACT?.getTargetWalletAddress();
		console.log("withdrawAddress: " + withdrawAddress);
		setWithdrawTargetAddress(withdrawAddress);

		// dynamic price
		let dynamicPrice = await ICO_CONTRACT?.gettDynamicPrice();
		console.log("dynamicPrice: " + dynamicPrice);
		setDynamicPrice(dynamicPrice);

		// allowances
		const uUSDAllowance = await ICO_CONTRACT?.getTotaluUSDInvested();
		console.log(`usd to approve: ` + uUSDAllowance);

		let num2 = BigInt((uUSDAllowance * 10**18).toLocaleString('fullwide', {useGrouping:false}));
		console.log(`cygas to approve num2: ` + num2);
		if (price > 0) {
			let num3  = num2 / BigInt(price);
			console.log(`cygas to approve num3: ` + num3);
			setAllowanceRequired(num3);
		
			console.log("ICO_OWNER: " + ICO_OWNER);
			console.log("ICO_CONTRACT?.address: " + ICO_CONTRACT?.address);
			let allowanceApproved: BigInt = await tokenContract.allowance(icoOwner, ICO_CONTRACT?.address);
			console.log(`allowanceApproved: ` + allowanceApproved);
			setAllowanceApproved(allowanceApproved);
		}

		// vesting
		let vestingIds = await VESTING_CONTRACT?.getVestingIds();
		console.log(`vestingIds: ` + vestingIds);
		setVestingIds(vestingIds);
	}

	async function resetICOContractData() {
		console.log("resetICOContractData");
		setICOBalance(undefined);
		setICOHardCap(undefined);
		setICOSoftCap(undefined);
		setICOPrice(0);

		setCurrentState(0);
		setCurrentStateText('NOT CREATED');

		setTotaluUSDInvested(0);
		setCountInvestors(undefined);
		setInvestors([]);
		
		setMinTransfer(0);
		setMaxTransfer(10_000_000_000);
		setMaxInvestment(100_000_000_000);
		setIsUseBlacklist(undefined);
		setWhitelistUserCount(undefined);
		setBlacklistUserCount(undefined);

		setTargetWallet(undefined);
	}

	useEffect(() => {
		console.log("ICO_PAYMENT_SYMBOLS loaded " + ICO_PAYMENT_SYMBOLS);
		console.log("ICO_PAYMENT_METHODS loaded " + ICO_PAYMENT_METHODS);
		console.log(ICO_PAYMENT_METHODS);
		
		getBalancesPaymentTokensMeWallet();
		getBalancesRawICOMeWallet();
		getBalancesUSDICOMeWallet();
		getBalancesCygasMeWallet();

		getBalancesPaymentMethodsICOWallet();
		getBalancesCygasICOWallet();

	}, [ICO_PAYMENT_SYMBOLS]);

	// ***********************************************************************************************
	// ******************************************* ERC-20 Token ***************************************
	// ***********************************************************************************************
	const [TOKEN_ADDRESS, setTokenAddress] = useState<string>()
	const [TOKEN_CONTRACT, setTokenContract] = useState<Contract>()
  const [TOKEN_OWNER, setTokenOwner] = useState<string | undefined>()
	const [TOKEN_BALANCE, setTokenBalance] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS, setTokenSearchAllowanceFromAddress] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS, setTokenSearchAllowanceToAddress] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE, setTokenSearchAllowance] = useState<string | undefined>()

	const [INVESTOR_BALANCE, setInvestorsBalance] = useState<string | undefined>()
	
	// populateICOContract
	async function connectTokenContract(event:React.FormEvent) {
		event.preventDefault();

		populateTokenContractData();
	}

	async function setNewTokenOwner(elementId: string) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var value = element.value;

		// process transaction
		await TOKEN_CONTRACT?.transferOwnership(value).then(await handleICOReceipt).catch(handleError);
	}

	async function getBalanceOf(elementId: any) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var address = element.value;
		console.log('address', address);

		console.log('TOKEN_CONTRACT', TOKEN_CONTRACT);
		console.log('balanceOf3');
		const balanceOf = await TOKEN_CONTRACT?.balanceOf(address);
		console.log(balanceOf.toString());

		setInvestorsBalance(balanceOf.toString());
	}

	async function getAllowance() {
		console.log('TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS', TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS);
		console.log('TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS', TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS);
		const allowanceWithDecimals = await TOKEN_CONTRACT?.allowance(TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS, TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS);
		const allowance = allowanceWithDecimals / 10**18;
		console.log(allowance.toString());

		setTokenSearchAllowance(allowance.toString());
	}

	// click purchase
	async function populateTokenContractData() {
		console.log("populateTokenContractData");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
		let tokenBalance = await provider.getBalance(TOKEN_CONTRACT?.address!);
		console.log("icoBalance: " + tokenBalance);
		setTokenBalance(tokenBalance + '');
	}

	// ***********************************************************************************************
	// ************************************** Target Wallet Contract *********************************
	// ***********************************************************************************************
	const [ICO_TARGET_WALLET, setTargetWallet] = useState<string | undefined>()
	const [TARGET_WALLET_CONTRACT, setTargetWalletContract] = useState<Contract>()
	
	// click purchase
	async function populateTargetContract() {

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner()
		const liquidity: Contract = new ethers.Contract(ICO_TARGET_WALLET!, CFG_ERC_20_ABI, signer)
		setTargetWalletContract(liquidity);

		getBalancesTargetWallet();
		getBalancesCygasTargetWallet();
	}

	// ***********************************************************************************************
	// ****************************************** Transfer *******************************************
	// ***********************************************************************************************
  const [TO_TRANSFER_ADDRESS, setToTransferAddress] = useState<string>('')
  const [TO_TRANSFER_AMOUNT, setToTransferAmount] = useState<string>('0')
  const [TO_TRANSFER_AMOUNT_USD, setToTransferAmountUSD] = useState<string>('0')
	const [TO_TRANSFER_CURRENCY, setToTransferCurrency] = useState<string>('USDT')
	
	async function transfer() {
		console.log('transferring ', TO_TRANSFER_ADDRESS, TO_TRANSFER_AMOUNT, TO_TRANSFER_CURRENCY);

		if(TO_TRANSFER_CURRENCY == 'COIN') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			await signer.sendTransaction({
				from: METAMASK_CURRENT_ACCOUNT,
				to: TO_TRANSFER_ADDRESS,
				value: ethers.utils.parseEther(TO_TRANSFER_AMOUNT),
				gasLimit: 200000,
			}).then(await handleICOReceipt).catch(handleError);

		} else if(TO_TRANSFER_CURRENCY == 'ERC_20') {

		} else {
			let currencyMap = await ICO_CONTRACT?.getPaymentToken(TO_TRANSFER_CURRENCY);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			let currencyAddress = currencyMap[0];
			let currencyDecimals = currencyMap[3];
			const currencyToken: Contract = new ethers.Contract(currencyAddress, CFG_ERC_20_ABI, signer);
			console.log('currencyToken ', currencyToken);
			await currencyToken.transfer(TO_TRANSFER_ADDRESS, (BigInt(Number(TO_TRANSFER_AMOUNT) * 10**Number(currencyDecimals))).toString()).then(await handleICOReceipt).catch(handleError);
		}

	}

	const onSelectToTransferCurrency = async (symbol: any)=>{
		setToTransferCurrency(symbol);
	}

	useEffect(() => {
		if(!TO_TRANSFER_CURRENCY) return;
		if(!ICO_PAYMENT_METHODS[TO_TRANSFER_CURRENCY]) return;
		console.log('TO_TRANSFER_AMOUNT', TO_TRANSFER_AMOUNT);

		let amountToken: string = ICO_PAYMENT_METHODS[TO_TRANSFER_CURRENCY];
		let amountTokenPrice: number = Number(amountToken[2])
		let amountToTransferUSD: number = Number(TO_TRANSFER_AMOUNT) * amountTokenPrice / 10**6;
		setToTransferAmountUSD(amountToTransferUSD.toString());

	}, [TO_TRANSFER_AMOUNT, TO_TRANSFER_CURRENCY]);

	const [DYNAMIC_PRICE, setDynamicPrice] = useState<boolean>()
	async function setDynamicPriceSC(event:any) {
		await ICO_CONTRACT?.setDynamicPrice(event.target.checked).then(await handleICOReceipt).catch(handleError);
	}

	// ***********************************************************************************************
	// ****************************************** Create ICO *********************s*******************
	// ***********************************************************************************************
	async function createICO() {
		// createICO
		console.log(`ICO_HARD_CAP: ` + ICO_HARD_CAP);
		console.log(`ICO_SOFT_CAP: ` + ICO_SOFT_CAP);
		console.log(`ICO_PRICE: ` + ICO_PRICE);
		console.log(`ICO_WHITELIST_THRESHOLD: ` + ICO_WHITELIST_THRESHOLD);
		console.log(`ICO_MAX_INVESTMENT: ` + ICO_MAX_INVESTMENT);
		console.log(`ICO_MAX_TRANSFER: ` + ICO_MAX_TRANSFER);
		console.log(`ICO_MIN_TRANSFER: ` + ICO_MIN_TRANSFER);
		console.log(`VESTING_SCHEDULE_PERCENTAGE: ` + VESTING_SCHEDULE_PERCENTAGE);
		console.log(`VESTING_ID: ` + VESTING_ID);
		await ICO_CONTRACT?.createCrowdsale(ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_WHITELIST_THRESHOLD, ICO_MAX_INVESTMENT, ICO_MAX_TRANSFER, ICO_MIN_TRANSFER, VESTING_SCHEDULE_PERCENTAGE, VESTING_ID)
			.then(createCrowdsale).catch(handleError);
	}

	async function createCrowdsale(receipt: any) {
		console.log(receipt);
	
		ICO_CONTRACT?.once('FundsWithdrawn', function (_symbol, _amount) {
			console.log(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`);
			toast.success(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);
	}

	// ***********************************************************************************************
	// ******************************************* Invest ********************************************
	// ***********************************************************************************************
  const [TO_INVEST_AMOUNT, setToInvestAmount] = useState<string>('0')
  const [TO_INVEST_AMOUNT_USD, setToInvestAmountUSD] = useState<string>('0')
	const [TO_INVEST_CURRENCY, setToInvestCurrency] = useState<string>('USDT')

	// click purchase
	async function invest() {

		let amountToInvest: number = Number(TO_INVEST_AMOUNT)
		console.log('investing amountToInvest ', amountToInvest, TO_INVEST_CURRENCY);

		if(TO_INVEST_CURRENCY == 'COIN') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner()
			await signer.sendTransaction({
				from: METAMASK_CURRENT_ACCOUNT,
				to: ICO_CONTRACT?.address,
				value: ethers.utils.parseEther(amountToInvest.toString()),
				gasLimit: 1000000,
			})
				//.once('sending', function(payload: any){ console.log(payload); })
				//.once('sent', function(payload){ ... })
				//.once('transactionHash', function(hash){ ... })
				//.once('receipt', function(receipt){ ... })
				//.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })
				//.on('error', function(error){ ... })
				.then(processInvestmentSuccess).catch(handleError);

		} else if(TO_INVEST_CURRENCY == 'ERC_20') {
			// N/A

		} else {
			let amountToken: string = ICO_PAYMENT_METHODS[TO_INVEST_CURRENCY];
			let paymentTokenAddress: string = amountToken[0];
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);
			await paymentToken?.approve(ICO_CONTRACT?.address, ethers.utils.parseEther(amountToInvest.toString())).then(await handleICOReceipt).catch(handleError);
			await ICO_CONTRACT?.depositTokens(TO_INVEST_CURRENCY, ethers.utils.parseEther(amountToInvest.toString())).then(processInvestmentSuccess).catch(handleError);
		}

	}
	async function processInvestmentSuccess(receipt: any) {
		console.log(receipt);
	
		// catch events
		ICO_CONTRACT?.once('FundsReceived', function (_backer, _symbol, _amount) {
			console.log(`FundsReceived: ${_amount} ${_symbol} deposited by ${_backer}`);
			toast.success(`FundsReceived: ${_amount} ${_symbol} deposited by ${_backer}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);

		// reset form
		setToInvestAmount('0');
		setToInvestAmountUSD('0');
		setToInvestCurrency('USDT');
	}

	const onSelectToInvestCurrency = async (symbol: any)=>{
		setToInvestCurrency(symbol);
	}

	useEffect(() => {
		if(!TO_INVEST_CURRENCY) return;
		if(!ICO_PAYMENT_METHODS[TO_INVEST_CURRENCY]) return;
		console.log('TO_INVEST_AMOUNT', TO_INVEST_AMOUNT);

		let amountToken: string = ICO_PAYMENT_METHODS[TO_INVEST_CURRENCY];
		let amountTokenPrice: number = Number(amountToken[2])
		let amountToInvestUSD: number = Number(TO_INVEST_AMOUNT) * amountTokenPrice / 10**6;
		setToInvestAmountUSD(amountToInvestUSD.toString());

	}, [TO_INVEST_AMOUNT, TO_INVEST_CURRENCY]);

	// ***********************************************************************************************
	// ******************************************** Refund *******************************************
	// ***********************************************************************************************
  const [TO_REFUND_AMOUNT, setToRefundAmount] = useState<string>()
  const [TO_REFUND_AMOUNT_USD, setToRefundAmountUSD] = useState<string>()
	const [TO_REFUND_CURRENCY, setToRefundCurrency] = useState<string>()

	const onSelectToRefundCurrency = async (symbol: any)=>{
		setToRefundCurrency(symbol);

		let contribution = await ICO_CONTRACT?.getContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contribution: ` + contribution);
		setToRefundAmount(contribution);

		let contributionUSD = await ICO_CONTRACT?.getuUSDContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contributionUSD: ` + contributionUSD);
		setToRefundAmountUSD(contributionUSD);
	}
	async function refund() {
		await ICO_CONTRACT?.refund(TO_REFUND_CURRENCY).then(processRefundSuccess).catch(handleError);
	}

	const [TO_REFUND_ALL_AMOUNT, setToRefundAllAmount] = useState<string>()
  const [TO_REFUND_ALL_AMOUNT_USD, setToRefundAllAmountUSD] = useState<string>()
	const [TO_REFUND_ALL_CURRENCY, setToRefundAllCurrency] = useState<string>()

	const onSelectToRefundAllCurrency = async (symbol: any)=>{
		setToRefundAllCurrency(symbol);

		let invested = await ICO_CONTRACT?.getPaymentToken(symbol);
	  console.log(`invested: ` + invested);
	  console.log(`invested: ` + invested[4]);
		setToRefundAllAmountUSD(invested[4]);
	  console.log(`investedUSD: ` + invested[5]);
		setToRefundAllAmount(invested[5]);
	}
	async function refundAll() {
		await ICO_CONTRACT?.refundAll(TO_REFUND_ALL_CURRENCY).then(processRefundSuccess).catch(handleError);
	}
	async function processRefundSuccess(receipt: any) {
		console.log(receipt);
	
		// catch events
		ICO_CONTRACT?.once('FundsRefunded', function (_backer, amount) {
			console.log(`FundsRefunded: ${amount} refunded to ${_backer}`);
			toast.success(`FundsRefunded: ${amount} refunded to ${_backer}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);
	}

	// ***********************************************************************************************
	// ********************************************* Claim *******************************************
	// ***********************************************************************************************
	const [ICO_ALLOWANCE_REQUIRED, setAllowanceRequired] = useState<BigInt>(BigInt(0))
	const [ICO_ALLOWANCE_APPROVED, setAllowanceApproved] = useState<BigInt>(BigInt(0))

	async function approveAllowanceToICO() {
		// approve ico allowance on token
	  console.log(`TOKEN_CONTRACT: ` + TOKEN_CONTRACT);
	  console.log(`allowance being approved: ` + ICO_ALLOWANCE_REQUIRED);
		await TOKEN_CONTRACT?.approve(ICO_CONTRACT?.address, ICO_ALLOWANCE_REQUIRED)
	}
	async function claim() {
		await ICO_CONTRACT?.claim().then(processClaimSuccess).catch(handleError);
	}
	async function claimAll() {
		await ICO_CONTRACT?.claimAll().then(processClaimSuccess).catch(handleError);
	}

	async function processClaimSuccess(receipt: any) {
		console.log(receipt);
	
		// catch events
		ICO_CONTRACT?.once('FundsClaimed', function (_backer, amount) {
			console.log(`FundsClaimed: ${amount} claimed by ${_backer}`);
			toast.success(`FundsClaimed: ${amount} claimed by ${_backer}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);
	}

	async function setGasClickToken() {
		console.log(`setting token address: ` + TOKEN_ADDRESS);
		await ICO_CONTRACT?.setTokenAddress(TOKEN_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	// ***********************************************************************************************
	// ******************************************* Withdraw ******************************************
	// ***********************************************************************************************
	const [WITHDRAW_TARGET_ADDRESS, setWithdrawTargetAddress] = useState<string>('')
	const [WITHDRAW_CURRENCY, setWithdrawCurrency] = useState<string>('')
	const [WITHDRAW_PERCENTAGE, setWithdrawPercentage] = useState<string>('')

	async function withdrawICO() {
		console.log(`WITHDRAW_CURRENCY: ` + WITHDRAW_CURRENCY);
		console.log(`WITHDRAW_PERCENTAGE: ` + WITHDRAW_PERCENTAGE);
		await ICO_CONTRACT?.withdraw(WITHDRAW_CURRENCY, WITHDRAW_PERCENTAGE).then(processWithdrawSuccess).catch(handleError);
	}

	async function processWithdrawSuccess(receipt: any) {
		console.log(receipt);
	
		ICO_CONTRACT?.once('FundsWithdrawn', function (_symbol, _amount) {
			console.log(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`);
			toast.success(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);
	}

	const onSelectToWitdrawCurrency = async (symbol: any)=>{
		setWithdrawCurrency(symbol);
	}

	// whitelist user
	async function setTargetWalletAddress() {
		await ICO_CONTRACT?.setTargetWalletAddress(WITHDRAW_TARGET_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	// ***********************************************************************************************
	// ******************************************* Vesting *******************************************
	// ***********************************************************************************************
	const CFG_VESTING_ABI = require('../abi/VestingFacet.json');
	const [VESTING_CONTRACT, setVestingContract] = useState<Contract>()

	const [VESTING_IDS, setVestingIds] = useState([]);

	const [VESTING_ID, setVestingId] = useState<string>('');
	const [VESTING_START, setVestingStart] = useState<number>(0);
	const [VESTING_CLIFF, setVestingCliff] = useState<number>(0);
	const [VESTING_DURATION, setVestingDuration] = useState<number>(0);
	const [VESTING_NUM_SLIDES, setVestingNumSlides] = useState<number>(0);
	const [VESTING_SCHEDULE_PERCENTAGE, setVestingSchedulePercentage] = useState<number>(0);
	const [VESTING_UPDATE_ID, setVestingUpdateId] = useState<string>('');
	const [VESTING_UPDATE_START, setVestingUpdateStart] = useState<string>('');
	const [VESTING_UPDATE_CLIFF, setVestingUpdateCliff] = useState<string>('');
	const [VESTING_UPDATE_DURATION, setVestingUpdateDuration] = useState<string>('');
	const [VESTING_UPDATE_NUM_SLIDES, setVestingUpdateNumSlides] = useState<number>(0);
	const [VESTING_UPDATE_SCHEDULE_PERCENTAGE, setVestingUpdateSchedulePercentage] = useState<number>(0);


	async function createVesting() {
		// createICO
		console.log(`ICO_HARD_CAP: ` + ICO_HARD_CAP);
		console.log(`ICO_SOFT_CAP: ` + ICO_SOFT_CAP);
		console.log(`ICO_PRICE: ` + ICO_PRICE);
		console.log(`ICO_WHITELIST_THRESHOLD: ` + ICO_WHITELIST_THRESHOLD);
		console.log(`ICO_MAX_INVESTMENT: ` + ICO_MAX_INVESTMENT);
		console.log(`ICO_MAX_TRANSFER: ` + ICO_MAX_TRANSFER);
		console.log(`ICO_MIN_TRANSFER: ` + ICO_MIN_TRANSFER);
		console.log(`VESTING_SCHEDULE_PERCENTAGE: ` + VESTING_SCHEDULE_PERCENTAGE);
		console.log(`VESTING_ID: ` + VESTING_ID);
		await VESTING_CONTRACT?.createVesting(VESTING_START, VESTING_CLIFF, VESTING_DURATION, VESTING_NUM_SLIDES)
			.then(processCreateVesting).catch(handleError);
	}

	async function processCreateVesting(receipt: any) {
		console.log(receipt);
	
		ICO_CONTRACT?.once('FundsWithdrawn', function (_symbol, _amount) {
			console.log(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`);
			toast.success(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);
	}

	const onSelectVestingId = async (vestingId: any)=>{
		setVestingId(vestingId);
	}

	// ***********************************************************************************************
	// ************************************** TX Processing ******************************************
	// ***********************************************************************************************
	async function handleICOReceipt(tx:any) {
		console.log('handle tx');
		console.log(tx);

		// process transaction
		console.log(`Transaction hash: ${tx.hash}`);
		const receipt = await tx.wait();
		console.log(receipt);
	  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
		console.log(`Gas used: ${receipt.gasUsed.toString()}`);

		//parseError(err.message,);
		let msg = 'GasUsed: ' + receipt.gasUsed;
		toast.info(msg, {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});

		populateICOContractData();
	}
	function handleError(err:any) {
		console.log('Ohhhh nooo');
		console.log(err);
		console.log(err.code);
		console.log('err.message: ' + err.message);

		//parseError(err.message,);
		toast.error(parseError(err.message), {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	}

	function parseError(err:any) {
		if(err.indexOf('ERRW_OWNR_NOT') > -1) return 'Caller is not the owner';
		else if(err.indexOf('ERRP_INDX_PAY') > -1) return 'Wrong index';
		else if(err.indexOf('ERRD_MUST_ONG') > -1) return 'ICO must be ongoing';
		else if(err.indexOf('ERRD_MUSN_BLK') > -1) return 'Must not be blacklisted';
		else if(err.indexOf('ERRD_TRAS_LOW') > -1) return 'Transfer amount too low';
		else if(err.indexOf('ERRD_TRAS_HIG') > -1) return 'Transfer amount too high';
		else if(err.indexOf('ERRD_MUST_WHI') > -1) return 'Must be whitelisted';
		else if(err.indexOf('ERRD_INVT_HIG') > -1) return 'Total invested amount too high';
		else if(err.indexOf('ERRD_HARD_CAP') > -1) return 'Amount higher than available';
		else if(err.indexOf('ERRD_ALLO_LOW') > -1) return 'Insuffient allowance';
		else if(err.indexOf('ERRR_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRR_PASS_SOF') > -1) return 'Passed SoftCap. No refund';
		else if(err.indexOf('ERRR_ZERO_REF') > -1) return 'Nothing to refund';
		else if(err.indexOf('ERRR_WITH_REF') > -1) return 'Unable to refund';
		else if(err.indexOf('ERRC_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRC_NPAS_SOF') > -1) return 'Not passed SoftCap';
		else if(err.indexOf('ERRC_MISS_TOK') > -1) return 'Provide Token';
		else if(err.indexOf('ERRW_MUST_FIN') > -1) return 'ProvidICO must be finishede Token';
		else if(err.indexOf('ERRW_MISS_WAL') > -1) return 'Provide Wallet';
		else if(err.indexOf('ERRR_ZERO_WIT') > -1) return 'Nothing to withdraw';
		else if(err.indexOf('ERRR_WITH_BAD') > -1) return 'Unable to withdraw';
	
		return err;
	}
	
  return (
    <>

			<div className="bg-login p-4">

				<ToastContainer />

				<Row className="mb-3">
					<Col className="bg-label h3 d-flex justify-content-center">CATALLACTIC ADMIN v0.9</Col>
				</Row>

				<Row>
					{METAMASK_INSTALLED ?
					<Col>
						{METAMASK_CURRENT_ACCOUNT ? <Button className="w-100 bg-button-disconnect p-2 fw-bold" onClick={onClickDisconnect}>Disconnect From Metamask</Button> : <Button className="w-100 bg-button-connect p-2 fw-bold" onClick={onClickConnect}>Connect to MetaMask</Button>}
					</Col>
					: 
					<Col>
						<Button variant="danger" className="w-100 bg-button-disconnect p-2 fw-bold" onClick={openMetamaskInstall}>You need to Install Metamask Wallet. Click to Open</Button>
					</Col>
					}
				</Row>

				{METAMASK_CURRENT_ACCOUNT ? <Row><Col><div><Form.Text className="">Choose Chain</Form.Text></div></Col></Row> : "" }
				{METAMASK_CURRENT_ACCOUNT ?
				<Row>
					<Col>
						<Dropdown onSelect={onSwitchNetwork}>
							<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
								{METAMASK_CHAIN_NAME}
							</Dropdown.Toggle>

							<Dropdown.Menu className="w-100">
								{getMETAMASK_CHAINS().map((item: any, index: any) => {
									return (
										<Dropdown.Item as="button" key={index} eventKey={item.id} active={METAMASK_CHAIN_NAME == item.name}>
											{item.name}
										</Dropdown.Item>
									);
								})}
							</Dropdown.Menu>
						</Dropdown>
					</Col>
					<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={connectICOContract}>Connect To ICO</Button></Col>
				</Row>
				: "" }

				<Row className="mb-3"></Row>
				<Row className="mb-3"></Row>
				<Tabs defaultActiveKey="me" transition={false} className="nav nav-fill">

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************************** ME Tab ********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="me" title="ACCOUNTS" className="bg-label mb-3 bg-light-grey p-3">


						<Tabs className="nav nav-fill" defaultActiveKey="acc_me" transition={true}>

							<Tab eventKey="acc_me" title="ME" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallet</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Connected to Metamask Account</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="email" className="form-control form-control-lg text-center border-0" value={METAMASK_CURRENT_ACCOUNT} disabled={true}></input></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
									</Row>
									<Row>
										<Col xs={3}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In Tokens</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
										<Col xs={7}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In ICO</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={3}><div className="text-center"><Form.Text className="text-center">Available</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
										<Col xs={2}><div className="text-center"><Form.Text className="text-center">Invested</Form.Text></div></Col>
										<Col xs={2}><div className="text-center"><Form.Text className="text-center">Inv USD</Form.Text></div></Col>
										<Col xs={3}><div className="text-center"><Form.Text className="text-center">ERC-20 Bought</Form.Text></div></Col>
									</Row>
									{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => (
									<Row className="mb-3" key={index} >
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_ME_WALLET && BALANCES_PAYMENT_TOKENS_ME_WALLET[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_PAYMENT_TOKENS_ME_WALLET[item].toString()) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
										<Col xs={2}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >{item}</Button></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_RAW_ICO_ME_WALLET && BALANCES_RAW_ICO_ME_WALLET[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_RAW_ICO_ME_WALLET[item].toString()) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_ME_WALLET && BALANCES_USD_ICO_ME_WALLET[item] ? Number(BALANCES_USD_ICO_ME_WALLET[item].toString()) / 10**6 : 0}></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_ME_WALLET && BALANCES_USD_ICO_ME_WALLET[item] ? Number(BALANCES_USD_ICO_ME_WALLET[item].toString()) / ICO_PRICE : 0}></input></Col>
									</Row>
									))}
									<Row>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ME_WALLET}></input></Col>
										<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >ERC-20</Button></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_ME_WALLET && BALANCES_USD_ICO_ME_WALLET['TOTAL'] ? Number(BALANCES_USD_ICO_ME_WALLET['TOTAL']) / 10**6 : 0}></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_ME_WALLET && BALANCES_USD_ICO_ME_WALLET['TOTAL'] ? Number(BALANCES_USD_ICO_ME_WALLET['TOTAL']) / ICO_PRICE : 0}></input></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Accordion className="mb-3 bg-semitransparent border rounded-3">
									<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
										<Accordion.Header>
											<Row className="w-100"><Col className="bg-label text-center h4 p-2">ICO Participation</Col></Row>
										</Accordion.Header>
										<Accordion.Body className="px-0">

											<Form.Group className="p-3 border border-dark rounded bg-light-grey">
												<Row>
													<Col><div><div className="color-frame fs-4 text-center text-center w-100">Invest</div></div></Col>
												</Row>
												<Row>
													<Col><div><Form.Text className="color-frame">Currency</Form.Text></div></Col>
													<Col><div><Form.Text className="color-frame">Amount</Form.Text></div></Col>
													<Col><div><Form.Text className="color-frame">Amount USD</Form.Text></div></Col>
													<Col><div><Form.Text className="color-frame"></Form.Text></div></Col>
												</Row>
												<Row>
													<Col>
														<Dropdown onSelect={onSelectToInvestCurrency}>
															<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
																{TO_INVEST_CURRENCY}
															</Dropdown.Toggle>

															<Dropdown.Menu className="w-100">
																{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
																	return (
																		<Dropdown.Item as="button" key={index} eventKey={item} active={TO_INVEST_CURRENCY == item}>
																			{item}
																		</Dropdown.Item>
																	);
																})}
															</Dropdown.Menu>
														</Dropdown>
													</Col>
													<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setToInvestAmount(event.target.value) } value={TO_INVEST_AMOUNT}></input></Col>
													<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_INVEST_AMOUNT_USD ? TO_INVEST_AMOUNT_USD : 0} ></input></Col>
													<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => invest()}>Invest</Button></Col>
												</Row>
											</Form.Group>

											<Row className="mb-3"></Row>
											<Form.Group className="p-3 border border-dark rounded bg-light-grey">
												<Row>
													<Col><div><div className="color-frame fs-4 text-center text-center w-100">Refund</div></div></Col>
												</Row>
												<Row>
													<Col xs={3}><div><Form.Text className="color-frame">Currency</Form.Text></div></Col>
													<Col xs={3}><div><Form.Text className="color-frame">Amount</Form.Text></div></Col>
													<Col xs={3}><div><Form.Text className="color-frame">Amount USD</Form.Text></div></Col>
													<Col xs={3}><div><Form.Text className="color-frame"></Form.Text></div></Col>
												</Row>
												<Row>
													<Col xs={3}>
														<Dropdown onSelect={onSelectToRefundCurrency}>
															<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
																{TO_REFUND_CURRENCY}
															</Dropdown.Toggle>

															<Dropdown.Menu className="w-100">
																{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
																	return (
																		<Dropdown.Item as="button" key={index} eventKey={item} active={TO_REFUND_CURRENCY == item}>
																			{item}
																		</Dropdown.Item>
																	);
																})}
															</Dropdown.Menu>
														</Dropdown>
													</Col>
													<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_REFUND_AMOUNT ? Number(TO_REFUND_AMOUNT) / 10**Number(ICO_PAYMENT_METHODS[TO_REFUND_CURRENCY!][3]) : 0} ></input></Col>
													<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_REFUND_AMOUNT_USD ? Number(TO_REFUND_AMOUNT_USD) / 10**6 : 0} ></input></Col>
													<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => refund()}> {KEY_ICON()} Refund</Button></Col>
												</Row>
											</Form.Group>

											<Row className="mb-3"></Row>
											<Form.Group className="p-3 border border-dark rounded bg-light-grey">
												<Row>
													<Col><div><div className="color-frame fs-4 text-center text-center w-100">Claim ERC-20</div></div></Col>
												</Row>
												<Row>
													<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => claim()}>Claim</Button></Col>
												</Row>
											</Form.Group>

										</Accordion.Body>
									</Accordion.Item>
								</Accordion>

								<Accordion className="mb-3 bg-semitransparent border rounded-3">
									<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
										<Accordion.Header>
											<Row className="w-100"><Col className="bg-label text-center h4 p-2">ERC-20 Operations</Col></Row>
										</Accordion.Header>
										<Accordion.Body className="px-0">

											<Form.Group className="p-3 border border-dark rounded bg-light-grey">
												<Row>
													<Col><div><div className="color-frame fs-4 text-center text-center w-100">Transfer</div></div></Col>
												</Row>

												<Row>
													<Col><div><Form.Text className="">To Address</Form.Text></div></Col>
												</Row>
												<Row>
													<Col><input type="email" className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onChange={(event) => setToTransferAddress(event.target.value) } value={TO_TRANSFER_ADDRESS} ></input></Col>
												</Row>

												<Row className="mb-3"></Row>
												<Row>
												<Col xs={3}><div><Form.Text className="color-frame">Currency</Form.Text></div></Col>
													<Col xs={3}><div><Form.Text className="color-frame">Amount</Form.Text></div></Col>
													<Col xs={3}><div><Form.Text className="color-frame">Amount USD</Form.Text></div></Col>
													<Col xs={3}><div><Form.Text className="color-frame"></Form.Text></div></Col>
												</Row>
												<Row>
													<Col xs={3}>
														<Dropdown onSelect={onSelectToTransferCurrency}>
															<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
																{TO_TRANSFER_CURRENCY}
															</Dropdown.Toggle>

															<Dropdown.Menu className="w-100">
																{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
																	return (
																		<Dropdown.Item as="button" key={index} eventKey={item} active={TO_TRANSFER_CURRENCY == item}>
																			{item}
																		</Dropdown.Item>
																	);
																})}
															</Dropdown.Menu>
														</Dropdown>
													</Col>
													<Col xs={3}><input id="buyAmount" type="number" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setToTransferAmount(event.target.value) } defaultValue={BALANCES_PAYMENT_TOKENS_ME_WALLET && BALANCES_PAYMENT_TOKENS_ME_WALLET[TO_TRANSFER_CURRENCY] && ICO_PAYMENT_METHODS[TO_TRANSFER_CURRENCY] ? Number(BALANCES_PAYMENT_TOKENS_ME_WALLET[TO_TRANSFER_CURRENCY].toString()) / 10**Number(ICO_PAYMENT_METHODS[TO_TRANSFER_CURRENCY][3]) : 0}></input></Col>
													<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_TRANSFER_AMOUNT_USD ? TO_TRANSFER_AMOUNT_USD : 0} ></input></Col>
													<Col xs={3}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => transfer()}>Transfer</Button></Col>
												</Row>
											</Form.Group>

										</Accordion.Body>
									</Accordion.Item>
								</Accordion>

							</Tab>

							<Tab eventKey="acc_inv" title="INVESTORS" className="bg-label mb-3 bg-light-grey">
							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************************* ICO Tab ********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="ico" title="ICO" className="bg-label mb-3 bg-light-grey p-3">

						<Tabs className="nav nav-fill" defaultActiveKey="ico_fea" transition={true}>

							<Tab eventKey="ico_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><Form.Text className="">Current ICO Stage</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="text" className="form-control form-control-lg color-frame text-center border-0" value={ICO_CURRENT_STAGE_TEXT} disabled={true}></input></Col>
										{ICO_CURRENT_STAGE == STAGE.NOT_STARTED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setCrowdsaleStage(STAGE.ONGOING)}> {KEY_ICON()} START </Button></Col> : "" }
										{ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setCrowdsaleStage(STAGE.ONHOLD)}> {KEY_ICON()} HOLD </Button></Col> : "" }
										{ICO_CURRENT_STAGE == STAGE.ONHOLD || ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setCrowdsaleStage(STAGE.ONGOING)}> {KEY_ICON()} CONTINUE </Button></Col> : "" }
										{ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.ONHOLD ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setCrowdsaleStage(STAGE.FINISHED)}> {KEY_ICON()} FINISH </Button></Col> : "" }
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Main Features</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Hard Cap (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="email" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_HARD_CAP} onChange={(event) => setICOHardCap(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOHardCapOnSC()}> {KEY_ICON()} HardCap</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Soft Cap (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="email" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_SOFT_CAP} onChange={(event) => setICOSoftCap(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOSoftCapOnSC()}> {KEY_ICON()} SoftCap</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="email" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_PRICE} onChange={(event) => setICOPrice(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOSPriceOnSC()}> {KEY_ICON()} ICO Price</Button></Col> : '' }
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Volumes</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Minimum Transfer (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MIN_TRANSFER / 10**6} onChange={(event) => setMinTransfer(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMinTransferOnSC()}> {KEY_ICON()} Min Transfer</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Maximum Transfer (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_TRANSFER / 10**6} onChange={(event) => setMaxTransfer(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMaxTransferOnSC()}> {KEY_ICON()} Max Transfer</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Maximum Investment (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_INVESTMENT / 10**6} onChange={(event) => setMaxInvestment(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMaxInvestmentOnSC()}> {KEY_ICON()} Max Investment</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Whitelist Threshold (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_WHITELIST_THRESHOLD} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setWhitelistThreshold(Number(event.target.value)) }></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setWhitelistThresholdOnSC()} disabled={!METAMASK_CURRENT_ACCOUNT} > {KEY_ICON()} Whitelist Threshold</Button></Col> : '' }
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Vested Percentage</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" ></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Vesting Program</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onSelectVestingId}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
													{VESTING_ID}
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{VESTING_IDS?.map(vestingId => {
														return (
															<Dropdown.Item as="button" key={vestingId} eventKey={vestingId} active={VESTING_ID == vestingId + ''}>
																{vestingId + ''}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
									</Row>
								</Form.Group>

								<Row className="mb-3" hidden={ ICO_CURRENT_STAGE != STAGE.NOT_CREATED }></Row>
								<Row hidden={ ICO_CURRENT_STAGE != STAGE.NOT_CREATED }>
									<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => createICO()} > {KEY_ICON()} Create Funding Round</Button></Col>
								</Row>

								<Row className="mb-3" hidden={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED }></Row>
								<Accordion className="mb-3 bg-semitransparent border rounded-3" hidden={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED } >
									<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
										<Accordion.Header>
											<Row className="w-100"><Col className="bg-label text-center p-2 h4">Antiwhale</Col></Row>
										</Accordion.Header>
										<Accordion.Body className="px-0">

											<Row className="mb-3"></Row>
											<Form.Group className="p-3 border border-dark rounded bg-light-grey">
												<Row>
													<Col><div><div className="color-frame fs-4 text-center text-center w-100">Whitelist</div></div></Col>
												</Row>
												<Row className="mb-3"></Row>
												<Accordion className="inner-accordion">
													<Accordion.Item className="border-0" eventKey="0">
													<Accordion.Header>
															<Row className="w-100">
																<Col className="text-center">
																	{ (ICO_WHITELIST_USER_COUNT === undefined ) ? "" : "" }
																	{ (ICO_WHITELIST_USER_COUNT != undefined && ICO_WHITELIST_USER_COUNT == 0 ) ? "Not whitelisted investors yet" : "" }
																	{ (ICO_WHITELIST_USER_COUNT != undefined && ICO_WHITELIST_USER_COUNT > 0) ? "Click to see " + ICO_WHITELIST_USER_COUNT + " whitelisted investors" : "" }
																</Col>
															</Row>
														</Accordion.Header>
														<Accordion.Body className="bg-frame">
															<Row className="mb-3">
																<table className="table table-dark">
																	<thead>
																		<tr>
																			<th scope="col">#</th>
																			<th scope="col">Investor</th>
																			<th scope="col">Amount</th>
																		</tr>
																	</thead>
																	<tbody>
																		{ICO_WHITELIST_USER_LIST?.map((item, index) => (
																			<tr key={index}>
																				<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => isWhitelisted(item, index+1)}>{(index + 1) + "" }</Button></td>
																				<td>{item}</td>
																				<td id={"whitelistedValue" + (index+1) }></td>
																			</tr>
																		))}
																	</tbody>
																</table>
															</Row>
														</Accordion.Body>
													</Accordion.Item>
												</Accordion>

												<Row className="mb-3"></Row>
												<Row>
													<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
													<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT}  onClick={() => whitelistUser(true)}> {KEY_ICON()} Whitelist Investor</Button></Col>
												</Row>
												<Row className="mb-3"></Row>
												<Row>
													<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
													<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => whitelistUser(false)}> {KEY_ICON()} Unwhitelist Investor</Button></Col>
												</Row>

											</Form.Group>

											<Row className="mb-3"></Row>
											<Form.Group className="p-3 border border-dark rounded bg-light-grey">
												<Row>
													<Col><div><div className="color-frame fs-4 text-center text-center w-100">Blacklist</div></div></Col>
												</Row>
												<Row className="mb-3"></Row>

												<Row className="mb-3"></Row>
												<Row>
													<Col><Form.Check type="checkbox" label="Exclude blacklisted investors" className="color-frame"  onChange={setIsBlacklist} defaultChecked={ICO_IS_USE_BLACKLIST} /></Col>
												</Row>

												<Row className="mb-3"></Row>
												{ ICO_IS_USE_BLACKLIST ?
												<Accordion className="inner-accordion">
													<Accordion.Item className="border-0" eventKey="0">
													<Accordion.Header>
															<Row className="w-100">
																<Col className="text-center">
																	{ (ICO_BLACKLIST_USER_COUNT === undefined ) ? "" : "" }
																	{ (ICO_BLACKLIST_USER_COUNT != undefined && ICO_BLACKLIST_USER_COUNT == 0 ) ? "Not blacklisted investors yet" : "" }
																	{ (ICO_BLACKLIST_USER_COUNT != undefined && ICO_BLACKLIST_USER_COUNT > 0) ? "Click to see " + ICO_BLACKLIST_USER_COUNT + " blacklisted investors" : "" }
																</Col>
															</Row>
														</Accordion.Header>
														<Accordion.Body className="bg-frame">
															<Row className="mb-3">
																<table className="table table-dark">
																	<thead>
																		<tr>
																			<th scope="col">#</th>
																			<th scope="col">Investor</th>
																			<th scope="col">Amount</th>
																		</tr>
																	</thead>
																	<tbody>
																		{ICO_BLACKLIST_USER_LIST?.map((item, index) => (
																			<tr key={index}>
																				<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT}  onClick={() => isBlacklisted(item, index+1)}>{(index + 1) + "" }</Button></td>
																				<td>{item}</td>
																				<td id={"blacklistedValue" + (index+1) }></td>
																			</tr>
																		))}
																	</tbody>
																</table>
															</Row>
															<Row>
																<Col><input id="blacklistUser" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
																<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => blacklistUser('blacklistUser', true)}> {KEY_ICON()} Blacklist Investor</Button></Col>
															</Row>
															<Row className="mb-3"></Row>
															<Row>
																<Col><input id="unblacklistUser" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
																<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => blacklistUser('unblacklistUser', false)}> {KEY_ICON()} UnBlacklist Investor</Button></Col>
															</Row>
														</Accordion.Body>
													</Accordion.Item>
												</Accordion>
												: "" }

											</Form.Group>

										</Accordion.Body>
									</Accordion.Item>
								</Accordion>

							</Tab>

							<Tab eventKey="ioc_pay" title="PAYMENT" className="bg-label mb-3 bg-light-grey" disabled={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED }>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Payment Tokens</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">List of Payment Tokens</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onSelectPaymentMethod}>
												<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
													{ ICO_PAYMENT_SYMBOL_SYMBOL }
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={ICO_PAYMENT_SYMBOL_SYMBOL == item}>
																{item}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col xs={4}><div><Form.Text className="color-frame">Symbol</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame" dir="rtl">Address</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Decimals</Form.Text></div></Col>
									</Row>

									<Row>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setPaymentSymbolSymbol(event.target.value)} value={ICO_PAYMENT_SYMBOL_SYMBOL ? ICO_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setPaymentSymbolAddress(event.target.value)} value={ICO_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(ICO_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setPaymentSymbolDecimals(event.target.value)} value={ICO_PAYMENT_SYMBOL_DECIMALS ? ICO_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
									</Row>

									<Row>
										<Col xs={4}><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Ref</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
									</Row>

									<Row>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setPaymentSymbolPrice(event.target.value)} value={ICO_PAYMENT_SYMBOL_PRICE ? ICO_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setPaymentSymbolRef(event.target.value)} value={ICO_PAYMENT_SYMBOL_REF ? truncateEthAddress(ICO_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ ICO_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
									</Row>

									<Row className="mb-3"></Row>

									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => deletePaymentMethod()}>{KEY_ICON()} Delete</Button></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => savePaymentMethod()}>{KEY_ICON()} Save</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelPaymentMethod()}>Cancel</Button></Col>
									</Row>

									<Row className="mb-3"></Row>

								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Dynamic Prices</div></div></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col><Form.Check type="checkbox" label="Dynamic Prices" className="color-frame"  onChange={setDynamicPriceSC} defaultChecked={DYNAMIC_PRICE} /></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
									</Row>

									<Row>
										<Col><div><Form.Text className="">Address</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={9}><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onChange={(event) => setPaymentMethodSearchAddress(event.target.value) } value={ICO_PAYMENT_METHOD_SEARCH_ADDRESS} dir="rtl" ></input></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onClick={()=>{ getPaymentMethodBalance(); }} >Balances</Button></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Balance</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg text-center border-0" disabled={true} value={ICO_PAYMENT_METHOD_SEARCH_BALANCE} ></input></Col>
									</Row>
								</Form.Group>

							</Tab>

							<Tab eventKey="ico_con" title="CONTRACT" className="bg-label mb-3 bg-light-grey" disabled={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED }>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallet</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">ICO Contract Address</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="email" className="form-control form-control-lg color-frame border-0 text-center" disabled={true} value={getMETAMASK_CHAINS().find(function (el: any) { return parseInt(el.id) == METAMASK_CHAIN_ID; })?.ico_address || ''}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">ICO Contract Owner</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="email" className="form-control form-control-lg color-frame border-0 text-center" defaultValue={ICO_OWNER} disabled={true}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Pending ICO Contract Owner</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={12}><input dir="rtl" type="email" className="form-control form-control-lg bg-yellow color-frame border-0 text-center" defaultValue={ICO_PENDING_OWNER} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setICOPendingOwner(event.target.value)} ></input></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ICO_PENDING_OWNER != undefined} onClick={() => setNewICOOwner()}> {KEY_ICON()} Transfer</Button></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!ICO_PENDING_OWNER} onClick={() => acceptNewICOOwner()}> {KEY_ICON()} Accept</Button></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
									</Row>

									<Row>
										<Col xs={3}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In Tokens</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
										<Col xs={7}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In ICO</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={3}><div className="text-center"><Form.Text className="text-center">Available</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
										<Col xs={2}><div className="text-center"><Form.Text className="text-center">Invested</Form.Text></div></Col>
										<Col xs={2}><div className="text-center"><Form.Text className="text-center">Inv USD</Form.Text></div></Col>
										<Col xs={3}><div className="text-center"><Form.Text className="text-center">ERC-20 Bought</Form.Text></div></Col>
									</Row>
									{ICO_PAYMENT_SYMBOLS?.map((item: string, index: any) => (
										<Row className="mb-3" key={index}>
											<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_ICO_WALLET && BALANCES_PAYMENT_TOKENS_ICO_WALLET[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_PAYMENT_TOKENS_ICO_WALLET[item].toString()) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
											<Col xs={2}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={true}> {item}</Button></Col>
											<Col xs={2}><input className="form-control form-control-lg color-frame border-0" value={ ICO_PAYMENT_METHODS[item] && ICO_PAYMENT_METHODS[item][5] ? Number(ICO_PAYMENT_METHODS[item][5]) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0 } disabled={true}></input></Col>
											<Col xs={2}><input className="form-control form-control-lg color-frame border-0" value={ ICO_PAYMENT_METHODS[item] && ICO_PAYMENT_METHODS[item][4] ? Number(ICO_PAYMENT_METHODS[item][4]) / 10**6 : 0 } disabled={true}></input></Col>
											<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={ ICO_PAYMENT_METHODS[item] && ICO_PAYMENT_METHODS[item][4] ? Number(ICO_PAYMENT_METHODS[item][4]) / ICO_PRICE : 0 } disabled={true}></input></Col>
										</Row>
									))}
									<Row>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ICO_WALLET}></input></Col>
										<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >ERC-20</Button></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame border-0" value={ ICO_TOTAL_uUSD_INVESTED / 10**6 } disabled={true}></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={ ICO_TOTAL_uUSD_INVESTED / ICO_PRICE } disabled={true}></input></Col>
									</Row>
									<Row className="mb-3"></Row>
									{METAMASK_CURRENT_ACCOUNT ?
									<Row>
										<Col><div className="text-center"><Form.Text className=""> * Invested and available amounts should match</Form.Text></div></Col>
									</Row>
									: '' }
								</Form.Group>
								
							</Tab>

							<Tab eventKey="ico_inv" title="INVESTORS" className="bg-label mb-3 bg-light-grey" disabled={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED }>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallets</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">List of Investors</Form.Text></div></Col>
									</Row>
									<Row className="mb-3">
										<table className="table table-dark">
											<thead>
												<tr>
													<th scope="col">#</th>
													<th scope="col">Investor</th>
													<th scope="col">Amount</th>
												</tr>
											</thead>
											<tbody>
												{ICO_INVESTORS_LIST?.map((item, index) => (
													<tr key={index}>
														<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={()=>{ setPaymentMethodsSearchAddress(item); }}> </Button></td>
														<td>{item}</td>
														<td id={"weiContributedByValue" + (index+1) }></td>
													</tr>
												))}
											</tbody>
										</table>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
									</Row>

									<Row>
										<Col><div><Form.Text className="">Address</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={9}><input type="email" className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onChange={(event) => setPaymentMethodsSearchAddress(event.target.value) } value={PAYMENT_METHODS_SEARCH_ADDRESS} ></input></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onClick={()=>{ getBalancesPaymentMethodsSearchAddress(); getBalancesRawICOSearchAddressWallet(); getBalancesUSDICOSearchAddressWallet(); getBalancesCygasSearchAddress(); }}>Balances</Button></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col xs={3}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In Tokens</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
										<Col xs={7}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In ICO</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={3}><div className="text-center"><Form.Text className="text-center">Available</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
										<Col xs={2}><div className="text-center"><Form.Text className="text-center">Invested</Form.Text></div></Col>
										<Col xs={2}><div className="text-center"><Form.Text className="text-center">Inv USD</Form.Text></div></Col>
										<Col xs={3}><div className="text-center"><Form.Text className="text-center">ERC-20 Bought</Form.Text></div></Col>
									</Row>
									{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => (
									<Row className="mb-3" key={index} >
										<Col xs={3}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS && BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS[item].toString()) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
										<Col xs={2}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >{item}</Button></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET && BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET[item]) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item].toString()) / 10**6 : 0}></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item].toString()) / ICO_PRICE : 0}></input></Col>
									</Row>
									))}

									<Row>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_SEARCH_ADDRESS}></input></Col>
										<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >ERC-20</Button></Col>
										<Col xs={2}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL'] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL']) / 10**6 : 0}></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL'] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL']) / ICO_PRICE : 0}></input></Col>
									</Row>

								</Form.Group>

							</Tab>

							<Tab eventKey="ico_ops" title="OPERATIONS" className="bg-label mb-3 bg-light-grey" disabled={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED }>
								<Row className="mb-3"></Row>

								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Refunds</div></div></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col xs={3}><div><Form.Text className="color-frame">Currency</Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame">Amount</Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame">Amount USD</Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame"></Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={3}>
											<Dropdown onSelect={onSelectToRefundAllCurrency}>
												<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
													{TO_REFUND_ALL_CURRENCY}
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={TO_REFUND_ALL_CURRENCY == item}>
																{item}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_REFUND_ALL_AMOUNT ? Number(TO_REFUND_ALL_AMOUNT) /  10**Number(ICO_PAYMENT_METHODS[TO_REFUND_ALL_CURRENCY!][3]) : 0} ></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_REFUND_ALL_AMOUNT_USD ? Number(TO_REFUND_ALL_AMOUNT_USD) / 10**6 : 0} ></input></Col>
										<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => refundAll()}> {KEY_ICON()} Refund All</Button></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Claim ERC-20 to Investors</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Enter Token</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setTokenAddress(event.target.value)} value={TOKEN_ADDRESS} ></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={setGasClickToken}> {KEY_ICON()} Update</Button></Col>
									</Row>
									<Row className="mb-3"></Row>

									<Row>
										<Col><div><Form.Text className="color-frame">Allowance to ICO Required</Form.Text></div></Col>
										<Col><div><Form.Text className="color-frame">Allowance to ICO Approved</Form.Text></div></Col>
										<Col><div><Form.Text className="color-frame"></Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={Number(ICO_ALLOWANCE_REQUIRED.toString()) / 10**18} ></input></Col>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={Number(ICO_ALLOWANCE_APPROVED.toString()) / 10**18} ></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={approveAllowanceToICO}> {KEY_ICON()} Approve</Button></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row><Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => claimAll()}> {KEY_ICON()}Claim All Investors</Button></Col></Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Withdraw to Wallets</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Enter Target Wallet</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" value={WITHDRAW_TARGET_ADDRESS} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setWithdrawTargetAddress(event.target.value)} ></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setTargetWalletAddress()}> {KEY_ICON()} Update</Button></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col xs={3}><div><Form.Text className="color-frame"></Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame">Available</Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame">% To Withdraw</Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame">To Withdraw</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={3}>
											<Dropdown onSelect={onSelectToWitdrawCurrency}>
												<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
													{WITHDRAW_CURRENCY}
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={WITHDRAW_CURRENCY == item}>
																{item}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={BALANCES_PAYMENT_TOKENS_ICO_WALLET && BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY] ? Number(BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY]) / 10**Number(ICO_PAYMENT_METHODS[WITHDRAW_CURRENCY][3]) : 0} disabled={true}></input></Col>
										<Col xs={3}><input className="form-control form-control-lg bg-yellow color-frame border-0" value={WITHDRAW_PERCENTAGE} onChange={(event) => setWithdrawPercentage(event.target.value)} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={BALANCES_PAYMENT_TOKENS_ICO_WALLET && BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY] ? (Number(BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY]) / 10**Number(ICO_PAYMENT_METHODS[WITHDRAW_CURRENCY][3])) * Number(WITHDRAW_PERCENTAGE) / 100 : 0} disabled={true}></input></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => withdrawICO()}> {KEY_ICON()}Withdraw</Button></Col>
									</Row>
								</Form.Group>

								
							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************************ VESTING tab *****************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="VESTING" title="VESTING" className="bg-label mb-3 bg-light-grey p-3">

						<Tabs className="nav nav-fill" defaultActiveKey="ves_ops" transition={true}>

							<Tab eventKey="ves_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey p-3">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Id</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" value={VESTING_START + '-' + VESTING_CLIFF + '-' + VESTING_DURATION + '-' + VESTING_NUM_SLIDES} disabled={true}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Start</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="date" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_START} onChange={(event) => setVestingStart(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Cliff (days)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_CLIFF} onChange={(event) => setVestingCliff(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Duration (days)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_DURATION} onChange={(event) => setVestingDuration(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Number Slides</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_NUM_SLIDES} onChange={(event) => setVestingNumSlides(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => createVesting()}> {KEY_ICON()}Create Vesting</Button></Col>
									</Row>

								</Form.Group>

							</Tab>

							<Tab eventKey="ves_con" title="CONTRACT" className="bg-label mb-3 bg-light-grey p-3">
							</Tab>

							<Tab eventKey="ves_inv" title="HOLDERS" className="bg-label mb-3 bg-light-grey p-3">


							</Tab>

							<Tab eventKey="ves_ope" title="OPERATIONS" className="bg-label mb-3 bg-light-grey p-3">
							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* *********************************************************** ERC-20 Tab ********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="token" title="ERC-20" className="bg-label mb-3 bg-light-grey p-3">

						<Form.Group className="p-3 border border-dark rounded bg-light-grey">
							<Row>
								<Col><div><div className="color-frame fs-4 text-center text-center w-100">Token</div></div></Col>
							</Row>
							<Row>
								<Col><div><Form.Text className="">Token Contract Address</Form.Text></div></Col>
							</Row>
							<Row>
								<Col xs={9}><input type="email" className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!METAMASK_CURRENT_ACCOUNT} value={TOKEN_ADDRESS || ''}></input></Col>
								<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={connectTokenContract}>Connect</Button></Col>
							</Row>
							<Row>
								<Col><div><Form.Text className="">Token Contract Owner</Form.Text></div></Col>
							</Row>
							<Row>
								<Col xs={9}><input id="tokenowner" type="email" className="form-control form-control-lg bg-yellow color-frame border-0" value={TOKEN_OWNER} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
								<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setNewTokenOwner('tokenowner')}> {KEY_ICON()} Update</Button></Col>
							</Row>
						</Form.Group>

						<Row className="mb-3"></Row>

						<Form.Group className="p-3 border border-dark rounded bg-light-grey">
							<Row>
								<Col><div><div className="color-frame fs-4 text-center text-center w-100">Investors Balance</div></div></Col>
							</Row>
							<Row>
								<Col><div><Form.Text className="">Enter Investor Address</Form.Text></div></Col>
							</Row>
							<Row>
								<Col><input id="balanceInvestor" className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
							</Row>
							<Row className="mb-3"></Row>
							<Row>
								<Col xs={9}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={INVESTOR_BALANCE}></input></Col>
								<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => getBalanceOf('balanceInvestor')}>Balance</Button></Col>
							</Row>
						</Form.Group>

						<Row className="mb-3"></Row>

						<Form.Group className="p-3 border border-dark rounded bg-light-grey">
							<Row>
								<Col><div><div className="color-frame fs-4 text-center text-center w-100">Investors Allowance</div></div></Col>
							</Row>
							<Row>
								<Col><div><Form.Text className="">Allowance From Investor Address</Form.Text></div></Col>
							</Row>
							<Row>
								<Col><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setTokenSearchAllowanceFromAddress(event.target.value) }></input></Col>
							</Row>
							<Row>
								<Col><div><Form.Text className="">Allowance to Investor Address</Form.Text></div></Col>
							</Row>
							<Row>
								<Col><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setTokenSearchAllowanceToAddress(event.target.value) }></input></Col>
							</Row>
							<Row className="mb-3"></Row>
							<Row>
								<Col xs={9}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={TOKEN_SEARCH_ALLOWANCE} ></input></Col>
								<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={getAllowance}>Allowance</Button></Col>
							</Row>
						</Form.Group>

						<Row className="mb-3"></Row>

						<Accordion className="mb-3 bg-semitransparent border rounded-3">
							<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
								<Accordion.Header>
									<Row className="w-100"><Col className="bg-label text-center h4 p-2">Token</Col></Row>
								</Accordion.Header>
								<Accordion.Body className="px-0">



								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

						<Accordion className="mb-3 bg-semitransparent border rounded-3">
							<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
								<Accordion.Header>
									<Row className="w-100"><Col className="bg-label text-center p-2 h4">Supplies</Col></Row>
								</Accordion.Header>
								<Accordion.Body className="px-0">

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Supply</div></div></Col>
										</Row>
										<Row>
											<Col><div><Form.Text className="">Token Contract Balance</Form.Text></div></Col>
										</Row>
										<Row>
											<Col><input type="number" className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={TOKEN_BALANCE}></input></Col>
										</Row>
										<Row className="mb-3"></Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Mint</div></div></Col>
										</Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Burn</div></div></Col>
										</Row>
									</Form.Group>

								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

						<Accordion className="mb-3 bg-semitransparent border rounded-3">
							<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
								<Accordion.Header>
									<Row className="w-100"><Col className="bg-label text-center p-2 h4">Transfer</Col></Row>
								</Accordion.Header>
								<Accordion.Body className="px-0">


								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

						<Accordion className="mb-3 bg-semitransparent border rounded-3">
							<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
								<Accordion.Header>
									<Row className="w-100"><Col className="bg-label text-center p-2 h4">Liquidity</Col></Row>
								</Accordion.Header>
								<Accordion.Body className="px-0">

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Swap and Liquify</div></div></Col>
										</Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Swapback</div></div></Col>
										</Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Buyback</div></div></Col>
										</Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Rebase</div></div></Col>
										</Row>
									</Form.Group>

								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

						<Accordion className="mb-3 bg-semitransparent border rounded-3">
							<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
								<Accordion.Header>
									<Row className="w-100"><Col className="bg-label text-center p-2 h4">Rewards</Col></Row>
								</Accordion.Header>
								<Accordion.Body className="px-0">

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Withdraw</div></div></Col>
										</Row>
										<Row>
											<Col><div><Form.Text className="color-frame">Fees</Form.Text></div></Col>
										</Row>
										<Row>
											<Col xs={9}><input type="email" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
											<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => refund()}>ToDo</Button></Col>
										</Row>
										<Row>
											<Col><div><Form.Text className="color-frame">Wallets</Form.Text></div></Col>
										</Row>
										<Row>
											<Col xs={9}><input type="email" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
											<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => refund()}>ToDo</Button></Col>
										</Row>
										<Row>
											<Col><div><Form.Text className="color-frame">Withdraw</Form.Text></div></Col>
										</Row>
										<Row>
											<Col xs={9}><input type="email" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
											<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => refund()}>ToDo</Button></Col>
										</Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Reflections</div></div></Col>
										</Row>
									</Form.Group>

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Dividends</div></div></Col>
										</Row>
									</Form.Group>

								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************** Target Wallet Tab *********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="target" title="REWARDS" className="bg-label mb-3 bg-light-grey p-3">

						<Form.Group className="p-3 border border-dark rounded bg-light-grey">
							<Row>
								<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallet</div></div></Col>
							</Row>
							<Row>
								<Col><div><Form.Text className="">Target Contract Address</Form.Text></div></Col>
							</Row>
							<Row>
								<Col xs={9}><input type="email" className="form-control form-control-lg bg-yellow text-center border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setTargetWallet(event.target.value) } value={ICO_TARGET_WALLET} ></input></Col>
								<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={populateTargetContract}>Connect</Button></Col>
							</Row>
						</Form.Group>

						<Row className="mb-3"></Row>

						<Form.Group className="p-3 border border-dark rounded bg-light-grey">
							<Row>
								<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
							</Row>

							<Row>
								<Col xs={4}><div className="text-center"><Form.Text className="text-center"></Form.Text></div></Col>
								<Col xs={4}><div className="text-center"><Form.Text className="text-center">Available</Form.Text></div></Col>
								<Col xs={4}><div className="text-center"><Form.Text className="text-center">Available USD</Form.Text></div></Col>
							</Row>
							{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => (
							<Row className="mb-3" key={index} >
								<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >{item}</Button></Col>
								<Col xs={4}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET && BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET[item] ? Number(BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET[item]) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
								<Col xs={4}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET && BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET[item] ? (Number(BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET[item]) / 10**Number(ICO_PAYMENT_METHODS[item][3])) * (Number(ICO_PAYMENT_METHODS[item][2]) / 10**6) : 0}></input></Col>
							</Row>
							))}
							<Row>
								<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >ERC-20</Button></Col>
								<Col xs={4}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET && BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET['TOTAL'] ? Number(BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET['TOTAL']) / 10**6 : 0}></input></Col>
								<Col xs={4}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET && BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET['TOTAL'] ? Number(BALANCES_PAYMENT_TOKENS_LIQUIDITY_WALLET['TOTAL']) / ICO_PRICE : 0}></input></Col>
							</Row>

						</Form.Group>

						<Row className="mb-3"></Row>
						<Accordion className="mb-3 bg-semitransparent border rounded-3">
							<Accordion.Item className="border-0 bg-semitransparent" eventKey="0">
								<Accordion.Header>
									<Row className="w-100"><Col className="bg-label text-center h4 p-2">Transfer</Col></Row>
								</Accordion.Header>
								<Accordion.Body className="px-0">

									<Form.Group className="p-3 border border-dark rounded bg-light-grey">
										<Row>
											<Col><div><div className="color-frame fs-4 text-center text-center w-100">Transfer</div></div></Col>
										</Row>

										<Row>
											<Col><div><Form.Text className="">To Address</Form.Text></div></Col>
										</Row>
										<Row>
											<Col><input type="email" className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onChange={(event) => setToTransferAddress(event.target.value) } value={TO_TRANSFER_ADDRESS} ></input></Col>
										</Row>

										<Row className="mb-3"></Row>
										<Row>
											<Col xs={3}><div><Form.Text className="color-frame">Amount</Form.Text></div></Col>
											<Col xs={6}><div><Form.Text className="color-frame">Currency</Form.Text></div></Col>
											<Col xs={3}><div><Form.Text className="color-frame"></Form.Text></div></Col>
										</Row>
										<Row>
											<Col xs={3}><input id="buyAmount" type="number" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setToTransferAmount(event.target.value) } value={TO_TRANSFER_AMOUNT}></input></Col>
											<Col xs={6}>
												<Dropdown onSelect={onSelectToTransferCurrency}>
													<Dropdown.Toggle id="dropdown-header" className="btn-lg bg-yellow text-black-50 w-100">
														{TO_TRANSFER_CURRENCY}
													</Dropdown.Toggle>

													<Dropdown.Menu className="w-100">
														{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
															return (
																<Dropdown.Item as="button" key={index} eventKey={item} active={TO_TRANSFER_CURRENCY == item}>
																	{item}
																</Dropdown.Item>
															);
														})}
													</Dropdown.Menu>
												</Dropdown>
											</Col>
											<Col xs={3}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => transfer()}>Transfer</Button></Col>
										</Row>
									</Form.Group>

								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

					</Tab>

				</Tabs>

			</div>

    </>
  )
}

export default Home
