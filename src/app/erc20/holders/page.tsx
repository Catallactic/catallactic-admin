"use client";

import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook'

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import Link from 'next/link';
import { useSetChain, useWallets } from '@web3-onboard/react';

declare let window:any

const ERC20Holders: NextPage = () => {

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
	const { handleICOReceipt, handleError } = useResponseHook()

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************


	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS, setTokenSearchAllowanceFromAddress] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS, setTokenSearchAllowanceToAddress] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE, setTokenSearchAllowance] = useState<string | undefined>()

	const [INVESTOR_BALANCE, setInvestorsBalance] = useState<string | undefined>()

	async function getBalanceOf(elementId: any) {

		const element = window.document.getElementById(elementId);
		if (element === null) {
    	return;
		}
		var address = element.value;
		console.log('address', address);

		console.log('SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT', contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT);
		console.log('balanceOf3');
		const balanceOf = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.balanceOf(address);
		console.log(balanceOf.toString());

		setInvestorsBalance(balanceOf.toString());
	}

	async function getAllowance() {
		console.log('TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS', TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS);
		console.log('TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS', TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS);
		const allowanceWithDecimals = await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.allowance(TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS, TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS);
		const allowance = allowanceWithDecimals / 10**18;
		console.log(allowance.toString());

		setTokenSearchAllowance(allowance.toString());
	}

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
		setColorCSS(connectedChain && selectedCrypto != undefined ? ' bg-edited' : '');
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
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">Holder Balance</div></div></Col>
						</Row>

						<Row className="m-2"></Row>

						<Row>
							<Col><div><Form.Text className="fs-6">Enter Holder Address</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input id="balanceInvestor" className="form-control form-control-lg bg-edited text-left border-0" disabled={!connectedChain}></input></Col>
						</Row>

						<Row className="m-4"></Row>
						<Row>
							<Col xs={9}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={INVESTOR_BALANCE ? Number(INVESTOR_BALANCE) / 10**18 : 0}></input></Col>
							<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={() => getBalanceOf('balanceInvestor')}>Balance</Button></Col>
						</Row>
					</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Holder Allowance</div></div></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Allowance From Holder Address</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-edited text-left border-0" disabled={!connectedChain} onChange={ (event) => setTokenSearchAllowanceFromAddress(event.target.value) }></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Allowance to Holder Address</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input className="form-control form-control-lg bg-edited text-left border-0" disabled={!connectedChain} onChange={ (event) => setTokenSearchAllowanceToAddress(event.target.value) }></input></Col>
					</Row>

					<Row className="m-4"></Row>
					<Row>
						<Col xs={9}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={TOKEN_SEARCH_ALLOWANCE} ></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!connectedChain} onClick={getAllowance}>Allowance</Button></Col>
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>

			</Container>
		</div>
	);

}

export default ERC20Holders

