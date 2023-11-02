
import { Contract } from 'ethers';
import { useErrorHook } from 'hooks/useErrorHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { useVestingHook } from 'hooks/useVestingHook';
import { NextPage } from 'next'
import { ChangeEvent, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

const Features: NextPage = () => {

	const { isDisconnected } = useAccount()

	const [SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT, setSelectedCryptocommodityVestingContract] = useState<Contract>()

	const { 
		loadVestingPrograms, VESTING_IDS,
		onSelectVestingId, VESTING_ID, VESTING_START_MILLIS, VESTING_CLIFF_DAYS, VESTING_DURATION_DAYS, VESTING_NUM_SLIDES,
		onSelectVestingSchedule, VESTING_SCHEDULE_ID, VESTING_SCHEDULE_PROGRAM_ID, VESTING_SCHEDULE_HOLDER, VESTING_SCHEDULE_AMOUNT, VESTING_SCHEDULE_RELEASED_AMOUNT,
		loadVestingScheduleList, VESTING_SCHEDULE_LIST,
		computeVesting, 
		releaseVesting, 
		setVestinGrantorOnSC, setVestinGrantor,
	} = useVestingHook();

	const [VESTING_IDD, setVestingId] = useState<string>('');
	const [VESTING_DURATION_DAYSS, setVestingDurationInDays] = useState<number>(0);
	const [VESTING_CLIFF_DAYSS, setVestingCliffInDays] = useState<number>(0);
	const [VESTING_NUM_SLIDESS, setVestingNumSlides] = useState<number>(0);
	const [VESTING_START_MILLISS, setVestingStartMillis] = useState("");

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




	async function deleteVesting() {
		console.log('deletVesting', VESTING_ID);

		//await VESTING_CONTRACT?.deletePaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(ICO_PAYMENT_SYMBOL_SYMBOL));

		//populateICOContractData();
		//cancelICOPaymentMethod();
	}
	async function saveVesting() {
		// calculate vestingId
		let vestingId = (Date.parse(VESTING_START_MILLIS) / 1000) + '_' + VESTING_CLIFF_DAYS + '_' + VESTING_DURATION_DAYS + '_' + VESTING_NUM_SLIDES;
		setVestingId(vestingId);

		// saveVesting
		console.log(`creating vesting: `);
		console.log(`\nVESTING_ID: ` + vestingId);
		console.log(`\nVESTING_START: ` + (Date.parse(VESTING_START_MILLIS)) / 1000);
		console.log(`\nVESTING_START_SECS: ` + Date.parse(VESTING_START_MILLIS));
		console.log(`\nVESTING_CLIFF_DAYS: ` + VESTING_CLIFF_DAYS + ' days');
		console.log(`\nVESTING_CLIFF_SECS: ` + VESTING_CLIFF_DAYS * 60 * 60 * 24 + ' seconds' );
		console.log(`\nVESTING_DURATION_DAYS: ` + VESTING_DURATION_DAYS + ' days');
		console.log(`\nVESTING_DURATION_SECS: ` + VESTING_DURATION_DAYS * 60 * 60 * 24 + ' seconds');
		console.log(`\nVESTING_NUM_SLIDES: ` + VESTING_NUM_SLIDES);

		const vestingStart = Date.parse(VESTING_START_MILLIS) / 1000;
		const cliffInSecs = VESTING_CLIFF_DAYS * 60 * 60 * 24;
		const durationInSecs = VESTING_DURATION_DAYS * 60 * 60 * 24;
		await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.createVesting(vestingId , vestingStart, cliffInSecs, durationInSecs, VESTING_NUM_SLIDES).then(await useResponseHook).catch(useErrorHook);

		cancelVesting();
	}
	async function cancelVesting() {
		console.log('cancelVesting');

		setVestingId('');
		setVestingStartMillis('');
		setVestingCliffInDays(0);
		setVestingDurationInDays(0);
		setVestingNumSlides(0);
	}

  const handleVestingStartChange = (e: ChangeEvent<HTMLInputElement>) => {
		console.log('handleVestingStartChange: ', e.target.value);

    setVestingStartMillis(e.target.value);
  };

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Programs</div></div></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col>
							<Dropdown onSelect={onSelectVestingId}>
								<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={!VESTING_IDS || VESTING_IDS.length == 0}>
									{ VESTING_ID }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{VESTING_IDS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={VESTING_ID == item}>
												{item}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Vesting Id</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" value={VESTING_ID} disabled={true}></input></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Vesting Start</Form.Text></div></Col>
						<Col><div><Form.Text className="">Vesting Cliff (days)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="datetime-local" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_START_MILLIS != '0' ? VESTING_START_MILLIS : ''} onChange={handleVestingStartChange} disabled={isDisconnected}></input></Col>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_CLIFF_DAYS != 0 ? VESTING_CLIFF_DAYS : ''} onChange={(event) => setVestingCliffInDays(Number(event.target.value))} disabled={isDisconnected}></input></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Vesting Duration (days)</Form.Text></div></Col>
						<Col><div><Form.Text className="">Vesting Number Slides</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_DURATION_DAYS != 0 ? VESTING_DURATION_DAYS : ''} onChange={(event) => setVestingDurationInDays(Number(event.target.value))} disabled={isDisconnected}></input></Col>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={VESTING_NUM_SLIDES != 0 ? VESTING_NUM_SLIDES : ''} onChange={(event) => setVestingNumSlides(Number(event.target.value))} disabled={isDisconnected}></input></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => deleteVesting()}> {KEY_ICON()}Delete</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => saveVesting()}> {KEY_ICON()}Save</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={() => cancelVesting()}> {KEY_ICON()}Cancel</Button></Col>
					</Row>

				</Form.Group>

			</Container>
		</div>
		
	);

}

export default Features

