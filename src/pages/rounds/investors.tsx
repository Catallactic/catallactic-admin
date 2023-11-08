
import { ContractsContext } from 'hooks/useContractContextHook';
import { useCrowdsaleHook } from 'hooks/useCrowdsaleHook';
import { useERC20Hook } from 'hooks/useERC20Hook';
import { useResponseHook } from 'hooks/useResponseHook';
import { NextPage } from 'next'
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

const Investors: NextPage = () => {

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

	const [ICO_INVESTORS_LIST, setInvestors] = useState([]);

	const { handleICOReceipt, handleError } = useResponseHook()

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************



	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************

	// Investors Available
	const [PAYMENT_METHODS_SEARCH_ADDRESS, setPaymentMethodsSearchAddress] = useState<string>('')

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
					<Col className='text-center'><Form.Text className="color-frame w-100">These features are disabled because you have not created a cryptocommodity. Visit <Link href="/admin/cryptocommodities">this page</Link> to create one.</Form.Text></Col>
				</Row>
				}

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Wallets</div></div></Col>
					</Row>
					<Row>
						<Col><div><Form.Text className="color-frame">List of Investors</Form.Text></div></Col>
					</Row>
					<Row className="mb-3">
						<table className="table table-dark">
							<thead>
								<tr>
									<th scope="col">#</th>
									<th scope="col">Investor</th>
									<th scope="col">Amount</th>
								</tr>
							</thead>
							<tbody>
								{ICO_INVESTORS_LIST?.map((item, index) => (
									<tr key={index}>
										<td><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={isDisconnected} onClick={()=>{ setPaymentMethodsSearchAddress(item); }}> </Button></td>
										<td>{item}</td>
										<td id={"weiContributedByValue" + (index+1) }></td>
									</tr>
								))}
							</tbody>
						</table>
					</Row>
				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Balances</div></div></Col>
					</Row>

					<Row>
						<Col><div><Form.Text className="">Address</Form.Text></div></Col>
					</Row>
					<Row>
						<Col xs={9}><input type="email" className={"form-control form-control-lg color-frame border-0" + colorCSS} disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS || !CAN_TYPE} onChange={(event) => setPaymentMethodsSearchAddress(event.target.value) } value={PAYMENT_METHODS_SEARCH_ADDRESS} ></input></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button-connect p-2 fw-bold" disabled={!BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS || !CAN_TYPE} onClick={()=>{ getBalancesPaymentMethodsSearchAddress(); getBalancesRawICOSearchAddressWallet(); getBalancesUSDICOSearchAddressWallet(); getBalancesCygasSearchAddress(); }}>Balances</Button></Col>
					</Row>

					<Row className="mb-3"></Row>
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
					{ICO_PAYMENT_SYMBOLS?.map((item: any, index: any) => (
					<Row className="mb-3" key={index} >
						<Col xs={3}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS && BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_PAYMENT_TOKENS_SEARCH_ADDRESS[item].toString()) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
						<Col xs={2}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >{item}</Button></Col>
						<Col xs={2}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET && BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET[item] && ICO_PAYMENT_METHODS[item] ? Number(BALANCES_RAW_ICO_SEARCH_ADDRESS_WALLET[item]) / 10**Number(ICO_PAYMENT_METHODS[item][3]) : 0}></input></Col>
						<Col xs={2}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item].toString()) / 10**6 : 0}></input></Col>
						<Col xs={3}><input className="form-control form-control-lg color-frame text-left border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET[item].toString()) / ICO_PRICE : 0}></input></Col>
					</Row>
					))}

					<Row>
						<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_ERC_20_SEARCH_ADDRESS}></input></Col>
						<Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0 btn btn-primary" disabled={true} >ERC-20</Button></Col>
						<Col xs={2}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL'] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL']) / 10**6 : 0}></input></Col>
						<Col xs={3}><input className="form-control form-control-lg color-frame border-0" disabled={true} value={BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET && BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL'] ? Number(BALANCES_USD_ICO_SEARCH_ADDRESS_WALLET['TOTAL']) / ICO_PRICE : 0}></input></Col>
					</Row>

				</Form.Group>

			</Container>
		</div>
		
	);

}

export default Investors

