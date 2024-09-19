
"use client";

import { Contract } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import Link from 'next/link';
import { useSetChain, useWallets } from '@web3-onboard/react';

const Operations: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	// OnBoard hooks
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()

	// Blockchain hooks
	const { 
		createEnvContracts, envContracts, 
		loadYourCryptocommodities, CRYPTOCOMMODITIES, 
		selectCrypto, unselectCrypto, selectedCrypto, contracts 
	} = useContext(ContractsContext);
	const { 
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
	} = useCrowdsaleHook();
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

		console.log('loadICOFeatures');
		loadICOFeatures();

		console.log('loadICOPaymentMethod');
		loadICOPaymentMethod();

		console.log('loadTokenAddressOnCrowdsaleContract');
		loadTokenAddressOnCrowdsaleContract();

		console.log('loadICOVestingAddress');
		loadICOVestingAddress();

		console.log('loadWithdrawTargetAddress');
		loadWithdrawTargetAddress();

		console.log('loadInvested');
		loadInvested();

		console.log('getBalancesPaymentMethodsICOWallet');
		getBalancesPaymentMethodsICOWallet();

		console.log('getBalancesCygasICOWallet');
		getBalancesCygasICOWallet();

	}, [selectedCrypto])

	useEffect(() => {
		setVestingAddress(VESTING_ADDRESS);
	}, [VESTING_ADDRESS])

	useEffect(() => {
		setTokenAddress(TOKEN_ADDRESS);
	}, [TOKEN_ADDRESS])

	useEffect(() => {
		setWithdrawTargetAddress(WITHDRAW_TARGET_ADDRESS);
	}, [WITHDRAW_TARGET_ADDRESS])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	// crowdsale stage
	async function setCrowdsaleStage(stage: number) {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setCrowdsaleStage(stage)
			.then(await handleICOReceipt)
			.then(await loadICOFeatures)
			.catch(await handleError);
	}
	async function reset() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.reset()
			.then(await handleICOReceipt)
			.catch(await handleError);
	}

	// refund	
	const [TO_REFUND_ALL_CURRENCY, setToRefundAllCurrency] = useState<string>()
  const [TO_REFUND_ALL_AMOUNT_USD, setToRefundAllAmountUSD] = useState<string>()
	const [TO_REFUND_ALL_AMOUNT, setToRefundAllAmount] = useState<string>()

	const onSelectToRefundAllCurrency = async (symbol: any)=>{
		setToRefundAllCurrency(symbol);

		let invested = await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(symbol);
	  console.log(`invested: ` + invested);
	  console.log(`invested: ` + invested[4]);
		setToRefundAllAmountUSD(invested[4]);
	  console.log(`investedUSD: ` + invested[5]);
		setToRefundAllAmount(invested[5]);
	}

	async function refundAll() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refundAll(TO_REFUND_ALL_CURRENCY)
			.then(await handleICOReceipt)
			.catch(await handleError);
	}


	// transferClaimableAmountToICO
	async function transferClaimableAmountToICO() {
		console.log(`ICO CATokens Required: ` + ICO_TOTAL_uUSD_INVESTED / ICO_PRICE);
	  console.log(`ICO CATokens Current: ` + BALANCES_ERC_20_ICO_WALLET);
		let amountRequiredCATokens = BigInt(ICO_TOTAL_uUSD_INVESTED * 10**18 / ICO_PRICE);
		let amountCurrentCATokens = BigInt(BALANCES_ERC_20_ICO_WALLET) * BigInt(10**18);
	  console.log(`amountToTransferCATokensWithDecimals: ` + (amountRequiredCATokens - amountCurrentCATokens));
		await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.transfer(contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address, amountRequiredCATokens - amountCurrentCATokens)
		.then(await handleICOReceipt)
		.then(await getBalancesCygasICOWallet)
		.catch(await handleError);
	}

	const [X_VESTING_ADDRESS, setVestingAddress] = useState<string>()
	async function setVestingTokenOnSC() {
		console.log(`setting VESTING_ADDRESS: ` + X_VESTING_ADDRESS);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setVestingAddress(X_VESTING_ADDRESS)
			.then(await handleICOReceipt)
			.then(await loadICOVestingAddress)
			.catch(await handleError);
	}

	const [X_TOKEN_ADDRESS, setTokenAddress] = useState<string>()
	async function setTokenAddressOnSC() {
		console.log(`setting token address: ` + X_TOKEN_ADDRESS);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTokenAddress(X_TOKEN_ADDRESS)
			.then(await handleICOReceipt)
			.then(await loadTokenAddressOnCrowdsaleContract)
			.catch(await handleError);
	}

	const [X_WITHDRAW_TARGET_ADDRESS, setWithdrawTargetAddress] = useState<string>('')
	async function setTargetWalletAddress() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTargetWalletAddress(X_WITHDRAW_TARGET_ADDRESS)
			.then(await handleICOReceipt)
			.then(await loadWithdrawTargetAddress)
			.catch(await handleError);
	}

	async function claimAll() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claimAll()
			.then(await handleICOReceipt)
			.catch(await handleError);
	}

	// withdraw
	const [WITHDRAW_CURRENCY, setWithdrawCurrency] = useState<string>('')
	const [WITHDRAW_PERCENTAGE, setWithdrawPercentage] = useState<string>('')

	const onSelectToWitdrawCurrency = async (symbol: any)=>{
		setWithdrawCurrency(symbol);
	}
	async function withdrawICO() {
		console.log(`WITHDRAW_CURRENCY: ` + WITHDRAW_CURRENCY);
		console.log(`WITHDRAW_PERCENTAGE: ` + WITHDRAW_PERCENTAGE);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.withdraw(WITHDRAW_CURRENCY, WITHDRAW_PERCENTAGE)
			.then(await handleICOReceipt)
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
		console.log(`isDisconnected: `, !connectedChain);
		console.log(`selectedCrypto: `, selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connectedChain != undefined && selectedCrypto != undefined);
		setColorCSS(connectedChain != undefined && selectedCrypto != undefined ? ' bg-edited' : '');
	}, [connectedChain, selectedCrypto, ICO_CURRENT_STAGE])

  return (

    <div className="bg-page d-flex flex-row align-items-center dark:bg-transparent">
      <Container className='mw-100'>

				{ CAN_TYPE ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <Link href="/admin/cryptocommodities">this page</Link> to create one.</Form.Text></Col>
				</Row>
				}

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><Form.Text className="fs-6">Current ICO Stage</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="text" className="form-control form-control-lg color-frame text-center border-0" value={ICO_CURRENT_STAGE_TEXT} disabled={true}></input></Col>
						{ICO_CURRENT_STAGE == STAGE.NOT_STARTED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setCrowdsaleStage(STAGE.ONGOING)}> {KEY_ICON()} START </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setCrowdsaleStage(STAGE.ONHOLD)}> {KEY_ICON()} HOLD </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.ONHOLD || ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setCrowdsaleStage(STAGE.ONGOING)}> {KEY_ICON()} CONTINUE </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.ONHOLD ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setCrowdsaleStage(STAGE.FINISHED)}> {KEY_ICON()} FINISH </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => reset()}> {KEY_ICON()} RESET </Button></Col> : "" }
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Refunds</div></div></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col xs={3}><div><Form.Text className="color-frame fs-6">Currency</Form.Text></div></Col>
						<Col xs={3}><div><Form.Text className="color-frame fs-6">Amount</Form.Text></div></Col>
						<Col xs={3}><div><Form.Text className="color-frame fs-6">Amount USD</Form.Text></div></Col>
						<Col xs={3}><div><Form.Text className="color-frame fs-6"></Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={3}>
							<Dropdown onSelect={onSelectToRefundAllCurrency}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED}>
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
						<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={() => refundAll()}> {KEY_ICON()} Refund All</Button></Col>
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">

					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Claim ERC-20 to Investors</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">ICO Cryptocommodities Required</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame fs-6">ICO Cryptocommodities Current</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame fs-6"></Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={ ICO_TOTAL_uUSD_INVESTED / ICO_PRICE } ></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ICO_WALLET} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={transferClaimableAmountToICO}> {KEY_ICON()} Transfer</Button></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Enter Vesting Token</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onChange={(event) => setVestingAddress(event.target.value)} value={X_VESTING_ADDRESS} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={setVestingTokenOnSC}> {KEY_ICON()} Update</Button></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Enter ERC-20 Token</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onChange={(event) => setTokenAddress(event.target.value)} value={X_TOKEN_ADDRESS} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={setTokenAddressOnSC}> {KEY_ICON()} Update</Button></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row><Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={() => claimAll()}> {KEY_ICON()}Claim All Investors</Button></Col></Row>

				</Form.Group>

				<Row className="m-4"></Row>

				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Withdraw to Wallets</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Enter Target Wallet</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_WITHDRAW_TARGET_ADDRESS} disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onChange={(event) => setWithdrawTargetAddress(event.target.value)} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={() => setTargetWalletAddress()}> {KEY_ICON()} Update</Button></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col xs={3}><div><Form.Text className="color-frame"></Form.Text></div></Col>
						<Col xs={3}><div><Form.Text className="color-frame fs-6">Available</Form.Text></div></Col>
						<Col xs={3}><div><Form.Text className="color-frame fs-6">% To Withdraw</Form.Text></div></Col>
						<Col xs={3}><div><Form.Text className="color-frame fs-6">To Withdraw</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={3}>
							<Dropdown onSelect={onSelectToWitdrawCurrency}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED}>
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
						<Col xs={3}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} value={WITHDRAW_PERCENTAGE} onChange={(event) => setWithdrawPercentage(event.target.value)} disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} ></input></Col>
						<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={BALANCES_PAYMENT_TOKENS_ICO_WALLET && BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY] ? (Number(BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY]) / 10**Number(ICO_PAYMENT_METHODS[WITHDRAW_CURRENCY][3])) * Number(WITHDRAW_PERCENTAGE) / 100 : 0} disabled={true}></input></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || ICO_CURRENT_STAGE < STAGE.FINISHED} onClick={() => withdrawICO()}> {KEY_ICON()}Withdraw</Button></Col>
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>

			</Container>
		</div>
		
	);

}

export default Operations

