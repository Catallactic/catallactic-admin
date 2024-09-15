"use client";

import { Contract, ethers } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { useWallets } from '@web3-onboard/react';

declare let window:any

const Accounts: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [connected, setConnected] = useState(false)
	const [connectedAddress, setConnectedAddress] = useState('')

	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const CFG_ERC_20_ABI = require('../../../abi/ERC20Facet.json');

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
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
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


	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	useEffect(() => {
		console.log("Num connected Wallets: " + connectedWallets.length)
		setConnected(connectedWallets.length > 0);
		if (connectedWallets.length == 0) {
			console.log('disconnected')
			setConnectedAddress('')
			//window.location.reload();
			return;
		}

		setConnectedAddress(connectedWallets[0].accounts[0].address)

		console.log('loadICOFeatures');
		loadICOFeatures();

		console.log('loadERC20Features');
		loadICOPaymentMethod();

	}, [connectedWallets])

	useEffect(() => {
		getBalancesRawICOMeWallet();
		getBalancesUSDICOMeWallet();
		getBalancesPaymentTokensMeWallet();
		getBalancesCygasMeWallet();
	}, [ICO_PAYMENT_METHODS])	

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
				.catch(handleError);

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
				.catch(handleError);
		}

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
			.catch(handleError);
	}

	// refund
	async function claim() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claim()
			.then(await handleICOReceipt)
			.then(await getBalancesRawICOMeWallet)
			.then(await getBalancesUSDICOMeWallet)
			.then(await getBalancesPaymentTokensMeWallet)
			.then(await getBalancesCygasMeWallet)
			.catch(handleError);
	}

	// transfer
	const [TO_TRANSFER_CURRENCY, setToTransferCurrency] = useState<string>('USDT')
  const [TO_TRANSFER_AMOUNT_USD, setToTransferAmountUSD] = useState<string>('0')
  const [TO_TRANSFER_AMOUNT, setToTransferAmount] = useState<string>('0')
  const [TO_TRANSFER_ADDRESS, setToTransferAddress] = useState<string>('')

	const onSelectToTransferCurrency = async (symbol: any)=>{
		setToTransferCurrency(symbol);
	}

	async function transfer() {
		console.log('transferring ', TO_TRANSFER_ADDRESS, TO_TRANSFER_AMOUNT, TO_TRANSFER_CURRENCY);

		if(TO_TRANSFER_CURRENCY == 'COIN') {
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			window.ethereum.enable()
			const signer = provider.getSigner()
			await signer.sendTransaction({
				from: connectedAddress,
				to: TO_TRANSFER_ADDRESS,
				value: ethers.utils.parseEther(TO_TRANSFER_AMOUNT),
				gasLimit: 200000,
			})
			.then(await handleICOReceipt)
			.then(await getBalancesRawICOMeWallet)
			.then(await getBalancesUSDICOMeWallet)
			.then(await getBalancesPaymentTokensMeWallet)
			.then(await getBalancesCygasMeWallet)
			.catch(handleError);

		} else if(TO_TRANSFER_CURRENCY == 'ERC_20') {

		} else {
			let currencyMap = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(TO_TRANSFER_CURRENCY);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			window.ethereum.enable()
			const signer = provider.getSigner();
			let currencyAddress = currencyMap[0];
			let currencyDecimals = currencyMap[3];
			const currencyToken: Contract = new ethers.Contract(currencyAddress, CFG_ERC_20_ABI, signer);
			console.log('currencyToken ', currencyToken);
			await currencyToken.transfer(TO_TRANSFER_ADDRESS, (BigInt(Number(TO_TRANSFER_AMOUNT) * 10**Number(currencyDecimals))).toString())
			.then(await handleICOReceipt)
			.then(await getBalancesRawICOMeWallet)
			.then(await getBalancesUSDICOMeWallet)
			.then(await getBalancesPaymentTokensMeWallet)
			.then(await getBalancesCygasMeWallet)
			.catch(handleError);
		}

	}

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: ` + !connected);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connected && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connected && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connected && selectedCrypto != undefined);
		setColorCSS(connected && selectedCrypto != undefined ? ' bg-yellow' : '');
	}, [connected, selectedCrypto, ICO_CURRENT_STAGE])

  return (

    <div className="bg-light d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallet</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Connected to Metamask Account</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="email" className="form-control form-control-lg text-center border-0" value={connectedAddress} disabled={true}></input></Col>
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
									<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!connected} onChange={(event) => setToInvestAmount(event.target.value) } value={TO_INVEST_AMOUNT}></input></Col>
									<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_INVEST_AMOUNT_USD ? TO_INVEST_AMOUNT_USD : 0} ></input></Col>
									<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connected} onClick={() => invest()}>Invest</Button></Col>
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
									<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connected} onClick={() => refund()}> {KEY_ICON()} Refund</Button></Col>
								</Row>
							</Form.Group>

							<Row className="mb-3"></Row>
							<Form.Group className="p-3 border border-dark rounded bg-light-grey">
								<Row>
									<Col><div><div className="color-frame fs-4 text-center text-center w-100">Claim ERC-20</div></div></Col>
								</Row>

								<Row className="mb-3"></Row>
								<Row>
									<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connected} onClick={() => claim()}>Claim</Button></Col>
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
									<Col><input type="email" className="form-control form-control-lg color-frame bg-yellow text-left border-0" onChange={(event) => setToTransferAddress(event.target.value) } value={TO_TRANSFER_ADDRESS} ></input></Col>
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
									<Col xs={3}><input id="buyAmount" type="number" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!connected} onChange={(event) => setToTransferAmount(event.target.value) } defaultValue={BALANCES_PAYMENT_TOKENS_ME_WALLET && BALANCES_PAYMENT_TOKENS_ME_WALLET[TO_TRANSFER_CURRENCY] && ICO_PAYMENT_METHODS[TO_TRANSFER_CURRENCY] ? Number(BALANCES_PAYMENT_TOKENS_ME_WALLET[TO_TRANSFER_CURRENCY].toString()) / 10**Number(ICO_PAYMENT_METHODS[TO_TRANSFER_CURRENCY][3]) : 0}></input></Col>
									<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={TO_TRANSFER_AMOUNT_USD ? TO_TRANSFER_AMOUNT_USD : 0} ></input></Col>
									<Col xs={3}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connected} onClick={() => transfer()}>Transfer</Button></Col>
								</Row>
							</Form.Group>

						</Accordion.Body>
					</Accordion.Item>
				</Accordion>

			</Container>
		</div>

	);
}

export default Accounts