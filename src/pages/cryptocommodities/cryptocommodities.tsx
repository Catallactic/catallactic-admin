
import { Contract, ethers } from 'ethers';
import { NextPage } from 'next'
import { useState } from 'react';
import { Button, Col, Container, Dropdown, Form, ListGroup, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

import { KEY_ICON, MapType } from '../../config/config'

declare let window:any

const Cryptomcommodities: NextPage = () => {

	const { isDisconnected } = useAccount()

	const CFG_FACTORY_ABI = require('../../abi/CryptocommoditiesFactory.json');
	const CFG_SELECTED_CRYPTOCOMMODITIY_ABI = require('../../abi/Diamond.json');
	const CFG_DIAMOND_CUT_ABI = require('../../abi/DiamondCutFacet.json');
	const CFG_DIAMOND_LOUPE_ABI = require('../../abi/DiamondLoupeFacet.json');
	const CFG_COMMON_ABI = require('../../abi/CommonFacet.json');
	const CFG_CROWDSALE_ABI = require('../../abi/CrowdsaleFacet.json');
	const CFG_VESTING_ABI = require('../../abi/VestingFacet.json');
	const CFG_ERC_20_ABI = require('../../abi/ERC20Facet.json');

	const [FACTORY_CONTRACT, setFactoryContract] = useState<Contract>()


	const [SELECTED_CRYPTOCOMMODITY_NAME, setSelectedCryptocommodityName] = useState<string>('');
	const [SELECTED_CRYPTOCOMMODITY_ADDRESS, setSelectedCryptocommodityAddress] = useState<string>('');

	const [FACTORY_FACET_TYPES, setFactoryFacetTypes] = useState([]);
	const [FACTORY_FACETS, setFactoryFacets] = useState<MapType>({})

	const [SELECTED_CRYPTOCOMMODITY_CONTRACT, setSelectedCryptocommodityContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_CUT_CONTRACT, setSelectedCryptocommodityDiamondCutContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_DIAMOND_LOUPE_CONTRACT, setSelectedCryptocommodityDiamondLoupeContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_COMMON_CONTRACT, setSelectedCryptocommodityCommonContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_CROWDSALE_CONTRACT, setSelectedCryptocommodityCrowdsaleContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_VESTING_CONTRACT, setSelectedCryptocommodityVestingContract] = useState<Contract>()
	const [SELECTED_CRYPTOCOMMODITY_TOKEN_CONTRACT, setSelectedCryptocommodityTokenContract] = useState<Contract>()
	const [ADD_CRYPTOCOMMODITY_NAME, setAddCryptocommodityName] = useState<string>('');
	const [FIND_CRYPTOCOMMODITY_NAME, setFindCryptocommodityName] = useState<string>('');

	const [ICO_PAYMENT_SYMBOL_SYMBOL, setICOPaymentSymbolSymbol] = useState<any | undefined>()

	const [SELECTED_CRYPTOCOMMODITY_FACETS, setSelectedCryptocommodityFacets] = useState<any>();

	const [CRYPTOCOMMODITIES, setCryptocommodities] = useState([]);

	async function loadFacets() {
		// get read only - payment methods
		let facetTypes = await FACTORY_CONTRACT?.getFacetTypes();
		setFactoryFacetTypes(facetTypes);
		console.log("facetTypes: " + facetTypes);
		console.log(facetTypes);

		const map: MapType = {};
		for (var i = 0; i < facetTypes.length; i++) {
			console.log("facetType: " + facetTypes[i]);
			let facetType = await FACTORY_CONTRACT?.getFacetVersions(facetTypes[i]);
			console.log("facetType: " + facetType);
			console.log(facetType);
			map[facetTypes[i]] = facetType[0];
		}
		console.log(map);
		console.log("facetTypes: " + map);
		setFactoryFacets(map);
	}

	const onSelectFacet = async (facetName: any, pp: any)=>{
		console.log('onSelectFacet', facetName);
		console.log('onSelectFacet', pp);
		console.log('onSelectFacet', FACTORY_FACETS[facetName][0]);
		console.log('onSelectFacet', FACTORY_FACETS[facetName][1]);

		//let contract = await ethers.getContractAt('DiamondLoupeFacet', FACTORY_FACETS[facetName][1]);
		

	}
	async function unselectCryptocommodity() {
		console.log("unselectCryptocommodity");
		setSelectedCryptocommodityName('');
		setSelectedCryptocommodityAddress('');
		setAddCryptocommodityName('');
	}

	const onSelectCryptocommodity = async (cryptocommodityName: any)=>{
		console.log('onSelectCryptocommodity', cryptocommodityName);

		let cryptocommodityAddress = await FACTORY_CONTRACT?.getCryptocommodity(cryptocommodityName);
		setSelectedCryptocommodityName(cryptocommodityName);
		setSelectedCryptocommodityAddress(cryptocommodityAddress);

		const provider = new ethers.providers.Web3Provider(window.ethereum)
		const signer = provider.getSigner();

		const cryptocommodityContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_SELECTED_CRYPTOCOMMODITIY_ABI, signer);
		setSelectedCryptocommodityContract(cryptocommodityContract);

		const diamondCutContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_CUT_ABI, signer);
		setSelectedCryptocommodityDiamondCutContract(diamondCutContract);

		const diamondLoupeContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_DIAMOND_LOUPE_ABI, signer);
		setSelectedCryptocommodityDiamondLoupeContract(diamondLoupeContract);

		const commonContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_COMMON_ABI, signer);
		setSelectedCryptocommodityCommonContract(commonContract);

		const crowdsaleContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_CROWDSALE_ABI, signer);
		setSelectedCryptocommodityCrowdsaleContract(crowdsaleContract);

		const vestingContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_VESTING_ABI, signer);
		setSelectedCryptocommodityVestingContract(vestingContract);

		const tokenContract: Contract = new ethers.Contract(cryptocommodityAddress, CFG_ERC_20_ABI, signer);
		setSelectedCryptocommodityTokenContract(tokenContract);

		loadFacets();

		// loadCryptocommodityFacets();
		let facets = await diamondLoupeContract.facets();
		console.log("loadCryptocommodityFacets: ", facets);
		setSelectedCryptocommodityFacets(facets);
	}

	async function findCryptocommodity() {
		console.log("FIND_CRYPTOCOMMODITY_NAME: ", FIND_CRYPTOCOMMODITY_NAME);
		onSelectCryptocommodity(FIND_CRYPTOCOMMODITY_NAME);
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
							<Dropdown.Toggle className="btn-lg bg-yellow text-black-50 w-100" disabled={true}>
								{ SELECTED_CRYPTOCOMMODITY_NAME }
							</Dropdown.Toggle>

							<Dropdown.Menu className="w-100">
								{CRYPTOCOMMODITIES?.map((item: any, index: any) => {
									return (
										<Dropdown.Item as="button" key={index} eventKey={item} active={SELECTED_CRYPTOCOMMODITY_NAME == item}>
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
					{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col xs={8} ><div><Form.Text className="color-frame">Address</Form.Text></div></Col> : '' }
				</Row>

				<Row>
					{ !SELECTED_CRYPTOCOMMODITY_NAME ? <Col><input className="form-control form-control-lg bg-yellow color-frame border-0" disabled={ isDisconnected } defaultValue={SELECTED_CRYPTOCOMMODITY_NAME} value={FIND_CRYPTOCOMMODITY_NAME} onChange={(event) => setFindCryptocommodityName(event.target.value)} ></input></Col> : '' }
					{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col xs={4} ><input className="form-control form-control-lg text-center border-0" disabled={ true } value={SELECTED_CRYPTOCOMMODITY_NAME} ></input></Col> : '' }
					{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col xs={8} ><input className="form-control form-control-lg text-center border-0" disabled={ true } value={SELECTED_CRYPTOCOMMODITY_ADDRESS} ></input></Col> : '' }
				</Row>

				<Row className="mb-3"></Row>
				{ SELECTED_CRYPTOCOMMODITY_NAME ? 
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
				{ SELECTED_CRYPTOCOMMODITY_NAME ? 
				<Row>
					<Col>
						<ListGroup onSelect={onSelectFacet}>
							{FACTORY_FACET_TYPES?.map((item: any, index: any) => {
								return (
									<Row className="mt-2" key={index} eventKey={item} active={ICO_PAYMENT_SYMBOL_SYMBOL == item} >
										<Col xs={4}><input className="form-control form-control-lg border-0" disabled={ true } value={item} ></input></Col>
										<Col xs={2}><input className="form-control form-control-lg text-center border-0" disabled={ true } value={FACTORY_FACETS[item] ? FACTORY_FACETS[item][0] : ''} ></input></Col>

										{ SELECTED_CRYPTOCOMMODITY_FACETS && SELECTED_CRYPTOCOMMODITY_FACETS.filter(function(elem:any) { return elem[0] == FACTORY_FACETS[item][1] }).length > 0 ?
											<Col xs={6}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ true }>Installed</Button></Col>
										:
											<Col xs={6}><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ true }>Not Installed</Button></Col>
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
					{ SELECTED_CRYPTOCOMMODITY_NAME ? <Col><Button type="submit" className="w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !SELECTED_CRYPTOCOMMODITY_NAME } onClick={() => unselectCryptocommodity()}>Cancel</Button></Col> : '' }
					{ !SELECTED_CRYPTOCOMMODITY_NAME ? <Col><Button type="submit" className="d-flex justify-content-center w-100 btn-lg bg-button p-2 fw-bold border-0" disabled={ isDisconnected || !FIND_CRYPTOCOMMODITY_NAME } onClick={() => findCryptocommodity()}>{KEY_ICON()} Find</Button></Col> : '' }
				</Row>

				</Form.Group>

			</Container>
		</div>

	);

}

export default Cryptomcommodities