import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { providers } from 'ethers';
import Web3Modal from 'web3modal';

export interface AuthState {
	provider: providers.JsonRpcProvider;
	signer: providers.JsonRpcSigner;
	address: string;
	connected: boolean;
}

const initialState: AuthState = {
	provider: null,
	signer: null,
	address: "",
	connected: false,
};

export const connectToAccount = createAsyncThunk(
	"auth/connect",
	async (web3modal: Web3Modal) => {
		const modalProvider = await web3modal.connect();

		const provider = new providers.Web3Provider(modalProvider);
		const signer = provider.getSigner();

		const address = await signer.getAddress();

		return {
			provider,
			signer,
			address,
			connected: true,
		};
	}
);

export const disconnectFromAccount = createAsyncThunk(
	"auth/disconnect",
	async (web3modal: Web3Modal) => {
		web3modal.clearCachedProvider();

		return initialState;
	}
);

export const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setAccount: (state, action: PayloadAction<AuthState>) => {
			state.address = action.payload.address;
			state.provider = action.payload.provider;
			state.signer = action.payload.signer;
			state.connected = true;
		},
		resetAccount: (state) => {
			state.address = "";
			state.provider = null;
			state.signer = null;
			state.connected = false;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(
				connectToAccount.fulfilled,
				(state, action: PayloadAction<AuthState>) => {
					state.address = action.payload.address;
					state.provider = action.payload.provider;
					state.signer = action.payload.signer;
					state.connected = action.payload.connected;
				}
			)
			.addCase(
				disconnectFromAccount.fulfilled,
				(state, action: PayloadAction<AuthState>) => {
					state.address = action.payload.address;
					state.provider = action.payload.provider;
					state.signer = action.payload.signer;
					state.connected = action.payload.connected;
				}
			);
	},
});

export const { resetAccount, setAccount } = authSlice.actions;

export default authSlice.reducer;
