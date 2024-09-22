"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContractsContext } from 'hooks/useContractContextHook'
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook'
import { NextPage } from 'next'
import Link from 'next/link'
import { useContext, useEffect, useState } from 'react'
import { Button, Card, CardBody, Col, Container, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Form, Row } from 'react-bootstrap'
import {
  faArrowDown,
  faArrowUp,
  faDownload,
  faEllipsisVertical,
  faMars,
  faSearch,
  faUsers,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import { useSetChain, useWallets } from '@web3-onboard/react';

const Login: NextPage = () => {

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

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	// data to be loaded
	const loadData = async ()=>{

		if (!connectedWallets) {
			console.log('No connected acount. Aborting..')
			return;
		}

		console.log('loadICOFeatures');
		loadICOFeatures();

		console.log('getBalancesPaymentMethodsICOWallet')
		getBalancesPaymentMethodsICOWallet();

		console.log('loadICOPaymentMethod')
		loadICOPaymentMethod();
	}

	// conditions to load
	useEffect(() => {
		loadData();
	}, [])

	useEffect(() => {
		loadData();
	}, [connectedWallets])

	useEffect(() => {
		loadData();
	}, [selectedCrypto])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************

	

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
	useEffect(() => {
		console.log(`isDisconnected: ` + !connectedChain);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connectedChain != undefined && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connectedChain != undefined && selectedCrypto != undefined);
	}, [connectedChain, selectedCrypto, ICO_CURRENT_STAGE])

	const [ICO_TOTAL_uUSD_INVESTED, setTotaluUSDInvested] = useState<number>(0)
	const [BALANCES_ERC_20_ICO_WALLET, setBalancesCygasICOWallet] = useState<string>('0')

  return (
    <div className="bg-group rounded-5 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="m-4"></Row>

				<Row>
					<Col><div><div className="color-frame fs-2 text-center fw-bold text-center w-100">{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME } CryptoCommodity Dashboard</div></div></Col>
				</Row>

				<Row className="m-4"></Row>

				<Row className="mt-4 mb-2">
					<Col xs={3}><div><Form.Text className="color-frame catatext">Symbol</Form.Text></div></Col>
					<Col xs={6}><div><Form.Text className="color-frame catatext" dir="rtl">Address</Form.Text></div></Col>
					<Col xs={3}><div><Form.Text className="color-frame catatext">Decimals</Form.Text></div></Col>						
				</Row>

				<Row className="mb-5">
					<Col xs={3}><input className="form-control form-control-lg border-0 text-center background-disabled color-dashboard fw-bolder border-0" disabled={ true } value={ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME ? selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME : 'NO SELECTED' } ></input></Col>
					<Col xs={6}><input className="form-control form-control-lg border-0 text-center background-disabled color-dashboard fw-bolder border-0" disabled={ true } value={ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_ADDRESS ? selectedCrypto?.SELECTED_CRYPTOCOMMODITY_ADDRESS : 'NO SELECTED' } dir="rtl" ></input></Col>
					<Col xs={3}><input className="form-control form-control-lg border-0 text-center background-disabled color-dashboard fw-bolder border-0" disabled={ true } value={ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME ? selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME : 'NO SELECTED' } dir="rtl" ></input></Col>
				</Row>

				{/* https://europe1.discourse-cdn.com/business20/uploads/gnosis_safe/optimized/1X/593b6f307a37304066ba221f2aab8962159f6baa_2_936x526.jpeg */}
				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Supply Allocations</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO SELECTED
							</div>
						</Card>
					</div>

					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										$6.200
										<span className="fs-6 ms-2 fw-normal">
											(40.9%
											<FontAwesomeIcon icon={faArrowUp} fixedWidth />
											)
										</span>
									</div>
									<div>Holders</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart2">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO SELECTED
							</div>
						</Card>
					</div>

					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										2.49%
										<span className="fs-6 ms-2 fw-normal">
											(84.7%
											<FontAwesomeIcon icon={faArrowUp} fixedWidth />
											)
										</span>
									</div>
									<div>Exchanges</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart3">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO SELECTED
							</div>
						</Card>
					</div>

					<div className="col-sm-6 col-lg-3">
						<Card className="mb-4 background-disabled color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										44K
										<span className="fs-6 ms-2 fw-normal">
											(-23.6%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>DeFi Services</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart4">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO SELECTED
							</div>
						</Card>
					</div>
				</div>

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Vesting Schedules</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-12">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO CRYPTOCOMMODITY SELECTED
							</div>
						</Card>
					</div>
				</div>

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Token Balances</Form.Text></div></Col>
				</Row>

				{ ICO_CURRENT_STAGE == STAGE.ONGOING || ICO_CURRENT_STAGE == STAGE.ONHOLD ?
					<Form.Group className="p-2 rounded-5 bg-group">
						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
						</Row>
						<Row className="m-2"></Row>
					<Row>
						<Col xs={3}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">Holdings In Tokens</Form.Text></div></Col>
						<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
						<Col xs={7}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">Raised In ICO</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={3}><div className="text-center"><Form.Text className="text-center fs-6">Num Tokens Available</Form.Text></div></Col>
						<Col xs={2}><div><Form.Text className="fs-6"></Form.Text></div></Col>
						<Col xs={2}><div className="text-center"><Form.Text className="text-center fs-6">Raised Tokens</Form.Text></div></Col>
						<Col xs={2}><div className="text-center"><Form.Text className="text-center fs-6">Raised Amount (USD)</Form.Text></div></Col>
						<Col xs={3}><div className="text-center"><Form.Text className="text-center fs-6">{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME || "ERC-20" } Sold</Form.Text></div></Col>
					</Row>
						{ICO_PAYMENT_SYMBOLS?.map((item: string, index: any) => (
							<Row className="mb-3" key={index}>
								<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_ICO_WALLET && BALANCES_PAYMENT_TOKENS_ICO_WALLET[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_PAYMENT_TOKENS_ICO_WALLET[item].toString()) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
								<Col xs={2}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={true}> {item}</Button></Col>
								<Col xs={2}><input className="form-control form-control-lg color-frame border-0" value={ ICO_PAYMENT_METHODS[item] && ICO_PAYMENT_METHODS[item][5] ? Number(ICO_PAYMENT_METHODS[item][5]) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0 } disabled={true}></input></Col>
								<Col xs={2}><input className="form-control form-control-lg color-frame border-0" value={ ICO_PAYMENT_METHODS[item] && ICO_PAYMENT_METHODS[item][4] ? Number(ICO_PAYMENT_METHODS[item][4]) / 10**6 : 0 } disabled={true}></input></Col>
								<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={ ICO_PAYMENT_METHODS[item] && ICO_PAYMENT_METHODS[item][4] ? Number(ICO_PAYMENT_METHODS[item][4]) / ICO_PRICE : 0 } disabled={true}></input></Col>
							</Row>
						))}
						<Row>
							<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_ICO_WALLET}></input></Col>
							<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >ERC-20</Button></Col>
							<Col xs={2}><input className="form-control form-control-lg color-frame border-0" value={ ICO_TOTAL_uUSD_INVESTED / 10**6 } disabled={true}></input></Col>
							<Col xs={3}><input className="form-control form-control-lg color-frame border-0" value={ ICO_TOTAL_uUSD_INVESTED / ICO_PRICE } disabled={true}></input></Col>
						</Row>
						<Row className="mb-3"></Row>
						{connectedChain ?
						<Row>
							<Col><div className="text-center"><Form.Text className=""> * Invested and available amounts should match</Form.Text></div></Col>
						</Row>
						: '' }
					</Form.Group>
				:
					<div className="row">
						<div className="col-12">
							<Card className="mb-4 background-disabled border-0 color-dashboard">
								<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
									NO CRYPTOCOMMODITY SELECTED
								</div>
							</Card>
						</div>
					</div>
				}

				<Row className="mt-4 mb-2">
					<Col><div><Form.Text className="color-frame catatext">Deployed Networks</Form.Text></div></Col>
				</Row>
				<div className="row">
					<div className="col-12">
						<Card className="mb-4 background-disabled border-0 color-dashboard">
							<CardBody className="pb-0 d-flex justify-content-between align-items-start">
								<div>
									<div className="fs-4 fw-semibold">
										26K
										<span className="fs-6 ms-2 fw-normal">
											(-12.4%
											<FontAwesomeIcon icon={faArrowDown} fixedWidth />
											)
										</span>
									</div>
									<div>Project</div>
								</div>
								<Dropdown align="end">
									<DropdownToggle as="button" bsPrefix="btn" className="btn-link rounded-0 color-dashboard shadow-none p-0 border-0" id="dropdown-chart1">
										<FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
									</DropdownToggle>

									<DropdownMenu>
										<DropdownItem href="#/action-1">Action</DropdownItem>
										<DropdownItem href="#/action-2">Another action</DropdownItem>
										<DropdownItem href="#/action-3">Something else</DropdownItem>
									</DropdownMenu>
								</Dropdown>
							</CardBody>
							<div className="mt-3 mx-3 text-center fw-bolder fs-3" style={{ height: '70px' }}>
								NO CRYPTOCOMMODITY SELECTED
							</div>
						</Card>
					</div>
				</div>

				<Row className="m-4"></Row>

				{ CAN_CREATE || CAN_MODIFY ? '' :
					<Row>
						<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <Link href="/admin/cryptocommodities">this page</Link> to create one.</Form.Text></Col>
					</Row>
				}

				{ CAN_CREATE || CAN_MODIFY ? '' :
					<Row className="m-4"></Row>
				}

      </Container>
    </div>
  )
}

export default Login
