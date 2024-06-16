/** 
 * @type {import('next').NextConfig} 
 */
const nextConfig = {
	reactStrictMode: true,
	output: 'export',
	//swcMinify: false,			// https://github.com/vercel/next.js/discussions/39425
	/*env: {
		METAMASK_CHAINS: [
			{ id: "0x1", name: "ETH MainNet", ico_address: "" },
			{ id: "0x7A69", name: "HardHat TestNet", ico_address: "0x5FbDB2315678afecb367f032d93F642f64180aa3" },
			{ id: "0xAA36A7", name: "Sepolia TestNet", ico_address: "0xFf8FA9381caf61cB3368a6ec0b3F5C788028D0Cd" },
			{ id: "0x5", name: "Goerli TestNet", ico_address: "" },
			{ id: "0x13881", name: "Mumbai TestNet", ico_address: "0xaFd14013A344907909D034C215156a1909ABDdcc" },
			{ id: "0x89", name: "Polygon", ico_address: "0x9124E3F56F5e6a464f05C1BB04390d871b15183f" },
		]
  },*/
}

module.exports = nextConfig
