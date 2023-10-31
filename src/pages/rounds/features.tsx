import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import {
  Button, Col, Container, Form, InputGroup, Row,
} from 'react-bootstrap'
import Dropdown from 'react-bootstrap/Dropdown';
import Link from 'next/link'
import { SyntheticEvent, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import {Contract, ethers, utils} from "ethers"

import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const RoundFeatures: NextPage = () => {

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()

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

  const [ICO_HARD_CAP, setICOHardCap] = useState<number>(0)
  const [ICO_SOFT_CAP, setICOSoftCap] = useState<number>(0)
	const [ICO_PRICE, setICOPrice] = useState<number>(0)

  const [ICO_MIN_TRANSFER, setMinTransfer] = useState<number>(0)
  const [ICO_MAX_TRANSFER, setMaxTransfer] = useState<number>(0)
	const [ICO_MAX_INVESTMENT, setMaxInvestment] = useState<number>(0)

	const [ICO_WHITELIST_THRESHOLD, setWhitelistThreshold] = useState<number>(0);
	const [VESTING_IDS, setVestingIds] = useState([]);
	const [VESTING_ID, setVestingId] = useState<string>('');

	const [VESTING_SCHEDULE_PERCENTAGE, setVestingSchedulePercentage] = useState<number>(0);
	const [VESTING_SCHEDULE_CURRENT_ID, setVestingScheduleCurrentId] = useState<string>('');

	const [ICO_CURRENT_STAGE, setCurrentState] = useState<number>(0);
	const [ICO_CURRENT_STAGE_TEXT, setCurrentStateText] = useState<string>('NOT CREATED')
	const STAGE: {[key: string]: number} = {
		NOT_CREATED: 0,
		NOT_STARTED: 1,
		ONGOING: 2,
		ONHOLD: 3,
		FINISHED: 4,
	}

	async function setMinTransferOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMinuUSDTransfer(ICO_MIN_TRANSFER).then(await handleICOReceipt).catch(handleError);
	}
	async function setMaxTransferOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDTransfer(ICO_MAX_TRANSFER).then(await handleICOReceipt).catch(handleError);
	}
	async function setMaxInvestmentOnSC() {
		console.log('ICO_MAX_INVESTMENT ' + ICO_MAX_INVESTMENT);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setMaxuUSDInvestment(ICO_MAX_INVESTMENT).then(await handleICOReceipt).catch(handleError);
	}

	async function setWhitelistThresholdOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setWhitelistuUSDThreshold(Number(ICO_WHITELIST_THRESHOLD) * 10**6).then(await handleICOReceipt).catch(handleError);
	}

	async function setPercentVestedOnSC() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPercentVested(VESTING_SCHEDULE_PERCENTAGE).then(await handleICOReceipt).catch(handleError);
	}
	const onSelectCurrentVestingId = async (vestingId: any)=>{
		console.log('onSelectCurrentVestingId', vestingId);

		//let vesting = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getVesting(vestingId);
		//console.log('vesting', vesting);
		setVestingScheduleCurrentId(vestingId);
		//setVestingCliffInDays(vesting[0]);
	}

	async function loadICOFeatures() {

		let hardCap = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getHardCap();
		console.log("hardCap: " + hardCap);
		setICOHardCap(hardCap);
		let softCap = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getSoftCap();
		console.log("softCap: " + softCap);
		setICOSoftCap(softCap);
		let price = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getPriceuUSD();
		console.log("price: " + price);
		setICOPrice(price);

		// get read only - antiwhale
		let minTransfer = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMinUSDTransfer();
		setMinTransfer(minTransfer * 10**6);
		let maxTransfer = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMaxUSDTransfer();
		setMaxTransfer(maxTransfer * 10**6);
		let maxInvestment = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getMaxUSDInvestment();
		setMaxInvestment(maxInvestment * 10**6);
		let whitelistThreshold = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getWhitelistuUSDThreshold();
		setWhitelistThreshold(whitelistThreshold / 10**6);

		let currentStage = await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.getCrowdsaleStage();
		setCurrentState(currentStage);
		if(currentStage == 0) setCurrentStateText("NOT CREATED");
		else if(currentStage == 1) setCurrentStateText("NOT STARTED");
		else if(currentStage == 2) setCurrentStateText("ONGOING");
		else if(currentStage == 3) setCurrentStateText("ON HOLD");
		else if(currentStage == 4) setCurrentStateText("FINISHED");
		console.log(currentStage);
	}

	async function setICOHardCapOnSC() {
		console.log(`ICO_HARD_CAP: ` + ICO_HARD_CAP);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setHardCapuUSD(ICO_HARD_CAP * 10**6).then(await handleICOReceipt).catch(handleError);
	}
	async function setICOSoftCapOnSC() {
		console.log(`ICO_SOFT_CAP: ` + ICO_SOFT_CAP);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setSoftCapuUSD(ICO_SOFT_CAP * 10**6).then(await handleICOReceipt).catch(handleError);
	}
	async function setICOSPriceOnSC() {
		console.log(`ICO_PRICE: ` + ICO_PRICE);
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.setPriceuUSD(ICO_PRICE).then(await handleICOReceipt).catch(handleError);
	}

	async function handleICOReceipt(tx:any) {
		console.log('handle tx');
		console.log(tx);

		// process transaction
		console.log(`Transaction hash: ${tx.hash}`);
		const receipt = await tx.wait();
		console.log(receipt);
	  console.log(`Transaction confirmed in block ${receipt.blockNumber}`);
		console.log(`Gas used: ${receipt.gasUsed.toString()}`);

		//parseError(err.message,);
		let msg = 'GasUsed: ' + receipt.gasUsed;
		toast.info(msg, {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});

		//populateICOContractData();
	}
	function handleError(err:any) {
		console.log('Ohhhh nooo');
		console.log(err);
		console.log(err.code);
		console.log('err.message: ' + err.message);

		//parseError(err.message,);
		toast.error(parseError(err.message), {
			position: "bottom-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
			theme: "colored",
		});
	}

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
			.then(await processCreateCrowdsale).catch(handleError);
	}

	async function processCreateCrowdsale(receipt: any) {
		console.log(receipt);
	
		SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.once('FundsWithdrawn', function (_symbol:any, _amount:any) {
			console.log(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`);
			toast.success(`FundsWithdrawn: ${_symbol} withdrawn by ${_amount}`, {
				position: "bottom-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
		});

		handleICOReceipt(receipt);
	}

	function parseError(err:any) {
		if(err.indexOf('ERRW_OWNR_NOT') > -1) return 'Caller is not the owner';
		else if(err.indexOf('ERRP_INDX_PAY') > -1) return 'Wrong index';
		else if(err.indexOf('ERRD_MUST_ONG') > -1) return 'ICO must be ongoing';
		else if(err.indexOf('ERRD_MUSN_BLK') > -1) return 'Must not be blacklisted';
		else if(err.indexOf('ERRD_TRAS_LOW') > -1) return 'Transfer amount too low';
		else if(err.indexOf('ERRD_TRAS_HIG') > -1) return 'Transfer amount too high';
		else if(err.indexOf('ERRD_MUST_WHI') > -1) return 'Must be whitelisted';
		else if(err.indexOf('ERRD_INVT_HIG') > -1) return 'Total invested amount too high';
		else if(err.indexOf('ERRD_HARD_CAP') > -1) return 'Amount higher than available';
		else if(err.indexOf('ERRD_ALLO_LOW') > -1) return 'Insuffient allowance';
		else if(err.indexOf('ERRR_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRR_PASS_SOF') > -1) return 'Passed SoftCap. No refund';
		else if(err.indexOf('ERRR_ZERO_REF') > -1) return 'Nothing to refund';
		else if(err.indexOf('ERRR_WITH_REF') > -1) return 'Unable to refund';
		else if(err.indexOf('ERRC_MUST_FIN') > -1) return 'ICO must be finished';
		else if(err.indexOf('ERRC_NPAS_SOF') > -1) return 'Not passed SoftCap';
		else if(err.indexOf('ERRC_MISS_TOK') > -1) return 'Provide Token';
		else if(err.indexOf('ERRW_MUST_FIN') > -1) return 'ProvidICO must be finishede Token';
		else if(err.indexOf('ERRW_MISS_WAL') > -1) return 'Provide Wallet';
		else if(err.indexOf('ERRR_ZERO_WIT') > -1) return 'Nothing to withdraw';
		else if(err.indexOf('ERRR_WITH_BAD') > -1) return 'Unable to withdraw';
	
		return err;
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
						<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_PRICE != 0 ? ICO_PRICE : ''} onChange={(event) => setICOPrice(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOSPriceOnSC()}> {KEY_ICON()} ICO Price</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Soft Cap (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_SOFT_CAP != 0 ? ICO_SOFT_CAP : ''} onChange={(event) => setICOSoftCap(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOSoftCapOnSC()}> {KEY_ICON()} SoftCap</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Hard Cap (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_HARD_CAP != 0 ? ICO_HARD_CAP : ''} onChange={(event) => setICOHardCap(Number(event.target.value))} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setICOHardCapOnSC()}> {KEY_ICON()} HardCap</Button></Col> : '' }
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
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MIN_TRANSFER != 0 ? ICO_MIN_TRANSFER / 10**6 : ''}  onChange={(event) => setMinTransfer(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT} ></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMinTransferOnSC()}> {KEY_ICON()} Min Transfer</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Maximum Transfer (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_TRANSFER != 0 ? ICO_MAX_TRANSFER / 10**6 : ''} onChange={(event) => setMaxTransfer(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMaxTransferOnSC()}> {KEY_ICON()} Max Transfer</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Maximum Investment (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_MAX_INVESTMENT != 0 ? ICO_MAX_INVESTMENT / 10**6 : ''} onChange={(event) => setMaxInvestment(Number(event.target.value) * 10**6)} disabled={!METAMASK_CURRENT_ACCOUNT}></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!METAMASK_CURRENT_ACCOUNT} onClick={() => setMaxInvestmentOnSC()}> {KEY_ICON()} Max Investment</Button></Col> : '' }
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Whitelist Threshold (USD)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={ICO_WHITELIST_THRESHOLD != 0 ? ICO_WHITELIST_THRESHOLD : ''} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setWhitelistThreshold(Number(event.target.value)) }></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setWhitelistThresholdOnSC()} disabled={!METAMASK_CURRENT_ACCOUNT} > {KEY_ICON()} Whitelist Threshold</Button></Col> : '' }
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
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_SCHEDULE_PERCENTAGE != 0 ? VESTING_SCHEDULE_PERCENTAGE : ''} disabled={!METAMASK_CURRENT_ACCOUNT} onChange={ (event) => setVestingSchedulePercentage(Number(event.target.value)) }></input></Col>
						{ ICO_CURRENT_STAGE != STAGE.NOT_CREATED ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => setPercentVestedOnSC()} disabled={!METAMASK_CURRENT_ACCOUNT} > {KEY_ICON()} Percent Vested</Button></Col> : '' }
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
			)
}

export default RoundFeatures
