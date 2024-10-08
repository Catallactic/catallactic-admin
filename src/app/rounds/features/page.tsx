"use client";

import { NextPage } from 'next'
import { Button, Col, Container, Form, Row, } from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import { useContext, useEffect, useState } from 'react'

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook'
import { useResponseHook } from 'hooks/useResponseHook'
import { ContractsContext } from 'hooks/useContractContextHook';

import { KEY_ICON } from '../../../config/config'

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useVestingHook } from 'hooks/useVestingHook';
import Link from 'next/link';
import { useSetChain, useWallets } from '@web3-onboard/react';

const RoundFeatures: NextPage = () => {

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
		loadICOFeatures, ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_MIN_TRANSFER, ICO_MAX_TRANSFER, ICO_MAX_INVESTMENT, ICO_WHITELIST_THRESHOLD, VESTING_SCHEDULE_PERCENTAGE, VESTING_CURRENT_PROGRAM_ID, ICO_CURRENT_STAGE, ICO_CURRENT_STAGE_TEXT, STAGE,
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
		loadVestingPrograms, VESTING_IDS,
		onSelectVestingId, VESTING_ID, VESTING_START_MILLIS, VESTING_CLIFF_DAYS, VESTING_DURATION_DAYS, VESTING_NUM_SLIDES,
		onSelectVestingSchedule, VESTING_SCHEDULE_ID, VESTING_SCHEDULE_PROGRAM_ID, VESTING_SCHEDULE_HOLDER, VESTING_SCHEDULE_AMOUNT, VESTING_SCHEDULE_RELEASED_AMOUNT,
		loadVestingScheduleList, VESTING_SCHEDULE_LIST,
		computeVesting, 
		releaseVesting, 
	} = useVestingHook();
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

		console.log('loadICOFeatures');
		loadICOFeatures();

		console.log('loadVestingPrograms');
		loadVestingPrograms();

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

		setICOHardCap(ICO_HARD_CAP)
		setICOSoftCap(ICO_SOFT_CAP)
		setICOPrice(ICO_PRICE)
		setMinTransfer(ICO_MIN_TRANSFER)
		setMaxTransfer(ICO_MAX_TRANSFER)
		setMaxInvestment(ICO_MAX_INVESTMENT)
		setWhitelistThreshold(ICO_WHITELIST_THRESHOLD)
		setVestingSchedulePercentage(VESTING_SCHEDULE_PERCENTAGE)
		setVestingCurrentProgramId(VESTING_CURRENT_PROGRAM_ID)

	}, [ICO_HARD_CAP, ICO_SOFT_CAP, ICO_PRICE, ICO_MIN_TRANSFER, ICO_MAX_TRANSFER, ICO_MAX_INVESTMENT, ICO_WHITELIST_THRESHOLD, VESTING_SCHEDULE_PERCENTAGE, VESTING_CURRENT_PROGRAM_ID])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
  const [X_ICO_HARD_CAP, setICOHardCap] = useState<number>(0)
	async function setICOHardCapOnSC() {
		console.log(`X_ICO_HARD_CAP: ` + X_ICO_HARD_CAP);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setHardCapuUSD(X_ICO_HARD_CAP * 10**6).then(await handleICOReceipt).catch(await handleError);
	}

  const [X_ICO_SOFT_CAP, setICOSoftCap] = useState<number>(0)
	async function setICOSoftCapOnSC() {
		console.log(`X_ICO_SOFT_CAP: ` + X_ICO_SOFT_CAP);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setSoftCapuUSD(X_ICO_SOFT_CAP * 10**6).then(await handleICOReceipt).catch(await handleError);
	}

	const [X_ICO_PRICE, setICOPrice] = useState<number>(0)
	async function setICOSPriceOnSC() {
		console.log(`X_ICO_PRICE: ` + X_ICO_PRICE);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPriceuUSD(X_ICO_PRICE).then(await handleICOReceipt).catch(await handleError);
	}

	const [X_ICO_MIN_TRANSFER, setMinTransfer] = useState<number>(0)
	async function setMinTransferOnSC() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMinuUSDTransfer(X_ICO_MIN_TRANSFER).then(await handleICOReceipt).catch(await handleError);
	}

  const [X_ICO_MAX_TRANSFER, setMaxTransfer] = useState<number>(0)
	async function setMaxTransferOnSC() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDTransfer(X_ICO_MAX_TRANSFER).then(await handleICOReceipt).catch(await handleError);
	}

	const [X_ICO_MAX_INVESTMENT, setMaxInvestment] = useState<number>(0)
	async function setMaxInvestmentOnSC() {
		console.log('ICO_MAX_INVESTMENT ' + X_ICO_MAX_INVESTMENT);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDInvestment(X_ICO_MAX_INVESTMENT).then(await handleICOReceipt).catch(await handleError);
	}

	const [X_ICO_WHITELIST_THRESHOLD, setWhitelistThreshold] = useState<number>(0);
	async function setWhitelistThresholdOnSC() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setWhitelistuUSDThreshold(Number(X_ICO_WHITELIST_THRESHOLD) * 10**6).then(await handleICOReceipt).catch(await handleError);
	}

	const [X_VESTING_SCHEDULE_PERCENTAGE, setVestingSchedulePercentage] = useState<number>(0);
	async function setPercentVestedOnSC() {
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPercentVested(X_VESTING_SCHEDULE_PERCENTAGE).then(await handleICOReceipt).catch(await handleError);
	}

	const [X_VESTING_CURRENT_PROGRAM_ID, setVestingCurrentProgramId] = useState<string>('');
	const onSelectCurrentVestingId = async (vestingId: any)=>{
		console.log('onSelectCurrentVestingId', vestingId);

		//let vesting = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVesting(vestingId);
		//console.log('vesting', vesting);
		setVestingCurrentProgramId(vestingId);
		//setVestingCliffInDays(vesting[0]);
	}

	async function createICO() {
		// createICO
		console.log(`ICO_PRICE: ` + X_ICO_PRICE);
		console.log(`ICO_SOFT_CAP: ` + X_ICO_SOFT_CAP);
		console.log(`ICO_HARD_CAP: ` + X_ICO_HARD_CAP);
		console.log(`ICO_WHITELIST_THRESHOLD: ` + X_ICO_WHITELIST_THRESHOLD);
		console.log(`ICO_MAX_TRANSFER: ` + X_ICO_MAX_TRANSFER);
		console.log(`ICO_MIN_TRANSFER: ` + X_ICO_MIN_TRANSFER);
		console.log(`ICO_MAX_INVESTMENT: ` + X_ICO_MAX_INVESTMENT);
		console.log(`VESTING_SCHEDULE_PERCENTAGE: ` + X_VESTING_SCHEDULE_PERCENTAGE);
		console.log(`X_VESTING_CURRENT_PROGRAM_ID: ` + X_VESTING_CURRENT_PROGRAM_ID);
		await contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.createCrowdsale(X_ICO_PRICE, X_ICO_HARD_CAP * 10**6, X_ICO_SOFT_CAP * 10**6, X_ICO_WHITELIST_THRESHOLD * 10**6, X_ICO_MAX_INVESTMENT, X_ICO_MAX_TRANSFER, X_ICO_MIN_TRANSFER, X_VESTING_SCHEDULE_PERCENTAGE, X_VESTING_CURRENT_PROGRAM_ID)
			.then(await handleICOReceipt)
			.then(await loadICOFeatures)
			.catch(await handleError);
	}

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Main Features</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Price (uUSD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_PRICE != 0 ? X_ICO_PRICE : ''} onChange={(event) => setICOPrice(Number(event.target.value))} disabled={!CAN_TYPE} placeholder="e.g. 30000" ></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setICOSPriceOnSC()}> {KEY_ICON()} ICO Price</Button></Col> : '' }
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Soft Cap (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_SOFT_CAP != 0 ? X_ICO_SOFT_CAP : ''} onChange={(event) => setICOSoftCap(Number(event.target.value))} disabled={!CAN_TYPE} placeholder="e.g. 50000" ></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setICOSoftCapOnSC()}> {KEY_ICON()} SoftCap</Button></Col> : '' }
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Hard Cap (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_HARD_CAP != 0 ? X_ICO_HARD_CAP : ''} onChange={(event) => setICOHardCap(Number(event.target.value))} disabled={!CAN_TYPE} placeholder="e.g. 300000" ></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setICOHardCapOnSC()}> {KEY_ICON()} HardCap</Button></Col> : '' }
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Volumes</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Minimum Transfer (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_MIN_TRANSFER != 0 ? X_ICO_MIN_TRANSFER / 10**6 : ''}  onChange={(event) => setMinTransfer(Number(event.target.value) * 10**6)} disabled={!CAN_TYPE} placeholder="e.g. 10" ></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setMinTransferOnSC()}> {KEY_ICON()} Min Transfer</Button></Col> : '' }
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Maximum Transfer (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_MAX_TRANSFER != 0 ? X_ICO_MAX_TRANSFER / 10**6 : ''} onChange={(event) => setMaxTransfer(Number(event.target.value) * 10**6)} disabled={!CAN_TYPE} placeholder="e.g. 60000"></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setMaxTransferOnSC()}> {KEY_ICON()} Max Transfer</Button></Col> : '' }
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Maximum Investment (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_MAX_INVESTMENT != 0 ? X_ICO_MAX_INVESTMENT / 10**6 : ''} onChange={(event) => setMaxInvestment(Number(event.target.value) * 10**6)} disabled={!CAN_TYPE} placeholder="e.g. 100000"></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => setMaxInvestmentOnSC()}> {KEY_ICON()} Max Investment</Button></Col> : '' }
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Whitelist Threshold (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_ICO_WHITELIST_THRESHOLD != 0 ? X_ICO_WHITELIST_THRESHOLD : ''} disabled={!CAN_TYPE} onChange={ (event) => setWhitelistThreshold(Number(event.target.value)) } placeholder="e.g. 10000"></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setWhitelistThresholdOnSC()} disabled={!connectedChain} > {KEY_ICON()} Whitelist Threshold</Button></Col> : '' }
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Vested Percentage</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_VESTING_SCHEDULE_PERCENTAGE != 0 ? X_VESTING_SCHEDULE_PERCENTAGE : ''} disabled={!CAN_TYPE} onChange={ (event) => setVestingSchedulePercentage(Number(event.target.value)) } placeholder="e.g. 90"></input></Col>
						{ CAN_MODIFY ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setPercentVestedOnSC()} disabled={!connectedChain} > {KEY_ICON()} Percent Vested</Button></Col> : '' }
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Vesting Program</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onSelectCurrentVestingId}>
								<Dropdown.Toggle className={"btn-lg bg-edited text-black-50 w-100 border-0" + colorCSS} disabled={!CAN_TYPE}>
									{X_VESTING_CURRENT_PROGRAM_ID}
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{VESTING_IDS?.map(vestingId => {
										return (
											<Dropdown.Item as="button" key={vestingId} eventKey={vestingId} active={X_VESTING_CURRENT_PROGRAM_ID == vestingId + ''}>
												{vestingId + ''}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>

				<Row>
					<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_CREATE || X_ICO_PRICE===0 || X_ICO_SOFT_CAP===0 || X_ICO_HARD_CAP===0 || X_ICO_MIN_TRANSFER===0 || X_ICO_MAX_TRANSFER===0 || X_ICO_MAX_INVESTMENT===0 || X_ICO_WHITELIST_THRESHOLD===0 || X_VESTING_SCHEDULE_PERCENTAGE===0 || !X_VESTING_CURRENT_PROGRAM_ID } onClick={() => createICO()} > {KEY_ICON()} Create Funding Round</Button></Col>
				</Row>

				<Row className="m-4"></Row>

			</Container>
		</div>

	);
}

export default RoundFeatures
