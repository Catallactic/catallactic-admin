import { NextPage } from 'next'
import { Button, Col, Container, Form, Row, } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import { useState } from 'react'
import { Contract } from "ethers"

import { useAccount } from 'wagmi'

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook'
import { useResponseHook } from 'hooks/useResponseHook'
import { useErrorHook } from 'hooks/useErrorHook'

import { KEY_ICON } from '../../config/config'

const RoundFeatures: NextPage = () => {

	const { isDisconnected } = useAccount()

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

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()

  const [X_ICO_HARD_CAP, setICOHardCap] = useState<number>(0)
	async function setICOHardCapOnSC() {
		console.log(`X_ICO_HARD_CAP: ` + X_ICO_HARD_CAP);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setHardCapuUSD(X_ICO_HARD_CAP * 10**6).then(await useResponseHook).catch(useErrorHook);
	}

  const [X_ICO_SOFT_CAP, setICOSoftCap] = useState<number>(0)
	async function setICOSoftCapOnSC() {
		console.log(`X_ICO_SOFT_CAP: ` + X_ICO_SOFT_CAP);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setSoftCapuUSD(X_ICO_SOFT_CAP * 10**6).then(await useResponseHook).catch(useErrorHook);
	}

	const [X_ICO_PRICE, setICOPrice] = useState<number>(0)
	async function setICOSPriceOnSC() {
		console.log(`X_ICO_PRICE: ` + X_ICO_PRICE);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPriceuUSD(X_ICO_PRICE).then(await useResponseHook).catch(useErrorHook);
	}

	const [X_ICO_MIN_TRANSFER, setMinTransfer] = useState<number>(0)
	async function setMinTransferOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMinuUSDTransfer(X_ICO_MIN_TRANSFER).then(await useResponseHook).catch(useErrorHook);
	}

  const [X_ICO_MAX_TRANSFER, setMaxTransfer] = useState<number>(0)
	async function setMaxTransferOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDTransfer(X_ICO_MAX_TRANSFER).then(await useResponseHook).catch(useErrorHook);
	}

	const [X_ICO_MAX_INVESTMENT, setMaxInvestment] = useState<number>(0)
	async function setMaxInvestmentOnSC() {
		console.log('ICO_MAX_INVESTMENT ' + ICO_MAX_INVESTMENT);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDInvestment(X_ICO_MAX_INVESTMENT).then(await useResponseHook).catch(useErrorHook);
	}

	const [X_ICO_WHITELIST_THRESHOLD, setWhitelistThreshold] = useState<number>(0);
	async function setWhitelistThresholdOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setWhitelistuUSDThreshold(Number(X_ICO_WHITELIST_THRESHOLD) * 10**6).then(await useResponseHook).catch(useErrorHook);
	}

	const [VESTING_SCHEDULE_PERCENTAGE, setVestingSchedulePercentage] = useState<number>(0);
	async function setPercentVestedOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPercentVested(VESTING_SCHEDULE_PERCENTAGE).then(await useResponseHook).catch(useErrorHook);
	}

	const [VESTING_SCHEDULE_CURRENT_ID, setVestingScheduleCurrentId] = useState<string>('');
	const onSelectCurrentVestingId = async (vestingId: any)=>{
		console.log('onSelectCurrentVestingId', vestingId);

		//let vesting = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVesting(vestingId);
		//console.log('vesting', vesting);
		setVestingScheduleCurrentId(vestingId);
		//setVestingCliffInDays(vesting[0]);
	}

	const [VESTING_IDS, setVestingIds] = useState([]);
	const [VESTING_ID, setVestingId] = useState<string>('');

	async function createICO() {
		// createICO
		console.log(`ICO_HARD_CAP: ` + ICO_HARD_CAP);
		console.log(`ICO_SOFT_CAP: ` + ICO_SOFT_CAP);
		console.log(`ICO_PRICE: ` + ICO_PRICE);
		console.log(`ICO_WHITELIST_THRESHOLD: ` + ICO_WHITELIST_THRESHOLD);
		console.log(`ICO_MAX_INVESTMENT: ` + ICO_MAX_INVESTMENT);
		console.log(`ICO_MAX_TRANSFER: ` + ICO_MAX_TRANSFER);
		console.log(`ICO_MIN_TRANSFER: ` + ICO_MIN_TRANSFER);
		console.log(`VESTING_SCHEDULE_PERCENTAGE: ` + VESTING_SCHEDULE_PERCENTAGE);
		console.log(`VESTING_ID: ` + VESTING_ID);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.createCrowdsale(ICO_PRICE, ICO_HARD_CAP * 10**6, ICO_SOFT_CAP * 10**6, ICO_WHITELIST_THRESHOLD * 10**6, ICO_MAX_INVESTMENT, ICO_MAX_TRANSFER, ICO_MIN_TRANSFER, VESTING_SCHEDULE_PERCENTAGE, VESTING_ID)
		.then(await useResponseHook).catch(useErrorHook);
	}

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Main Features</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_PRICE != 0 ? ICO_PRICE : ''} onChange={(event) => setICOPrice(Number(event.target.value))} disabled={isDisconnected} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setICOSPriceOnSC()}> {KEY_ICON()} ICO Price</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Soft Cap (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_SOFT_CAP != 0 ? ICO_SOFT_CAP : ''} onChange={(event) => setICOSoftCap(Number(event.target.value))} disabled={isDisconnected} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setICOSoftCapOnSC()}> {KEY_ICON()} SoftCap</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Hard Cap (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_HARD_CAP != 0 ? ICO_HARD_CAP : ''} onChange={(event) => setICOHardCap(Number(event.target.value))} disabled={isDisconnected} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setICOHardCapOnSC()}> {KEY_ICON()} HardCap</Button></Col> : '' }
					</Row>
				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Volumes</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Minimum Transfer (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MIN_TRANSFER != 0 ? ICO_MIN_TRANSFER / 10**6 : ''}  onChange={(event) => setMinTransfer(Number(event.target.value) * 10**6)} disabled={isDisconnected} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setMinTransferOnSC()}> {KEY_ICON()} Min Transfer</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Maximum Transfer (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_TRANSFER != 0 ? ICO_MAX_TRANSFER / 10**6 : ''} onChange={(event) => setMaxTransfer(Number(event.target.value) * 10**6)} disabled={isDisconnected}></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setMaxTransferOnSC()}> {KEY_ICON()} Max Transfer</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Maximum Investment (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_INVESTMENT != 0 ? ICO_MAX_INVESTMENT / 10**6 : ''} onChange={(event) => setMaxInvestment(Number(event.target.value) * 10**6)} disabled={isDisconnected}></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setMaxInvestmentOnSC()}> {KEY_ICON()} Max Investment</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Whitelist Threshold (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_WHITELIST_THRESHOLD != 0 ? ICO_WHITELIST_THRESHOLD : ''} disabled={isDisconnected} onChange={ (event) => setWhitelistThreshold(Number(event.target.value)) }></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setWhitelistThresholdOnSC()} disabled={isDisconnected} > {KEY_ICON()} Whitelist Threshold</Button></Col> : '' }
					</Row>
				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Vested Percentage</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_SCHEDULE_PERCENTAGE != 0 ? VESTING_SCHEDULE_PERCENTAGE : ''} disabled={isDisconnected} onChange={ (event) => setVestingSchedulePercentage(Number(event.target.value)) }></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setPercentVestedOnSC()} disabled={isDisconnected} > {KEY_ICON()} Percent Vested</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Vesting Program</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onSelectCurrentVestingId}>
								<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
									{VESTING_SCHEDULE_CURRENT_ID}
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{VESTING_IDS?.map(vestingId => {
										return (
											<Dropdown.Item as="button" key={vestingId} eventKey={vestingId} active={VESTING_SCHEDULE_CURRENT_ID == vestingId + ''}>
												{vestingId + ''}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>
				</Form.Group>

				{ ICO_CURRENT_STAGE == STAGE.NOT_CREATED ?
				<Row className="mb-3"></Row>
				: ''}
				{ ICO_CURRENT_STAGE == STAGE.NOT_CREATED ?
				<Row>
					<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => createICO()} > {KEY_ICON()} Create Funding Round</Button></Col>
				</Row>
				: ''}

			</Container>
		</div>

	);
}

export default RoundFeatures
