
"use client";

import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook'

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import Link from 'next/link';
import { useSetChain, useWallets } from '@web3-onboard/react';

const AntiwhaleFeatures: NextPage = () => {

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
	const loadData = async ()=>{

		if (!connectedChain) {
			console.log('No chainId found. Aborting..')
			return;
		}

		if(!selectedCrypto)
			return;

		console.log('loadYourCryptocommodities');
		loadYourCryptocommodities();

		console.log('loadERC20Features');
		loadAntiWhale();
	}

	useEffect(() => {
		loadData();
	}, [])

	useEffect(() => {
		loadData();
	}, [connectedWallets])

	useEffect(() => {
		loadData();
	}, [selectedCrypto])

	useEffect(() => {
		setWhitelistUserList(ICO_WHITELIST_USER_LIST);
	}, [ICO_WHITELIST_USER_LIST])

	useEffect(() => {
		setWhitelistUserCount(ICO_WHITELIST_USER_COUNT);
	}, [ICO_WHITELIST_USER_COUNT])

	useEffect(() => {
		setIsUseBlacklist(ICO_IS_USE_BLACKLIST);
	}, [ICO_IS_USE_BLACKLIST])

	useEffect(() => {
		setBlacklistUserList(ICO_BLACKLIST_USER_LIST);
	}, [ICO_BLACKLIST_USER_LIST])

	useEffect(() => {
		setBlacklistUserCount(ICO_BLACKLIST_USER_COUNT);
	}, [ICO_BLACKLIST_USER_COUNT])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [X_ICO_WHITELIST_USER_LIST, setWhitelistUserList] = useState([])
  const [X_ICO_WHITELIST_USER_COUNT, setWhitelistUserCount] = useState<number>(0);
	const [X_ICO_IS_USE_BLACKLIST, setIsUseBlacklist] = useState<boolean | undefined>()
	const [X_ICO_BLACKLIST_USER_LIST, setBlacklistUserList] = useState([]);
	const [X_ICO_BLACKLIST_USER_COUNT, setBlacklistUserCount] = useState<number | undefined>()

	const [ICO_USER_TO_WHITELIST, setUserToWhitelist] = useState<string | undefined>()
	// whitelist user
	async function whitelistUser(flag: boolean) {
		console.log("SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT " + contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT);

		if(flag) {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.whitelistUser(ICO_USER_TO_WHITELIST)
				.then(await handleICOReceipt)
				.then(await loadAntiWhale)
				.catch(await handleError);
		} else {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unwhitelistUser(ICO_USER_TO_WHITELIST)
				.then(await handleICOReceipt)
				.then(await loadAntiWhale)
				.catch(await handleError);
		}

	}

	// blacklist user
	async function blacklistUser(elementId: string, flag: boolean) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var user;// = element.value;

		// process transaction
		if(flag) {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.blacklistUser(user)
				.then(await handleICOReceipt)
				.then(await loadAntiWhale)
				.catch(await handleError);
		} else {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unblacklistUser(user)
				.then(await handleICOReceipt)
				.then(await loadAntiWhale)
				.catch(await handleError);
		}
	}

	// whitelist user
	async function setIsBlacklist(event:any) {

		// process transaction
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setUseBlacklist(event.target.checked).then(await handleICOReceipt).catch(handleError);
	}

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: `, !connectedChain);
		console.log(`selectedCrypto: `, selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: `, ICO_CURRENT_STAGE);
		setCanCreate(!!connectedChain && !!selectedCrypto && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(!!connectedChain && !!selectedCrypto && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED) && CRYPTOCOMMODITIES.includes(selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME));
		setCanType(!!connectedChain && !!selectedCrypto  && CRYPTOCOMMODITIES.includes(selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME));
		setColorCSS(!!connectedChain && !!selectedCrypto ? ' bg-edited' : '');
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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Whitelist</div></div></Col>
					</Row>

					<Row className="m-4"></Row>

					<Row>
						<table className="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Investor</th>
									<th scope="col">Amount</th>
								</tr>
							</thead>
							<tbody>
								{X_ICO_WHITELIST_USER_LIST?.map((item, index) => (
									<tr key={index}>
										<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => isWhitelisted(item, index+1)}>{(index + 1) + "" }</Button></td>
										<td>{item}</td>
										<td id={"whitelistedValue" + (index+1) }></td>
									</tr>
								))}
							</tbody>
						</table>
					</Row>

					<Row className="m-2"></Row>

					<Row className="w-100">
						<Col className="text-center">
							{ (X_ICO_WHITELIST_USER_COUNT === undefined ) ? "" : "" }
							{ (X_ICO_WHITELIST_USER_COUNT != undefined && X_ICO_WHITELIST_USER_COUNT == 0 ) ? "Not whitelisted investors yet" : "" }
							{ (X_ICO_WHITELIST_USER_COUNT != undefined && X_ICO_WHITELIST_USER_COUNT > 0) ? X_ICO_WHITELIST_USER_COUNT + " whitelisted investors" : "" }
						</Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!CAN_TYPE}></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || !ICO_USER_TO_WHITELIST}  onClick={() => whitelistUser(true)}> {KEY_ICON()} Whitelist Investor</Button></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!CAN_TYPE}></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || !ICO_USER_TO_WHITELIST} onClick={() => whitelistUser(false)}> {KEY_ICON()} Unwhitelist Investor</Button></Col>
					</Row>

					<Row className="m-2"></Row>

				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Blacklist</div></div></Col>
					</Row>

					<Row className="m-4"></Row>

					<Row>
						<Col><Form.Check type="checkbox" label="Exclude blacklisted investors" className="color-frame" disabled={!CAN_TYPE} onChange={setIsBlacklist} defaultChecked={X_ICO_IS_USE_BLACKLIST} /></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row className="mb-3">
						<table className="table">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Investor</th>
									<th scope="col">Amount</th>
								</tr>
							</thead>
							<tbody>
								{X_ICO_BLACKLIST_USER_LIST?.map((item, index) => (
									<tr key={index}>
										<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE}  onClick={() => isBlacklisted(item, index+1)}>{(index + 1) + "" }</Button></td>
										<td>{item}</td>
										<td id={"blacklistedValue" + (index+1) }></td>
									</tr>
								))}
							</tbody>
						</table>
					</Row>

					<Row className="m-2"></Row>

					<Row className="w-100">
						<Col className="text-center">
							{ (X_ICO_BLACKLIST_USER_COUNT === undefined ) ? "" : "" }
							{ (X_ICO_BLACKLIST_USER_COUNT != undefined && X_ICO_BLACKLIST_USER_COUNT == 0 ) ? "Not blacklisted investors yet" : "" }
							{ (X_ICO_BLACKLIST_USER_COUNT != undefined && X_ICO_BLACKLIST_USER_COUNT > 0) ? "Click to see " + X_ICO_BLACKLIST_USER_COUNT + " blacklisted investors" : "" }
						</Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><input id="blacklistUser" className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={!CAN_TYPE}></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => blacklistUser('blacklistUser', true)}> {KEY_ICON()} Blacklist Investor</Button></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><input id="unblacklistUser" className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={!CAN_TYPE}></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => blacklistUser('unblacklistUser', false)}> {KEY_ICON()} UnBlacklist Investor</Button></Col>
					</Row>

				</Form.Group>

			</Container>
		</div>
	);

}

export default AntiwhaleFeatures

