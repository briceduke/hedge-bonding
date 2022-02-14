import { NextPage } from 'next';
import { useEffect } from 'react';
import Web3Modal from 'web3modal';

import { connectToAccount, disconnectFromAccount } from '../app/features/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { BusdBnbPool } from '../components/BusdBnbPool';
import { HedgePool } from '../components/HedgePool';
import { providerOptions } from '../util/providerOptions';

let web3Modal: Web3Modal;

if (typeof window !== "undefined") {
	web3Modal = new Web3Modal({
		network: "mainnet",
		cacheProvider: true,
		providerOptions,
	});
}

const Index: NextPage = () => {
	const { connected } = useAppSelector((state) => state.auth);
	const dispatch = useAppDispatch();

	useEffect(() => {
		if (connected) return;

		if (web3Modal.cachedProvider) {
			dispatch(connectToAccount(web3Modal));
		}
	}, [dispatch, web3Modal]);

	const onConnect = async () => {
		if (connected) return;

		return dispatch(connectToAccount(web3Modal));
	};

	const onDisconnect = async () => {
		if (!connected) return;

		return dispatch(disconnectFromAccount(web3Modal));
	};

	return (
		<div>
			<div>
				{connected ? (
					<button onClick={onDisconnect}>Disconnect</button>
				) : (
					<button onClick={onConnect}>Connect</button>
				)}
			</div>
			<BusdBnbPool />
			<HedgePool />
		</div>
	);
};

export default Index;
