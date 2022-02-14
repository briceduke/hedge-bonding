import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { providers } from 'ethers';

import { BnbBusdBond, BnbBusdBond__factory, HedgeBond, HedgeBond__factory } from '../../contracts';

export interface BondState {
	bnbBusdAddress: string;
	hedgeAddress: string;
	bnbBusdInstance: BnbBusdBond;
	hedgeInstance: HedgeBond;
	bnbBusdConnected: boolean;
	hedgeConnected: boolean;
}

const initialState: BondState = {
	bnbBusdAddress: "",
	hedgeAddress: "",
	bnbBusdInstance: null,
	hedgeInstance: null,
	bnbBusdConnected: false,
	hedgeConnected: false,
};

export const connectBonds = createAsyncThunk(
	"bond/initialize",
	(signer: providers.JsonRpcSigner) => {
		const { hedgeAddress, bnbBusdAddress } = initialState;

		const bnbBusdInstance = BnbBusdBond__factory.connect(
			bnbBusdAddress,
			signer
		);
		const hedgeInstance = HedgeBond__factory.connect(hedgeAddress, signer);

		return {
			bnbBusdAddress,
			hedgeAddress,
			bnbBusdInstance,
			hedgeInstance,
			bnbBusdConnected: true,
			hedgeConnected: true,
		};
	}
);

export const bondSlice = createSlice({
	name: "bond",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(
			connectBonds.fulfilled,
			(state, action: PayloadAction<BondState>) => {
				(state.bnbBusdAddress = action.payload.bnbBusdAddress),
					(state.bnbBusdConnected = action.payload.bnbBusdConnected),
					(state.bnbBusdInstance = action.payload.bnbBusdInstance as any);

				(state.hedgeAddress = action.payload.hedgeAddress),
					(state.hedgeConnected = action.payload.hedgeConnected),
					(state.hedgeInstance = action.payload.hedgeInstance as any);
			}
		);
	},
});

export default bondSlice.reducer;
