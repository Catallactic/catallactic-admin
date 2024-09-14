"use client";

import { Contract } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useAccount, useNetwork } from 'wagmi'

import { truncateEthAddress, KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import Link from 'next/link';

const Payments: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const { chain } = useNetwork()

	const { isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const [FACTORY_CONTRACT, setFactoryContract] = useState<Contract>()

	const { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, FACTORY_PAYMENT_METHODS,
		onFactorySelectPaymentMethod, FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_DECIMALS, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_DYN_PRICE,
		handleShowFunctions, showFunctionsModal, SHOW_FUNCTIONS, INTERFACE_MODAL,
	} = useFactoryHook();	

	const { 
		loadICOPaymentMethod, ICO_PAYMENT_SYMBOLS, ICO_PAYMENT_METHODS, 
		onICOSelectPaymentMethod, ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOL_DECIMALS, ICO_PAYMENT_SYMBOL_ADDRESS, ICO_PAYMENT_SYMBOL_PRICE, ICO_PAYMENT_SYMBOL_REF, ICO_PAYMENT_SYMBOL_DYN_PRICE,
		loadICOFeatures, ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_MIN_TRANSFER, ICO_MAX_TRANSFER, ICO_MAX_INVESTMENT, ICO_WHITELIST_THRESHOLD, VESTING_SCHEDULE_PERCENTAGE, VESTING_CURRENT_PROGRAM_ID, ICO_CURRENT_STAGE, ICO_CURRENT_STAGE_TEXT, STAGE,
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
	useEffect(() => {

		console.log('createEnvContracts');
		createEnvContracts(chain?.id ? chain.id : 0);

		console.log('loadFactoryPaymentMethod');
		loadFactoryPaymentMethod();

		console.log('loadICOPaymentMethod');
		loadICOPaymentMethod();

	}, [])

	useEffect(() => {

		setFactoryPaymentSymbolSymbol(FACTORY_PAYMENT_SYMBOL_SYMBOL)
		setFactoryPaymentSymbolDecimals(FACTORY_PAYMENT_SYMBOL_DECIMALS)
		setFactoryPaymentSymbolAddress(FACTORY_PAYMENT_SYMBOL_ADDRESS)
		setFactoryPaymentSymbolPrice(FACTORY_PAYMENT_SYMBOL_PRICE)
		setFactoryPaymentSymbolRef(FACTORY_PAYMENT_SYMBOL_REF)

	}, [FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_DECIMALS, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_REF])

	useEffect(() => {

		setICOPaymentSymbolSymbol(ICO_PAYMENT_SYMBOL_SYMBOL)
		setICOPaymentSymbolDecimals(ICO_PAYMENT_SYMBOL_DECIMALS)
		setICOPaymentSymbolAddress(ICO_PAYMENT_SYMBOL_ADDRESS)
		setICOPaymentSymbolPrice(ICO_PAYMENT_SYMBOL_PRICE)
		setICOPaymentSymbolRef(ICO_PAYMENT_SYMBOL_REF)
		setICOPaymentSymbolDynPrice(ICO_PAYMENT_SYMBOL_DYN_PRICE)

	}, [ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOL_DECIMALS, ICO_PAYMENT_SYMBOL_ADDRESS, ICO_PAYMENT_SYMBOL_PRICE, ICO_PAYMENT_SYMBOL_REF, ICO_PAYMENT_SYMBOL_DYN_PRICE])


	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	// factory payment methods
	const [X_FACTORY_PAYMENT_SYMBOL_SYMBOL, setFactoryPaymentSymbolSymbol] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_DECIMALS, setFactoryPaymentSymbolDecimals] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_ADDRESS, setFactoryPaymentSymbolAddress] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_PRICE, setFactoryPaymentSymbolPrice] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_REF, setFactoryPaymentSymbolRef] = useState<any | undefined>()

	// ico payment methods
	const [X_ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()
	const [X_ICO_PAYMENT_SYMBOL_DECIMALS, setICOPaymentSymbolDecimals] = useState<any | undefined>()
	const [X_ICO_PAYMENT_SYMBOL_ADDRESS, setICOPaymentSymbolAddress] = useState<any | undefined>()
	const [X_ICO_PAYMENT_SYMBOL_PRICE, setICOPaymentSymbolPrice] = useState<any | undefined>()
	const [X_ICO_PAYMENT_SYMBOL_REF, setICOPaymentSymbolRef] = useState<any | undefined>()
	const [X_ICO_PAYMENT_SYMBOL_DYN_PRICE, setICOPaymentSymbolDynPrice] = useState<any | undefined>()

	async function saveICOPaymentMethod() {
		console.log('FACTORY_PAYMENT_SYMBOL_SYMBOL', X_FACTORY_PAYMENT_SYMBOL_SYMBOL);

		console.log(`isDisconnected: ` + isDisconnected);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);

		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPaymentToken(X_FACTORY_PAYMENT_SYMBOL_SYMBOL, X_FACTORY_PAYMENT_SYMBOL_ADDRESS, X_FACTORY_PAYMENT_SYMBOL_REF, X_FACTORY_PAYMENT_SYMBOL_PRICE, X_FACTORY_PAYMENT_SYMBOL_DECIMALS)
			.then(await handleICOReceipt)
			.then(await loadICOPaymentMethod)
			.catch(handleError);

		cancelICOPaymentMethod();
	}

	async function deleteICOPaymentMethod() {
		console.log('deleteICOPaymentMethod', X_ICO_PAYMENT_SYMBOL_SYMBOL);

		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.deletePaymentToken(X_ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(X_ICO_PAYMENT_SYMBOL_SYMBOL))
			.then(await handleICOReceipt)
			.then(await loadICOPaymentMethod)
			.catch(handleError);

		cancelICOPaymentMethod();
	}

	async function cancelICOPaymentMethod() {
		console.log('cancelICOPaymentMethod');

		setICOPaymentSymbolSymbol(undefined);
		setICOPaymentSymbolAddress(undefined);
		setICOPaymentSymbolRef(undefined);
		setICOPaymentSymbolPrice(undefined);
		setICOPaymentSymbolDecimals(undefined);
	}

	// ico dynamic price
	const [DYNAMIC_PRICE, setDynamicPrice] = useState<boolean>()
	async function setDynamicPriceSC(event:any) {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setDynamicPrice(event.target.checked).then(await handleICOReceipt).catch(handleError);
	}

	// receive address
	const [SELECTED_CRYPTOCOMMODITY_RECEIVE_ADDRESS, setSelectedCryptocommodityReceiveAddress] = useState<any>();

	async function setReceiveAddress() {
		console.log("setReceiveAddress", SELECTED_CRYPTOCOMMODITY_RECEIVE_ADDRESS);
		
		await contracts.SELECTED_CRYPTOCOMMODITY_CONTRACT?.setReceiveFacet(SELECTED_CRYPTOCOMMODITY_RECEIVE_ADDRESS);
	}

	// balances
	const [ICO_PAYMENT_METHOD_SEARCH_ADDRESS, setICOPaymentMethodSearchAddress] = useState<string | undefined>()
	const [ICO_PAYMENT_METHOD_SEARCH_BALANCE, setICOPaymentMethodSearchBalance] = useState<string | undefined>()

	async function getICOPaymentMethodBalance() {
		console.log('ICO_PAYMENT_METHOD_SEARCH_ADDRESS', ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log('ICO_PAYMENT_SYMBOL_ADDRESS', X_ICO_PAYMENT_SYMBOL_ADDRESS);

		console.log('balanceOf4');
		let balance = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(ICO_PAYMENT_METHOD_SEARCH_ADDRESS);
		console.log(balance);
		setICOPaymentMethodSearchBalance(balance);
	}

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: ` + isDisconnected);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(!isDisconnected && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(!isDisconnected && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(!isDisconnected && selectedCrypto != undefined);
		setColorCSS(!isDisconnected && selectedCrypto != undefined ? ' bg-yellow' : '');
	}, [isDisconnected, selectedCrypto, ICO_CURRENT_STAGE])

  return (

    <div className="bg-light d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				{ CAN_TYPE ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <Link href="/admin/cryptocommodities">this page</Link> to create one.</Form.Text></Col>
				</Row>
				}

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
									{ X_FACTORY_PAYMENT_SYMBOL_SYMBOL }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{FACTORY_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={X_FACTORY_PAYMENT_SYMBOL_SYMBOL == item}>
												{item}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
						<Col xs={4}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE || !X_FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveICOPaymentMethod()}>Install</Button></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Installed Payment Tokens</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onICOSelectPaymentMethod}>
								<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={!ICO_PAYMENT_SYMBOLS}>
									{ X_ICO_PAYMENT_SYMBOL_SYMBOL }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={X_ICO_PAYMENT_SYMBOL_SYMBOL == item}>
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
						<Col xs={4}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={ !CAN_TYPE } onChange={event => setICOPaymentSymbolSymbol(event.target.value)} value={X_ICO_PAYMENT_SYMBOL_SYMBOL ? X_ICO_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
						<Col xs={4}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={ !CAN_TYPE } onChange={event => setICOPaymentSymbolAddress(event.target.value)} value={X_ICO_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(X_ICO_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={ !CAN_TYPE } onChange={event => setICOPaymentSymbolDecimals(event.target.value)} value={X_ICO_PAYMENT_SYMBOL_DECIMALS ? X_ICO_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
					</Row>

					<Row>
						<Col xs={4}><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Ref</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
					</Row>

					<Row>
						<Col xs={4}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={ !CAN_TYPE } onChange={event => setICOPaymentSymbolPrice(event.target.value)} value={X_ICO_PAYMENT_SYMBOL_PRICE ? X_ICO_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
						<Col xs={4}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={ !CAN_TYPE } onChange={event => setICOPaymentSymbolRef(event.target.value)} value={X_ICO_PAYMENT_SYMBOL_REF ? truncateEthAddress(X_ICO_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ X_ICO_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
					</Row>

					<Row className="mb-3"></Row>

					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE || !X_ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => deleteICOPaymentMethod()}>{KEY_ICON()} Uninstall</Button></Col>
						{/*<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !METAMASK_CURRENT_ACCOUNT || !ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveICOPaymentMethod()}>{KEY_ICON()} Save</Button></Col>*/}
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE || !X_ICO_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelICOPaymentMethod()}>Cancel</Button></Col>
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
						<Col xs={8}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={ !CAN_TYPE } onChange={(event) => setSelectedCryptocommodityReceiveAddress(event.target.value) }></input></Col>
						<Col xs={4}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE } onClick={setReceiveAddress}>Update</Button></Col>
					</Row>
				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Dynamic Prices</div></div></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col><Form.Check type="checkbox" label="Dynamic Prices" className="color-frame" disabled={ !CAN_TYPE } onChange={setDynamicPriceSC} defaultChecked={DYNAMIC_PRICE} /></Col>
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

