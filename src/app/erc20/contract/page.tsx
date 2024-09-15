
"use client";

import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Accordion, Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useResponseHook } from 'hooks/useResponseHook'

import { KEY_ICON } from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { ethers } from 'ethers';
import Link from 'next/link';
import { useWallets } from '@web3-onboard/react';

declare let window:any

const ERC20Contract: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [connected, setConnected] = useState(false)
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

	const { handleICOReceipt, handleError } = useResponseHook()

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	useEffect(() => {
		console.log("Num connected Wallets: " + connectedWallets.length)
		setConnected(connectedWallets.length > 0);
		if (connectedWallets.length == 0) {
			console.log('disconnected')
			//window.location.reload();
			return;
		}

	}, [connectedWallets])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [TOKEN_ADDRESS, setTokenAddress] = useState<string>()
  const [TOKEN_OWNER, setTokenOwner] = useState<string | undefined>()
	const [TOKEN_BALANCE, setTokenBalance] = useState<string | undefined>()

	const [TOKEN_SEARCH_ALLOWANCE_FROM_ADDRESS, setTokenSearchAllowanceFromAddress] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE_TO_ADDRESS, setTokenSearchAllowanceToAddress] = useState<string | undefined>()
	const [TOKEN_SEARCH_ALLOWANCE, setTokenSearchAllowance] = useState<string | undefined>()

		// populateICOContract
		async function connectTokenContract(event:React.FormEvent) {
			event.preventDefault();
	
			populateTokenContractData();
		}

		async function populateTokenContractData() {
			console.log("populateTokenContractData");
	
			const provider = new ethers.providers.Web3Provider(window.ethereum)
			let tokenBalance = await provider.getBalance(contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.address!);
			console.log("icoBalance: " + tokenBalance);
			setTokenBalance(tokenBalance + '');
		}
	
		async function setNewTokenOwner(elementId: string) {
	
			const element = window.document.getElementById(elementId);
			if (element === null) {
				return;
			}
			var value = element.value;
	
			// process transaction
			await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.transferOwnership(value).then(await handleICOReceipt).catch(handleError);
		}
	

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: ` + !connected);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(connected && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(connected && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(connected && selectedCrypto != undefined);
		setColorCSS(connected && selectedCrypto != undefined ? ' bg-yellow' : '');
	}, [connected, selectedCrypto, ICO_CURRENT_STAGE])

  return (

    <div className="bg-light d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				{ CAN_TYPE ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <Link href="/admin/cryptocommodities">this page</Link> to create one.</Form.Text></Col>
				</Row>
				}

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Token</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Token Contract Address</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input type="email" className="form-control form-control-lg color-frame bg-yellow text-left border-0" disabled={connected} value={TOKEN_ADDRESS || ''}></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={connected} onClick={connectTokenContract}>Connect</Button></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="">Token Contract Owner</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input id="tokenowner" type="email" className="form-control form-control-lg bg-yellow color-frame border-0" value={TOKEN_OWNER} disabled={connected}></input></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={connected} onClick={() => setNewTokenOwner('tokenowner')}> {KEY_ICON()} Update</Button></Col>
					</Row>
				</Form.Group>

			</Container>
		</div>
	);

}

export default ERC20Contract

