
import { Contract, ethers } from 'ethers';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

const Operations: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************

	const { isDisconnected } = useAccount()

	const { handleICOReceipt, handleError } = useResponseHook()
	
	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************

	const [SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT, setSelectedCryptocommodityVestingContract] = useState<Contract>()

	const [METAMASK_CHAIN_TIME_IN_MS, setChainTimeInMs] = useState<number>(0);

	const [VESTING_SCHEDULE_LIST, setVestingScheduleList] = useState<[]>()
	const [VESTING_GRANTOR, setVestinGrantor] = useState<string>('');
	const [VESTING_SCHEDULE_ID, setVestingScheduleId] = useState<string>('');
	const [VESTING_SCHEDULE_RELEASED_AMOUNT, setVestingScheduleReleasedAmount] = useState<number>(0);
	const [VESTING_SCHEDULE_HOLDER, setVestingScheduleHolder] = useState<string>('');
	const [VESTING_SCHEDULE_AMOUNT, setVestingScheduleAmount] = useState<number>(0);
	const [VESTING_SCHEDULE_PROGRAM_ID, setVestingScheduleProgramId] = useState<string>('');
	const [VESTING_SCHEDULE_TOKEN_ADDRESS, setVestingScheduleTokenAddress] = useState<string>()

	async function increaseTime(ms: number) {
		const provider = new ethers.providers.JsonRpcProvider();
		const nowInChainBefore = (await provider.getBlock("latest")).timestamp;
		console.log('nowInChainBefore: ', nowInChainBefore);
		await provider.send('evm_mine', [ nowInChainBefore + ms ]);
		setChainTimeInMs((await provider.getBlock("latest")).timestamp * 1000);
	}

	async function setVestinGrantorOnSC() {
		console.log(`setting VESTING_GRANTOR: ` + VESTING_GRANTOR);
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.addGrantor(VESTING_GRANTOR).then(await handleICOReceipt).catch(handleError);
	}

	async function computeVesting() {
		console.log('computeVesting', VESTING_SCHEDULE_ID);
		let releseableAmount = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.computeReleasableAmount(VESTING_SCHEDULE_ID);
		console.log('releseableAmount', releseableAmount);
		setVestingScheduleReleasedAmount(releseableAmount);
	}

	async function releaseVesting() {
		console.log('releaseVesting', VESTING_SCHEDULE_ID);
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.release(VESTING_SCHEDULE_ID);
	}

	const onSelectVestingSchedule = async (vestingScheduleId: any)=>{
		console.log('onSelectVestingSchedule', vestingScheduleId);

		let vestingSchedule = await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.getVestingSchedule(vestingScheduleId);
		console.log('vestingSchedule', vestingSchedule);

		setVestingScheduleId(vestingScheduleId);
		setVestingScheduleHolder(vestingSchedule[0]);
		setVestingScheduleAmount(vestingSchedule[1]);
		setVestingScheduleProgramId(vestingSchedule[2]);
		setVestingScheduleReleasedAmount(vestingSchedule[3]);
	}

	async function setTokenAddressOnVestingSC() {
		console.log(`setting VESTING_SCHEDULE_TOKEN_ADDRESS: ` + VESTING_SCHEDULE_TOKEN_ADDRESS);
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.setTokenAddress(VESTING_SCHEDULE_TOKEN_ADDRESS).then(await handleICOReceipt).catch(handleError);
	}

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="mb-3"></Row>
					<Form.Group className="p-3 border border-dark rounded bg-light-grey">

						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Time</div></div></Col>
						</Row>

						<Row className="mb-3"></Row>
						<Row>
							<Col><div><Form.Text className="color-frame">Current Chain Time</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input className="form-control form-control-lg color-frame border-0 text-center" disabled={ true } value={new Date(METAMASK_CHAIN_TIME_IN_MS).toLocaleString()} ></input></Col>
						</Row>

						<Row className="mb-3"></Row>
						<Row>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => increaseTime(60*60)}>+HOUR</Button></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => increaseTime(60*60*24*1)}>+DAY</Button></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => increaseTime(60*60*24*7)}>+WEEK</Button></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => increaseTime(60*60*24*30)}>+MONTH</Button></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => increaseTime(60*60*24*365)}>+YEAR</Button></Col>
						</Row>

					</Form.Group>

					<Row className="mb-3"></Row>
					<Form.Group className="p-3 border border-dark rounded bg-light-grey">

						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Config</div></div></Col>
						</Row>

						<Row>
							<Col><div><Form.Text className="">Grantor Account</Form.Text></div></Col>
						</Row>
						<Row>
							<Col xs={8}><input className="form-control form-control-lg bg-yellow color-frame border-0" defaultValue={VESTING_GRANTOR} onChange={(event) => setVestinGrantor(event.target.value)} ></input></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setVestinGrantorOnSC()}>Set as Vesting Grantor</Button></Col>
						</Row>

						<Row>
							<Col><div><Form.Text className="">Enter Token Address</Form.Text></div></Col>
						</Row>
						<Row>
							<Col xs={8}><input className="form-control form-control-lg bg-yellow color-frame border-0" defaultValue={VESTING_SCHEDULE_TOKEN_ADDRESS} onChange={(event) => setVestingScheduleTokenAddress(event.target.value)} ></input></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => setTokenAddressOnVestingSC()}>Set as Token Address</Button></Col>
						</Row>

					</Form.Group>

					<Row className="mb-3"></Row>
					<Form.Group className="p-3 border border-dark rounded bg-light-grey">

						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Schedules</div></div></Col>
						</Row>

						<Row>
							<Col><div><Form.Text className="color-frame">List of Vesting Schedules</Form.Text></div></Col>
						</Row>
						<Row>
							<Col>
								<Dropdown onSelect={onSelectVestingSchedule}>
									<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
										{ VESTING_SCHEDULE_ID }
									</Dropdown.Toggle>

									<Dropdown.Menu className="w-100">
										{VESTING_SCHEDULE_LIST?.map((item: any, index: any) => {
											return (
												<Dropdown.Item as="button" key={index} eventKey={item} active={VESTING_SCHEDULE_ID == item}>
													{item + ''}
												</Dropdown.Item>
											);
										})}
									</Dropdown.Menu>
								</Dropdown>
							</Col>
						</Row>

						<Row>
							<Col><div><Form.Text className="color-frame">Holder</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_HOLDER} ></input></Col>
						</Row>

						<Row>
							<Col><div><Form.Text className="color-frame">Vesting Schedule Id</Form.Text></div></Col>
							<Col><div><Form.Text className="color-frame">Vesting Program Id</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_ID ? VESTING_SCHEDULE_ID : '' }></input></Col>
							<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_PROGRAM_ID ? VESTING_SCHEDULE_PROGRAM_ID : '' } ></input></Col>
						</Row>

						<Row>
							<Col><div><Form.Text className="color-frame">Total Amount</Form.Text></div></Col>
							<Col><div><Form.Text className="color-frame">Released Amount</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_AMOUNT ? VESTING_SCHEDULE_AMOUNT / 10**18 : '' }></input></Col>
							<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={VESTING_SCHEDULE_RELEASED_AMOUNT ? VESTING_SCHEDULE_RELEASED_AMOUNT : '' } dir="rtl" ></input></Col>
						</Row>

						<Row>
							<Col xs={6}><div><Form.Text className="color-frame">Releseable Amount</Form.Text></div></Col>
						</Row>
						<Row>
							<Col xs={6}><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={ VESTING_SCHEDULE_RELEASED_AMOUNT } ></input></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => computeVesting()}>Compute</Button></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected } onClick={() => releaseVesting()}>Release</Button></Col>
						</Row>

						<Row className="mb-3"></Row>

					</Form.Group>

			</Container>
		</div>

	);

}

export default Operations

