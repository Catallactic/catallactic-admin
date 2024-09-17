"use client";

import { useFactoryHook } from 'hooks/useFactoryHook';
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Modal, Row } from 'react-bootstrap';

import { useResponseHook } from 'hooks/useResponseHook';
import { ContractsContext } from 'hooks/useContractContextHook';
import { useSetChain, useWallets } from '@web3-onboard/react';

import { truncateEthAddress, KEY_ICON } from '../../../config/config'

const Environment: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()
	const { createEnvContracts, envContracts } = useContext(ContractsContext);

	const { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, 
		onFactorySelectPaymentMethod, FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_DECIMALS, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_DYN_PRICE,
		handleShowFunctions, showFunctionsModal, SHOW_FUNCTIONS, INTERFACE_MODAL,
	} = useFactoryHook();
	const { handleICOReceipt, handleError } = useResponseHook()

	// *************************************************************************************************************************
	// ******************************************************* Load Data *******************************************************
	// *************************************************************************************************************************
	useEffect(() => {

		if (!connectedChain) {
			console.log('No chainId found. Aborting..')
			return;
		}

		const chainId = Number(connectedWallets.at(0)?.chains[0].id);
		createEnvContracts(chainId ? chainId : 0);

		console.log('loadFactoryPaymentMethod');
		loadFactoryPaymentMethod();

		console.log('loadFacets');
		loadFacets();

	}, [connectedWallets])

	useEffect(() => {

		setFactoryPaymentSymbolSymbol(FACTORY_PAYMENT_SYMBOL_SYMBOL)
		setFactoryPaymentSymbolDecimals(FACTORY_PAYMENT_SYMBOL_DECIMALS)
		setFactoryPaymentSymbolAddress(FACTORY_PAYMENT_SYMBOL_ADDRESS)
		setFactoryPaymentSymbolPrice(FACTORY_PAYMENT_SYMBOL_PRICE)
		setFactoryPaymentSymbolRef(FACTORY_PAYMENT_SYMBOL_REF)
		setFactoryPaymentSymbolDynPrice(FACTORY_PAYMENT_SYMBOL_DYN_PRICE)

	}, [FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_DECIMALS, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_DYN_PRICE])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [X_FACTORY_PAYMENT_SYMBOL_SYMBOL, setFactoryPaymentSymbolSymbol] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_DECIMALS, setFactoryPaymentSymbolDecimals] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_ADDRESS, setFactoryPaymentSymbolAddress] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_PRICE, setFactoryPaymentSymbolPrice] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_REF, setFactoryPaymentSymbolRef] = useState<any | undefined>()
	const [X_FACTORY_PAYMENT_SYMBOL_DYN_PRICE, setFactoryPaymentSymbolDynPrice] = useState<any | undefined>()

	async function saveFactoryPaymentMethod() {
		console.log('saveFactoryPaymentMethod', X_FACTORY_PAYMENT_SYMBOL_SYMBOL);
		console.log('saveFactoryPaymentMethod', X_FACTORY_PAYMENT_SYMBOL_ADDRESS);
		console.log('saveFactoryPaymentMethod', X_FACTORY_PAYMENT_SYMBOL_REF);
		console.log('saveFactoryPaymentMethod', X_FACTORY_PAYMENT_SYMBOL_PRICE);
		console.log('saveFactoryPaymentMethod', X_FACTORY_PAYMENT_SYMBOL_DECIMALS);
		await envContracts.FACTORY_CONTRACT?.setPaymentToken(X_FACTORY_PAYMENT_SYMBOL_SYMBOL, X_FACTORY_PAYMENT_SYMBOL_ADDRESS, X_FACTORY_PAYMENT_SYMBOL_REF, X_FACTORY_PAYMENT_SYMBOL_PRICE, X_FACTORY_PAYMENT_SYMBOL_DECIMALS)
			.then(await handleICOReceipt)
			.then(await loadFactoryPaymentMethod)
			.catch(handleError);

		cancelFactoryPaymentMethod();
	}
	
	async function deleteFactoryPaymentMethod() {
		console.log('deleteFactoryPaymentMethod', X_FACTORY_PAYMENT_SYMBOL_SYMBOL);

		await envContracts.FACTORY_CONTRACT?.deletePaymentToken(X_FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOLS.indexOf(X_FACTORY_PAYMENT_SYMBOL_SYMBOL))
			.then(await handleICOReceipt)
			.then(await loadFactoryPaymentMethod)
			.catch(handleError);

		cancelFactoryPaymentMethod();
	}

	async function cancelFactoryPaymentMethod() {
		console.log('cancelFactoryPaymentMethod');

		setFactoryPaymentSymbolSymbol(undefined);
		setFactoryPaymentSymbolAddress(undefined);
		setFactoryPaymentSymbolRef(undefined);
		setFactoryPaymentSymbolPrice(undefined);
		setFactoryPaymentSymbolDecimals(undefined);
	}

  return (

    <div className="bg-page d-flex flex-row align-items-center dark:bg-transparent">
      <Container className='mw-100'>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Payment Tokens</div></div></Col>
					</Row>

					<Row>
						<Col><div><Form.Text className="color-frame">Available Payment Tokens</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onFactorySelectPaymentMethod}>
								<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100 border-0" disabled={!connectedChain || !FACTORY_PAYMENT_SYMBOLS || FACTORY_PAYMENT_SYMBOLS.length == 0}>
									{ X_FACTORY_PAYMENT_SYMBOL_SYMBOL }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{FACTORY_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={X_FACTORY_PAYMENT_SYMBOL_SYMBOL == item}>
												{item}
											</Dropdown.Item>
										);
									})}
								</Dropdown.Menu>
							</Dropdown>
						</Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col xs={4}><div><Form.Text className="color-frame">Symbol</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame" dir="rtl">Address</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Price Feed Address</Form.Text></div></Col>						
					</Row>

					<Row>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !connectedChain } onChange={event => setFactoryPaymentSymbolSymbol(event.target.value)} value={X_FACTORY_PAYMENT_SYMBOL_SYMBOL ? X_FACTORY_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !connectedChain } onChange={event => setFactoryPaymentSymbolAddress(event.target.value)} value={X_FACTORY_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(X_FACTORY_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ !connectedChain } onChange={event => setFactoryPaymentSymbolRef(event.target.value)} value={X_FACTORY_PAYMENT_SYMBOL_REF ? truncateEthAddress(X_FACTORY_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
					</Row>

					<Row>
						<Col xs={4}><div><Form.Text className="color-frame">Decimals</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Initial Price (uUSD)</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
					</Row>

					<Row>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !connectedChain } onChange={event => setFactoryPaymentSymbolDecimals(event.target.value)} value={X_FACTORY_PAYMENT_SYMBOL_DECIMALS ? X_FACTORY_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ !connectedChain } onChange={event => setFactoryPaymentSymbolPrice(event.target.value)} value={X_FACTORY_PAYMENT_SYMBOL_PRICE ? X_FACTORY_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
						<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ X_FACTORY_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => deleteFactoryPaymentMethod()}>{KEY_ICON()} Uninstall</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveFactoryPaymentMethod()}>{KEY_ICON()} Save</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelFactoryPaymentMethod()}>Cancel</Button></Col>
					</Row>

					<Row className="mb-3"></Row>

				</Form.Group>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Behaviours</div></div></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col xs={3}><div><Form.Text className="color-frame">Behaviour</Form.Text></div></Col>
						<Col xs={2}><div><Form.Text className="color-frame">Version</Form.Text></div></Col>
						<Col xs={7}><div><Form.Text className="color-frame">Address</Form.Text></div></Col>
					</Row>
					<Row className="mt-2" >
								<Col xs={3}><input className="form-control form-control-lg border-0" disabled={ true } value={'Diamond'} ></input></Col>
								<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={'-'} ></input></Col>
								<Col xs={6}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={'-'} ></input></Col>
								<Col xs={1}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => handleShowFunctions('Diamond')}>...</Button></Col>
							</Row>
					{FACTORY_FACET_TYPES?.map((item: any, index: any) => {
						return (
							<Row className="mt-2" >
								<Col xs={3}><input className="form-control form-control-lg border-0" disabled={ true } value={item} ></input></Col>
								<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][0] : ''} ></input></Col>
								<Col xs={6}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][1] : ''} dir="rtl" ></input></Col>
								<Col xs={1}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => handleShowFunctions(item)}>...</Button></Col>
							</Row>
						);
					})}

				</Form.Group>

				<Row className="m-4"></Row>
				<Modal show={SHOW_FUNCTIONS} onHide={() => showFunctionsModal(false)}>
					<Modal.Header closeButton>
						<Modal.Title>Modal heading</Modal.Title>
					</Modal.Header>
					<Modal.Body>

						{/*
						{Object.keys(INTERFACE_MODAL?.functions!).map((item: string, index: any) => (
							<Row className="mb-3" key={index}>
								<Col>{item}</Col>
							</Row>
						))}
						*/}

						<Form>
							<Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
								<Form.Label> { INTERFACE_MODAL && INTERFACE_MODAL.functions && INTERFACE_MODAL.functions[0] ? INTERFACE_MODAL.functions[0].name : '' } </Form.Label>
								<Form.Control type="email" placeholder="name@example.com" autoFocus />
							</Form.Group>
							<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
								<Form.Label>Example textarea</Form.Label>
								<Form.Control as="textarea" rows={3} />
							</Form.Group>
						</Form>
					</Modal.Body>

					<Modal.Footer>
						<Button variant="secondary" onClick={() => showFunctionsModal(false)}>
							Close
						</Button>
						<Button variant="primary" onClick={() => showFunctionsModal(false)}>
							Save Changes
						</Button>
					</Modal.Footer>

				</Modal>

			</Container>
		</div>

	);

}

export default Environment