
import { Contract } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useContext, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

import { KEY_ICON } from '../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';

const Operations: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************

	const { isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT, setSelectedCryptocommodityTokenContract] = useState<Contract>()

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

	const { handleICOReceipt, handleError } = useResponseHook()
	
	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************

	const [TO_REFUND_ALL_CURRENCY, setToRefundAllCurrency] = useState<string>()
  const [TO_REFUND_ALL_AMOUNT_USD, setToRefundAllAmountUSD] = useState<string>()
	const [TO_REFUND_ALL_AMOUNT, setToRefundAllAmount] = useState<string>()

	const [ICO_TOTAL_uUSD_INVESTED, setTotaluUSDInvested] = useState<number>(0)

	const [BALANCES_ERC_20_ICO_WALLET, setBalancesCygasICOWallet] = useState<string>('0')

	const [WITHDRAW_CURRENCY, setWithdrawCurrency] = useState<string>('')

	const [TOKEN_ADDRESS, setTokenAddress] = useState<string>()

	const onSelectToRefundAllCurrency = async (symbol: any)=>{
		setToRefundAllCurrency(symbol);

		let invested = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(symbol);
	  console.log(`invested: ` + invested);
	  console.log(`invested: ` + invested[4]);
		setToRefundAllAmountUSD(invested[4]);
	  console.log(`investedUSD: ` + invested[5]);
		setToRefundAllAmount(invested[5]);
	}

	// transferClaimableAmountToICO
	async function transferClaimableAmountToICO() {
		console.log(`ICO CATokens Required: ` + ICO_TOTAL_uUSD_INVESTED / ICO_PRICE);
	  console.log(`ICO CATokens Current: ` + BALANCES_ERC_20_ICO_WALLET);
		let amountRequiredCATokens = BigInt(ICO_TOTAL_uUSD_INVESTED * 10**18 / ICO_PRICE);
		let amountCurrentCATokens = BigInt(BALANCES_ERC_20_ICO_WALLET) * BigInt(10**18);
	  console.log(`amountToTransferCATokensWithDecimals: ` + (amountRequiredCATokens - amountCurrentCATokens));
		await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.transfer(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address, amountRequiredCATokens - amountCurrentCATokens)
	}

	const onSelectToWitdrawCurrency = async (symbol: any)=>{
		setWithdrawCurrency(symbol);
	}
	const [VESTING_ADDRESS, setVestingAddress] = useState<string>()
	const [WITHDRAW_TARGET_ADDRESS, setWithdrawTargetAddress] = useState<string>('')
	const [WITHDRAW_PERCENTAGE, setWithdrawPercentage] = useState<string>('')

	// whitelist user
	async function setTargetWalletAddress() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTargetWalletAddress(WITHDRAW_TARGET_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	async function setTokenAddressOnSC() {
		console.log(`setting token address: ` + TOKEN_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTokenAddress(TOKEN_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	async function refundAll() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refundAll(TO_REFUND_ALL_CURRENCY).then(await handleICOReceipt).catch(handleError);
	}

	async function setVestingTokenOnSC() {
		console.log(`setting VESTING_ADDRESS: ` + VESTING_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setVestingAddress(VESTING_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

	async function claimAll() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claimAll().then(await handleICOReceipt).catch(handleError);
	}

	async function withdrawICO() {
		console.log(`WITHDRAW_CURRENCY: ` + WITHDRAW_CURRENCY);
		console.log(`WITHDRAW_PERCENTAGE: ` + WITHDRAW_PERCENTAGE);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.withdraw(WITHDRAW_CURRENCY, WITHDRAW_PERCENTAGE).then(await handleICOReceipt).catch(handleError);
	}

	// click purchase
	async function setCrowdsaleStage(stage: number) {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setCrowdsaleStage(stage).then(await handleICOReceipt).catch(handleError);
	}
	async function reset() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.reset().then(await handleICOReceipt).catch(handleError);
	}

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				{ !isDisconnected && selectedCrypto != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled. You need to create a CryptoCommodity to enable them.</Form.Text></Col>
				</Row>
				}

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><Form.Text className="">Current ICO Stage</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="text" className="form-control form-control-lg color-frame text-center border-0" value={ICO_CURRENT_STAGE_TEXT} disabled={true}></input></Col>
						{ICO_CURRENT_STAGE == STAGE.NOT_STARTED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setCrowdsaleStage(STAGE.ONGOING)}> {KEY_ICON()} START </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setCrowdsaleStage(STAGE.ONHOLD)}> {KEY_ICON()} HOLD </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.ONHOLD || ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setCrowdsaleStage(STAGE.ONGOING)}> {KEY_ICON()} CONTINUE </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.ONHOLD ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setCrowdsaleStage(STAGE.FINISHED)}> {KEY_ICON()} FINISH </Button></Col> : "" }
						{ICO_CURRENT_STAGE == STAGE.FINISHED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => reset()}> {KEY_ICON()} RESET </Button></Col> : "" }
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
						<Col xs={3}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => refundAll()}> {KEY_ICON()} Refund All</Button></Col>
					</Row>
				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">

					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Claim ERC-20 to Investors</div></div></Col>
					</Row>

					<Row>
						<Col><div><Form.Text className="color-frame">ICO Cryptocommodities Required</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">ICO Cryptocommodities Current</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame"></Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={ ICO_TOTAL_uUSD_INVESTED / ICO_PRICE } ></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ICO_WALLET} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={transferClaimableAmountToICO}> {KEY_ICON()} Transfer</Button></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Enter Vesting Token</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={isDisconnected} onChange={(event) => setVestingAddress(event.target.value)} value={VESTING_ADDRESS} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={setVestingTokenOnSC}> {KEY_ICON()} Update</Button></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Enter ERC-20 Token</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={isDisconnected} onChange={(event) => setTokenAddress(event.target.value)} value={TOKEN_ADDRESS} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={setTokenAddressOnSC}> {KEY_ICON()} Update</Button></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row><Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => claimAll()}> {KEY_ICON()}Claim All Investors</Button></Col></Row>
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
						<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" value={WITHDRAW_TARGET_ADDRESS} disabled={isDisconnected} onChange={(event) => setWithdrawTargetAddress(event.target.value)} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setTargetWalletAddress()}> {KEY_ICON()} Update</Button></Col>
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
						<Col xs={3}><input className="form-control form-control-lg bg-yellow color-frame border-0" value={WITHDRAW_PERCENTAGE} onChange={(event) => setWithdrawPercentage(event.target.value)} disabled={isDisconnected} ></input></Col>
						<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={BALANCES_PAYMENT_TOKENS_ICO_WALLET && BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY] ? (Number(BALANCES_PAYMENT_TOKENS_ICO_WALLET[WITHDRAW_CURRENCY]) / 10**Number(ICO_PAYMENT_METHODS[WITHDRAW_CURRENCY][3])) * Number(WITHDRAW_PERCENTAGE) / 100 : 0} disabled={true}></input></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => withdrawICO()}> {KEY_ICON()}Withdraw</Button></Col>
					</Row>
				</Form.Group>

			</Container>
		</div>
		
	);

}

export default Operations

