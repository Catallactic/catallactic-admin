
import { NextPage } from 'next'
import { useContext, useEffect, useState } from 'react';
import { Button, Col, Container, Dropdown, Form, ListGroup, Row } from 'react-bootstrap';

import { useAccount, useNetwork } from 'wagmi'

import { KEY_ICON, getSelectors, removeSelectors, FacetCutAction} from '../../config/config'
import { ContractsContext } from 'hooks/useContractContextHook';
import { useFactoryHook } from 'hooks/useFactoryHook';
import { useDiamonsLoupeHook } from 'hooks/useDiamonsLoupeHook';
import { useResponseHook } from 'hooks/useResponseHook';

const Cryptomcommodities: NextPage = () => {

	// *************************************************************************************************************************
	// ******************************************************** Read Data ******************************************************
	// *************************************************************************************************************************
	const { chain } = useNetwork()

	const { isDisconnected } = useAccount()

	const { createEnvContracts, envContracts, selectCrypto, unselectCrypto, selectedCrypto, contracts } = useContext(ContractsContext);

	const { 
		loadFacets, FACTORY_FACET_TYPES, FACTORY_FACETS,
		loadYourCryptocommodities, CRYPTOCOMMODITIES,
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
		console.log('createEnvContracts');
		createEnvContracts(chain?.id ? chain.id : 0);
	}, [])

	useEffect(() => {
		console.log('loading Your Cryptocommodities');
		loadYourCryptocommodities();
	}, [contracts])

	// *************************************************************************************************************************
	// ******************************************************** Update Data ****************************************************
	// *************************************************************************************************************************
	const [FIND_CRYPTOCOMMODITY_NAME, setFindCryptocommodityName] = useState<string>('');

	const [ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()

	async function saveCryptocommodity() {
		await envContracts.FACTORY_CONTRACT?.createCryptocommodity(FIND_CRYPTOCOMMODITY_NAME)
			.then(await handleICOReceipt)
			.then(await loadYourCryptocommodities)
			.catch(handleError);
	}

	async function findCryptocommodity() {
		onSelectCryptocommodity(FIND_CRYPTOCOMMODITY_NAME);
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
		console.log('onSelectFacet', FACTORY_FACETS[facetName][0]);
		console.log('onSelectFacet', FACTORY_FACETS[facetName][1]);

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

  return (

    <div className="bg-light min-vh-100 d-flex flex-row align-items-center dark:bg-transparent">
      <Container>

				<Row className="mb-3"></Row>
				<Form.Group className="p-3 border border-dark rounded bg-light-grey">
				<Row>
					<Col><div><div className="color-frame fs-4 text-center text-center w-100">Cryptocommodities</div></div></Col>
				</Row>

				<Row>
					<Col><div><Form.Text className="color-frame">List of Cryptocommodities</Form.Text></div></Col>
				</Row>
				<Row>
					<Col>
						<Dropdown onSelect={onSelectCryptocommodity}>
							<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={!CRYPTOCOMMODITIES || CRYPTOCOMMODITIES.length == 0}>
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
					{ !selectedCrypto ? <Col><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } onChange={(event) => setFindCryptocommodityName(event.target.value)} ></input></Col> : '' }
					{ selectedCrypto ? <Col xs={8} ><input className="form-control form-control-lg text-center border-0" disabled={ true } value={selectedCrypto.SELECTED_CRYPTOCOMMODITY_ADDRESS} ></input></Col> : '' }
					{ selectedCrypto ? <Col xs={4} ><input className="form-control form-control-lg text-center border-0" disabled={ true } value={selectedCrypto.SELECTED_CRYPTOCOMMODITY_NAME} ></input></Col> : '' }
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
									: SELECTED_CRYPTOCOMMODITY_FACETS && FACTORY_FACETS[item][1] && SELECTED_CRYPTOCOMMODITY_FACETS.filter(function(elem:any) { return elem[0] == FACTORY_FACETS[item][1] }).length > 0 ?
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
					{ selectedCrypto ? <Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !selectedCrypto } onClick={() => unselectCryptocommodity()}>Cancel</Button></Col> : '' }
					{ !selectedCrypto ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FIND_CRYPTOCOMMODITY_NAME } onClick={() => findCryptocommodity()}>{KEY_ICON()} Find</Button></Col> : '' }
					{ !selectedCrypto ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FIND_CRYPTOCOMMODITY_NAME } onClick={() => saveCryptocommodity()}>{KEY_ICON()} Add</Button></Col> : '' }
				</Row>

				</Form.Group>

			</Container>
		</div>

	);

}

export default Cryptomcommodities