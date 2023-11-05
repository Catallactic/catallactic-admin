
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';

import { useAccount } from 'wagmi'

import { ContractsContext } from 'hooks/useContractContextHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import { useResponseHook } from 'hooks/useResponseHook';

const ERC20Features: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const { isDisconnected } = useAccount()

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
	useEffect(() => {

		if(!selectedCrypto)
			return;

		console.log('loadERC20Features');
		loadERC20Features();

	}, [])

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
		await contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.initialize(X_TOKEN_NAME, X_TOKEN_SYMBOL, BigInt(X_TOKEN_SUPPLY!) * BigInt(10**18)).then(await handleICOReceipt).catch(handleError);
	}

	// *************************************************************************************************************************
	// ************************************************************ UI *********************************************************
	// *************************************************************************************************************************
  const [CAN_CREATE, setCanCreate] = useState<boolean>(false);
  const [CAN_MODIFY, setCanModify] = useState<boolean>(false);
  const [CAN_TYPE, setCanType] = useState<boolean>(false);
  const [colorCSS, setColorCSS] = useState<string>('');
	useEffect(() => {
		console.log(`isDisconnected: ` + isDisconnected);
		console.log(`selectedCrypto: ` + selectedCrypto);
		console.log(`ICO_CURRENT_STAGE: ` + ICO_CURRENT_STAGE);
		setCanCreate(!isDisconnected && selectedCrypto != undefined && (ICO_CURRENT_STAGE == undefined || ICO_CURRENT_STAGE == STAGE.NOT_CREATED));
		setCanModify(!isDisconnected && selectedCrypto != undefined && (ICO_CURRENT_STAGE != undefined && ICO_CURRENT_STAGE != STAGE.NOT_CREATED));
		setCanType(!isDisconnected && selectedCrypto != undefined);
		setColorCSS(!isDisconnected && selectedCrypto != undefined ? ' bg-yellow' : '');
	}, [isDisconnected, selectedCrypto, ICO_CURRENT_STAGE])

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				{ CAN_TYPE ? '' :
				<Row>
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <a href='../admin/cryptocommodities'>this page</a> to create one.</Form.Text></Col>
				</Row>
				}

				<Row className="mb-3"></Row>
					<Form.Group className="p-3 border border-dark rounded bg-light-grey">
						<Row>
							<Col><div><div className="color-frame fs-4 text-center text-center w-100">ERC-20 Features</div></div></Col>
						</Row>
						<Row>
							<Col><div><Form.Text className="">Token Name</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input className={ 'form-control form-control-lg color-frame text-left border-0 ' + (X_TOKEN_INITIALIZED ? '' : 'bg-yellow') } defaultValue={X_TOKEN_NAME} onChange={(event) => setTokenName(event.target.value)} disabled={X_TOKEN_INITIALIZED ? true : false} ></input></Col>
						</Row>
						<Row>
							<Col><div><Form.Text className="">Token Symbol</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input className={ 'form-control form-control-lg color-frame text-left border-0 ' + (X_TOKEN_INITIALIZED ? '' : 'bg-yellow') } defaultValue={X_TOKEN_SYMBOL} onChange={(event) => setTokenSymbol(event.target.value)} disabled={X_TOKEN_INITIALIZED ? true : false} ></input></Col>
						</Row>
						<Row>
							<Col><div><Form.Text className="">Token Supply</Form.Text></div></Col>
						</Row>
						<Row>
							<Col><input type="number" className={ 'form-control form-control-lg color-frame text-left border-0 ' + (X_TOKEN_INITIALIZED ? '' : 'bg-yellow') } defaultValue={X_TOKEN_SUPPLY ? X_TOKEN_SUPPLY / 10**18 : ''} onChange={(event) => setTokenSupply(Number(event.target.value))} disabled={X_TOKEN_INITIALIZED ? true : false} ></input></Col>
						</Row>

						{ !X_TOKEN_INITIALIZED ? <Row className="mb-3"></Row> : '' }
						{ !X_TOKEN_INITIALIZED ? 
						<Row>
							<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={X_TOKEN_INITIALIZED ? true : false} onClick={() => saveERC20Features()}>Initialize</Button></Col>
						</Row>
						: '' }

					</Form.Group>

			</Container>
		</div>
	);

}

export default ERC20Features

