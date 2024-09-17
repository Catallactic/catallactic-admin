"use client";

import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, ListGroup, Row } from 'react-bootstrap';

import { KEY_ICON, getSelectors, removeSelectors, FacetCutAction} from '../../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useDiamonsLoupeHook } from 'hooks/useDiamonsLoupeHook';
import { useResponseHook } from 'hooks/useResponseHook';
import { keccak256 } from "@ethersproject/keccak256";
import { toUtf8Bytes } from "@ethersproject/strings";
import { useSetChain, useWallets } from '@web3-onboard/react';

const Cryptomcommodities: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const connectedWallets = useWallets()
	const [{ connectedChain }] = useSetChain()
	const { createEnvContracts, envContracts, loadYourCryptocommodities, CRYPTOCOMMODITIES, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
	} = useFactoryHook();	

	const { 
		loadCryptocommodityFacets, 
		SELECTED_CRYPTOCOMMODITY_FACETS,
	} = useDiamonsLoupeHook();

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
		console.log('createEnvContracts');
		createEnvContracts(chainId ? chainId : 0);

		if(selectedCrypto) {
			selectCrypto(selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME);
			loadFacets();
			loadCryptocommodityFacets();
		}

	}, [connectedWallets])

	useEffect(() => {
		console.log('loading Your Cryptocommodities');
		loadYourCryptocommodities();
	}, [contracts])

	useEffect(() => {
		setSelectedCryptocommodityName(selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME!);
		setSelectedCryptocommodityAddress(selectedCrypto?.SELECTED_CRYPTOCOMMODITY_ADDRESS!);
	}, [selectedCrypto])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [X_SELECTED_CRYPTOCOMMODITY_NAME, setSelectedCryptocommodityName] = useState<string>('');
	const [X_SELECTED_CRYPTOCOMMODITY_ADDRESS, setSelectedCryptocommodityAddress] = useState<string>('');

	const [ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()

	const [SELECTED_CRYPTOCOMMODITY_STORAGE, setCryptocommodityStorage] = useState<string>('');

	async function saveCryptocommodity() {
		await envContracts.FACTORY_CONTRACT?.createCryptocommodity(X_SELECTED_CRYPTOCOMMODITY_NAME)
			.then(await handleICOReceipt)
			.then(await loadYourCryptocommodities)
			.catch(handleError);
	}

	async function findCryptocommodity() {
		onSelectCryptocommodity(X_SELECTED_CRYPTOCOMMODITY_NAME);
	}
	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);
		await selectCrypto(cryptocommodityName);
		await loadFacets();
		await loadCryptocommodityFacets();
	}
	async function unselectCryptocommodity() {
		console.log("unselectCryptocommodity");
		await unselectCrypto();
	}

	const onSelectFacet = async (facetName: any, pp: any)=>{
		console.log('onSelectFacet', facetName);
		console.log('onSelectFacet', pp);
		console.log('onSelectFacet', FACTORY_FACETS);

		//let contract = await ethers.getContractAt('DiamondLoupeFacet', FACTORY_FACETS[facetName][1]);
	}

	async function installFacet(facetName: string) {
		console.log("installFacet ", facetName);

		let selectors: any = [];
		let commonSelectors = getSelectors(Object.keys(contracts.SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT?.interface.functions!))
		if (facetName == 'DiamondCutFacet') selectors = [];
		else if (facetName == 'DiamondLoupeFacet') selectors = getSelectors(Object.keys(contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT?.interface.functions!));
		else if (facetName == 'CommonFacet') selectors = getSelectors(Object.keys(contracts.SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT?.interface.functions!));
		else if (facetName == 'CrowdsaleFacet') selectors = removeSelectors(getSelectors(Object.keys(contracts.SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT?.interface.functions!)), commonSelectors);
		else if (facetName == 'VestingFacet') selectors = removeSelectors(getSelectors(Object.keys(contracts.SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT?.interface.functions!)), commonSelectors);
		else if (facetName == 'ERC20Facet') selectors = removeSelectors(getSelectors(Object.keys(contracts.SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT?.interface.functions!)), commonSelectors);
		console.log("selectors ", selectors);

		// would need to merge abi files
		let tx = await contracts.SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT?.diamondCut([{ 
			facetAddress: FACTORY_FACETS[facetName][1],
			action: FacetCutAction.Add,
			functionSelectors: selectors,
		}]);
		await tx.wait();

		loadCryptocommodityFacets();

		console.log("installFacet end", facetName);
	}
	async function uninstallFacet(facetName: string) {
		console.log("uninstallFacet ", facetName);
	}

	async function setStorage() {
		console.log("SELECTED_CRYPTOCOMMODITY_STORAGE", SELECTED_CRYPTOCOMMODITY_STORAGE);
		let storage = keccak256(toUtf8Bytes(SELECTED_CRYPTOCOMMODITY_STORAGE));
		console.log("storage", storage);
		await contracts.SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT?.setStorage(storage);
	}

  return (

    <div className="bg-page d-flex flex-row align-items-center dark:bg-transparent">
      <Container className='mw-100'>

				<Row className="m-4"></Row>
				<Form.Group className="p-5 rounded-5 bg-group">

					<Row>
						<Col><div><div className="color-frame fs-4 text-center text-center w-100">Cryptocommodities</div></div></Col>
					</Row>

					<Row>
						<Col><div><Form.Text className="color-frame">List of Cryptocommodities</Form.Text></div></Col>
					</Row>
					<Row>
						<Col>
							<Dropdown onSelect={onSelectCryptocommodity}>
								<Dropdown.Toggle className="btn-lg bg-edited text-black-50 w-100 border-0" disabled={!CRYPTOCOMMODITIES || CRYPTOCOMMODITIES.length == 0}>
									{ selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME }
								</Dropdown.Toggle>

								<Dropdown.Menu className="w-100">
									{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
										return (
											<Dropdown.Item as="button" key={index} eventKey={item} active={selectedCrypto?.SELECTED_CRYPTOCOMMODITY_NAME == item}>
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
						<Col><div><Form.Text className="color-frame">Name</Form.Text></div></Col>
						{ selectedCrypto ? <Col xs={8} ><div><Form.Text className="color-frame">Address</Form.Text></div></Col> : '' }
					</Row>

					<Row>
						<Col><input className="form-control form-control-lg bg-edited border-0" disabled={ !connectedChain || selectedCrypto != undefined } value={X_SELECTED_CRYPTOCOMMODITY_NAME} onChange={(event) => setSelectedCryptocommodityName(event.target.value)} ></input></Col>
						{ selectedCrypto ? <Col xs={8} ><input className="form-control form-control-lg bg-edited border-0" disabled={ !connectedChain || selectedCrypto != undefined } value={X_SELECTED_CRYPTOCOMMODITY_ADDRESS} onChange={(event) => setSelectedCryptocommodityAddress(event.target.value)}  ></input></Col> : '' }
					</Row>

					<Row className="mb-3"></Row>
					{ selectedCrypto ? 
					<Row>
						<Col>
							<Row>
								<Col xs={4}><div><Form.Text className="color-frame">Behaviour</Form.Text></div></Col>
								<Col xs={2}><div><Form.Text className="color-frame">Version</Form.Text></div></Col>
								<Col xs={3}><div><Form.Text className="color-frame">Status</Form.Text></div></Col>
							</Row>
						</Col>
					</Row>
						: '' }
					{ selectedCrypto ? 
					<Row>
						<Col>
							<ListGroup onSelect={onSelectFacet}>
								{FACTORY_FACET_TYPES?.map((item: any, index: any) => {
									return (
										<Row className="mt-2" key={index} eventKey={item} active={ICO_PAYMENT_SYMBOL_SYMBOL == item} >
											<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={item} ></input></Col>
											<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][0] : ''} ></input></Col>

											{ item == 'DiamondCutFacet' ?
												<Col xs={6}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={true} >Installed</Button></Col>
											: SELECTED_CRYPTOCOMMODITY_FACETS && FACTORY_FACETS[item] && FACTORY_FACETS[item][1] && SELECTED_CRYPTOCOMMODITY_FACETS.filter(function(elem:any) { return elem[0] == FACTORY_FACETS[item][1] }).length > 0 ?
												<Col xs={6}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => uninstallFacet(item)}>Uninstall</Button></Col>
											:
												<Col xs={6}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" onClick={() => installFacet(item)}>Install</Button></Col>
											}
										</Row>

									);
								})}
							</ListGroup>
						</Col>
					</Row>
						: '' }

					<Row className="mb-3"></Row>
					<Row>
						{ selectedCrypto ? <Col><div><Form.Text className="color-frame">Storage</Form.Text></div></Col> : '' }
					</Row>
					<Row>
						{ selectedCrypto ? <Col xs={8}><input className="form-control form-control-lg bg-edited color-frame border-0" value={SELECTED_CRYPTOCOMMODITY_STORAGE} onChange={(event) => setCryptocommodityStorage(event.target.value)} ></input></Col> : '' }
						{ selectedCrypto ? <Col xs={4}><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => setStorage()}>{KEY_ICON()} Set Storage</Button></Col> : '' }
					</Row>

					<Row className="mb-3"></Row>
					<Row>
						{ selectedCrypto ? <Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => unselectCryptocommodity()}>Cancel</Button></Col> : '' }
						{ !selectedCrypto ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => findCryptocommodity()}>{KEY_ICON()} Find</Button></Col> : '' }
						{ !selectedCrypto ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ !connectedChain || !X_SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => saveCryptocommodity()}>{KEY_ICON()} Add</Button></Col> : '' }
					</Row>

				</Form.Group>

				<Row className="m-4"></Row>

		</Container>
		</div>

	);

}

export default Cryptomcommodities