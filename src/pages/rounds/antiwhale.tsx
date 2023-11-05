
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook'

import { useAccount } from 'wagmi'

import { KEY_ICON } from '../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';

const AntiwhaleFeatures: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************

	const { isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

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




	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************

	const [ICO_USER_TO_WHITELIST, setUserToWhitelist] = useState<string | undefined>()
	// whitelist user
	async function whitelistUser(flag: boolean) {
		console.log("SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT " + contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT);

		if(flag) {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.whitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
		} else {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unwhitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
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
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.blacklistUser(user).then(await handleICOReceipt).catch(handleError);
		} else {
			await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unblacklistUser(user).then(await handleICOReceipt).catch(handleError);
		}
	}

	// whitelist user
	async function setIsBlacklist(event:any) {

		// process transaction
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setUseBlacklist(event.target.checked).then(await handleICOReceipt).catch(handleError);
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

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				{ CAN_TYPE ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <a href='../admin/cryptocommodities'>this page</a> to create one.</Form.Text></Col>
				</Row>
				}

				<Row className="mb-3"></Row>
					<Form.Group className="p-3 border border-dark rounded bg-light-grey">
						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Whitelist</div></div></Col>
						</Row>
						<Row className="mb-3"></Row>
						<Row>
							<table className="table table-dark">
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Investor</th>
										<th scope="col">Amount</th>
									</tr>
								</thead>
								<tbody>
									{ICO_WHITELIST_USER_LIST?.map((item, index) => (
										<tr key={index}>
											<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => isWhitelisted(item, index+1)}>{(index + 1) + "" }</Button></td>
											<td>{item}</td>
											<td id={"whitelistedValue" + (index+1) }></td>
										</tr>
									))}
								</tbody>
							</table>
						</Row>
						<Row className="w-100">
							<Col className="text-center">
								{ (ICO_WHITELIST_USER_COUNT === undefined ) ? "" : "" }
								{ (ICO_WHITELIST_USER_COUNT != undefined && ICO_WHITELIST_USER_COUNT == 0 ) ? "Not whitelisted investors yet" : "" }
								{ (ICO_WHITELIST_USER_COUNT != undefined && ICO_WHITELIST_USER_COUNT > 0) ? "Click to see " + ICO_WHITELIST_USER_COUNT + " whitelisted investors" : "" }
							</Col>
						</Row>
						<Row className="mb-3"></Row>

						<Row className="mb-3"></Row>
						<Row>
							<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!CAN_TYPE}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE}  onClick={() => whitelistUser(true)}> {KEY_ICON()} Whitelist Investor</Button></Col>
						</Row>
						<Row className="mb-3"></Row>
						<Row>
							<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!CAN_TYPE}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => whitelistUser(false)}> {KEY_ICON()} Unwhitelist Investor</Button></Col>
						</Row>

					</Form.Group>

					<Row className="mb-3"></Row>
					<Form.Group className="p-3 border border-dark rounded bg-light-grey">
						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Blacklist</div></div></Col>
						</Row>
						<Row className="mb-3"></Row>

						<Row className="mb-3"></Row>
						<Row>
							<Col><Form.Check type="checkbox" label="Exclude blacklisted investors" className="color-frame" disabled={!CAN_TYPE} onChange={setIsBlacklist} defaultChecked={ICO_IS_USE_BLACKLIST} /></Col>
						</Row>

						<Row className="mb-3"></Row>
						<Row className="w-100">
							<Col className="text-center">
								{ (ICO_BLACKLIST_USER_COUNT === undefined ) ? "" : "" }
								{ (ICO_BLACKLIST_USER_COUNT != undefined && ICO_BLACKLIST_USER_COUNT == 0 ) ? "Not blacklisted investors yet" : "" }
								{ (ICO_BLACKLIST_USER_COUNT != undefined && ICO_BLACKLIST_USER_COUNT > 0) ? "Click to see " + ICO_BLACKLIST_USER_COUNT + " blacklisted investors" : "" }
							</Col>
						</Row>

						<Row className="mb-3">
							<table className="table table-dark">
								<thead>
									<tr>
										<th scope="col">#</th>
										<th scope="col">Investor</th>
										<th scope="col">Amount</th>
									</tr>
								</thead>
								<tbody>
									{ICO_BLACKLIST_USER_LIST?.map((item, index) => (
										<tr key={index}>
											<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE}  onClick={() => isBlacklisted(item, index+1)}>{(index + 1) + "" }</Button></td>
											<td>{item}</td>
											<td id={"blacklistedValue" + (index+1) }></td>
										</tr>
									))}
								</tbody>
							</table>
						</Row>
						<Row>
							<Col><input id="blacklistUser" className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={!CAN_TYPE}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => blacklistUser('blacklistUser', true)}> {KEY_ICON()} Blacklist Investor</Button></Col>
						</Row>
						<Row className="mb-3"></Row>
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

