
import { Contract } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useErrorHook } from 'hooks/useErrorHook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

const Payments: NextPage = () => {

	const { isDisconnected } = useAccount()

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_CONTRACT, setSelectedCryptocommodityContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT, setSelectedCryptocommodityTokenContract] = useState<Contract>()
	const [FACTORY_CONTRACT, setFactoryContract] = useState<Contract>()

	type MapType = { 
		[id: string]: string; 
	}

	const { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, FACTORY_PAYMENT_METHODS,
		loadYourCryptocommodities, CRYPTOCOMMODITIES,
	} = useFactoryHook();	

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

	const [ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_PRICE, setICOPaymentSymbolPrice] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_DECIMALS, setICOPaymentSymbolDecimals] = useState<any | undefined>()

	const [ICO_PAYMENT_SYMBOL_ADDRESS, setICOPaymentSymbolAddress] = useState<any | undefined>()
	const [ICO_PAYMENT_SYMBOL_REF, setICOPaymentSymbolRef] = useState<any | undefined>()

	const [ICO_PAYMENT_SYMBOL_DYN_PRICE, setICOPaymentSymbolDynPrice] = useState<any | undefined>()


	const [ICO_PAYMENT_METHOD_SEARCH_ADDRESS, setICOPaymentMethodSearchAddress] = useState<string | undefined>()
	const [ICO_PAYMENT_METHOD_SEARCH_BALANCE, setICOPaymentMethodSearchBalance] = useState<string | undefined>()

	const [FACTORY_PAYMENT_SYMBOL_SYMBOL, setFactoryPaymentSymbolSymbol] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DECIMALS, setFactoryPaymentSymbolDecimals] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_ADDRESS, setFactoryPaymentSymbolAddress] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_PRICE, setFactoryPaymentSymbolPrice] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_REF, setFactoryPaymentSymbolRef] = useState<any | undefined>()

	const [DYNAMIC_PRICE, setDynamicPrice] = useState<boolean>()
	async function setDynamicPriceSC(event:any) {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setDynamicPrice(event.target.checked).then(await useResponseHook).catch(useErrorHook);
	}

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

	const [SELECTED_CRYPTOCOMMODITY_RECEIVE_ADDRESS, setSelectedCryptocommodityReceiveAddress] = useState<any>();

	async function deleteICOPaymentMethod() {
		console.log('deleteICOPaymentMethod', ICO_PAYMENT_SYMBOL_SYMBOL);

		const tx = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.deletePaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(ICO_PAYMENT_SYMBOL_SYMBOL));
		await tx.wait();

		loadICOPaymentMethod();
		cancelICOPaymentMethod();
	}

	async function setReceiveAddress() {
		console.log("setReceiveAddress", SELECTED_CRYPTOCOMMODITY_RECEIVE_ADDRESS);
		
		await SELECTED_CRYPTOCOMMODITY_CONTRACT?.setReceiveFacet(SELECTED_CRYPTOCOMMODITY_RECEIVE_ADDRESS);
	}

	async function getICOPaymentMethodBalance() {
		console.log('ICO_PAYMENT_METHOD_SEARCH_ADDRESS', ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log('ICO_PAYMENT_SYMBOL_ADDRESS', ICO_PAYMENT_SYMBOL_ADDRESS);

		console.log('balanceOf4');
		let balance = await SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log(balance);
		setICOPaymentMethodSearchBalance(balance);
	}

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

	const truncateRegex = '^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$';
	const truncateEthAddress = (address: string) => {
		if (!address) return '';
		const match = address.match(truncateRegex);
		if (!match) return address;
		return `${match[1]}…${match[2]}`;
	};

	const onFactorySelectPaymentMethod = async (symbol: any)=>{
		console.log('selectPaymentMethod', symbol);

		let paymentMethod = await FACTORY_CONTRACT?.getPaymentToken(symbol);
		console.log('paymentMethod', paymentMethod);
		setFactoryPaymentSymbolSymbol(symbol);
		setFactoryPaymentSymbolAddress(paymentMethod[0]);
		setFactoryPaymentSymbolRef(paymentMethod[1]);
		setFactoryPaymentSymbolPrice(paymentMethod[2]);
		setFactoryPaymentSymbolDecimals(paymentMethod[3]);

		/*try {
			let dynPrice = await FACTORY_CONTRACT?.getUusdPerToken(symbol);
			console.log('dynPrice' + dynPrice);
			setFactoryPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setFactoryPaymentSymbolDynPrice(0);
		}*/

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

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

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
						<Col xs={4}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveICOPaymentMethod()}>Install</Button></Col>
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
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={event => setICOPaymentSymbolSymbol(event.target.value)} value={ICO_PAYMENT_SYMBOL_SYMBOL ? ICO_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ isDisconnected } onChange={event => setICOPaymentSymbolAddress(event.target.value)} value={ICO_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(ICO_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={event => setICOPaymentSymbolDecimals(event.target.value)} value={ICO_PAYMENT_SYMBOL_DECIMALS ? ICO_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
					</Row>

					<Row>
						<Col xs={4}><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Ref</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
					</Row>

					<Row>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={event => setICOPaymentSymbolPrice(event.target.value)} value={ICO_PAYMENT_SYMBOL_PRICE ? ICO_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ isDisconnected } onChange={event => setICOPaymentSymbolRef(event.target.value)} value={ICO_PAYMENT_SYMBOL_REF ? truncateEthAddress(ICO_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ ICO_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
					</Row>

					<Row className="mb-3"></Row>

					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => deleteICOPaymentMethod()}>{KEY_ICON()} Uninstall</Button></Col>
						{/*<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveICOPaymentMethod()}>{KEY_ICON()} Save</Button></Col>*/}
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelICOPaymentMethod()}>Cancel</Button></Col>
					</Row>

					<Row className="mb-3"></Row>

				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Receive Address</div></div></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col xs={8}><input className="form-control form-control-lg border-0 bg-yellow" onChange={(event) => setSelectedCryptocommodityReceiveAddress(event.target.value) }></input></Col>
						<Col xs={4}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={setReceiveAddress}>Update</Button></Col>
					</Row>
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
						<Col xs={8}><input className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onChange={(event) => setICOPaymentMethodSearchAddress(event.target.value) } value={ICO_PAYMENT_METHOD_SEARCH_ADDRESS} dir="rtl" ></input></Col>
						<Col xs={4}><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS} onClick={()=>{ getICOPaymentMethodBalance(); }} >Balances</Button></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Balance</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg text-center border-0" disabled={true} value={ICO_PAYMENT_METHOD_SEARCH_BALANCE} ></input></Col>
					</Row>
				</Form.Group>


			</Container>
		</div>
		
	);

}

export default Payments

