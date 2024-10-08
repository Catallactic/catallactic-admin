"use client";

import { useSetChain, useWallets } from '@web3-onboard/react';
import { ethers } from 'ethers';
import { ContractsContext } from 'hooks/useContractContextHook';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { useVestingHook } from 'hooks/useVestingHook';
import { NextPage } from 'next'
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Row } from 'react-bootstrap';

const Operations: NextPage = () => {

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
		loadBlockchainDatetime, METAMASK_CHAIN_TIME_IN_MS,
		loadVestingPrograms, VESTING_IDS,
		loadVestingScheduleTokenAddress, VESTING_SCHEDULE_TOKEN_ADDRESS,
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

		console.log('loadBlockchainDatetime');
		loadBlockchainDatetime();

		console.log('loadVestingScheduleTokenAddress');
		loadVestingScheduleTokenAddress();

		console.log('loadVestingScheduleList');
		loadVestingScheduleList();

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
		setChainTimeInMs(METAMASK_CHAIN_TIME_IN_MS)
	}, [METAMASK_CHAIN_TIME_IN_MS])

	useEffect(() => {
		setVestingScheduleTokenAddress(VESTING_SCHEDULE_TOKEN_ADDRESS)
	}, [VESTING_SCHEDULE_TOKEN_ADDRESS])

	useEffect(() => {
		setVestingScheduleHolder(VESTING_SCHEDULE_HOLDER)
		setVestingScheduleId(VESTING_SCHEDULE_ID)
		setVestingScheduleProgramId(VESTING_SCHEDULE_PROGRAM_ID)
		setVestingScheduleAmount(VESTING_SCHEDULE_AMOUNT)
		setVestingScheduleReleasedAmount(VESTING_SCHEDULE_RELEASED_AMOUNT)
	}, [VESTING_SCHEDULE_ID, VESTING_SCHEDULE_RELEASED_AMOUNT, VESTING_SCHEDULE_HOLDER, VESTING_SCHEDULE_AMOUNT, VESTING_SCHEDULE_PROGRAM_ID ])


	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************

	// blockchain time
	const [X_METAMASK_CHAIN_TIME_IN_MS, setChainTimeInMs] = useState<number>(0);
	async function increaseTime(ms: number) {
		const provider = new ethers.providers.JsonRpcProvider();
		const nowInChainBefore = (await provider.getBlock("latest")).timestamp;
		console.log('nowInChainBefore: ', nowInChainBefore);
		await provider.send('evm_mine', [ nowInChainBefore + ms ]);
		setChainTimeInMs((await provider.getBlock("latest")).timestamp * 1000);
	}

	// grantor
	const [X_VESTING_GRANTOR, setVestinGrantor] = useState<string>('');
	async function setVestinGrantorOnSC() {
		console.log(`setting X_VESTING_GRANTOR: ` + X_VESTING_GRANTOR);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.addGrantor(X_VESTING_GRANTOR)
			.then(await handleICOReceipt)
			.catch(await handleError);
	}

	// token adddress
	async function setTokenAddressOnVestingSC() {
		console.log(`setting X_VESTING_SCHEDULE_TOKEN_ADDRESS: ` + X_VESTING_SCHEDULE_TOKEN_ADDRESS);
		await contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.setTokenAddress(X_VESTING_SCHEDULE_TOKEN_ADDRESS)
			.then(await handleICOReceipt)
			.then(await setVestingScheduleTokenAddress)
			.catch(await handleError);
	}

	// vesting schedules
	const [X_VESTING_SCHEDULE_ID, setVestingScheduleId] = useState<string>('');
	const [X_VESTING_SCHEDULE_RELEASED_AMOUNT, setVestingScheduleReleasedAmount] = useState<number>(0);
	const [X_VESTING_SCHEDULE_HOLDER, setVestingScheduleHolder] = useState<string>('');
	const [X_VESTING_SCHEDULE_AMOUNT, setVestingScheduleAmount] = useState<number>(0);
	const [X_VESTING_SCHEDULE_PROGRAM_ID, setVestingScheduleProgramId] = useState<string>('');
	const [X_VESTING_SCHEDULE_TOKEN_ADDRESS, setVestingScheduleTokenAddress] = useState<string>()

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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Time</div></div></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><div><Form.Text className="color-frame">Current Chain Time</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0 text-center" disabled={ true } value={new Date(X_METAMASK_CHAIN_TIME_IN_MS).toLocaleString()} ></input></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE } onClick={() => increaseTime(60*60)}>+HOUR</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE } onClick={() => increaseTime(60*60*24*1)}>+DAY</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE } onClick={() => increaseTime(60*60*24*7)}>+WEEK</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE } onClick={() => increaseTime(60*60*24*30)}>+MONTH</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !CAN_TYPE } onClick={() => increaseTime(60*60*24*365)}>+YEAR</Button></Col>
					</Row>

				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">

					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Config</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Grantor Account</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={8}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} defaultValue={X_VESTING_GRANTOR} disabled={!CAN_TYPE} onChange={(event) => setVestinGrantor(event.target.value)} ></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => setVestinGrantorOnSC()}>Set as Vesting Grantor</Button></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Enter Token Address</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={8}><input className={"form-control form-control-lg color-frame border-0" + colorCSS} defaultValue={X_VESTING_SCHEDULE_TOKEN_ADDRESS} disabled={!CAN_TYPE} onChange={(event) => setVestingScheduleTokenAddress(event.target.value)} ></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => setTokenAddressOnVestingSC()}>Set as Token Address</Button></Col>
					</Row>

				</Form.Group>

				<Row className="m-4"></Row>

				<Form.Group className="p-5 rounded-5 bg-group">

					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Vesting Schedules</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">List of Vesting Schedules</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onSelectVestingSchedule}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!CAN_TYPE || !VESTING_SCHEDULE_LIST || VESTING_SCHEDULE_LIST.length == 0}>
									{ X_VESTING_SCHEDULE_ID }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{VESTING_SCHEDULE_LIST?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={X_VESTING_SCHEDULE_ID == item}>
												{item + ''}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Holder</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={X_VESTING_SCHEDULE_HOLDER} ></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Vesting Schedule Id</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame fs-6">Vesting Program Id</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={X_VESTING_SCHEDULE_ID ? X_VESTING_SCHEDULE_ID : '' }></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={X_VESTING_SCHEDULE_PROGRAM_ID ? X_VESTING_SCHEDULE_PROGRAM_ID : '' } ></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="color-frame fs-6">Total Amount</Form.Text></div></Col>
						<Col><div><Form.Text className="color-frame fs-6">Released Amount</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={X_VESTING_SCHEDULE_AMOUNT ? X_VESTING_SCHEDULE_AMOUNT / 10**18 : '' }></input></Col>
						<Col><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={X_VESTING_SCHEDULE_RELEASED_AMOUNT ? X_VESTING_SCHEDULE_RELEASED_AMOUNT : '' } dir="rtl" ></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col xs={6}><div><Form.Text className="color-frame fs-6">Releseable Amount</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={6}><input className="form-control form-control-lg color-frame border-0" disabled={ true } value={ X_VESTING_SCHEDULE_RELEASED_AMOUNT } ></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => computeVesting()}>Compute</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE} onClick={() => releaseVesting()}>Release</Button></Col>
					</Row>

					<Row className="m-3"></Row>

				</Form.Group>

				<Row className="m-2"></Row>

			</Container>
		</div>

	);

}

export default Operations
