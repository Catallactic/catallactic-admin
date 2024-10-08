"use client";

import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import Link from 'next/link';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { ContractsContext } from 'hooks/useContractContextHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import { useResponseHook } from 'hooks/useResponseHook';
import { useSetChain, useWallets } from '@web3-onboard/react';

const ERC20Features: NextPage = () => {

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
		loadERC20Features, TOKEN_INITIALIZED, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY,
		getBalancesCygasMeWallet, BALANCES_ERC_20_ME_WALLET, 
		getBalancesCygasSearchAddress, BALANCES_ERC_20_SEARCH_ADDRESS, 
		getBalancesCygasICOWallet, BALANCES_ERC_20_ICO_WALLET, 
		getBalancesCygasTargetWallet, BALANCES_ERC_20_TARGET_WALLET, 
	} = useERC20Hook();
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

		console.log('loadERC20Features');
		loadERC20Features();

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

		setInitialized(TOKEN_INITIALIZED)
		setTokenName(TOKEN_NAME)
		setTokenSymbol(TOKEN_SYMBOL)
		setTokenSupply(TOKEN_SUPPLY)

	}, [TOKEN_INITIALIZED, TOKEN_NAME, TOKEN_SYMBOL, TOKEN_SUPPLY])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [X_TOKEN_INITIALIZED, setInitialized] = useState<Boolean>(false)
	const [X_TOKEN_NAME, setTokenName] = useState<string>('')
	const [X_TOKEN_SYMBOL, setTokenSymbol] = useState<string>('')
	const [X_TOKEN_SUPPLY, setTokenSupply] = useState<number>(0)

	async function saveERC20Features() {
		await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.initialize(X_TOKEN_NAME, X_TOKEN_SYMBOL, BigInt(X_TOKEN_SUPPLY!) * BigInt(10**18))
			.then(await handleICOReceipt)
			.then(await loadERC20Features)
			.catch(await handleError);
	}

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
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">ERC-20 Features</div></div></Col>
					</Row>

					<Row className="m-2"></Row>
					
					<Row>
						<Col><div><Form.Text className="fs-6">Token Name</Form.Text></div></Col>
					</Row>				
					<Row>
						<Col><input className={ 'form-control form-control-lg bg-edited text-left border-0' } defaultValue={X_TOKEN_NAME} onChange={(event) => setTokenName(event.target.value)} disabled={!CAN_TYPE || !!X_TOKEN_INITIALIZED} ></input></Col>
					</Row>

					<Row className="m-2"></Row>
					
					<Row>						
						<Col><div><Form.Text className="fs-6">Token Symbol</Form.Text></div></Col>
					</Row>				
					<Row>
						<Col><input className={ 'form-control form-control-lg bg-edited text-left border-0' } defaultValue={X_TOKEN_SYMBOL} onChange={(event) => setTokenSymbol(event.target.value)} disabled={!CAN_TYPE || !!X_TOKEN_INITIALIZED} ></input></Col>
					</Row>

					<Row className="m-2"></Row>

					<Row>
						<Col><div><Form.Text className="fs-6">Token Supply</Form.Text></div></Col>
					</Row>
					<Row>
						<Col><input type="number" className={ 'form-control form-control-lg bg-edited text-left border-0' } defaultValue={X_TOKEN_SUPPLY ? X_TOKEN_SUPPLY / 10**18 : ''} onChange={(event) => setTokenSupply(Number(event.target.value))} disabled={!CAN_TYPE || !!X_TOKEN_INITIALIZED} ></input></Col>
					</Row>

					{ !X_TOKEN_INITIALIZED ?
					<Row className="m-4"></Row>
					: '' }

					{ !X_TOKEN_INITIALIZED ?
					<Row>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={!CAN_TYPE || !X_TOKEN_NAME || !X_TOKEN_SYMBOL || X_TOKEN_SUPPLY==0 } onClick={() => saveERC20Features()}>Initialize</Button></Col>
					</Row>
					: '' }

				</Form.Group>

				<Row className="m-4"></Row>

			</Container>
		</div>
	);

}

export default ERC20Features

