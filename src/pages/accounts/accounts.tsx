
import { Contract, ethers } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import { useErrorHook } from 'hooks/useErrorHook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useState } from 'react';
import { Accordion, Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

declare let window:any

const Accounts: NextPage = () => {

	const CFG_ERC_20_ABI = require('../../abi/ERC20Facet.json');

	const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()
	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()

	const [TO_TRANSFER_CURRENCY, setToTransferCurrency] = useState<string>('USDT')
  const [TO_TRANSFER_AMOUNT_USD, setToTransferAmountUSD] = useState<string>('0')
  const [TO_TRANSFER_AMOUNT, setToTransferAmount] = useState<string>('0')
  const [TO_TRANSFER_ADDRESS, setToTransferAddress] = useState<string>('')

	const [TO_INVEST_CURRENCY, setToInvestCurrency] = useState<string>('USDT')
  const [TO_INVEST_AMOUNT_USD, setToInvestAmountUSD] = useState<string>('0')
  const [TO_INVEST_AMOUNT, setToInvestAmount] = useState<string>('0')

  const [TO_REFUND_AMOUNT, setToRefundAmount] = useState<string>()
  const [TO_REFUND_AMOUNT_USD, setToRefundAmountUSD] = useState<string>()
	const [TO_REFUND_CURRENCY, setToRefundCurrency] = useState<string>()

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
		loadYourCryptocommodities, CRYPTOCOMMODITIES,
	} = useFactoryHook();	

	const { 
		loadERC20Features, TOKEN_INITIALIZED, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY,
		getBalancesCygasMeWallet, BALANCES_ERC_20_ME_WALLET, 
		getBalancesCygasSearchAddress, BALANCES_ERC_20_SEARCH_ADDRESS, 
		getBalancesCygasICOWallet, BALANCES_ERC_20_ICO_WALLET, 
		getBalancesCygasTargetWallet, BALANCES_ERC_20_TARGET_WALLET, 
	} = useERC20Hook();

	const onSelectToRefundCurrency = async (symbol: any)=>{
		setToRefundCurrency(symbol);

		let contribution = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contribution: ` + contribution);
		setToRefundAmount(contribution);

		let contributionUSD = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getuUSDContribution(METAMASK_CURRENT_ACCOUNT, symbol);
	  console.log(`contributionUSD: ` + contributionUSD);
		setToRefundAmountUSD(contributionUSD);
	}

	const onSelectToTransferCurrency = async (symbol: any)=>{
		setToTransferCurrency(symbol);
	}
	async function claim() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.claim().then(await useResponseHook).catch(useErrorHook);
	}
	// click purchase
	async function invest() {

		let amountToInvest: number = Number(TO_INVEST_AMOUNT)
		console.log('investing amountToInvest ', amountToInvest, TO_INVEST_CURRENCY);

		if(TO_INVEST_CURRENCY == 'COIN') {
			console.log('SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address ', SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address);

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
				.then(await useResponseHook).catch(useErrorHook);

		} else if(TO_INVEST_CURRENCY == 'ERC_20') {
			// N/A

		} else {
			console.log('SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address ', SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address);

			let amountToken: string = ICO_PAYMENT_METHODS[TO_INVEST_CURRENCY];
			console.log('amountToken: ', amountToken);
			let paymentTokenAddress: string = amountToken[0];
			console.log('paymentTokenAddress: ', paymentTokenAddress);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			const paymentToken: Contract = new ethers.Contract(paymentTokenAddress, CFG_ERC_20_ABI, signer);
			await paymentToken?.approve(SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.address, ethers.utils.parseEther(amountToInvest.toString())).then(await useResponseHook).catch(useErrorHook);
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.depositTokens(TO_INVEST_CURRENCY, ethers.utils.parseEther(amountToInvest.toString())).then(await useResponseHook).catch(useErrorHook);
		}

	}
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
			}).then(await useResponseHook).catch(useErrorHook);

		} else if(TO_TRANSFER_CURRENCY == 'ERC_20') {

		} else {
			let currencyMap = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPaymentToken(TO_TRANSFER_CURRENCY);
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			const signer = provider.getSigner();
			let currencyAddress = currencyMap[0];
			let currencyDecimals = currencyMap[3];
			const currencyToken: Contract = new ethers.Contract(currencyAddress, CFG_ERC_20_ABI, signer);
			console.log('currencyToken ', currencyToken);
			await currencyToken.transfer(TO_TRANSFER_ADDRESS, (BigInt(Number(TO_TRANSFER_AMOUNT) * 10**Number(currencyDecimals))).toString()).then(await useResponseHook).catch(useErrorHook);
		}

	}

	const onSelectToInvestCurrency = async (symbol: any)=>{
		setToInvestCurrency(symbol);
	}

	async function refund() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.refund(TO_REFUND_CURRENCY).then(await useResponseHook).catch(useErrorHook);
	}
  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
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

			</Container>
		</div>

	);
}

export default Accounts