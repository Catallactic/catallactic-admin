"use client";

import { Contract } from 'ethers';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import Link from 'next/link';
import { useSetChain, useWallets } from '@web3-onboard/react';

const ICOContract: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()
	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()

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

  const [ICO_OWNER, setICOOwner] = useState<string | undefined>()
  const [ICO_PENDING_OWNER, setICOPendingOwner] = useState<string | undefined>()
  const [ICO_BALANCE, setICOBalance] = useState<string | undefined>()

	const [ICO_TOTAL_uUSD_INVESTED, setTotaluUSDInvested] = useState<number>(0)
	const [BALANCES_ERC_20_ICO_WALLET, setBalancesCygasICOWallet] = useState<string>('0')

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************


	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************

	// ICO Owner
	async function setNewICOOwner() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.transferOwnership(ICO_PENDING_OWNER).then(await handleICOReceipt).catch(handleError);
	}
	async function acceptNewICOOwner() {
		await SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.acceptOwnership().then(await handleICOReceipt).catch(handleError);
	}

	var METAMASK_CHAINS:any;
	const getMETAMASK_CHAINS = function() {
		if(!METAMASK_CHAINS && process.env.NEXT_PUBLIC_METAMASK_CHAINS) {
			METAMASK_CHAINS = JSON.parse(process.env.NEXT_PUBLIC_METAMASK_CHAINS ? process.env.NEXT_PUBLIC_METAMASK_CHAINS : '[]' )
		}
		return METAMASK_CHAINS;
	}
  const [METAMASK_CHAIN_ID, setChainId] = useState<number | undefined>()

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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallet</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">ICO Contract Address</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="email" className="form-control form-control-lg color-frame border-0 text-center" disabled={true} value={getMETAMASK_CHAINS().find(function (el: any) { return parseInt(el.id) == METAMASK_CHAIN_ID; })?.ico_address || ''}></input></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">ICO Contract Owner</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="email" className="form-control form-control-lg color-frame border-0 text-center" defaultValue={ICO_OWNER} disabled={true}></input></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Pending ICO Contract Owner</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={12}><input dir="rtl" type="email" className={"form-control form-control-lg color-frame border-0" + colorCSS} defaultValue={ICO_PENDING_OWNER} disabled={!CAN_TYPE} onChange={(event) => setICOPendingOwner(event.target.value)} ></input></Col>
					</Row>
					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!ICO_PENDING_OWNER || !CAN_TYPE} onClick={() => setNewICOOwner()}> {KEY_ICON()} Transfer</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!ICO_PENDING_OWNER || !CAN_TYPE} onClick={() => acceptNewICOOwner()}> {KEY_ICON()} Accept</Button></Col>
					</Row>
				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
					</Row>

					<Row>
						<Col xs={3}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In Tokens</Form.Text></div></Col>
						<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
						<Col xs={7}><div className="text-center border-bottom border-dark"><Form.Text className="text-center">In ICO</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={3}><div className="text-center"><Form.Text className="text-center">Available</Form.Text></div></Col>
						<Col xs={2}><div><Form.Text className=""></Form.Text></div></Col>
						<Col xs={2}><div className="text-center"><Form.Text className="text-center">Invested</Form.Text></div></Col>
						<Col xs={2}><div className="text-center"><Form.Text className="text-center">Inv USD</Form.Text></div></Col>
						<Col xs={3}><div className="text-center"><Form.Text className="text-center">ERC-20 Bought</Form.Text></div></Col>
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

				<Row className="m-4"></Row>

			</Container>
		</div>
		
	);

}

export default ICOContract

