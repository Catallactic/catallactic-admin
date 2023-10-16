// src/pages/index.tsx
import {Contract, ethers, utils} from "ethers"

import { useState, useEffect, ChangeEvent } from "react";
import type { NextPage } from 'next'

import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Accordion from 'react-bootstrap/Accordion';
import Dropdown from 'react-bootstrap/Dropdown';
import ListGroup from 'react-bootstrap/ListGroup';
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

declare let window:any

const Home: NextPage = () => {

	// ***********************************************************************************************
	// ******************************************** Config *******************************************
	// ***********************************************************************************************
	// not elegant but works for the moment - concatenate in one would be one option
	const CFG_FACTORY_ABI = require('../abi/CryptocommoditiesFactory.json');
	const CFG_SELECTED_CRYPTOCOMMODITIY_ABI = require('../abi/Diamond.json');
	const CFG_DIAMOND_CUT_ABI = require('../abi/DiamondCutFacet.json');
	const CFG_DIAMOND_LOUPE_ABI = require('../abi/DiamondLoupeFacet.json');
	const CFG_COMMON_ABI = require('../abi/CommonFacet.json');
	const CFG_CROWDSALE_ABI = require('../abi/CrowdsaleFacet.json');
	const CFG_VESTING_ABI = require('../abi/VestingFacet.json');
	const CFG_ERC_20_ABI = require('../abi/ERC20Facet.json');

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


	const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }
	let getSelectors = function (signatures: string[] ) {
		return signatures.reduce((acc: string[], val) => {
				if (val !== 'init(bytes)') {
						acc.push(utils.id(val).substring(0, 10));
				}
				return acc;
		}, []);
	}
	let removeSelectors = function (selectors: string[], removeSelectors: string[]) {
		selectors = selectors.filter(v => !removeSelectors.includes(v))
		return selectors
	}
	let logSelectors = function (contract:Contract) {
		const signatures: string[] = Object.keys(contract.interface.functions);
		return signatures.reduce((acc: string[], val) => {
			console.log(val + '->' + contract.interface.getSighash(val));
			return acc;
		}, []);
	}

	// ***********************************************************************************************
	// ****************************************** Metamask *******************************************
	// ***********************************************************************************************
  const [METAMASK_INSTALLED, setMetamaskInstalled] = useState<boolean | undefined>()
  const [METAMASK_PROVIDER, setMetamaskProvider] = useState<ethers.providers.Web3Provider | undefined>()
  const [METAMASK_SIGNER, setMetamaskSigner] = useState<any | undefined>()
  const [METAMASK_CHAIN_ID, setChainId] = useState<number | undefined>()
	const [METAMASK_CHAIN_NAME, setChainName] = useState<string | undefined>()
	const [METAMASK_CHAIN_TIME_IN_MS, setChainTimeInMs] = useState<number>(0);

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
		console.log('useEffect1');
		console.log("MetaMask installed " + window.ethereum !== undefined);
		setMetamaskInstalled(window.ethereum !== undefined);
	}, [METAMASK_CHAIN_ID]);

	// ***********************************************************************************************
	// ************************************** Metamask Network ***************************************
	// ************************************ (On Connect Metamask) ************************************
	// ***********************************************************************************************
	useEffect(() => {
		console.log('useEffect2');
		console.log('METAMASK_INSTALLED', METAMASK_INSTALLED);
		console.log('METAMASK_INSTALLED', getMETAMASK_CHAINS());
		if(!METAMASK_INSTALLED) {
			console.log("please install MetaMask")
			return
		}

		// get network
    const provider = new ethers.providers.Web3Provider(window.ethereum)
		if(!provider)
			return;

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
		if(!METAMASK_INSTALLED) {
			console.log("please install MetaMask")
			return
		}

		console.log('useEffect3');
		console.log('METAMASK_CHAIN_ID', METAMASK_CHAIN_ID);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();
		const factory_address: string = getMETAMASK_CHAINS()!.find(function (el: any) { return parseInt(el.id) == METAMASK_CHAIN_ID; })?.factory_address || '';
		const factory: Contract = new ethers.Contract(factory_address, CFG_FACTORY_ABI, signer);
		setFactoryContract(factory);

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
	// ************************************* CryptocommoditiesFactory ********************************
	// ***********************************************************************************************
	const [FACTORY_CONTRACT, setFactoryContract] = useState<Contract>()

	// ***********************************************************************************************
	// ********************************* Factory Payments Tokens *************************************
	// ***********************************************************************************************
	const [FACTORY_PAYMENT_SYMBOLS, setFactoryPaymentSymbols] = useState<any | undefined>()
	const [FACTORY_PAYMENT_METHODS, setFactoryPaymentMethods] = useState<MapType>({})
	const [FACTORY_PAYMENT_SYMBOL_SYMBOL, setFactoryPaymentSymbolSymbol] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DECIMALS, setFactoryPaymentSymbolDecimals] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_ADDRESS, setFactoryPaymentSymbolAddress] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_PRICE, setFactoryPaymentSymbolPrice] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_REF, setFactoryPaymentSymbolRef] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DYN_PRICE, setFactoryPaymentSymbolDynPrice] = useState<any | undefined>()

	const onFactorySelectPaymentMethod = async (symbol: any)=>{
		console.log('selectPaymentMethod', symbol);

		let paymentMethod = await FACTORY_CONTRACT?.getPaymentToken(symbol);
		console.log('paymentMethod', paymentMethod);
		setFactoryPaymentSymbolSymbol(symbol);
		setFactoryPaymentSymbolAddress(paymentMethod[0]);
		setFactoryPaymentSymbolRef(paymentMethod[1]);
		setFactoryPaymentSymbolPrice(paymentMethod[2]);
		setFactoryPaymentSymbolDecimals(paymentMethod[3]);

		try {
			let dynPrice = await FACTORY_CONTRACT?.getUusdPerToken(symbol);
			console.log('dynPrice' + dynPrice);
			setFactoryPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setFactoryPaymentSymbolDynPrice(0);
		}

	}

	async function saveFactoryPaymentMethod() {
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_SYMBOL);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_ADDRESS);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_REF);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_PRICE);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_DECIMALS);
		FACTORY_CONTRACT?.setPaymentToken(FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_DECIMALS)
			.then(await loadFactoryPaymentMethod)
			.catch(handleError);

		cancelFactoryPaymentMethod();
	}
	
	async function cancelFactoryPaymentMethod() {
		console.log('cancelFactoryPaymentMethod');

		setFactoryPaymentSymbolSymbol(undefined);
		setFactoryPaymentSymbolAddress(undefined);
		setFactoryPaymentSymbolRef(undefined);
		setFactoryPaymentSymbolPrice(undefined);
		setFactoryPaymentSymbolDecimals(undefined);
	}

	async function deleteFactoryPaymentMethod() {
		console.log('deleteFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_SYMBOL);

		let tx = await FACTORY_CONTRACT?.deletePaymentToken(FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOLS.indexOf(FACTORY_PAYMENT_SYMBOL_SYMBOL));
		await tx.wait();

		populateICOContractData();
		cancelICOPaymentMethod();
	}

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

	// ***********************************************************************************************
	// ******************************************* Facets ********************************************
	// ***********************************************************************************************
	const [FACTORY_FACET_TYPES, setFactoryFacetTypes] = useState([]);
	const [FACTORY_FACETS, setFactoryFacets] = useState<MapType>({})

	const onSelectFacet = async (facetName: any, pp: any)=>{
		console.log('onSelectFacet', facetName);
		console.log('onSelectFacet', pp);
		console.log('onSelectFacet', FACTORY_FACETS[facetName][0]);
		console.log('onSelectFacet', FACTORY_FACETS[facetName][1]);

		//let contract = await ethers.getContractAt('DiamondLoupeFacet', FACTORY_FACETS[facetName][1]);
		

	}

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

	// ***********************************************************************************************
	// ************************************* Cryptocommodities ***************************************
	// ***********************************************************************************************
	const [CRYPTOCOMMODITIES, setCryptocommodities] = useState([]);

	const [SELECTED_CRYPTOCOMMODITY_CONTRACT, setSelectedCryptocommodityContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT, setSelectedCryptocommodityDiamondCutContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT, setSelectedCryptocommodityDiamondLoupeContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT, setSelectedCryptocommodityCommonContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT, setSelectedCryptocommodityVestingContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT, setSelectedCryptocommodityTokenContract] = useState<Contract>()

	const [SELECTED_CRYPTOCOMMODITY_NAME, setSelectedCryptocommodityName] = useState<string>('');
	const [SELECTED_CRYPTOCOMMODITY_ADDRESS, setSelectedCryptocommodityAddress] = useState<string>('');
	const [SELECTED_CRYPTOCOMMODITY_FACETS, setSelectedCryptocommodityFacets] = useState<any>();
	const [ADD_CRYPTOCOMMODITY_NAME, setAddCryptocommodityName] = useState<string>('');

	async function unselectCryptocommodity() {
		console.log("unselectCryptocommodity");
		setSelectedCryptocommodityName('');
		setSelectedCryptocommodityAddress('');
		setAddCryptocommodityName('');
	}
	async function saveCryptocommodity() {
		console.log('saveCryptocommodity', ADD_CRYPTOCOMMODITY_NAME);

		const tx = await FACTORY_CONTRACT?.createCryptocommodity(ADD_CRYPTOCOMMODITY_NAME);
		const receipt = await tx.wait();

		loadCryptocommodities();
	}

	async function loadCryptocommodities() {
		console.log("fetching cryptocommodities for user");

		let cryptocommodities = await FACTORY_CONTRACT?.getCryptocommodities();
		console.log("cryptocommodities: " + cryptocommodities);
		setCryptocommodities(cryptocommodities);
		
		unselectCryptocommodity();
	}

	async function loadCryptocommodityFacets() {
		let facets = await SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT?.facets();
		console.log("loadCryptocommodityFacets: ", facets);
		setSelectedCryptocommodityFacets(facets);
	}

	async function installFacet(facetName: string) {
		console.log("installFacet ", facetName);

		let selectors: any = [];
		let commonSelectors = getSelectors(Object.keys(SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT?.interface.functions!))
		if (facetName == 'DiamondCutFacet') selectors = [];
		else if (facetName == 'DiamondLoupeFacet') selectors = getSelectors(Object.keys(SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT?.interface.functions!));
		else if (facetName == 'CommonFacet') selectors = getSelectors(Object.keys(SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT?.interface.functions!));
		else if (facetName == 'CrowdsaleFacet') selectors = removeSelectors(getSelectors(Object.keys(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.interface.functions!)), commonSelectors);
		else if (facetName == 'VestingFacet') selectors = removeSelectors(getSelectors(Object.keys(SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.interface.functions!)), commonSelectors);
		else if (facetName == 'ERC20Facet') selectors = removeSelectors(getSelectors(Object.keys(SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.interface.functions!)), commonSelectors);
		console.log("selectors ", selectors);

		// would need to merge abi files
		let tx = await SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT?.diamondCut([{ 
			facetAddress: FACTORY_FACETS[facetName][1],
			action: FacetCutAction.Add,
			functionSelectors: selectors,
		}]);
		await tx.wait();

		loadCryptocommodityFacets();

		console.log("installFacet end", facetName);
	}
	async function uninstallFacet(facetName: string) {
		console.log("uninstallFacet ", facetName);
	}

	async function findCryptocommodity() {
		console.log("ADD_CRYPTOCOMMODITY_NAME: ", ADD_CRYPTOCOMMODITY_NAME);
		onSelectCryptocommodity(ADD_CRYPTOCOMMODITY_NAME);
	}

	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);

		let cryptocommodityAddress = await FACTORY_CONTRACT?.getCryptocommodity(cryptocommodityName);
		setSelectedCryptocommodityName(cryptocommodityName);
		setSelectedCryptocommodityAddress(cryptocommodityAddress);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();

		const cryptocommodityContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_SELECTED_CRYPTOCOMMODITIY_ABI, signer);
		setSelectedCryptocommodityContract(cryptocommodityContract);

		const diamondCutContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_CUT_ABI, signer);
		setSelectedCryptocommodityDiamondCutContract(diamondCutContract);

		const diamondLoupeContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_LOUPE_ABI, signer);
		setSelectedCryptocommodityDiamondLoupeContract(diamondLoupeContract);

		const commonContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_COMMON_ABI, signer);
		setSelectedCryptocommodityCommonContract(commonContract);

		const crowdsaleContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_CROWDSALE_ABI, signer);
		setSelectedCryptocommodityCrowdsaleContract(crowdsaleContract);

		const vestingContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_VESTING_ABI, signer);
		setSelectedCryptocommodityVestingContract(vestingContract);

		const tokenContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_ERC_20_ABI, signer);
		setSelectedCryptocommodityTokenContract(tokenContract);

		loadFacets();

		// loadCryptocommodityFacets();
		let facets = await diamondLoupeContract.facets();
		console.log("loadCryptocommodityFacets: ", facets);
		setSelectedCryptocommodityFacets(facets);
	}


	// ***********************************************************************************************
	// ************************************* Metamask Account ****************************************
	// ************************************ (On Click Connect) ***************************************
	// ***********************************************************************************************
  const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()
	const [METAMASK_CURRENT_ACCOUNT_BALANCE, setBalance] = useState<string | undefined>()

  // click connect
  const onConnectToProvider = () => {
    console.log("onConnectToProvider")

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
		console.log('useEffect4');
		console.log('METAMASK_CURRENT_ACCOUNT', METAMASK_CURRENT_ACCOUNT);

		// account balance
    if(!METAMASK_CURRENT_ACCOUNT || !ethers.utils.isAddress(METAMASK_CURRENT_ACCOUNT)) return
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    provider.getBalance(METAMASK_CURRENT_ACCOUNT).then((result)=>{
      setBalance(ethers.utils.formatEther(result))
		}).catch((e)=>console.log(e))

		// load environment
		loadFactoryPaymentMethod();
		loadCryptocommodities();
		loadFacets();

		window.ethereum.on('accountsChanged', (accounts: any) => {
			// Handle the new accounts, or lack thereof "accounts" will always be an array, but it can be empty.
			window.location.reload();
		});

	},[METAMASK_CURRENT_ACCOUNT])

	// ***********************************************************************************************
	// ************************************ ICO Payments Tokens **************************************
	// ***********************************************************************************************
	const [ICO_PAYMENT_SYMBOLS, setICOPaymentSymbols] = useState<any | undefined>()
	const [ICO_PAYMENT_METHODS, setICOPaymentMethods] = useState<MapType>({})
	const [ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DECIMALS, setICOPaymentSymbolDecimals] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_ADDRESS, setICOPaymentSymbolAddress] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_PRICE, setICOPaymentSymbolPrice] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_REF, setICOPaymentSymbolRef] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DYN_PRICE, setICOPaymentSymbolDynPrice] = useState<any | undefined>()

	const [ICO_PAYMENT_METHOD_SEARCH_ADDRESS, setICOPaymentMethodSearchAddress] = useState<string | undefined>()
	const [ICO_PAYMENT_METHOD_SEARCH_BALANCE, setICOPaymentMethodSearchBalance] = useState<string | undefined>()

	async function cancelICOPaymentMethod() {
		console.log('cancelICOPaymentMethod');

		setICOPaymentSymbolSymbol(undefined);
		setICOPaymentSymbolAddress(undefined);
		setICOPaymentSymbolRef(undefined);
		setICOPaymentSymbolPrice(undefined);
		setICOPaymentSymbolDecimals(undefined);
	}

	async function saveICOPaymentMethod() {
		console.log('FACTORY_PAYMENT_SYMBOL_SYMBOL', FACTORY_PAYMENT_SYMBOL_SYMBOL);

		const tx = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPaymentToken(FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_DECIMALS);
		await tx.wait();

		loadICOPaymentMethod();
		cancelICOPaymentMethod();
	}

	async function deleteICOPaymentMethod() {
		console.log('deleteICOPaymentMethod', ICO_PAYMENT_SYMBOL_SYMBOL);

		const tx = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.deletePaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(ICO_PAYMENT_SYMBOL_SYMBOL));
		await tx.wait();

		loadICOPaymentMethod();
		cancelICOPaymentMethod();
	}

	async function getICOPaymentMethodBalance() {
		console.log('ICO_PAYMENT_METHOD_SEARCH_ADDRESS', ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log('ICO_PAYMENT_SYMBOL_ADDRESS', ICO_PAYMENT_SYMBOL_ADDRESS);

		console.log('balanceOf4');
		let balance = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log(balance);
		setICOPaymentMethodSearchBalance(balance);
	}

	async function loadICOPaymentMethod() {
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

	const onICOSelectPaymentMethod = async (symbol: any)=>{
		console.log('selectPaymentMethod', symbol);

		let paymentMethod = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(symbol);
		console.log('paymentMethod', paymentMethod);
		setICOPaymentSymbolSymbol(symbol);
		setICOPaymentSymbolAddress(paymentMethod[0]);
		setICOPaymentSymbolRef(paymentMethod[1]);
		setICOPaymentSymbolPrice(paymentMethod[2]);
		setICOPaymentSymbolDecimals(paymentMethod[3]);

		try {
			let dynPrice = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getUusdPerToken(symbol);
			console.log('dynPrice' + dynPrice);
			setICOPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setICOPaymentSymbolDynPrice(0);
		}

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
				let balance = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(address);
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
		const balance: string = await getTokenBalanceOf(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		setBalancesCygasICOWallet(balance);
	}

	async function getBalancesCygasTargetWallet() {
		const balance: string = await getTokenBalanceOf(ICO_TARGET_WALLET!);
		setBalancesCygasTargetWallet(balance);
	}

	async function getTokenBalanceOf(address: string) {
		console.log('getTokenBalanceOf', address);

		console.log('SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT', SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT);
		console.log('balanceOf2');
		const balanceOf = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(address);
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
	const [ICO_WHITELIST_THRESHOLD, setWhitelistThreshold] = useState<number>(0);
  const [ICO_WHITELIST_USER_COUNT, setWhitelistUserCount] = useState<number>(0);
	const [ICO_WHITELIST_USER_LIST, setWhitelistUserList] = useState([])

	const [ICO_USER_TO_WHITELIST, setUserToWhitelist] = useState<string | undefined>()

	const [ICO_IS_USE_BLACKLIST, setIsUseBlacklist] = useState<boolean | undefined>()
	const [ICO_BLACKLIST_USER_COUNT, setBlacklistUserCount] = useState<number | undefined>()
	const [ICO_BLACKLIST_USER_LIST, setBlacklistUserList] = useState([]);

	async function setMinTransferOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMinuUSDTransfer(ICO_MIN_TRANSFER).then(await handleICOReceipt).catch(handleError);
	}
	async function setMaxTransferOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDTransfer(ICO_MAX_TRANSFER).then(await handleICOReceipt).catch(handleError);
	}
	async function setMaxInvestmentOnSC() {
		console.log('ICO_MAX_INVESTMENT ' + ICO_MAX_INVESTMENT);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDInvestment(ICO_MAX_INVESTMENT).then(await handleICOReceipt).catch(handleError);
	}

	// whitelist user
	async function setWhitelistThresholdOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setWhitelistuUSDThreshold(Number(ICO_WHITELIST_THRESHOLD) * 10**6).then(await handleICOReceipt).catch(handleError);
	}

	// whitelist user
	async function setIsBlacklist(event:any) {

		// process transaction
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setUseBlacklist(event.target.checked).then(await handleICOReceipt).catch(handleError);
	}

	async function isWhitelisted(address: any, index: any) {

		const isWhitelisted = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.isWhitelisted(address);

		const element = window.document.getElementById('whitelistedValue'+index);
		if (element === null) {
			return;
		}
		console.log(isWhitelisted);
		element.innerHTML = isWhitelisted.toString();

	}

	// whitelist user
	async function whitelistUser(flag: boolean) {
		console.log("SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT " + SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT);

		if(flag) {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.whitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
		} else {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unwhitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
		}
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

	// blacklist user
	async function blacklistUser(elementId: string, flag: boolean) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var user = element.value;

		// process transaction
		if(flag) {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.blacklistUser(user).then(await handleICOReceipt).catch(handleError);
		} else {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unblacklistUser(user).then(await handleICOReceipt).catch(handleError);
		}
	}

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
	// **************************************** ICO Features *****************************************
	// ***********************************************************************************************
  const [ICO_HARD_CAP, setICOHardCap] = useState<number>(0)
  const [ICO_SOFT_CAP, setICOSoftCap] = useState<number>(0)
	const [ICO_PRICE, setICOPrice] = useState<number>(0)

  const [ICO_MIN_TRANSFER, setMinTransfer] = useState<number>(0)
  const [ICO_MAX_TRANSFER, setMaxTransfer] = useState<number>(0)
	const [ICO_MAX_INVESTMENT, setMaxInvestment] = useState<number>(0)

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

	}

	async function setICOHardCapOnSC() {
		console.log(`ICO_HARD_CAP: ` + ICO_HARD_CAP);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setHardCapuUSD(ICO_HARD_CAP * 10**6).then(await handleICOReceipt).catch(handleError);
	}
	async function setICOSoftCapOnSC() {
		console.log(`ICO_SOFT_CAP: ` + ICO_SOFT_CAP);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setSoftCapuUSD(ICO_SOFT_CAP * 10**6).then(await handleICOReceipt).catch(handleError);
	}
	async function setICOSPriceOnSC() {
		console.log(`ICO_PRICE: ` + ICO_PRICE);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPriceuUSD(ICO_PRICE).then(await handleICOReceipt).catch(handleError);
	}

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
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.createCrowdsale(ICO_PRICE, ICO_HARD_CAP * 10**6, ICO_SOFT_CAP * 10**6, ICO_WHITELIST_THRESHOLD * 10**6, ICO_MAX_INVESTMENT, ICO_MAX_TRANSFER, ICO_MIN_TRANSFER, VESTING_SCHEDULE_PERCENTAGE, VESTING_ID)
			.then(await processCreateCrowdsale).catch(handleError);
	}

	async function processCreateCrowdsale(receipt: any) {
		console.log(receipt);
	
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsWithdrawn', function (_symbol, _amount) {
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
	// ******************************************* ICO Contract **************************************
	// ***********************************************************************************************
  const [ICO_OWNER, setICOOwner] = useState<string | undefined>()
  const [ICO_PENDING_OWNER, setICOPendingOwner] = useState<string | undefined>()
  const [ICO_BALANCE, setICOBalance] = useState<string | undefined>()

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
		console.log('useEffect6');
		console.log('SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT', SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT);
	}, [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT]);

	// populateICOContract
	async function connectICOContract(event:React.FormEvent) {
		event.preventDefault();

		populateICOContractData();
	}



	// ICO Owner
	async function setNewICOOwner() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.transferOwnership(ICO_PENDING_OWNER).then(await handleICOReceipt).catch(handleError);
	}
	async function acceptNewICOOwner() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.acceptOwnership().then(await handleICOReceipt).catch(handleError);
	}

	// click purchase
	async function setCrowdsaleStage(stage: number) {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setCrowdsaleStage(stage).then(await handleICOReceipt).catch(handleError);
	}
	async function reset() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.reset().then(await handleICOReceipt).catch(handleError);
	}



	// click purchase
	async function populateICOContractData() {
		console.log("populateICOContractData");
    const provider = new ethers.providers.Web3Provider(window.ethereum)
		const blockTimestamp = (await provider.getBlock("latest")).timestamp;
		console.log('blockTimestamp: ', blockTimestamp);
		setChainTimeInMs(blockTimestamp * 1000) ;

		console.log('SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!: ', SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		let icoBalance = await provider.getBalance(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address!);
		console.log("icoBalance: " + icoBalance);
		setICOBalance(icoBalance + '');

		console.log("SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT: " + SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address);
		let icoOwner = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.owner();
		console.log("icoOwner: " + icoOwner);
		setICOOwner(icoOwner + '');
		let icoPendingOwner = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.pendingOwner();
		console.log("icoPendingOwner: " + icoPendingOwner);
		if(icoPendingOwner != '0x0000000000000000000000000000000000000000')
			setICOPendingOwner(icoPendingOwner + '');


		// token address
		let tokenAddress = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getTokenAddress();
		console.log("tokenAddress: " + tokenAddress);
		setTokenAddress(tokenAddress);

		// get stage
		let currentStage = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getCrowdsaleStage();
		setCurrentState(currentStage);
		if(currentStage == 0) setCurrentStateText("NOT CREATED");
		else if(currentStage == 1) setCurrentStateText("NOT STARTED");
		else if(currentStage == 2) setCurrentStateText("ONGOING");
		else if(currentStage == 3) setCurrentStateText("ON HOLD");
		else if(currentStage == 4) setCurrentStateText("FINISHED");
		console.log(currentStage);

		// get read only - investors
		let totalWeiInvested = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getTotaluUSDInvested();
		setTotaluUSDInvested(totalWeiInvested);
		let countInvestors = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getInvestorsCount();
		setCountInvestors(countInvestors);
		let investors = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getInvestors();
		setInvestors(investors);
		console.log("investors: " + investors);

		// get read only - finalize
		let withdrawAddress = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getTargetWalletAddress();
		console.log("withdrawAddress: " + withdrawAddress);
		setWithdrawTargetAddress(withdrawAddress);

		// dynamic price
		let dynamicPrice = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.gettDynamicPrice();
		console.log("dynamicPrice: " + dynamicPrice);
		setDynamicPrice(dynamicPrice);

		loadVesting();

	}

	async function resetICOContractData() {
		console.log("resetICOContractData");
		setICOBalance(undefined);
		setICOHardCap(0);
		setICOSoftCap(0);
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
		setWhitelistThreshold(0);
		setWhitelistUserCount(0);
		setBlacklistUserCount(undefined);

		setTargetWallet(undefined);
	}

	useEffect(() => {
		console.log('useEffect7');
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
				to: SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address,
				value: ethers.utils.parseEther(amountToInvest.toString()),
				gasLimit: 1000000,
			})
				//.once('sending', function(payload: any){ console.log(payload); })
				//.once('sent', function(payload){ ... })
				//.once('transactionHash', function(hash){ ... })
				//.once('receipt', function(receipt){ ... })
				//.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })
				//.on('error', function(error){ ... })
				.then(await processInvestmentSuccess).catch(handleError);

		} else if(TO_INVEST_CURRENCY == 'ERC_20') {
			// N/A

		} else {
			let amountToken: string = ICO_PAYMENT_METHODS[TO_INVEST_CURRENCY];
			console.log('amountToken: ', amountToken);
			let paymentTokenAddress: string = amountToken[0];
			console.log('paymentTokenAddress: ', paymentTokenAddress);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);
			await paymentToken?.approve(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address, ethers.utils.parseEther(amountToInvest.toString())).then(await handleICOReceipt).catch(handleError);
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.depositTokens(TO_INVEST_CURRENCY, ethers.utils.parseEther(amountToInvest.toString())).then(processInvestmentSuccess).catch(handleError);
		}

	}
	async function processInvestmentSuccess(receipt: any) {
		console.log(receipt);
	
		// catch events
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsReceived', function (_backer, _symbol, _amount) {
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
		console.log('useEffect9');
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

		let contribution = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contribution: ` + contribution);
		setToRefundAmount(contribution);

		let contributionUSD = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contributionUSD: ` + contributionUSD);
		setToRefundAmountUSD(contributionUSD);
	}
	async function refund() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refund(TO_REFUND_CURRENCY).then(await processRefundSuccess).catch(handleError);
	}

	const [TO_REFUND_ALL_AMOUNT, setToRefundAllAmount] = useState<string>()
  const [TO_REFUND_ALL_AMOUNT_USD, setToRefundAllAmountUSD] = useState<string>()
	const [TO_REFUND_ALL_CURRENCY, setToRefundAllCurrency] = useState<string>()

	const onSelectToRefundAllCurrency = async (symbol: any)=>{
		setToRefundAllCurrency(symbol);

		let invested = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(symbol);
	  console.log(`invested: ` + invested);
	  console.log(`invested: ` + invested[4]);
		setToRefundAllAmountUSD(invested[4]);
	  console.log(`investedUSD: ` + invested[5]);
		setToRefundAllAmount(invested[5]);
	}
	async function refundAll() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refundAll(TO_REFUND_ALL_CURRENCY).then(await processRefundSuccess).catch(handleError);
	}
	async function processRefundSuccess(receipt: any) {
		console.log(receipt);
	
		// catch events
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsRefunded', function (_backer, amount) {
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

	// transferClaimableAmountToICO
	async function transferClaimableAmountToICO() {
		console.log(`ICO CATokens Required: ` + ICO_TOTAL_uUSD_INVESTED / ICO_PRICE);
	  console.log(`ICO CATokens Current: ` + BALANCES_ERC_20_ICO_WALLET);
		let amountRequiredCATokens = BigInt(ICO_TOTAL_uUSD_INVESTED * 10**18 / ICO_PRICE);
		let amountCurrentCATokens = BigInt(BALANCES_ERC_20_ICO_WALLET) * BigInt(10**18);
	  console.log(`amountToTransferCATokensWithDecimals: ` + (amountRequiredCATokens - amountCurrentCATokens));
		await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.transfer(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address, amountRequiredCATokens - amountCurrentCATokens)
	}
	async function claim() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claim().then(await processClaimSuccess).catch(handleError);
	}
	async function claimAll() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claimAll().then(await processClaimSuccess).catch(handleError);
	}

	async function processClaimSuccess(receipt: any) {
		console.log(receipt);
	
		// catch events
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsClaimed', function (_backer, amount) {
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

	async function setTokenAddressOnSC() {
		console.log(`setting token address: ` + TOKEN_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTokenAddress(TOKEN_ADDRESS).then(await handleICOReceipt).catch(handleError);
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
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.withdraw(WITHDRAW_CURRENCY, WITHDRAW_PERCENTAGE).then(await processWithdrawSuccess).catch(handleError);
	}

	async function processWithdrawSuccess(receipt: any) {
		console.log(receipt);
	
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsWithdrawn', function (_symbol, _amount) {
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
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTargetWalletAddress(WITHDRAW_TARGET_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	// ***********************************************************************************************
	// ************************************ Vesting Programs *****************************************
	// ***********************************************************************************************
	const [VESTING_IDS, setVestingIds] = useState([]);

	const [VESTING_ID, setVestingId] = useState<string>('');
	const [VESTING_START, setVestingStart] = useState("");
	const [VESTING_CLIFF, setVestingCliff] = useState<number>(0);
	const [VESTING_DURATION, setVestingDuration] = useState<number>(0);
	const [VESTING_NUM_SLIDES, setVestingNumSlides] = useState<number>(0);

  const handleVestingStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVestingStart(e.target.value);
  };

	async function setPercentVestedOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPercentVested(VESTING_SCHEDULE_PERCENTAGE).then(await handleICOReceipt).catch(handleError);
	}
	const onSelectCurrentVestingId = async (vestingId: any)=>{
		console.log('onSelectCurrentVestingId', vestingId);

		//let vesting = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVesting(vestingId);
		//console.log('vesting', vesting);
		setVestingScheduleCurrentId(vestingId);
		//setVestingCliff(vesting[0]);
	}
	const onSelectVestingId = async (vestingId: any)=>{
		console.log('onSelectVestingId', vestingId);



		let vesting = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVesting(vestingId);
		console.log('vesting', vesting);
		console.log('vesting[0])', vesting[0]);
		console.log('parseInt', parseInt(vesting[0]));
		var dateFormat = new Date(parseInt(vesting[0]));
		console.log('dateFormat: ', dateFormat);
		console.log(dateFormat.toISOString().slice(0, 16));

		setVestingId(vestingId);
		setVestingStart(dateFormat.toISOString().slice(0, 16));
		setVestingCliff(vesting[1]);
		setVestingDuration(vesting[2]);
		setVestingNumSlides(vesting[3]);
	}
	async function cancelVesting() {
		console.log('cancelICOPaymentMethod');

		setVestingId('');
		setVestingStart('');
		setVestingCliff(0);
		setVestingDuration(0);
		setVestingNumSlides(0);
	}

	async function saveVesting() {
		// calculate vestingId
		let vestingId = Date.parse(VESTING_START) + '_' + VESTING_CLIFF + '_' + VESTING_DURATION + '_' + VESTING_NUM_SLIDES;
		setVestingId(vestingId);

		// saveVesting
		console.log(`creating vesting: `);
		console.log(`\nVESTING_ID: ` + vestingId);
		console.log(`\nVESTING_START: ` + Date.parse(VESTING_START));
		console.log(`\nVESTING_CLIFF: ` + VESTING_CLIFF);
		console.log(`\nVESTING_DURATION: ` + VESTING_DURATION);
		console.log(`\nVESTING_NUM_SLIDES: ` + VESTING_NUM_SLIDES);
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.createVesting(vestingId , Date.parse(VESTING_START), VESTING_CLIFF, VESTING_DURATION, VESTING_NUM_SLIDES)
			.then(await processCreateVesting).catch(handleError);

		cancelVesting();
	}
	async function processCreateVesting(receipt: any) {
		console.log(receipt);
	
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsWithdrawn', function (_symbol, _amount) {
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

	async function deleteVesting() {
		console.log('deletVesting', VESTING_ID);

		//await VESTING_CONTRACT?.deletePaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(ICO_PAYMENT_SYMBOL_SYMBOL));

		populateICOContractData();
		cancelICOPaymentMethod();
	}

	// ***********************************************************************************************
	// ************************************* Vesting Schedules ***************************************
	// ***********************************************************************************************
	const [VESTING_ADDRESS, setVestingAddress] = useState<string>()

	const [VESTING_SCHEDULE_LIST, setVestingScheduleList] = useState<[]>()
	const [VESTING_SCHEDULE_ID, setVestingScheduleId] = useState<string>('');
	const [VESTING_SCHEDULE_PROGRAM_ID, setVestingScheduleProgramId] = useState<string>('');
	const [VESTING_SCHEDULE_HOLDER, setVestingScheduleHolder] = useState<string>('');
	const [VESTING_SCHEDULE_AMOUNT, setVestingScheduleAmount] = useState<number>(0);
	const [VESTING_SCHEDULE_RELEASED_AMOUNT, setVestingScheduleReleasedAmount] = useState<number>(0);

	async function loadVestingScheduleList() {
		let vestingScheduleList = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedulesIds();
		console.log(`VESTING_SCHEDULE_LIST: ` + vestingScheduleList);
		setVestingScheduleList(vestingScheduleList);
	}

	const onSelectVestingSchedule = async (vestingScheduleId: any)=>{
		console.log('onSelectVestingSchedule', vestingScheduleId);

		let vestingSchedule = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedule(vestingScheduleId);
		console.log('vestingSchedule', vestingSchedule);

		setVestingScheduleId(vestingScheduleId);
		setVestingScheduleHolder(vestingSchedule[0]);
		setVestingScheduleAmount(vestingSchedule[1]);
		setVestingScheduleProgramId(vestingSchedule[2]);
		setVestingScheduleReleasedAmount(vestingSchedule[3]);
	}

	async function increaseTime(ms: number) {
		const provider = new ethers.providers.JsonRpcProvider();
		const nowInChainBefore = (await provider.getBlock("latest")).timestamp;
		console.log('nowInChainBefore: ', nowInChainBefore);
		await provider.send('evm_mine', [ nowInChainBefore + ms ]);
		setChainTimeInMs((await provider.getBlock("latest")).timestamp * 1000);
	}

	async function computeVesting() {
		console.log('computeVesting', VESTING_SCHEDULE_ID);
		let releseableAmount = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.computeReleasableAmount(VESTING_SCHEDULE_ID);
		console.log('releseableAmount', releseableAmount);
		setVestingScheduleReleasedAmount(releseableAmount);
	}

	async function releaseVesting() {
		console.log('releaseVesting', VESTING_SCHEDULE_ID);
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.release(VESTING_SCHEDULE_ID);
	}

	const [VESTING_GRANTOR, setVestinGrantor] = useState<string>('');
	const [VESTING_SCHEDULE_PERCENTAGE, setVestingSchedulePercentage] = useState<number>(0);
	const [VESTING_SCHEDULE_CURRENT_ID, setVestingScheduleCurrentId] = useState<string>('');

	async function setVestinGrantorOnSC() {
		console.log(`setting VESTING_GRANTOR: ` + VESTING_GRANTOR);
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.addGrantor(VESTING_GRANTOR).then(await handleICOReceipt).catch(handleError);
	}

	async function setVestingTokenOnSC() {
		console.log(`setting VESTING_ADDRESS: ` + VESTING_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setVestingAddress(VESTING_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	async function loadVesting() {
		// vesting
		let vestingAddress = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVestingAddress();
		console.log("vestingAddress: " + vestingAddress);
		setVestingAddress(vestingAddress);

		let vestingIds = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingIds();
		console.log(`vestingIds: ` + vestingIds);
		setVestingIds(vestingIds);

		let percentVested = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPercentVested();
		console.log(`percentVested: ` + percentVested);
		setVestingSchedulePercentage(percentVested);

		let vestingScheduleId = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVestingId();
		console.log(`vestingScheduleId: ` + vestingScheduleId);
		setVestingScheduleCurrentId(vestingScheduleId);
	}

	// ***********************************************************************************************
	// ********************************* ERC-20 Token Initialization *********************************
	// ***********************************************************************************************
	const [TOKEN_NAME, setTokenName] = useState<string>()
	const [TOKEN_SYMBOL, setTokenSymbol] = useState<string>()
	const [TOKEN_SUPPLY, setTokenSupply] = useState<number>()

	async function saveERC20Features() {
		let tx = SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.initialize(TOKEN_NAME, TOKEN_SYMBOL, BigInt(TOKEN_SUPPLY!) * BigInt(10**18));
		await tx.wait();
	}

	async function loadERC20Features() {
		let name = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.name();
		console.log('name: ' + name);
		setTokenName(name);

		let symbol = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.symbol();
		console.log('symbol: ' + symbol);
		setTokenSymbol(symbol);

		let supply = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.totalSupply();
		console.log('supply: ' + supply);
		setTokenSupply(supply);
	}

	// ***********************************************************************************************
	// ******************************************* ERC-20 Token **************************************
	// ***********************************************************************************************
	const [TOKEN_ADDRESS, setTokenAddress] = useState<string>()
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
		await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.transferOwnership(value).then(await handleICOReceipt).catch(handleError);
	}

	async function getBalanceOf(elementId: any) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var address = element.value;
		console.log('address', address);

		console.log('SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT', SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT);
		console.log('balanceOf3');
		const balanceOf = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(address);
		console.log(balanceOf.toString());

		setInvestorsBalance(balanceOf.toString());
	}

	async function getAllowance() {
		console.log('TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS', TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS);
		console.log('TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS', TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS);
		const allowanceWithDecimals = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.allowance(TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS, TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS);
		const allowance = allowanceWithDecimals / 10**18;
		console.log(allowance.toString());

		setTokenSearchAllowance(allowance.toString());
	}

	// click purchase
	async function populateTokenContractData() {
		console.log("populateTokenContractData");

    const provider = new ethers.providers.Web3Provider(window.ethereum)
		let tokenBalance = await provider.getBalance(SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.address!);
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
			let currencyMap = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(TO_TRANSFER_CURRENCY);
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
		console.log('useEffect8');
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
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setDynamicPrice(event.target.checked).then(await handleICOReceipt).catch(handleError);
	}

	// ***********************************************************************************************
	// ************************************** Tab Navigation *****************************************
	// ***********************************************************************************************
	function handleMainSelect(key: any) {
		console.log(`handleMainSelect: ` + key);

		if (key === 'me') {
			loadICOFeatures();
			loadVesting();
			loadICOPaymentMethod();

		} else if (key === 'config') {
			loadFactoryPaymentMethod();

		} else if (key === 'ico') {
			loadICOFeatures();
			loadVesting();

		} else if (key === 'vesting') {
			loadVesting();

		} else if (key === 'reserve') {

		} else if (key === 'token') {
			loadERC20Features();

		} else if (key === 'rewards') {


		} else {

		}
			
	}

	function handleAccountsSelect(key: any) {
		console.log(`handleAccountsSelect: ` + key);

		if (key === 'acc_own') {

		} else if (key === 'acc_me') {
			loadICOPaymentMethod();

		} else if (key === 'cfg_inv') {

		}
			
	}

	function handleConfigSelect(key: any) {
		console.log(`handleConfigSelect: ` + key);

		if (key === 'cfg_env') {


		} else if (key === 'cfg_crc') {
			loadCryptocommodityFacets();
			loadCryptocommodities();

		}
			
	}

	function handleFundingSelect(key: any) {
		console.log(`handleFundingSelect: ` + key);

		if (key === 'ico_fea') {
			loadICOFeatures();
			loadVesting();

		} else if (key === 'ico_wha') {
			loadAntiWhale();

		} else if (key === 'ico_pay') {
			loadICOPaymentMethod();

		} else if (key === 'ico_ops') {

		} else if (key === 'ico_fea') {

		} else if (key === 'ico_inv') {

		} else if (key === 'ico_con') {

		}
			
	}

	function handleVestingSelect(key: any) {
		console.log(`handleConfigSelect: ` + key);

		if (key === 'ves_fea') {

		} else if (key === 'ves_ope') {

		} else if (key === 'ves_inv') {

		} else if (key === 'ves_con') {


		}
			
	}

	function handleReserveSelect(key: any) {
		console.log(`handleReserveSelect: ` + key);

		if (key === 'ico_fea') {

		}
			
	}

	function handleTokenSelect(key: any) {
		console.log(`handleTokenSelect: ` + key);

		if (key === 'tok_fea') {
			loadERC20Features();

		} else if (key === 'tok_hol') {

		} else if (key === 'tok_con') {


		}
			
	}

	function handleRewardsSelect(key: any) {
		console.log(`handleRewardsSelect: ` + key);

		if (key === 'ico_fea') {

		}
			
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
					<Col className="bg-label h3 d-flex justify-content-center">CATALLACTIC ADMIN v0.9 (DEMO)</Col>
				</Row>

				<Row>
					{!METAMASK_INSTALLED ?
						<Col>
							<Button variant="danger" className="w-100 bg-button-disconnect p-2 fw-bold" onClick={openMetamaskInstall}>You need to Install Metamask Wallet. Click to Open</Button>
						</Col>
					: !METAMASK_CURRENT_ACCOUNT ?
						<Col>
							<Button className="w-100 bg-button-connect p-2 fw-bold" onClick={onConnectToProvider}>Connect to MetaMask</Button>
						</Col>
					:
						<Col>
							<Button className="w-100 bg-button-disconnect p-2 fw-bold" onClick={onClickDisconnect}>Disconnect From Metamask</Button>
						</Col>
					}
				</Row>

				<Row className="mb-3"></Row>
				{METAMASK_CURRENT_ACCOUNT ? 
				<Row>
					<Col><div><Form.Text className="bg-label fw-normal">Choose Chain</Form.Text></div></Col>
					<Col><div><Form.Text className="bg-label fw-normal">Choose Cryptocommodity</Form.Text></div></Col>
					<Col><div><Form.Text className="bg-label fw-normal"></Form.Text></div></Col>
				</Row> 
				: "" }

				{METAMASK_CURRENT_ACCOUNT ?
				<Row>
					<Col>
						<Dropdown onSelect={onSwitchNetwork}>
							<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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
					<Col>
						<Dropdown onSelect={onSelectCryptocommodity}>
							<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={CRYPTOCOMMODITIES.length==0}>
								{ SELECTED_CRYPTOCOMMODITY_NAME }
							</Dropdown.Toggle>

							<Dropdown.Menu className="w-100">
								{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
									return (
										<Dropdown.Item as="button" key={index} eventKey={item} active={SELECTED_CRYPTOCOMMODITY_NAME == item}>
											{item}
										</Dropdown.Item>
									);
								})}
							</Dropdown.Menu>
						</Dropdown>
					</Col>
					<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT || !SELECTED_CRYPTOCOMMODITY_NAME} onClick={connectICOContract}>Connect</Button></Col>
				</Row>
				: "" }

				<Row className="mb-3"></Row>
				<Row className="mb-3"></Row>
				<Tabs defaultActiveKey="config" transition={false} className="nav nav-fill" onSelect={handleMainSelect}>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************************** ME Tab ********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="me" title="ACCOUNTS" className="bg-label mb-3 bg-light-grey p-3">

						<Tabs className="nav nav-fill" defaultActiveKey="acc_me" transition={true} onSelect={handleAccountsSelect}>

							<Tab eventKey="acc_own" title="OWNER" className="bg-label mb-3 bg-light-grey">
							</Tab>

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
															<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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
															<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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

												<Row className="mb-3"></Row>
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
															<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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
					{/* *********************************************************** CONFIG Tab *******************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="config" title="CONFIG" className="bg-label mb-3 bg-light-grey p-3">

						<Tabs className="nav nav-fill" defaultActiveKey="cfg_crc" transition={true} onSelect={handleConfigSelect}>

							<Tab eventKey="cfg_env" title="ENVIRONMENT" className="bg-label mb-3 bg-light-grey" >

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Payment Tokens</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Available Payment Tokens</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onFactorySelectPaymentMethod}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
													{ FACTORY_PAYMENT_SYMBOL_SYMBOL }
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{FACTORY_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={FACTORY_PAYMENT_SYMBOL_SYMBOL == item}>
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
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setFactoryPaymentSymbolSymbol(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_SYMBOL ? FACTORY_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setFactoryPaymentSymbolAddress(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(FACTORY_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setFactoryPaymentSymbolDecimals(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_DECIMALS ? FACTORY_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
									</Row>

									<Row>
										<Col xs={4}><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Ref</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
									</Row>

									<Row>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setFactoryPaymentSymbolPrice(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_PRICE ? FACTORY_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setFactoryPaymentSymbolRef(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_REF ? truncateEthAddress(FACTORY_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ FACTORY_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
									</Row>

									<Row className="mb-3"></Row>

									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => deleteFactoryPaymentMethod()}>{KEY_ICON()} Uninstall</Button></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveFactoryPaymentMethod()}>{KEY_ICON()} Save</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelFactoryPaymentMethod()}>Cancel</Button></Col>
									</Row>

									<Row className="mb-3"></Row>

								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Behaviors</div></div></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col xs={4}><div><Form.Text className="color-frame">Behaviour</Form.Text></div></Col>
										<Col xs={2}><div><Form.Text className="color-frame">Version</Form.Text></div></Col>
										<Col xs={3}><div><Form.Text className="color-frame">Address</Form.Text></div></Col>
										<Col xs={3}></Col>
									</Row>
									{FACTORY_FACET_TYPES?.map((item: any, index: any) => {
										return (
											<Row>
												<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={item} ></input></Col>
												<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][0] : ''} ></input></Col>
												<Col xs={3}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? truncateEthAddress(FACTORY_FACETS[item][1]) : ''} ></input></Col>
												<Col xs={3}></Col>
											</Row>
										);
									})}

								</Form.Group>

							</Tab>

							<Tab eventKey="cfg_crc" title="CRYPTOCOMMODITIES" className="bg-label mb-3 bg-light-grey">

							<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Cryptocommodities</div></div></Col>
									</Row>


									<Row>
										<Col><div><Form.Text className="color-frame">List of Cryptocommodities</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onSelectCryptocommodity}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={CRYPTOCOMMODITIES.length==0}>
													{ SELECTED_CRYPTOCOMMODITY_NAME }
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={SELECTED_CRYPTOCOMMODITY_NAME == item}>
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
										<Col><div><Form.Text className="color-frame">Name</Form.Text></div></Col>
										{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col><div><Form.Text className="color-frame">Address</Form.Text></div></Col> : '' }
									</Row>

									<Row>
										{ !SELECTED_CRYPTOCOMMODITY_NAME ? <Col><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } defaultValue={SELECTED_CRYPTOCOMMODITY_NAME} value={ADD_CRYPTOCOMMODITY_NAME} onChange={(event) => setAddCryptocommodityName(event.target.value)} ></input></Col> : '' }
										{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col><input className="form-control form-control-lg text-center border-0" disabled={ true } value={SELECTED_CRYPTOCOMMODITY_NAME} ></input></Col> : '' }
										{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col><input className="form-control form-control-lg text-center border-0" disabled={ true } value={SELECTED_CRYPTOCOMMODITY_ADDRESS} ></input></Col> : '' }
									</Row>

									<Row className="mb-3"></Row>
									{ SELECTED_CRYPTOCOMMODITY_NAME ? 
									<Row>
										<Col>
											<Row>
												<Col xs={4}><div><Form.Text className="color-frame">Behaviour</Form.Text></div></Col>
												<Col xs={2}><div><Form.Text className="color-frame">Version</Form.Text></div></Col>
												<Col xs={3}><div><Form.Text className="color-frame">Address</Form.Text></div></Col>
												<Col xs={3}><div><Form.Text className="color-frame">Status</Form.Text></div></Col>
											</Row>
										</Col>
									</Row>
									 : '' }
									{ SELECTED_CRYPTOCOMMODITY_NAME ? 
									<Row>
										<Col>
											<ListGroup onSelect={onSelectFacet}>
													{FACTORY_FACET_TYPES?.map((item: any, index: any) => {
														return (
															<ListGroup.Item as="button" key={index} eventKey={item} active={ICO_PAYMENT_SYMBOL_SYMBOL == item}>
																<Row>
																	<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={item} ></input></Col>
																	<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][0] : ''} ></input></Col>
																	<Col xs={3}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? truncateEthAddress(FACTORY_FACETS[item][1]) : ''} ></input></Col>

																	{ item == 'DiamondCutFacet' ?
																		<Col xs={3}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={true} >Installed</Button></Col>
																	: SELECTED_CRYPTOCOMMODITY_FACETS && SELECTED_CRYPTOCOMMODITY_FACETS.filter(function(elem:any) { return elem[0] == FACTORY_FACETS[item][1] }).length > 0 ?
																		<Col xs={3}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => uninstallFacet(item)}>Uninstall</Button></Col>
																	:
																		<Col xs={3}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => installFacet(item)}>Install</Button></Col>
																	}
																</Row>
															</ListGroup.Item>
														);
													})}
											</ListGroup>
										</Col>
									</Row>
									 : '' }

									<Row className="mb-3"></Row>
									<Row className="mb-3"></Row>
									<Row>
										{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => deleteFactoryPaymentMethod()}>{KEY_ICON()} Delete</Button></Col> : '' }
										{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => unselectCryptocommodity()}>Cancel</Button></Col> : '' }
										{ !SELECTED_CRYPTOCOMMODITY_NAME ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ADD_CRYPTOCOMMODITY_NAME } onClick={() => saveCryptocommodity()}>{KEY_ICON()} Add</Button></Col> : '' }
										{ !SELECTED_CRYPTOCOMMODITY_NAME ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ADD_CRYPTOCOMMODITY_NAME } onClick={() => findCryptocommodity()}>{KEY_ICON()} Find</Button></Col> : '' }
									</Row>

								</Form.Group>

							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ********************************************************** PADDING Tab *******************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="padding" title="<->" className="bg-label mb-3 bg-light-grey p-3" disabled={true}>
					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ******************************************************* CROWDSALES Tab *******************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="ico" title="FUNDING" className="bg-label mb-3 bg-light-grey p-3" disabled={!SELECTED_CRYPTOCOMMODITY_NAME}>

						<Tabs className="nav nav-fill" defaultActiveKey="ico_fea" transition={true} onSelect={handleFundingSelect}>

							<Tab eventKey="ico_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Main Features</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_PRICE != 0 ? ICO_PRICE : ''} onChange={(event) => setICOPrice(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOSPriceOnSC()}> {KEY_ICON()} ICO Price</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Soft Cap (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_SOFT_CAP != 0 ? ICO_SOFT_CAP : ''} onChange={(event) => setICOSoftCap(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOSoftCapOnSC()}> {KEY_ICON()} SoftCap</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Hard Cap (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_HARD_CAP != 0 ? ICO_HARD_CAP : ''} onChange={(event) => setICOHardCap(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOHardCapOnSC()}> {KEY_ICON()} HardCap</Button></Col> : '' }
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
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MIN_TRANSFER != 0 ? ICO_MIN_TRANSFER / 10**6 : ''}  onChange={(event) => setMinTransfer(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMinTransferOnSC()}> {KEY_ICON()} Min Transfer</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Maximum Transfer (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_TRANSFER != 0 ? ICO_MAX_TRANSFER / 10**6 : ''} onChange={(event) => setMaxTransfer(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMaxTransferOnSC()}> {KEY_ICON()} Max Transfer</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Maximum Investment (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_INVESTMENT != 0 ? ICO_MAX_INVESTMENT / 10**6 : ''} onChange={(event) => setMaxInvestment(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMaxInvestmentOnSC()}> {KEY_ICON()} Max Investment</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Whitelist Threshold (USD)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_WHITELIST_THRESHOLD != 0 ? ICO_WHITELIST_THRESHOLD : ''} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setWhitelistThreshold(Number(event.target.value)) }></input></Col>
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
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_SCHEDULE_PERCENTAGE != 0 ? VESTING_SCHEDULE_PERCENTAGE : ''} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setVestingSchedulePercentage(Number(event.target.value)) }></input></Col>
										{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setPercentVestedOnSC()} disabled={!METAMASK_CURRENT_ACCOUNT} > {KEY_ICON()} Percent Vested</Button></Col> : '' }
									</Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Vesting Program</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onSelectCurrentVestingId}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
													{VESTING_SCHEDULE_CURRENT_ID}
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{VESTING_IDS?.map(vestingId => {
														return (
															<Dropdown.Item as="button" key={vestingId} eventKey={vestingId} active={VESTING_SCHEDULE_CURRENT_ID == vestingId + ''}>
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

							</Tab>

							<Tab eventKey="ico_wha" title="ANTIWHALE" className="bg-label mb-3 bg-light-grey">

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

							</Tab>

							<Tab eventKey="ico_pay" title="PAYMENT" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Payment Tokens</div></div></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Available Payment Tokens</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={8}>
											<Dropdown onSelect={onFactorySelectPaymentMethod}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
													{ FACTORY_PAYMENT_SYMBOL_SYMBOL }
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{FACTORY_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={FACTORY_PAYMENT_SYMBOL_SYMBOL == item}>
																{item}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
										<Col xs={4}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveICOPaymentMethod()}>Install</Button></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Installed Payment Tokens</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onICOSelectPaymentMethod}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={!ICO_PAYMENT_SYMBOLS}>
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
									
									{/*
									<Row>
										<Col>
											<ListGroup onSelect={onICOSelectPaymentMethod}>
													{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
														return (
															<ListGroup.Item as="button" key={index} eventKey={item} active={ICO_PAYMENT_SYMBOL_SYMBOL == item}>
																{item}
															</ListGroup.Item>
														);
													})}
											</ListGroup>
										</Col>
									</Row>
									*/}

									<Row className="mb-3"></Row>
									<Row>
										<Col xs={4}><div><Form.Text className="color-frame">Symbol</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame" dir="rtl">Address</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Decimals</Form.Text></div></Col>
									</Row>

									<Row>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setICOPaymentSymbolSymbol(event.target.value)} value={ICO_PAYMENT_SYMBOL_SYMBOL ? ICO_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setICOPaymentSymbolAddress(event.target.value)} value={ICO_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(ICO_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setICOPaymentSymbolDecimals(event.target.value)} value={ICO_PAYMENT_SYMBOL_DECIMALS ? ICO_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
									</Row>

									<Row>
										<Col xs={4}><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Ref</Form.Text></div></Col>
										<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
									</Row>

									<Row>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setICOPaymentSymbolPrice(event.target.value)} value={ICO_PAYMENT_SYMBOL_PRICE ? ICO_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
										<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !METAMASK_CURRENT_ACCOUNT } onChange={event => setICOPaymentSymbolRef(event.target.value)} value={ICO_PAYMENT_SYMBOL_REF ? truncateEthAddress(ICO_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
										<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ ICO_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
									</Row>

									<Row className="mb-3"></Row>

									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => deleteICOPaymentMethod()}>{KEY_ICON()} Uninstall</Button></Col>
										{/*<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveICOPaymentMethod()}>{KEY_ICON()} Save</Button></Col>*/}
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelICOPaymentMethod()}>Cancel</Button></Col>
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
										<Col xs={9}><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onChange={(event) => setICOPaymentMethodSearchAddress(event.target.value) } value={ICO_PAYMENT_METHOD_SEARCH_ADDRESS} dir="rtl" ></input></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onClick={()=>{ getICOPaymentMethodBalance(); }} >Balances</Button></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Balance</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg text-center border-0" disabled={true} value={ICO_PAYMENT_METHOD_SEARCH_BALANCE} ></input></Col>
									</Row>
								</Form.Group>

							</Tab>

							<Tab eventKey="ico_ops" title="OPERATIONS" className="bg-label mb-3 bg-light-grey" disabled={ ICO_CURRENT_STAGE == STAGE.NOT_CREATED }>

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
										{ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => reset()}> {KEY_ICON()} RESET </Button></Col> : "" }
									</Row>
								</Form.Group>

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
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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
										<Col><div><Form.Text className="color-frame">ICO CATokens Required</Form.Text></div></Col>
										<Col><div><Form.Text className="color-frame">ICO CATokens Current</Form.Text></div></Col>
										<Col><div><Form.Text className="color-frame"></Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={ ICO_TOTAL_uUSD_INVESTED / ICO_PRICE } ></input></Col>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ICO_WALLET} ></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={transferClaimableAmountToICO}> {KEY_ICON()} Transfer</Button></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Enter Token</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setTokenAddress(event.target.value)} value={TOKEN_ADDRESS} ></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={setTokenAddressOnSC}> {KEY_ICON()} Update</Button></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Enter Vesting Token</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setVestingAddress(event.target.value)} value={VESTING_ADDRESS} ></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={setVestingTokenOnSC}> {KEY_ICON()} Update</Button></Col>
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
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************************ VESTING tab *****************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="vesting" title="VESTING" className="bg-label mb-3 bg-light-grey p-3" disabled={!SELECTED_CRYPTOCOMMODITY_NAME}>

						<Tabs className="nav nav-fill" defaultActiveKey="ves_fea" transition={true} onSelect={handleVestingSelect}>

							<Tab eventKey="ves_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey">
								<Row className="mb-3"></Row>

								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Programs</div></div></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col>
											<Dropdown onSelect={onSelectVestingId}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
													{ VESTING_ID }
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{VESTING_IDS?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={VESTING_ID == item}>
																{item}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Id</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" value={VESTING_ID} disabled={true}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Start</Form.Text></div></Col>
										<Col><div><Form.Text className="">Vesting Cliff (days)</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="datetime-local" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_START != '0' ? VESTING_START : ''} onChange={handleVestingStartChange} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_CLIFF != 0 ? VESTING_CLIFF : ''} onChange={(event) => setVestingCliff(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Vesting Duration (days)</Form.Text></div></Col>
										<Col><div><Form.Text className="">Vesting Number Slides</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_DURATION != 0 ? VESTING_DURATION : ''} onChange={(event) => setVestingDuration(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_NUM_SLIDES != 0 ? VESTING_NUM_SLIDES : ''} onChange={(event) => setVestingNumSlides(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => deleteVesting()}> {KEY_ICON()}Delete</Button></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => saveVesting()}> {KEY_ICON()}Save</Button></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => cancelVesting()}> {KEY_ICON()}Cancel</Button></Col>
									</Row>

								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">

									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Grantor</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Account</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setVestinGrantor(event.target.value)} ></input></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setVestinGrantorOnSC()}>Set as Vesting Grantor</Button></Col>
									</Row>

								</Form.Group>

							</Tab>

							<Tab eventKey="ves_ope" title="OPERATIONS" className="bg-label mb-3 bg-light-grey">

							<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">

									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Time</div></div></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><div><Form.Text className="color-frame">Current Chain Time</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0 text-center" disabled={ true } value={new Date(METAMASK_CHAIN_TIME_IN_MS).toLocaleString()} ></input></Col>
									</Row>

									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => increaseTime(60*60)}>+HOUR</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => increaseTime(60*60*24*1)}>+DAY</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => increaseTime(60*60*24*7)}>+WEEK</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => increaseTime(60*60*24*30)}>+MONTH</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => increaseTime(60*60*24*365)}>+YEAR</Button></Col>
									</Row>

								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">

									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Schedules</div></div></Col>
									</Row>

									<Row>
										<Col><div><Form.Text className="color-frame">List of Vesting Schedules</Form.Text></div></Col>
									</Row>
									<Row>
										<Col>
											<Dropdown onSelect={onSelectVestingSchedule}>
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
													{ VESTING_SCHEDULE_ID }
												</Dropdown.Toggle>

												<Dropdown.Menu className="w-100">
													{VESTING_SCHEDULE_LIST?.map((item: any, index: any) => {
														return (
															<Dropdown.Item as="button" key={index} eventKey={item} active={VESTING_SCHEDULE_ID == item}>
																{item + ''}
															</Dropdown.Item>
														);
													})}
												</Dropdown.Menu>
											</Dropdown>
										</Col>
										<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={loadVestingScheduleList}>Load</Button></Col>
									</Row>

									<Row>
										<Col><div><Form.Text className="color-frame">Holder</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_HOLDER} ></input></Col>
									</Row>

									<Row>
										<Col><div><Form.Text className="color-frame">Vesting Schedule Id</Form.Text></div></Col>
										<Col><div><Form.Text className="color-frame">Vesting Id</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_ID ? VESTING_SCHEDULE_ID : '' }></input></Col>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_PROGRAM_ID ? VESTING_SCHEDULE_PROGRAM_ID : '' } dir="rtl" ></input></Col>
									</Row>

									<Row>
										<Col><div><Form.Text className="color-frame">Total Amount</Form.Text></div></Col>
										<Col><div><Form.Text className="color-frame">Released Amount</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_AMOUNT ? VESTING_SCHEDULE_AMOUNT : '' }></input></Col>
										<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_RELEASED_AMOUNT ? VESTING_SCHEDULE_RELEASED_AMOUNT : '' } dir="rtl" ></input></Col>
									</Row>

									<Row>
										<Col xs={6}><div><Form.Text className="color-frame">Releseable Amount</Form.Text></div></Col>
									</Row>
									<Row>
										<Col xs={6}><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={ VESTING_SCHEDULE_RELEASED_AMOUNT } ></input></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => computeVesting()}>Compute</Button></Col>
										<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT } onClick={() => releaseVesting()}>Release</Button></Col>
									</Row>

									<Row className="mb-3"></Row>

								</Form.Group>

							</Tab>

							<Tab eventKey="ves_inv" title="HOLDERS" className="bg-label mb-3 bg-light-grey">
							</Tab>

							<Tab eventKey="ves_con" title="CONTRACT" className="bg-label mb-3 bg-light-grey">
							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************** Reserve Wallet Tab ********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="reserve" title="RESERVE" className="bg-label mb-3 bg-light-grey p-3" disabled={!SELECTED_CRYPTOCOMMODITY_NAME}>

						<Tabs className="nav nav-fill" defaultActiveKey="ves_fea" transition={true} onSelect={handleReserveSelect}>

							<Tab eventKey="res_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Swap and Liquify</div></div></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Swapback</div></div></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Buyback</div></div></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Rebase</div></div></Col>
									</Row>
								</Form.Group>

							</Tab>

							<Tab eventKey="res_con" title="CONTRACT" className="bg-label mb-3 bg-light-grey">

