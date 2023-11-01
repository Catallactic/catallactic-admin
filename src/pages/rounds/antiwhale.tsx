
import { NextPage } from 'next'
import { useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook'
import { useErrorHook } from 'hooks/useErrorHook'
import { Contract } from 'ethers';

const AntiwhaleFeatures: NextPage = () => {

	const [METAMASK_CURRENT_ACCOUNT, setCurrentAccount] = useState<string | undefined>()

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()

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

	const [ICO_USER_TO_WHITELIST, setUserToWhitelist] = useState<string | undefined>()
	// whitelist user
	async function whitelistUser(flag: boolean) {
		console.log("SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT " + SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT);

		if(flag) {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.whitelistUser(ICO_USER_TO_WHITELIST).then(await useResponseHook).catch(useErrorHook);
		} else {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unwhitelistUser(ICO_USER_TO_WHITELIST).then(await useResponseHook).catch(useErrorHook);
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
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.blacklistUser(user).then(await useResponseHook).catch(useErrorHook);
		} else {
			await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.unblacklistUser(user).then(await useResponseHook).catch(useErrorHook);
		}
	}

	// whitelist user
	async function setIsBlacklist(event:any) {

		// process transaction
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setUseBlacklist(event.target.checked).then(await useResponseHook).catch(useErrorHook);
	}

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

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
														<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => isWhitelisted(item, index+1)}>{(index + 1) + "" }</Button></td>
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
							<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT}  onClick={() => whitelistUser(true)}> {KEY_ICON()} Whitelist Investor</Button></Col>
						</Row>
						<Row className="mb-3"></Row>
						<Row>
							<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" onChange={(event) => setUserToWhitelist(event.target.value)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
							<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => whitelistUser(false)}> {KEY_ICON()} Unwhitelist Investor</Button></Col>
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
														<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT}  onClick={() => isBlacklisted(item, index+1)}>{(index + 1) + "" }</Button></td>
														<td>{item}</td>
														<td id={"blacklistedValue" + (index+1) }></td>
													</tr>
												))}
											</tbody>
										</table>
									</Row>
									<Row>
										<Col><input id="blacklistUser" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => blacklistUser('blacklistUser', true)}> {KEY_ICON()} Blacklist Investor</Button></Col>
									</Row>
									<Row className="mb-3"></Row>
									<Row>
										<Col><input id="unblacklistUser" className="form-control form-control-lg bg-yellow color-frame border-0" disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
										<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => blacklistUser('unblacklistUser', false)}> {KEY_ICON()} UnBlacklist Investor</Button></Col>
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

