import { Contract, utils } from "ethers";

// export const chains = 

export const exchanges: any = {
	0x8173:  {
		name: "Acechain",
		exchanges: [
			{ "name": "camelot", "factory": "0x7d8c6B58BA2d40FC6E34C25f9A488067Fe0D2dB4", "router": "0x18E621B64d7808c3C47bccbbD7485d23F257D26f" },
		]
	},
	0xa4b1:  {
		name: "Arbitrum",
		exchanges: [
			{ "name": "uniswap", "factory": "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9", "router": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" },
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "pancakeswap", "factory": "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E", "router": "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb" },
			{ "name": "diamondswap", "factory": "0xE56d7e0344C68D0C5A2456eed229115B4071DB5e", "router": "0xeAa3ff4F434EFe6eFBB148075EfF2e37D311568F" },
			{ "name": "fraxswap", "factory": "0x8374A74A728f06bEa6B7259C68AA7BBB732bfeaD", "router": "0xCAAaB0A72f781B92bA63Af27477aA46aB8F653E7" },
			{ "name": "apeswap", "factory": "0xCf083Be4164828f00cAE704EC15a36D711491284", "router": "0x7d13268144adcdbEBDf94F654085CC15502849Ff" },
			{ "name": 	"camelot", "factory": "0x6EcCab422D763aC031210895C81787E87B43A652", "router": "0xc873fEcbd354f5A56E00E710B90EF4201db2448d" },
			{ "name": "magicswap", "factory": "0x77fa938998e196701c324149f771efd6e980df0a", "router": "0xb740d5804ea2061432469119cfa40cbb4586dd17" },
		]
	},
	0xa86a:  {
		name: "Avalanche",
		exchanges: [
			{ "name": "uniswap", "factory": "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C", "router": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" },
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "dxswap", "factory": "0xf77ca9B635898980fb219b4F4605C50e4ba58afF", "router": "0x5977b16AA9aBC4D1281058C73B789C65Bf9ab3d3" },
		]
	},
	0x2105:  {
		name: "Base",
		exchanges: [
			{ "name": "uniswap", "factory": "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6", "router": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" },
			{ "name": "sushiswap", "factory": "0x71524B4f93c58fcbF659783284E38825f0622859", "router": "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891" },
			{ "name": "pancakeswap", "factory": "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E", "router": "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb" },
			{ "name": "diamondswap", "factory": "0x1a62A841E83ECC3D72b0de6002AF7a7Dbf921Cd5", "router": "0x0681363e5da35a248E1abb5CddD6DB9cDac9a771" },
			{ "name": "equalizer", "factory": "0xEd8db60aCc29e14bC867a497D94ca6e3CeB5eC04", "router": "0x2F87Bf58D5A9b2eFadE55Cdbd46153a0902be6FA" },
		]
	},
	0x13e31:  {
		name: "Blast",
		exchanges: [
			{ "name": "uniswap", "factory": "0x5C346464d33F90bABaf70dB6388507CC889C1070", "router": "0xBB66Eb1c5e875933D44DAe661dbD80e5D9B03035" },
			{ "name": "sushiswap", "factory": "0x42Fa929fc636e657AC568C0b5Cf38E203b67aC2b", "router": "0x54CF3d259a06601b5bC45F61A16443ed5404DD64" },
			{ "name": "diamondswap", "factory": "0xfD5b5332D3472AD4ef539424B14D7C9182427dbB", "router": "0xc8cefBd5429fD5413e5d9EF16F20eF93Da4F6Ec4" },
			{ "name": "monoswap", "factory": "0xE27cb06A15230A7480d02956a3521E78C5bFD2D0", "router": "0x859374eA6dF8289d883fEd4E688a83381276521d" },
		]
	},
	0x120:  {
		name: "Boba Network",
		exchanges: [
			{ "name": "uniswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0x38:  {
		name: "BNB Smart Chain Mainnet",
		exchanges: [
			{ "name": "uniswap", "factory": "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6", "router": "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24" },
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "pancakeswap", "factory": "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73", "router": "0x10ED43C718714eb63d5aA57B78B54704E256024E" },
			{ "name": "diamondswap", "factory": "0x81A1417CBEc636e631fA62b81F970a5Ec23B39CA", "router": "0xdA627463977C8DA8E14A8afBafDdc8041DFC18B3" },
			{ "name": "fraxswap", "factory": "0xf89e6CA06121B6d4370f4B196Ae458e8b969A011", "router": "0x67F755137E0AE2a2aa0323c047715Bf6523116E5" },
			{ "name": "apeswap", "factory": "0x0841BD0B734E4F5853f0dD8d7Ea041c241fb0Da6", "router": "0xcF0feBd3f17CEf5b47b0cD257aCf6025c5BFf3b7" },
			{ "name": "swipeswap", "factory": "0x7810D4B7bC4F7faee9deec3242238a39c4f1197d", "router": "0x816278BbBCc529f8cdEE8CC72C226fb01def6E6C" },
			{ "name": "jetswap", "factory": "0x0eb58E5c8aA63314ff5547289185cC4583DfCBD5", "router": "0xBe65b8f75B9F20f4C522e0067a3887FADa714800" },
			{ "name": "babydogeswap", "factory": "0x4693B62E5fc9c0a45F89D62e6300a03C85f43137", "router": "0xC9a0F685F39d05D835c369036251ee3aEaaF3c47" },
			{ "name": "babyswap", "factory": "0x86407bEa2078ea5f5EB5A52B2caA963bC1F889Da", "router": "0x325E343f1dE602396E256B67eFd1F61C3A6B38Bd" },
		]
	},
	0xc7:  {
		name: "BTT",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xB45e53277a7e0F1D35f2a77160e91e25507f1763", "router": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE" },
		]
	},
	0xa4ec:  {
		name: "Celo",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1421bDe4B10e8dd459b3BCb598810B1337D56842" },
			{ "name": "ubeswap", "factory": "0x62d5b84bE28a183aBB507E125B384122D2C25fAE", "router": "0xE3D8bd6Aed4F159bc8000a9cD47CffDb95F96121" },
		]
	},
	0x45c:  {
		name: "Core",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xB45e53277a7e0F1D35f2a77160e91e25507f1763", "router": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE" },
		]
	},
	0x19:  {
		name: "Cronos",
		exchanges: [
			{ "name": "vvs", "factory": "0x3B44B2a187a7b3824131F8db5a74194D0a42Fc15", "router": "0x145863Eb42Cf62847A6Ca784e6416C1682b1b2Ae" },
			{ "name": "cronaswap", "factory": "0x73A48f8f521EB31c55c0e1274dB0898dE599Cb11", "router": "0xcd7d16fB918511BF7269eC4f48d61D79Fb26f918" },
		]
	},
	0x7d0:  {
		name: "Dogechain",
		exchanges: [
			{ "name": "quickswap", "factory": "0xC3550497E591Ac6ed7a7E03ffC711CfB7412E57F", "router": "0xAF96E63f965374dB6514e8CF595fB0a3f4d7763c" },
		]
	},
	0xa729:  {
		name: "Etherlink",
		exchanges: [
			{ "name": "iguanadex", "factory": "0x3eebf549D2d8839E387B63796327eE2C8f64A0C4", "router": "0xC00c41492e243ec24Bf0B3038b74d7Bd48411e63" },
		]
	},
	0x1: {
		name: "Ethereum",
		exchanges: [
			{ "name": "uniswap", "factory": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", "router": "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D" },
			{ "name": "sushiswap", "factory": "0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac", "router": "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F" },
			{ "name": "ethervista", "factory": "0x9a27cb5ae0B2cEe0bb71f9A85C0D60f3920757B4", "router": "0xCEDd366065A146a039B92Db35756ecD7688FCC77" },
			{ "name": "shibaswap", "factory": "0x115934131916C8b277DD010Ee02de363c09d037c", "router": "" },
			{ "name": "pancakeswap", "factory": "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362", "router": "0xEfF92A263d31888d860bD50809A8D171709b7b1c" },
			{ "name": "diamondswap", "factorys": "0xE1046fcB1057ef82B68f3A6B8eBb0e411Cf334E0", "router": "0x57712F6FDb7e8be144a9157f5E7958B1Dc612480" },
			{ "name": "plasmaswap", "factory": "0xd87Ad19db2c4cCbf897106dE034D52e3DD90ea60", "router": "0x5ec243F1F7ECFC137e98365C30c9A28691d86132" },
			{ "name": "fraxswap", "factory": "0x43eC799eAdd63848443E2347C49f5f52e8Fe0F6f", "router": "0xC14d550632db8592D1243Edc8B95b0Ad06703867" },
			{ "name": "apeswap", "factory": "0xBAe5dc9B19004883d0377419FeF3c2C8832d7d7B", "router": "0x5f509a3C3F16dF2Fba7bF84dEE1eFbce6BB85587" },
			{ "name": "swipeswap", "factory": "0x8a93B6865C4492fF17252219B87eA6920848EdC0", "router": "0xCB0cb2d22C529FdC9F6EFff2ED21086104b21a79" },
			{ "name": "vvs", "factory": "0x54Ff509102D51Bf4e0d06184A051c1e917333254", "router": "0x2e5dbaa86FcA7cb73F060300C55B51C72f1B8554" },
		]
	},
	0xfa:  {
		name: "Fantom Opera",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "equalizer", "factory": "0xc6366EFD0AF1d09171fe0EBF32c7943BB310832a", "router": "0x2aa07920e4ecb4ea8c801d9dfece63875623b285" },
			{ "name": "fraxswap", "factory": "0xDc745E09fC459aDC295E2e7baACe881354dB7F64", "router": "0x7D21C651Dd333306B35F2FeAC2a19FA1e1241545" },
			{ "name": "jetswap", "factory": "0xf6488205957f0b4497053d6422F49e27944eE3Dd", "router": "0x845E76A8691423fbc4ECb8Dd77556Cb61c09eE25" },
		]
	},
	0x13a:  {
		name: "Filecoin",
		exchanges: [
			{ "name": "sushiswap", "factory": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE", "router": "0x46B3fDF7b5CDe91Ac049936bF0bDb12c5d22202e" },
		]
	},
	0xfc:  {
		name: "Fraxtal",
		exchanges: [
			{ "name": "fraxswap", "factory": "0xE30521fe7f3bEB6Ad556887b50739d6C7CA667E6", "router": "0x2Dd1B4D4548aCCeA497050619965f91f78b3b532" },
		]
	},
	0x7a:  {
		name: "Fuse",
		exchanges: [
			{ "name": "sushiswap", "factory": "0x43eA90e2b786728520e4f930d2A71a477BF2737C", "router": "0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3" },
			{ "name": "voltage", "factory": "0x1998E4b0F1F922367d8Ec20600ea2b86df55f34E", "router": "0xE3F85aAd0c8DD7337427B9dF5d0fB741d65EEEB5" },
		]
	},
	0x64:  {
		name: "Gnosis",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0x2be3:  {
		name: "Haqq",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xB45e53277a7e0F1D35f2a77160e91e25507f1763", "router": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE" },
		]
	},
	0x63564c40:  {
		name: "Harmony",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0x80:  {
		name: "Huobi ECO",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0x8ae:  {
		name: "Kava",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xD408a20f1213286fB3158a2bfBf5bFfAca8bF269", "router": "0x1719DEf1BF8422a777f2442bcE704AC4Fb20c7f0" },
		]
	},
	0xe708:  {
		name: "Linea",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xFbc12984689e5f15626Bad03Ad60160Fe98B303C", "router": "0x2ABf469074dc0b54d793850807E6eb5Faf2625b1" },
			{ "name": "pancakeswap", "factory": "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E", "router": "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb" },
			{ "name": "diamondswap", "factory": "0xE3762AC5A3547c2734590Cb8A6e0cff3C690db84", "router": "0xA69BC8eB7Edf32C403c3208A3360820f0C0BeC48" },		]
	},
	0xa9:  {
		name: "Manta Pacific",
		exchanges: [
			{ "name": "pacificswap", "factory": "0x19405689008954CcddBc8C7Ef2b64Dd88b4a674a", "router": "0x314059Ed8cAdB35ae3C3bDaedCDeB48CcFC6012B" },
		]
	},
	0x440:  {
		name: "Metis",
		exchanges: [
			{ "name": "sushiswap", "factory": "0x580ED43F3BBa06555785C81c2957efCCa71f7483", "router": "0xbF3B71decBCEFABB3210B9D8f18eC22e0556f5F0" },
			{ "name": "hercules", "factory": "0xF38E7c7f8eA779e8A193B61f9155E6650CbAE095", "router": "0x14679D1Da243B8c7d1A4c6d0523A2Ce614Ef027C" },
			{ "name": "netswap", "factory": "0x70f51d68D16e8f9e418441280342BD43AC9Dff9f", "router": "0x1E876cCe41B7b844FDe09E38Fa1cf00f213bFf56" },
		]
	},
	0x868b:  {
		name: "Mode",
		exchanges: [
			{ "name": "supswap", "factory": "0x557f46F67a36E16Ff27e0a39C5DA6bFCB4Ff89c0", "router": "0x082C1E810B6518a65ae61d9C07dc25d9ffe61Ae6" },
			{ "name": "mimo", "factory": "0xda257cBe968202Dea212bBB65aB49f174Da58b9D", "router": "0x147CdAe2BF7e809b9789aD0765899c06B361C5cE" },
		]
	},
	0x504:  {
		name: "Moonbeam",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "fraxswap", "factory": "0x51f9DBEd76f5Dcf209817f641b549aa82F35D23F", "router": "0xD356d5b92a2329777310ECa03E7e708D1D21D182" },
			{ "name": "beamswap", "factory": "0x985BcA32293A7A496300a48081947321177a86FD", "router": "0x96b244391D98B62D19aE89b1A4dCcf0fc56970C7" },
		]
	},
	0x505:  {
		name: "Moonriver",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "fraxswap", "factory": "0x7FB05Ca29DAc7F5690E9b5AE0aF0415D579D7CD3", "router": "0xD8FC27ec222E8d5172CD63aC453C6Dfb7467a3C7" },
		]
	},
	0xe9ac0d6:  {
		name: "Neon",
		exchanges: [
			{ "name": "monoswap", "factory": "0xd43F135f6667174f695ecB7DD2B5f953d161e4d1", "router": "0x594e37b9f39f5d31dec4a8c1cc4fe2e254153034" },
		]
	},
	0x42:  {
		name: "OKXChain",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0xcc:  {
		name: "opBNB",
		exchanges: [
			{ "name": "pancakeswap", "factory": "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E", "router": "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb" },
		]
	},
	0xa:  {
		name: "Optimism",
		exchanges: [
			{ "name": "uniswap", "factory": "0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf", "router": "0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2" },
			{ "name": "sushiswap", "factory": "0xFbc12984689e5f15626Bad03Ad60160Fe98B303C", "router": "0x2ABf469074dc0b54d793850807E6eb5Faf2625b1" },
			{ "name": "fraxswap", "factory": "0x67a1412d2D6CbF211bb71F8e851b4393b491B10f", "router": "0xB9A55F455e46e8D717eEA5E47D2c449416A0437F" },
		]
	},
	0x2a15c308d:  {
		name: "Palm",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0x89:  {
		name: "Polygon",
		exchanges: [
			{ "name": "uniswap", "factory": "0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C", "router": "0xedf6066a2b290C185783862C7F4776A2C8077AD1" },
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
			{ "name": "fraxswap", "factory": "0x54F454D747e037Da288dB568D4121117EAb34e79", "router": "0xE52D0337904D4D0519EF7487e707268E1DB6495F" },
			{ "name": "apeswap", "factory": "0xCf083Be4164828f00cAE704EC15a36D711491284", "router": "0xC0788A3aD43d79aa53B09c2EaCc313A787d1d607" },
			{ "name": "quickswap", "factory": "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff", "router": "0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32" },
			{ "name": "jetswap", "factory": "0x668ad0ed2622C62E24f0d5ab6B6Ac1b9D2cD4AC7", "router": "0x5C6EC38fb0e2609672BDf628B1fD605A523E5923" },
		]
	},
	0x1e:  {
		name: "Rootstock",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xB45e53277a7e0F1D35f2a77160e91e25507f1763", "router": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE" },
		]
	},
	0x82750:  {
		name: "Scroll",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xB45e53277a7e0F1D35f2a77160e91e25507f1763", "router": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE" },
			{ "name": "diamondswap", "factory": "0xAcF7Ca94d3534D065fc1454EF18eB89948b9AAe7", "router": "0xc8cefBd5429fD5413e5d9EF16F20eF93Da4F6Ec4" },
			{ "name": "skydrome", "factory": "0x2516212168034b18a0155FfbE59f2f0063fFfBD9", "router": "0xAA111C62cDEEf205f70E6722D1E22274274ec12F" },
		]
	},
	0x109b4597:  {
		name: "Skale",
		exchanges: [
			{ "name": "sushiswap", "factory": "0x1aaF6eB4F85F8775400C1B10E6BbbD98b2FF8483", "router": "0x4cddf8D1473df386b926ec14b23bfbD566CE827a" },
		]
	},
	0x13:  {
		name: "Songbird",
		exchanges: [
			{ "name": "oracleswap", "factory": "0xDcA8EfcDe7F6Cb36904ea204bb7FCC724889b55d", "router": "0x73E93D9657E6f32203f900fe1BD81179a5bf6Ce4" },
		]
	},
	0x28:  {
		name: "Telos",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xc35DADB65012eC5796536bD9864eD8773aBc74C4", "router": "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506" },
		]
	},
	0x6c:  {
		name: "Thundercore",
		exchanges: [
			{ "name": "sushiswap", "factory": "0xB45e53277a7e0F1D35f2a77160e91e25507f1763", "router": "0x9B3336186a38E1b6c21955d112dbb0343Ee061eE" },
		]
	},
	0x82:  {
		name: "Unichain",
		exchanges: [
		]
	},
	0x1e0:  {
		name: "World Chain",
		exchanges: [
			{ "name": "uniswap", "factory": "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f", "router": "0x541aB7c31A119441eF3575F6973277DE0eF460bd" },
		]
	},
	0x1b58:  {
		name: "Zetachain",
		exchanges: [
			{ "name": "sushiswap", "factory": "0x33d91116e0370970444B0281AB117e161fEbFcdD", "router": "0x1f2FCf1d036b375b384012e61D3AA33F8C256bbE" },
		]
	},
	0x44d:  {
		name: "Polygon zkEVM",
		exchanges: [
			{ "name": "pancakeswap", "factory": "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E", "router": "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb" },
		]
	},
	0xc5cc4:  {
		name: "zKLynk",
		exchanges: [
			{ "name": "linkswap", "factory": "0x87929083ac2215cF3CE4936857D314aF6687C978", "router": "0x3D31943303aC09F2B97DF88b61c70eF00B732EA8" },
		]
	},
	0x144:  {
		name: "zkSync",
		exchanges: [
			{ "name": "pancakeswap", "factory": "0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d", "router": "0x5aEaF2883FBf30f3D62471154eDa3C0c1b05942d" },
		]
	},
	0x76adf1:  {
		name: "Zora",
		exchanges: [
			{ "name": "uniswap", "factory": "0x0F797dC7efaEA995bB916f268D919d0a1950eE3C", "router": "0xa00F34A632630EFd15223B1968358bA4845bEEC7" },
		]
	},
	0x13fb:  {
		name: "Citrea Testnet",
		exchanges: [
			{ "name": "Citrus Swap", "factory": "", "router": "" },
		]
	},
}