hi

							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* *********************************************************** CRYPTOCOMM Tab ******************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="token" title="CRYPTOCOMM" className="bg-label mb-3 bg-light-grey p-3" disabled={!SELECTED_CRYPTOCOMMODITY_NAME}>

						<Tabs className="nav nav-fill" defaultActiveKey="tok_fea" transition={true} onSelect={handleTokenSelect}>

							<Tab eventKey="tok_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">ERC-20 Features</div></div></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Token Name</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" defaultValue={TOKEN_NAME} onChange={(event) => setTokenName(event.target.value)} ></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Token Symbol</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" defaultValue={TOKEN_SYMBOL} onChange={(event) => setTokenSymbol(event.target.value)} ></input></Col>
									</Row>
									<Row>
										<Col><div><Form.Text className="">Token Supply</Form.Text></div></Col>
									</Row>
									<Row>
										<Col><input type="number" className="form-control form-control-lg color-frame bg-yellow text-left border-0" defaultValue={TOKEN_SUPPLY} onChange={(event) => setTokenSupply(Number(event.target.value))} ></input></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => saveERC20Features()}>Initialize</Button></Col>
									</Row>
								</Form.Group>

							</Tab>

							<Tab eventKey="tok_hol" title="HOLDERS" className="bg-label mb-3 bg-light-grey">

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

							</Tab>

							<Tab eventKey="tok_con" title="CONTRACT" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
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

							</Tab>

						</Tabs>

					</Tab>

					{/* ******************************************************************************************************************************  */}
					{/* ************************************************** Target Wallet Tab *********************************************************  */}
					{/* ******************************************************************************************************************************  */}
					<Tab eventKey="rewards" title="REWARDS" className="bg-label mb-3 bg-light-grey p-3" disabled={!SELECTED_CRYPTOCOMMODITY_NAME}>

						<Tabs className="nav nav-fill" defaultActiveKey="rew_fea" transition={true} onSelect={handleRewardsSelect}>

							<Tab eventKey="rew_fea" title="FEATURES" className="bg-label mb-3 bg-light-grey">

							</Tab>

							<Tab eventKey="rew_ope" title="OPERATION" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
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
												<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
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

								<Row className="mb-3"></Row>
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

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Reflections</div></div></Col>
									</Row>
								</Form.Group>

								<Row className="mb-3"></Row>
								<Form.Group className="p-3 border border-dark rounded bg-light-grey">
									<Row>
										<Col><div><div className="color-frame fs-4 text-center text-center w-100">Dividends</div></div></Col>
									</Row>
								</Form.Group>

							</Tab>

							<Tab eventKey="rew_con" title="CONTRACT" className="bg-label mb-3 bg-light-grey">

								<Row className="mb-3"></Row>
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

							</Tab>

						</Tabs>

					</Tab>

				</Tabs>

			</div>

    </>
  )
}

export default Home
