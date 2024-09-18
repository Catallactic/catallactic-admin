"use client";

import { NextPage } from 'next'
import { ChangeEvent, useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

import { useResponseHook } from 'hooks/useResponseHook';
import { useVestingHook } from 'hooks/useVestingHook';

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import Link from 'next/link';
import { useSetChain, useWallets } from '@web3-onboard/react';

const Features: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()
	const [connectedAddress, setConnectedAddress] = useState('')
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
	useEffect(() => {

		if (!connectedChain) {
			console.log('No chainId found. Aborting..')
			setConnectedAddress('')
			return;
		}

		console.log('loadVestingPrograms');
		loadVestingPrograms();

	}, [connectedWallets])

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

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: ` + !connectedChain);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connectedChain != undefined && selectedCrypto != undefined);
		setColorCSS(connectedChain != undefined && selectedCrypto != undefined ? ' bg-edited' : '');
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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Programs</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col>
							<Dropdown onSelect={onSelectVestingId}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!VESTING_IDS || VESTING_IDS.length == 0}>
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

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Vesting Id</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" value={X_VESTING_ID} disabled={true}></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Vesting Start</Form.Text></div></Col>
						<Col><div><Form.Text className="fs-6">Vesting Cliff (days)</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="datetime-local" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_VESTING_START_MILLIS && X_VESTING_START_MILLIS != '0' ? X_VESTING_START_MILLIS : ''} onChange={handleVestingStartChange} disabled={!connectedChain || !selectedCrypto}></input></Col>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_VESTING_CLIFF_DAYS != 0 ? X_VESTING_CLIFF_DAYS : ''} onChange={(event) => setVestingCliffInDays(Number(event.target.value))} disabled={!connectedChain || !selectedCrypto}></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Vesting Duration (days)</Form.Text></div></Col>
						<Col><div><Form.Text className="fs-6">Vesting Number Slides</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_VESTING_DURATION_DAYS != 0 ? X_VESTING_DURATION_DAYS : ''} onChange={(event) => setVestingDurationInDays(Number(event.target.value))} disabled={!connectedChain || !selectedCrypto}></input></Col>
						<Col><input type="number" className={"form-control form-control-lg color-frame border-0" + colorCSS} value={X_VESTING_NUM_SLIDES != 0 ? X_VESTING_NUM_SLIDES : ''} onChange={(event) => setVestingNumSlides(Number(event.target.value))} disabled={!connectedChain || !selectedCrypto}></input></Col>
					</Row>

					<Row className="m-3"></Row>

					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain || !selectedCrypto} onClick={() => deleteVesting()}> {KEY_ICON()}Delete</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain || !selectedCrypto} onClick={() => saveVesting()}> {KEY_ICON()}Save</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain || !selectedCrypto} onClick={() => cancelVesting()}> {KEY_ICON()}Cancel</Button></Col>
					</Row>

				</Form.Group>

				<Row className="m-4"></Row>

			</Container>
		</div>
		
	);

}

export default Features

