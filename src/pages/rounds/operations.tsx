
import { Contract } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useErrorHook } from 'hooks/useErrorHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';


const Operations: NextPage = () => {

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT, setSelectedCryptocommodityTokenContract] = useState<Contract>()

	const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()

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
	type MapType = { 
		[id: string]: string; 
	}
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
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTargetWalletAddress(WITHDRAW_TARGET_ADDRESS).then(await useResponseHook).catch(useErrorHook);
	}

	async function setTokenAddressOnSC() {
		console.log(`setting token address: ` + TOKEN_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setTokenAddress(TOKEN_ADDRESS).then(await useResponseHook).catch(useErrorHook);
	}

	async function refundAll() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refundAll(TO_REFUND_ALL_CURRENCY).then(await useResponseHook).catch(useErrorHook);
	}

	async function setVestingTokenOnSC() {
		console.log(`setting VESTING_ADDRESS: ` + VESTING_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setVestingAddress(VESTING_ADDRESS).then(await useResponseHook).catch(useErrorHook);
	}

	async function claimAll() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claimAll().then(await useResponseHook).catch(useErrorHook);
	}

	async function withdrawICO() {
		console.log(`WITHDRAW_CURRENCY: ` + WITHDRAW_CURRENCY);
		console.log(`WITHDRAW_PERCENTAGE: ` + WITHDRAW_PERCENTAGE);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.withdraw(WITHDRAW_CURRENCY, WITHDRAW_PERCENTAGE).then(await useResponseHook).catch(useErrorHook);
	}

	// click purchase
	async function setCrowdsaleStage(stage: number) {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setCrowdsaleStage(stage).then(await useResponseHook).catch(useErrorHook);
	}
	async function reset() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.reset().then(await useResponseHook).catch(useErrorHook);
	}

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

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
						<Col><div><Form.Text className="color-frame">ICO Cryptocommodities Required</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame">ICO Cryptocommodities Current</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame"></Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={ ICO_TOTAL_uUSD_INVESTED / ICO_PRICE } ></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ICO_WALLET} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={transferClaimableAmountToICO}> {KEY_ICON()} Transfer</Button></Col>
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
					<Row>
						<Col><div><Form.Text className="color-frame">Enter ERC-20 Token</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onChange={(event) => setTokenAddress(event.target.value)} value={TOKEN_ADDRESS} ></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={setTokenAddressOnSC}> {KEY_ICON()} Update</Button></Col>
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

			</Container>
		</div>
		
	);

}

export default Operations

