import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { connectBonds } from '../../app/features/bondSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

export const BusdBnbPool = () => {
	const { signer, address } = useAppSelector((state) => state.auth);
	const { bnbBusdConnected, bnbBusdInstance } = useAppSelector(
		(state) => state.bond
	);
	const dispatch = useAppDispatch();

	const [currentPhase, setCurrentPhase] = useState(0);
	const [phaseDiscounts, setPhaseDiscounts] = useState(0);
	const [available, setAvailable] = useState(0);

	const [totalBonded, setTotalBonded] = useState(0);

	const [newOwed, setNewOwed] = useState(0);

	useEffect(() => {
		if (!bnbBusdConnected) {
			dispatch(connectBonds(signer));
			return;
		}

		const getPoolInformation = async () => {
			const currPhase = await bnbBusdInstance.getCurrentPhase();
			setCurrentPhase(currPhase.toNumber());

			const phaseDisc: ethers.BigNumber = await bnbBusdInstance.phase_discounts[
				currentPhase
			];
			setPhaseDiscounts(phaseDisc.toNumber());

			const avail = await bnbBusdInstance.getAvailableHedgeToBond(currentPhase);
			setAvailable(ethers.utils.parseEther(avail.toString()).toNumber());

			const total = await bnbBusdInstance.getTotalBonded();
			setTotalBonded(ethers.utils.parseEther(total.toString()).toNumber());

			const owed = await bnbBusdInstance.t2k_owed(address);
			setNewOwed(ethers.utils.parseEther(owed.toString()).toNumber());
		};

		// return getPoolInformation();
	}, [bnbBusdConnected]);

	return (
		<div>
			<h1>BNB/BUSD Pool</h1>

			<span>
				<b>Current Phase: </b>Phase {currentPhase} ({phaseDiscounts}% discount)
			</span>
			<br />
			<span>
				<b>Available to Bond: </b>
				{available} HEDGE
			</span>
			<br />
			<span>
				<b>Total Bonded: </b>
				{totalBonded} HEDGE
			</span>
			<br />
			<span>
				<b>New Token Owed: </b>
				{newOwed} TOKEN
			</span>

			<div>
				<h2>Bond</h2>
			</div>

			<div>
				<h2>Claim</h2>
				<button>Claim here</button>
			</div>
		</div>
	);
};
