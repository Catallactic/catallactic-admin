"use client";

import { Contract, ethers } from 'ethers';
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
	const [TO_INVEST_CURRENCY, setToInvestCurrency] = useState<string>('USDT')
  const [TO_INVEST_AMOUNT_USD, setToInvestAmountUSD] = useState<string>('0')
  const [TO_INVEST_AMOUNT, setToInvestAmount] = useState<string>('0')

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

	async function invest() {

		let amountToInvest: number = Number(TO_INVEST_AMOUNT)
		console.log('investing amountToInvest ', amountToInvest, TO_INVEST_CURRENCY);

		if(TO_INVEST_CURRENCY == 'COIN') {
			console.log('SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address ', contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address);

			const provider = new ethers.providers.Web3Provider(window.ethereum)
			window.ethereum.enable()
			const signer = provider.getSigner()
			await signer.sendTransaction({
				from: connectedAddress,
				to: contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address,
				value: ethers.utils.parseEther(amountToInvest.toString()),
				gasLimit: 1000000,
			})
				//.once('sending', function(payload: any){ console.log(payload); })
				//.once('sent', function(payload){ ... })
				//.once('transactionHash', function(hash){ ... })
				//.once('receipt', function(receipt){ ... })
				//.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })
				//.on('error', function(error){ ... })
				.then(await handleICOReceipt)
				.then(await getBalancesRawICOMeWallet)
				.then(await getBalancesUSDICOMeWallet)
				.then(await getBalancesPaymentTokensMeWallet)
				.then(await getBalancesCygasMeWallet)
				.then(await resetInvest)
				.catch(await handleError);

		} else if(TO_INVEST_CURRENCY == 'ERC_20') {
			// N/A

		} else {
			console.log('SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address ', contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address);

			let amountToken: string = ICO_PAYMENT_METHODS[TO_INVEST_CURRENCY];
			console.log('amountToken: ', amountToken);
			let paymentTokenAddress: string = amountToken[0];
			console.log('paymentTokenAddress: ', paymentTokenAddress);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			window.ethereum.enable()
			const signer = provider.getSigner();
			const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);
			await paymentToken?.approve(contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address, ethers.utils.parseEther(amountToInvest.toString())).then(await handleICOReceipt).catch(handleError);
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.depositTokens(TO_INVEST_CURRENCY, ethers.utils.parseEther(amountToInvest.toString()))
				.then(await handleICOReceipt)
				.then(await getBalancesRawICOMeWallet)
				.then(await getBalancesUSDICOMeWallet)
				.then(await getBalancesPaymentTokensMeWallet)
				.then(await getBalancesCygasMeWallet)
				.then(await resetInvest)
				.catch(await handleError);
		}

	}

	async function resetInvest() {
		setToInvestCurrency('USDT');
		setToInvestAmount('0');
		setToInvestAmountUSD('0');
	}

	// refund
  const [TO_REFUND_AMOUNT, setToRefundAmount] = useState<string>()
  const [TO_REFUND_AMOUNT_USD, setToRefundAmountUSD] = useState<string>()
	const [TO_REFUND_CURRENCY, setToRefundCurrency] = useState<string>()

	const onSelectToRefundCurrency = async (symbol: any)=>{
		setToRefundCurrency(symbol);

		let contribution = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getContribution(connectedAddress, symbol);
	  console.log(`contribution: ` + contribution);
		setToRefundAmount(contribution);

		let contributionUSD = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDContribution(connectedAddress, symbol);
	  console.log(`contributionUSD: ` + contributionUSD);
		setToRefundAmountUSD(contributionUSD);
	}

	async function refund() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refund(TO_REFUND_CURRENCY)
			.then(await handleICOReceipt)
			.then(await getBalancesRawICOMeWallet)
			.then(await getBalancesUSDICOMeWallet)
			.then(await getBalancesPaymentTokensMeWallet)
			.then(await getBalancesCygasMeWallet)
			.then(await resetRefund)
			.catch(await handleError);
	}

	async function resetRefund() {
		setToRefundCurrency('');
		setToRefundAmount('0');
		setToRefundAmountUSD('0');
	}

	// claim
	async function claim() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claim()
			.then(await handleICOReceipt)
			.then(await getBalancesRawICOMeWallet)
			.then(await getBalancesUSDICOMeWallet)
			.then(await getBalancesPaymentTokensMeWallet)
			.then(await getBalancesCygasMeWallet)
			.catch(await handleError);
	}

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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Deploy {selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"} to Exchanges</div></div></Col>
					</Row>

					<Row className="m-3"></Row>

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
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!connectedChain || !selectCrypto || ICO_CURRENT_STAGE != STAGE.ONGOING}>
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
						<Col><input className="form-control form-control-lg bg-edited color-frame border-0" disabled={!connectedChain || !selectCrypto || ICO_CURRENT_STAGE != STAGE.ONGOING} onChange={(event) => setToInvestAmount(event.target.value) } value={TO_INVEST_AMOUNT}></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_INVEST_AMOUNT_USD ? TO_INVEST_AMOUNT_USD : 0} ></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain || !selectCrypto || !TO_INVEST_AMOUNT || TO_INVEST_AMOUNT=='0' || ICO_CURRENT_STAGE != STAGE.ONGOING} onClick={() => invest()}>Invest in {selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20"}</Button></Col>
					</Row>

					<Row className="m-3"></Row>

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
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!connectedChain || !selectCrypto || ICO_CURRENT_STAGE != STAGE.FINISHED}>
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
						<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain || !selectCrypto || ICO_CURRENT_STAGE != STAGE.FINISHED} onClick={() => refund()}> {KEY_ICON()} Refund</Button></Col>
					</Row>

				</Form.Group>

				<Row className="m-4"></Row>

			</Container>
		</div>

	);
}

export default Exchanges