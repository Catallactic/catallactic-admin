"use client";

import { ethers } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { useSetChain, useWallets } from '@web3-onboard/react';
import { useWeb3Onboard } from '@web3-onboard/react/dist/context';
import { exchanges } from 'config/config-exchanges';

declare let window:any

const Exchanges: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	// OnBoard hooks
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()
	const web3OnBoard = useWeb3Onboard();

	// Blockchain hooks
	const { 
		createEnvContracts, envContracts, 
		loadYourCryptocommodities, CRYPTOCOMMODITIES, 
		selectCrypto, unselectCrypto, selectedCrypto, contracts 
	} = useContext(ContractsContext);
	const { 
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
	} = useCrowdsaleHook();
	const { 
		loadFactoryFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, FACTORY_PAYMENT_METHODS,
	} = useFactoryHook();
	const { 
		loadERC20Features, TOKEN_INITIALIZED, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY,
		getBalancesCygasMeWallet, BALANCES_ERC_20_ME_WALLET, 
		getBalancesCygasSearchAddress, BALANCES_ERC_20_SEARCH_ADDRESS, 
		getBalancesCygasICOWallet, BALANCES_ERC_20_ICO_WALLET, 
		getBalancesCygasTargetWallet, BALANCES_ERC_20_TARGET_WALLET, 
	} = useERC20Hook();
	const { handleICOReceipt, handleError } = useResponseHook()
	const CFG_ERC_20_ABI = require('../../../abi/ERC20Facet.json');

	// UI hooks
	const [connectedAddress, setConnectedAddress] = useState('')

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	useEffect(() => {

		if (!connectedChain) {
			console.log('No chainId found. Aborting..')
			setConnectedAddress('')
			return;
		}

		//setConnectedAddress(connectedWallets[0].accounts[0].address)

		console.log('loadICOFeatures');
		console.log(exchanges);
		loadICOFeatures();

		console.log('loadICOPaymentMethod');
		loadICOPaymentMethod();

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		provider
			.send("eth_requestAccounts", [])
    	.then((accounts)=>{
				console.log(accounts);
				if(accounts.length>0)
					setConnectedAddress(accounts[0])

			})
			.catch((e)=>console.log(e))

	}, [connectedWallets, selectedCrypto])

	useEffect(() => {
		getBalancesRawICOMeWallet();
		getBalancesUSDICOMeWallet();
		getBalancesPaymentTokensMeWallet();
		getBalancesCygasMeWallet();
	}, [ICO_PAYMENT_METHODS])

	useEffect(() => {

		const wallets = web3OnBoard.state.select('wallets')
		wallets.subscribe(wallet => {
			console.log("Changed wallet", wallet)
			console.log(wallet)

			wallet[0].provider.on('accountsChanged', function (accounts) {
				console.log("Changed account", accounts[0])
	    });

			const provider = new ethers.providers.Web3Provider(window.ethereum)
			provider
				.send("eth_requestAccounts", [])
				.then((accounts)=>{
					console.log("eth_requestAccounts", accounts);
					if(accounts.length>0)
						setConnectedAddress(accounts[0])
	
				})
				.catch((e)=>console.log(e))

		})

	}, []);

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	// invest
	const [TOKEN1_CURRENCY, setToken1Currency] = useState<string>()
  const [TOKEN1_AMOUNT, setToken1Amount] = useState<string>('0')
  const [TOKEN1_AMOUNT_USD, setToken1AmountUSD] = useState<string>('0')

	useEffect(() => {
		console.log('useEffect8');
		if(!TOKEN1_CURRENCY) return;
		if(!ICO_PAYMENT_METHODS[TOKEN1_CURRENCY]) return;
		console.log('TOKEN1_AMOUNT', TOKEN1_AMOUNT);

		let amountToken: string = ICO_PAYMENT_METHODS[TOKEN1_CURRENCY];
		let amountTokenPrice: number = Number(amountToken[2])
		let amountToTransferUSD: number = Number(TOKEN1_AMOUNT) * amountTokenPrice / 10**6;
		setToken1AmountUSD(amountToTransferUSD.toString());

	}, [TOKEN1_AMOUNT, TOKEN1_CURRENCY]);

	const [TOKEN2_CURRENCY, setToken2Currency] = useState<string>()
  const [TOKEN2_AMOUNT_USD, setToken2AmountUSD] = useState<string>('0')
  const [TOKEN2_AMOUNT, setToken2Amount] = useState<string>('0')

	useEffect(() => {
		console.log('useEffect8');
		if(!TOKEN2_CURRENCY) return;
		if(!ICO_PAYMENT_METHODS[TOKEN2_CURRENCY]) return;
		console.log('TOKEN2_AMOUNT', TOKEN2_AMOUNT);

		let amountToken: string = ICO_PAYMENT_METHODS[TOKEN2_CURRENCY];
		let amountTokenPrice: number = Number(amountToken[2])
		let amountToTransferUSD: number = Number(TOKEN2_AMOUNT) * amountTokenPrice / 10**6;
		setToken2AmountUSD(amountToTransferUSD.toString());

	}, [TOKEN2_AMOUNT, TOKEN2_CURRENCY]);

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: ` + !connectedChain);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connectedChain != undefined && selectedCrypto != undefined);
		setColorCSS(connectedChain && selectedCrypto != undefined ? ' bg-edited' : '');
	}, [connectedChain, selectedCrypto, ICO_CURRENT_STAGE])

  return (

    <div className="bg-page d-flex flex-row align-items-center dark:bg-transparent">
      <Container className='mw-100'>

				<Row className="m-4"></Row>

				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Create New {selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"} Pairs</div></div></Col>
					</Row>

					<Row className="m-3"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame">Select Exchange</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" >
									Select Decentralized Exchange
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{connectedChain?.id ?
										exchanges[Number(connectedChain?.id)].exchanges.map((item: any, index: any) => {
											return (
												<Dropdown.Item as="button" key={Number(connectedChain?.id)} eventKey={item.name} >
													{item.name}
												</Dropdown.Item>
											);
										})
									: ''}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>

					<Row className="m-3"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame">Token1</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">Token1 Amount</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">Token1 Amount USD</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={(symbol: any) => setToken1Currency(symbol)}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" >
									{TOKEN1_CURRENCY || "Select Currency"}
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">

									<Dropdown.Item as="button" key={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"} eventKey={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"}>
										{selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"}
									</Dropdown.Item>

									{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={TOKEN1_CURRENCY == item}>
												{item}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col><input className="form-control form-control-lg bg-edited color-frame border-0" value={TOKEN1_AMOUNT} onChange={(event) => setToken1Amount(event.target.value)} ></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TOKEN1_AMOUNT_USD ? TOKEN1_AMOUNT_USD : 0} ></input></Col>
					</Row>

					<Row>
						<Col><div><Form.Text className="color-frame">Token2</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">Token2 Amount</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">Token2 Amount USD</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={(symbol: any) => setToken2Currency(symbol)}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" >
									{TOKEN2_CURRENCY || "Select Currency"}
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									
									<Dropdown.Item as="button" key={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"} eventKey={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"}>
										{selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"}
									</Dropdown.Item>

									{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={TOKEN2_CURRENCY == item}>
												{item}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col><input className="form-control form-control-lg bg-edited color-frame border-0" value={TOKEN2_AMOUNT} onChange={(event) => setToken2Amount(event.target.value)} ></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TOKEN2_AMOUNT_USD ? TOKEN2_AMOUNT_USD : 0} ></input></Col>
					</Row>

					<Row className="m-3"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame">Token1 Price</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">Token2 Price</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={Number(TOKEN1_AMOUNT) > 0 ? Number(TOKEN2_AMOUNT)/Number(TOKEN1_AMOUNT) : 0} ></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={Number(TOKEN2_AMOUNT) > 0 ? Number(TOKEN1_AMOUNT)/Number(TOKEN2_AMOUNT) : 0} ></input></Col>
					</Row>

					<Row className="m-3"></Row>

					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" > {KEY_ICON()} Create Pair</Button></Col>
					</Row>

				</Form.Group>

				<Row className="m-4"></Row>

			</Container>
		</div>

	);
}

export default Exchanges