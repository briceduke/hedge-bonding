import WalletConnectProvider from '@walletconnect/web3-provider';

export const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			rpc: {
				56: "https://bsc-dataseed.binance.org/",
			},
			network: "binance",
		},
	},
};
