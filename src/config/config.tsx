import { Contract, utils } from "ethers";

const truncateRegex = '^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$';
export const truncateEthAddress = (address: string) => {
	if (!address) return '';
	const match = address.match(truncateRegex);
	if (!match) return address;
	return `${match[1]}…${match[2]}`;
};

export const FacetCutAction = { Add: 0, Replace: 1, Remove: 2 }
export let getSelectors = function (signatures: string[] ) {
	return signatures.reduce((acc: string[], val) => {
			if (val !== 'init(bytes)') {
					acc.push(utils.id(val).substring(0, 10));
			}
			return acc;
	}, []);
}
export let removeSelectors = function (selectors: string[], removeSelectors: string[]) {
	selectors = selectors.filter(v => !removeSelectors.includes(v))
	return selectors
}
export let logSelectors = function (contract:Contract) {
	const signatures: string[] = Object.keys(contract.interface.functions);
	return signatures.reduce((acc: string[], val) => {
		console.log(val + '->' + contract.interface.getSighash(val));
		return acc;
	}, []);
}

export const KEY_ICON = function() {
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

export type MapType = { 
	[id: string]: string; 
}

var METAMASK_CHAINS:any;
export const getMETAMASK_CHAINS = function() {
	if(!METAMASK_CHAINS && process.env.NEXT_PUBLIC_METAMASK_CHAINS) {
		METAMASK_CHAINS = JSON.parse(process.env.NEXT_PUBLIC_METAMASK_CHAINS ? process.env.NEXT_PUBLIC_METAMASK_CHAINS : '[]' )
	}
	return METAMASK_CHAINS;
}

export const supportedChains = [
	{
		id: 62_298,
		token: 'cBTC',
		label: 'Citrea Devnet',
		rpcUrl: 'https://rpc.devnet.citrea.xyz'
	},
	{
		id: 5_115,
		token: 'cBTC',
		label: 'Citrea Testnet',
		rpcUrl: 'https://rpc.testnet.citrea.xyz'
	},
	{
		id: 686_868,
		token: 'BTC',
		label: 'Merlin Testnet',
		rpcUrl: 'https://testnet-rpc.merlinchain.io'
	},
	{
		id: 31_337,
		token: 'ETH',
		label: 'Hardhat',
		rpcUrl: 'http://127.0.0.1:8545'
	},
];

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const CFG_FACTORY_ABI = require('../abi/CryptocommoditiesFactory.json');
export const CFG_SELECTED_CRYPTOCOMMODITIY_ABI = require('../abi/Diamond.json');
export const CFG_DIAMOND_CUT_ABI = require('../abi/DiamondCutFacet.json');
export const CFG_DIAMOND_LOUPE_ABI = require('../abi/DiamondLoupeFacet.json');
export const CFG_COMMON_ABI = require('../abi/CommonFacet.json');
export const CFG_CROWDSALE_ABI = require('../abi/CrowdsaleFacet.json');
export const CFG_VESTING_ABI = require('../abi/VestingFacet.json');
export const CFG_ERC_20_ABI = require('../abi/ERC20Facet.json');

export const LOG_METHODS = 'color: #8B0000';

export const PROCESS:any = {
	CC: 'CROMMODITY',
	FUN: 'FUNDRAISING',
	TRA: 'TRADING',
	PAY: 'PAYMENTS',
	LEN: 'LENDING',
}

export const CHEVRON_LIST:any = {
	CC: [
		{title: "Design", URL: "/erc20/features"},
		{title: "Create", URL: "/erc20/features"},
		{title: "Airdrop", URL: "/erc20/holders"},
		{title: "Manage", URL: "/erc20/holders"},
		{title: "Audit", URL: "/erc20/features"},
		{}, {}, {},
	],
	FUN: [
		{title: "Vesting Period", URL: "/vesting/features"},
		{title: "Round", URL: "/rounds/features"},
		{title: "Antiwhale", URL: "/rounds/antiwhale"},
		{title: "Payment Methods", URL: "/rounds/payments"},
		{title: "ReceiveFacet", URL: "/rounds/payments"},
		{title: "Run", URL: "/rounds/operations"},
		{title: "Finalice", URL: "/rounds/operations"},
		{title: "Vesting", URL: "/vesting/operations"},
	],
	TRA: [
		{title: "Deploy", URL: "/trading/exchanges"},
		{title: "Reserve", URL: "/trading/reserve"},
		{title: "Withdraw", URL: "/trading/withdraw"},
		{}, {}, {}, {},
	],
	PAY: [
		{title: "Payments", URL: "/vesting/features"},
		{title: "Transfers", URL: "/vesting/holders"},
		{}, {}, {}, {}, {}, {},
	],
	LEN: [
		{title: "Lending", URL: "/vesting/features"},
		{}, {}, {}, {}, {}, {}, {},
	]
}

export const TUTORIAL:any = {
	CC: [
		{ type: "H1", text: "CROMMODITY PROCESS", },
		{ type: "H2", text: "Create CryptoCommodity", },
		{ type: "H3", text: "ISSUER: Create Cryptocommodity", URL: "/admin/cryptocommodities", },
		{ type: "H3", text: "ISSUER: Select Cryptocommodity", URL: "/admin/cryptocommodities", },
		{ type: "H3", text: "ISSUER: Install Facets", URL: "/admin/cryptocommodities", },
		{ type: "H3", text: "ISSUER: Create Storage", URL: "/admin/cryptocommodities", },
		{ type: "H3", text: "ISSUER: Initialize Cryptocommodity ERC-20 with Name, Symbol, Cryptocommodity Supply", URL: "/erc20/features", },
	],
	FUN: [
		{ type: "H1", text: "FUNDRAISING PROCESS", },
		{ type: "H2", text: "Create Funding Round", },
		{ type: "H3", text: "ISSUER: Create Vesting Period", URL: "/vesting/features", },
		{ type: "H3", text: "ISSUER: Create Funding Round", URL: "/rounds/features", },
		{ type: "H3", text: "ISSUER: Configure Antiwhale", URL: "/rounds/antiwhale", },
		{ type: "H3", text: "ISSUER: Install Payment Methods", URL: "/rounds/payments", },
		{ type: "H3", text: "ISSUER: Set the setReceiveFacet (the Crowdsale facet address)", URL:"/rounds/payments", },
		{ type: "H2", text: "Manage Funding Round", },
		{ type: "H3", text: "ISSUER: Start Funding Round", URL: "/rounds/operations", },		
		{ type: "H3", text: "INVESTOR: Find Cryptocommodity", URL: "/admin/cryptocommodities", },
		{ type: "H3", text: "INVESTOR: Invest Token", URL: "/admin/accounts", },
		{ type: "H3", text: "INVESTOR: Invest Coin", URL: "/admin/accounts", },		
		{ type: "H3", text: "ISSUER: Whitelist Investor", URL: "/rounds/antiwhale", },
		{ type: "H3", text: "INVESTOR: Invest Token", URL: "/admin/accounts", },
		{ type: "H3", text: "INVESTOR: Invest Coin", URL: "/admin/accounts", },
		{ type: "H2", text: "Finalize Funding Round with Failure", },
		{ type: "H3", text: "ISSUER: Finalize Funding Round", URL: "/rounds/operations", },		
		{ type: "H3", text: "INVESTOR: Refund invested tokens", URL: "/rounds/operations", },		
		{ type: "H3", text: "INVESTOR: Refund invested coins", URL: "/rounds/operations", },		
		{ type: "H3", text: "ISSUER: Reset Funding Round", URL: "/rounds/operations", },		
		{ type: "H2", text: "Finalize Funding Round with Success", },		
		{ type: "H3", text: "ISSUER: Finalize Funding Round", URL: "/rounds/operations", },		
		{ type: "H3", text: "ISSUER: Enter Vesting Address in Crowdsale", URL: "/rounds/operations", },		
		{ type: "H3", text: "ISSUER: Enter Token Address in Crowdsale", URL: "/rounds/operations", },		
		{ type: "H3", text: "ISSUER: Enter Token Address in Vesting", URL: "/vesting/operations", },		
		{ type: "H3", text: "ISSUER: Enter Crowdsale Address as Vesting Grantor", URL: "/vesting/operations", },		
		{ type: "H3", text: "ISSUER: Transfers to Crowdsale Total Cryptocommodities purchased", URL: "/rounds/operations", },
		{ type: "H3", text: "INVESTOR: Claims purchased Cryptocommodities", URL: "/admin/accounts", },		
		{ type: "H3", text: "INVESTOR: Waits Vesting Periods", URL: "/vesting/operations", },		
		{ type: "H3", text: "INVESTOR: Release Vesting Slides", URL: "/vesting/operations", },		
		{ type: "H3", text: "ISSUER: Configures Withdraw Wallet", URL: "/rounds/operations", },
		{ type: "H3", text: "ISSUER: Withdraws Funds to Wallet", URL: "/rounds/operations", },		
		{ type: "H3", text: "ISSUER: Runs TGE to Exchanges (Optionally)", URL: "/admin/contract", },
	],
	TRA: [
		{ type: "H1", text: "TRADING MANAGEMENT", },
	],
	PAY: [
		{ type: "H1", text: "PAYMENT SERVICES", },
	],
	LEN: [
		{ type: "H1", text: "LENDING SERVICES", },
	]
}