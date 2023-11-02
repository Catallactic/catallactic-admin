
import { Contract, ethers } from 'ethers';
import { useErrorHook } from 'hooks/useErrorHook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { NextPage } from 'next'
import { useState } from 'react';
import { Button, Col, Container, Dropdown, Form, Modal, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

const Environment: NextPage = () => {

	const { isDisconnected } = useAccount()

	const CFG_FACTORY_ABI = require('../../abi/CryptocommoditiesFactory.json');
	const CFG_SELECTED_CRYPTOCOMMODITIY_ABI = require('../../abi/Diamond.json');
	const CFG_DIAMOND_CUT_ABI = require('../../abi/DiamondCutFacet.json');
	const CFG_DIAMOND_LOUPE_ABI = require('../../abi/DiamondLoupeFacet.json');
	const CFG_COMMON_ABI = require('../../abi/CommonFacet.json');
	const CFG_CROWDSALE_ABI = require('../../abi/CrowdsaleFacet.json');
	const CFG_VESTING_ABI = require('../../abi/VestingFacet.json');
	const CFG_ERC_20_ABI = require('../../abi/ERC20Facet.json');

	const KEY_ICON = function() {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="1em" height="1em" viewBox="0 0 300 300" fill="#FFF">
				<path d="M287.305,243.005c-0.136-1.772-0.928-3.476-2.227-4.747L172.835,126.015c4.416-10.403,6.747-21.669,6.747-33.312
					c0-22.754-8.875-44.163-24.938-60.266C138.558,16.366,117.164,7.5,94.397,7.5c-22.778,0-44.135,8.869-60.247,24.95
					C0.907,65.675,0.9,119.716,34.145,152.938c16.111,16.115,37.475,24.99,60.241,24.99c11.646,0,22.884-2.35,33.312-6.772
					l36.874,36.902c1.534,1.515,3.557,2.319,5.74,2.248l20.095-0.705l-0.656,20.145c-0.062,2.125,0.705,4.193,2.245,5.706
					c1.484,1.512,3.569,2.334,5.685,2.248l20.169-0.689l-0.724,20.123c-0.063,2.127,0.754,4.199,2.238,5.712
					c1.534,1.512,3.321,2.325,5.74,2.251l20.119-0.684l-0.674,20.126c-0.118,2.232,0.822,4.379,2.418,5.903
					c1.472,1.339,3.309,2.06,5.245,2.06c0.278,0,0.563-0.012,0.847-0.037l30.851-3.426c4.169-0.455,7.205-4.175,6.847-8.353
					L287.305,243.005z M84.106,82.415c-9.476,9.466-24.796,9.466-34.252,0c-9.47-9.469-9.47-24.786,0-34.246
					c9.456-9.46,24.771-9.469,34.252-0.003C93.563,57.625,93.557,72.952,84.106,82.415z M260.97,245.575
					c-1.126,1.126-2.635,1.688-4.101,1.688s-2.976-0.563-4.101-1.688l-95.501-95.529c2.659-2.867,5.077-5.885,7.273-9.058l96.429,96.41
					C263.221,239.65,263.221,243.324,260.97,245.575z"/>
			</svg>
		);
	}

	const [FACTORY_CONTRACT, setFactoryContract] = useState<Contract>()

	const truncateRegex = '^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$';
	const truncateEthAddress = (address: string) => {
		if (!address) return '';
		const match = address.match(truncateRegex);
		if (!match) return address;
		return `${match[1]}…${match[2]}`;
	};

	const { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadFactoryPaymentMethod, FACTORY_PAYMENT_SYMBOLS, FACTORY_PAYMENT_METHODS,
		loadYourCryptocommodities, CRYPTOCOMMODITIES,
	} = useFactoryHook();	

	const [FACTORY_PAYMENT_SYMBOL_SYMBOL, setFactoryPaymentSymbolSymbol] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DECIMALS, setFactoryPaymentSymbolDecimals] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_ADDRESS, setFactoryPaymentSymbolAddress] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_PRICE, setFactoryPaymentSymbolPrice] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_REF, setFactoryPaymentSymbolRef] = useState<any | undefined>()
	const [FACTORY_PAYMENT_SYMBOL_DYN_PRICE, setFactoryPaymentSymbolDynPrice] = useState<any | undefined>()

	const onFactorySelectPaymentMethod = async (symbol: any)=>{
		console.log('selectPaymentMethod', symbol);

		let paymentMethod = await FACTORY_CONTRACT?.getPaymentToken(symbol);
		console.log('paymentMethod', paymentMethod);
		setFactoryPaymentSymbolSymbol(symbol);
		setFactoryPaymentSymbolAddress(paymentMethod[0]);
		setFactoryPaymentSymbolRef(paymentMethod[1]);
		setFactoryPaymentSymbolPrice(paymentMethod[2]);
		setFactoryPaymentSymbolDecimals(paymentMethod[3]);

		/*try {
			let dynPrice = await FACTORY_CONTRACT?.getUusdPerToken(symbol);
			console.log('dynPrice' + dynPrice);
			setFactoryPaymentSymbolDynPrice(dynPrice);
		} catch (error) {
			console.error(error);
			setFactoryPaymentSymbolDynPrice(0);
		}*/

	}

	const [SHOW_FUNCTIONS, showFunctionsModal] = useState(false);
	const [INTERFACE_MODAL, setInterfaceModal] = useState<ethers.utils.Interface>();

	async function handleShowFunctions(facet: string) {
		console.log(facet);

		let facetInterface: ethers.utils.Interface = new ethers.utils.Interface(CFG_SELECTED_CRYPTOCOMMODITIY_ABI);
		if(facet == 'DiamondCutFacet') facetInterface = new ethers.utils.Interface(CFG_DIAMOND_CUT_ABI)!;
		else if(facet == 'DiamondLoupeFacet') facetInterface = new ethers.utils.Interface(CFG_DIAMOND_LOUPE_ABI)!;
		else if(facet == 'CommonFacet') facetInterface = new ethers.utils.Interface(CFG_COMMON_ABI)!;
		else if(facet == 'CrowdsaleFacet') facetInterface = new ethers.utils.Interface(CFG_CROWDSALE_ABI)!;
		else if(facet == 'VestingFacet') facetInterface = new ethers.utils.Interface(CFG_VESTING_ABI)!;
		else if(facet == 'ERC20Facet') facetInterface = new ethers.utils.Interface(CFG_ERC_20_ABI)!;
		console.log(facetInterface);
		console.log(facetInterface.functions);

		setInterfaceModal(facetInterface);

		showFunctionsModal(true);

	}

	async function saveFactoryPaymentMethod() {
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_SYMBOL);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_ADDRESS);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_REF);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_PRICE);
		console.log('saveFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_DECIMALS);
		FACTORY_CONTRACT?.setPaymentToken(FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOL_ADDRESS, FACTORY_PAYMENT_SYMBOL_REF, FACTORY_PAYMENT_SYMBOL_PRICE, FACTORY_PAYMENT_SYMBOL_DECIMALS)
			.then(await loadFactoryPaymentMethod)
			.catch(useErrorHook);

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

	async function deleteFactoryPaymentMethod() {
		console.log('deleteFactoryPaymentMethod', FACTORY_PAYMENT_SYMBOL_SYMBOL);

		let tx = await FACTORY_CONTRACT?.deletePaymentToken(FACTORY_PAYMENT_SYMBOL_SYMBOL, FACTORY_PAYMENT_SYMBOLS.indexOf(FACTORY_PAYMENT_SYMBOL_SYMBOL));
		await tx.wait();

		//populateICOContractData();
		//cancelICOPaymentMethod();
	}

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Payment Tokens</div></div></Col>
					</Row>

					<Row>
						<Col><div><Form.Text className="color-frame">Available Payment Tokens</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onFactorySelectPaymentMethod}>
								<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100">
									{ FACTORY_PAYMENT_SYMBOL_SYMBOL }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{FACTORY_PAYMENT_SYMBOLS?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={FACTORY_PAYMENT_SYMBOL_SYMBOL == item}>
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
						<Col xs={4}><div><Form.Text className="color-frame">Decimals</Form.Text></div></Col>
					</Row>

					<Row>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={event => setFactoryPaymentSymbolSymbol(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_SYMBOL ? FACTORY_PAYMENT_SYMBOL_SYMBOL : '' } ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ isDisconnected } onChange={event => setFactoryPaymentSymbolAddress(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_ADDRESS ? truncateEthAddress(FACTORY_PAYMENT_SYMBOL_ADDRESS) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={event => setFactoryPaymentSymbolDecimals(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_DECIMALS ? FACTORY_PAYMENT_SYMBOL_DECIMALS : '' }></input></Col>
					</Row>

					<Row>
						<Col xs={4}><div><Form.Text className="color-frame">Price (uUSD)</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Ref</Form.Text></div></Col>
						<Col xs={4}><div><Form.Text className="color-frame">Dynamic Price (uUSD)</Form.Text></div></Col>
					</Row>

					<Row>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={event => setFactoryPaymentSymbolPrice(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_PRICE ? FACTORY_PAYMENT_SYMBOL_PRICE : '' }></input></Col>
						<Col xs={4}><input className="form-control form-control-lg bg-yellow color-frame border-0 text-center" disabled={ isDisconnected } onChange={event => setFactoryPaymentSymbolRef(event.target.value)} value={FACTORY_PAYMENT_SYMBOL_REF ? truncateEthAddress(FACTORY_PAYMENT_SYMBOL_REF) : '' } dir="rtl" ></input></Col>
						<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={ FACTORY_PAYMENT_SYMBOL_DYN_PRICE }></input></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => deleteFactoryPaymentMethod()}>{KEY_ICON()} Uninstall</Button></Col>
						<Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => saveFactoryPaymentMethod()}>{KEY_ICON()} Save</Button></Col>
						<Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FACTORY_PAYMENT_SYMBOL_SYMBOL } onClick={() => cancelFactoryPaymentMethod()}>Cancel</Button></Col>
					</Row>

					<Row className="mb-3"></Row>

				</Form.Group>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Behaviors</div></div></Col>
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						<Col xs={4}><div><Form.Text className="color-frame">Behaviour</Form.Text></div></Col>
						<Col xs={2}><div><Form.Text className="color-frame">Version</Form.Text></div></Col>
						<Col xs={6}><div><Form.Text className="color-frame">Address</Form.Text></div></Col>
					</Row>
					<Row className="mt-2" >
								<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={'Diamond'} ></input></Col>
								<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={'-'} ></input></Col>
								<Col xs={5}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={'-'} ></input></Col>
								<Col xs={1}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => handleShowFunctions('Diamond')}>...</Button></Col>
							</Row>
					{FACTORY_FACET_TYPES?.map((item: any, index: any) => {
						return (
							<Row className="mt-2" >
								<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={item} ></input></Col>
								<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][0] : ''} ></input></Col>
								<Col xs={5}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][1] : ''} dir="rtl" ></input></Col>
								<Col xs={1}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => handleShowFunctions(item)}>...</Button></Col>
							</Row>
						);
					})}

				</Form.Group>

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