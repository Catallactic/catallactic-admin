import { NextPage } from 'next'
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useAccount, useNetwork } from 'wagmi'

import { useResponseHook } from 'hooks/useResponseHook';
import { useVestingHook } from 'hooks/useVestingHook';

import { KEY_ICON } from '../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';

const Features: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const { isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const { 
		loadVestingPrograms, VESTING_IDS,
		onSelectVestingId, VESTING_ID, VESTING_START_MILLIS, VESTING_CLIFF_DAYS, VESTING_DURATION_DAYS, VESTING_NUM_SLIDES,
		onSelectVestingSchedule, VESTING_SCHEDULE_ID, VESTING_SCHEDULE_PROGRAM_ID, VESTING_SCHEDULE_HOLDER, VESTING_SCHEDULE_AMOUNT, VESTING_SCHEDULE_RELEASED_AMOUNT,
		loadVestingScheduleList, VESTING_SCHEDULE_LIST,
		computeVesting, 
		releaseVesting, 
		setVestinGrantorOnSC, setVestinGrantor,
	} = useVestingHook();

	const { handleICOReceipt, handleError } = useResponseHook()
	
	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	useEffect(() => {

		console.log('loadVestingPrograms');
		loadVestingPrograms();

	}, [])

	useEffect(() => {

		setVestingId(VESTING_ID)
		setVestingStartMillis(VESTING_START_MILLIS)
		setVestingCliffInDays(VESTING_CLIFF_DAYS)
		setVestingDurationInDays(VESTING_DURATION_DAYS)
		setVestingNumSlides(VESTING_NUM_SLIDES)

	}, [VESTING_ID, VESTING_START_MILLIS, VESTING_CLIFF_DAYS, VESTING_DURATION_DAYS, VESTING_NUM_SLIDES])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [X_VESTING_ID, setVestingId] = useState<string>('');
	const [X_VESTING_START_MILLIS, setVestingStartMillis] = useState<string>('');
	const [X_VESTING_CLIFF_DAYS, setVestingCliffInDays] = useState<number>(0);
	const [X_VESTING_DURATION_DAYS, setVestingDurationInDays] = useState<number>(0);
	const [X_VESTING_NUM_SLIDES, setVestingNumSlides] = useState<number>(0);

	async function saveVesting() {
		// calculate vestingId
		let vestingId = (Date.parse(X_VESTING_START_MILLIS) / 1000) + '_' + X_VESTING_CLIFF_DAYS + '_' + X_VESTING_DURATION_DAYS + '_' + X_VESTING_NUM_SLIDES;
		setVestingId(vestingId);

		// saveVesting
		console.log(`creating vesting: `);
		console.log(`\nVESTING_ID: ` + vestingId);
		console.log(`\nVESTING_START: ` + (Date.parse(X_VESTING_START_MILLIS)) / 1000);
		console.log(`\nVESTING_START_SECS: ` + Date.parse(X_VESTING_START_MILLIS));
		console.log(`\nVESTING_CLIFF_DAYS: ` + X_VESTING_CLIFF_DAYS + ' days');
		console.log(`\nVESTING_CLIFF_SECS: ` + X_VESTING_CLIFF_DAYS * 60 * 60 * 24 + ' seconds' );
		console.log(`\nVESTING_DURATION_DAYS: ` + X_VESTING_DURATION_DAYS + ' days');
		console.log(`\nVESTING_DURATION_SECS: ` + X_VESTING_DURATION_DAYS * 60 * 60 * 24 + ' seconds');
		console.log(`\nVESTING_NUM_SLIDES: ` + X_VESTING_NUM_SLIDES);

		const vestingStart = Date.parse(X_VESTING_START_MILLIS) / 1000;
		const cliffInSecs = X_VESTING_CLIFF_DAYS * 60 * 60 * 24;
		const durationInSecs = X_VESTING_DURATION_DAYS * 60 * 60 * 24;
		console.log(`\ncontracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT: ` + contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.createVesting(vestingId , vestingStart, cliffInSecs, durationInSecs, X_VESTING_NUM_SLIDES)
			.then(await handleICOReceipt)
			.then(await loadVestingPrograms)
			.catch(handleError);

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
	async function deleteVesting() {
		console.log('deletVesting', X_VESTING_ID);

		//await SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.deletePaymentToken(ICO_PAYMENT_SYMBOL_SYMBOL, ICO_PAYMENT_SYMBOLS.indexOf(ICO_PAYMENT_SYMBOL_SYMBOL));

		//populateICOContractData();
		//cancelICOPaymentMethod();
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
									{ X_VESTING_ID }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{VESTING_IDS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={X_VESTING_ID == item}>
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
						<Col><input className="form-control form-control-lg color-frame border-0" value={X_VESTING_ID} disabled={true}></input></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Vesting Start</Form.Text></div></Col>
						<Col><div><Form.Text className="">Vesting Cliff (days)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="datetime-local" className="form-control form-control-lg bg-yellow color-frame border-0" value={X_VESTING_START_MILLIS && X_VESTING_START_MILLIS != '0' ? X_VESTING_START_MILLIS : ''} onChange={handleVestingStartChange} disabled={isDisconnected || !selectedCrypto}></input></Col>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={X_VESTING_CLIFF_DAYS != 0 ? X_VESTING_CLIFF_DAYS : ''} onChange={(event) => setVestingCliffInDays(Number(event.target.value))} disabled={isDisconnected || !selectedCrypto}></input></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Vesting Duration (days)</Form.Text></div></Col>
						<Col><div><Form.Text className="">Vesting Number Slides</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={X_VESTING_DURATION_DAYS != 0 ? X_VESTING_DURATION_DAYS : ''} onChange={(event) => setVestingDurationInDays(Number(event.target.value))} disabled={isDisconnected || !selectedCrypto}></input></Col>
						<Col><input type="number" className="form-control form-control-lg bg-yellow color-frame border-0" value={X_VESTING_NUM_SLIDES != 0 ? X_VESTING_NUM_SLIDES : ''} onChange={(event) => setVestingNumSlides(Number(event.target.value))} disabled={isDisconnected || !selectedCrypto}></input></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected || !selectedCrypto} onClick={() => deleteVesting()}> {KEY_ICON()}Delete</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected || !selectedCrypto} onClick={() => saveVesting()}> {KEY_ICON()}Save</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected || !selectedCrypto} onClick={() => cancelVesting()}> {KEY_ICON()}Cancel</Button></Col>
					</Row>

				</Form.Group>

			</Container>
		</div>
		
	);

}

export default Features

