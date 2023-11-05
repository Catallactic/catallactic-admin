
import { NextPage } from 'next'
import { useContext, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook'
import { Contract } from 'ethers';

import { useAccount } from 'wagmi'

import { KEY_ICON } from '../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';

const AntiwhaleFeatures: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************

	const { isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()

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
		console.log("SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT " + SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT);

		if(flag) {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.whitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
		} else {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unwhitelistUser(ICO_USER_TO_WHITELIST).then(await handleICOReceipt).catch(handleError);
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
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.blacklistUser(user).then(await handleICOReceipt).catch(handleError);
		} else {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unblacklistUser(user).then(await handleICOReceipt).catch(handleError);
		}
	}

	// whitelist user
	async function setIsBlacklist(event:any) {

		// process transaction
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setUseBlacklist(event.target.checked).then(await handleICOReceipt).catch(handleError);
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
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Whitelist</div></div></Col>
						</Row>
						<Row className="mb-3"></Row>
						<Accordion className="inner-accordion">
							<Accordion.Item className="border-0" eventKey="0">
							<Accordion.Header>
									<Row className="w-100">
										<Col className="text-center">
											{ (ICO_WHITELIST_USER_COUNT === undefined ) ? "" : "" }
											{ (ICO_WHITELIST_USER_COUNT != undefined && ICO_WHITELIST_USER_COUNT == 0 ) ? "Not whitelisted investors yet" : "" }
											{ (ICO_WHITELIST_USER_COUNT != undefined && ICO_WHITELIST_USER_COUNT > 0) ? "Click to see " + ICO_WHITELIST_USER_COUNT + " whitelisted investors" : "" }
										</Col>
									</Row>
								</Accordion.Header>
								<Accordion.Body className="bg-frame">
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
												{ICO_WHITELIST_USER_LIST?.map((item, index) => (
													<tr key={index}>
														<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => isWhitelisted(item, index+1)}>{(index + 1) + "" }</Button></td>
														<td>{item}</td>
														<td id={"whitelistedValue" + (index+1) }></td>
													</tr>
												))}
											</tbody>
										</table>
									</Row>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>

						<Row className="mb-3"></Row>
						<Row>
							<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setUserToWhitelist(event.target.value)} disabled={isDisconnected}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected}  onClick={() => whitelistUser(true)}> {KEY_ICON()} Whitelist Investor</Button></Col>
						</Row>
						<Row className="mb-3"></Row>
						<Row>
							<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setUserToWhitelist(event.target.value)} disabled={isDisconnected}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => whitelistUser(false)}> {KEY_ICON()} Unwhitelist Investor</Button></Col>
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
							<Col><Form.Check type="checkbox" label="Exclude blacklisted investors" className="color-frame"  onChange={setIsBlacklist} defaultChecked={ICO_IS_USE_BLACKLIST} /></Col>
						</Row>

						<Row className="mb-3"></Row>
						{ ICO_IS_USE_BLACKLIST ?
						<Accordion className="inner-accordion">
							<Accordion.Item className="border-0" eventKey="0">
							<Accordion.Header>
									<Row className="w-100">
										<Col className="text-center">
											{ (ICO_BLACKLIST_USER_COUNT === undefined ) ? "" : "" }
											{ (ICO_BLACKLIST_USER_COUNT != undefined && ICO_BLACKLIST_USER_COUNT == 0 ) ? "Not blacklisted investors yet" : "" }
											{ (ICO_BLACKLIST_USER_COUNT != undefined && ICO_BLACKLIST_USER_COUNT > 0) ? "Click to see " + ICO_BLACKLIST_USER_COUNT + " blacklisted investors" : "" }
										</Col>
									</Row>
								</Accordion.Header>
								<Accordion.Body className="bg-frame">
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
														<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected}  onClick={() => isBlacklisted(item, index+1)}>{(index + 1) + "" }</Button></td>
														<td>{item}</td>
														<td id={"blacklistedValue" + (index+1) }></td>
													</tr>
												))}
											</tbody>
										</table>
									</Row>
									<Row>
										<Col><input id="blacklistUser" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={isDisconnected}></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => blacklistUser('blacklistUser', true)}> {KEY_ICON()} Blacklist Investor</Button></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col><input id="unblacklistUser" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={isDisconnected}></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => blacklistUser('unblacklistUser', false)}> {KEY_ICON()} UnBlacklist Investor</Button></Col>
									</Row>
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
						: "" }

					</Form.Group>

			</Container>
		</div>
	);

}

export default AntiwhaleFeatures

