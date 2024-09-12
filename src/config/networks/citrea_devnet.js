import { defineChain } from "viem";

export const citreaDevnet = /*#__PURE__*/ defineChain({
  id: 62298,
	network: 'citrea_devnet',
  name: 'Citrea Devnet',
  nativeCurrency: {
    name: 'Citrea Devnet Token',
    symbol: 'BTC',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.devnet.citrea.xyz'],
    },
    public: {
      http: ['https://rpc.devnet.citrea.xyz'],
    },
  },
  blockExplorers: {
    default: { 
			name: 'Citrea Explorer', 
			url: 'https://explorer.devnet.citrea.xyz/' 
		},
  },
  testnet: true,
})
