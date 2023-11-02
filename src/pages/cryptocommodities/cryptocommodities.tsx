
import { Contract, ethers } from 'ethers';
import { NextPage } from 'next'
import { useState } from 'react';
import { Button, Col, Container, Dropdown, Form, ListGroup, Row } from 'react-bootstrap';

import { useAccount } from 'wagmi'

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
	type MapType = { 
		[id: string]: string; 
	}

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