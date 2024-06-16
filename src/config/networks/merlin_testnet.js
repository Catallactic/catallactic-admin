import { defineChain } from "viem";

export const merlinTestnet = /*#__PURE__*/ defineChain({
  id: 686868,
	network: 'merlin_testnet',
  name: 'Merlin Testnet',
  nativeCurrency: {
    name: 'Merlin Testnet Token',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.merlinchain.io'],
    },
    public: {
      http: ['https://testnet-rpc.merlinchain.io'],
    },
  },
  blockExplorers: {
    default: { 
			name: 'Merlin Explorer', 
			url: 'https://testnet-scan.merlinchain.io' 
		},
  },
  testnet: true,
})
