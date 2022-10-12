import { createContext, Dispatch, ReactNode, useContext, useReducer } from 'react';
import { Position, Props as RndProps } from 'react-rnd';
import UniposAPI from '../../unipos';
import { Me, Member } from '../../unipos/type';

type Size = RndProps['size'];

// state用context
const ConsumerContext = createContext<ConsumerState | undefined>(void 0);
export type ConsumerState = {
	me: Me | undefined;
	t_point: number | undefined;
	t_clap: number | undefined;
	e_point: number | undefined;
	e_clap: number | undefined;
	offset: string;
	breaks: string;
	already: number | undefined;
	from: Member | undefined;
	to: Member | undefined;
	// ウィンドウ用
	pos: Position | undefined;
	size: Size | undefined;
};
const init = (): ConsumerState => ({
	me: void 0,
	t_point: 0,
	t_clap: 0,
	e_point: 0,
	e_clap: 0,
	offset: '',
	breaks: '',
	already: UniposAPI.MAX_PRAISE_COUNT - 1,
	from: void 0,
	to: void 0,
	pos: void 0,
	size: void 0,
});

// dispatch用context
const ConsumerDispatchContext = createContext<ConsumerDispatch | undefined>(void 0);
type ConsumerDispatch = Dispatch<Action>;
type Action =
	| { type: 'RESET' }
	| { type: 'SET_ME'; me: Me | undefined } //
	| { type: 'SET_TOTAL_POINT'; point: number | undefined }
	| { type: 'SET_TOTAL_CLAP'; clap: number | undefined }
	| { type: 'ADJUST_TOTALS' }
	| { type: 'SET_EACH_POINT'; point: number | undefined }
	| { type: 'SET_EACH_CLAP'; clap: number | undefined }
	| { type: 'ADJUST_EACHS' }
	| { type: 'SET_OFFSET'; offset: string }
	| { type: 'SET_BREAKS'; breaks: string }
	| { type: 'SET_ALREADY'; already: number | undefined }
	| { type: 'ADJUST_ALREADY' }
	| { type: 'SET_FROM'; from: Member | undefined }
	| { type: 'SET_TO'; to: Member | undefined }
	| { type: 'SET_POS'; pos: Position | undefined }
	| { type: 'SET_SIZE'; size: Size | undefined };

// reducer
const consumerReducer = (state: ConsumerState, action: Action): ConsumerState => {
	switch (action.type) {
		case 'RESET': {
			// ConsumerMode.windowのサイズは忘れない
			return { ...init(), pos: state.pos, size: state.size };
		}
		case 'SET_ME': {
			return { ...state, me: action.me };
		}
		case 'SET_TOTAL_POINT': {
			const t_point = action.point;
			const next: ConsumerState = { ...state, t_point };
			if (t_point !== void 0 && t_point >= 0) {
				next.t_clap = Math.floor(t_point / 2);
			}
			return next;
		}
		case 'SET_TOTAL_CLAP': {
			const t_clap = action.clap;
			const next: ConsumerState = { ...state, t_clap };
			if (t_clap !== void 0 && t_clap >= 0) {
				next.t_point = t_clap * 2;
			}
			return next;
		}
		case 'ADJUST_TOTALS': {
			const next: ConsumerState = { ...state };
			if ((next.t_point === void 0 || next.t_point < 0) && next.t_clap !== void 0) {
				next.t_point = next.t_clap * 2;
			}
			if ((next.t_clap === void 0 || next.t_clap < 0) && next.t_point !== void 0) {
				next.t_clap = Math.floor(next.t_point / 2);
			}
			return next;
		}
		case 'SET_EACH_POINT': {
			const e_point = action.point;
			const next: ConsumerState = { ...state, e_point };
			if (e_point !== void 0 && e_point >= 0) {
				next.e_clap = Math.floor(e_point / 2);
			}
			return next;
		}
		case 'SET_EACH_CLAP': {
			const e_clap = action.clap;
			const next: ConsumerState = { ...state, e_clap };
			if (e_clap !== void 0 && e_clap >= 0) {
				next.e_point = e_clap * 2;
			}
			return next;
		}
		case 'ADJUST_EACHS': {
			const next: ConsumerState = { ...state };
			if ((next.e_point === void 0 || next.e_point < 0) && next.e_clap !== void 0) {
				next.e_point = next.e_clap * 2;
			}
			if ((next.e_clap === void 0 || next.e_clap < 0) && next.e_point !== void 0) {
				next.e_clap = Math.floor(next.e_point / 2);
			}
			return next;
		}
		case 'SET_OFFSET': {
			return { ...state, offset: action.offset };
		}
		case 'SET_BREAKS': {
			return { ...state, breaks: action.breaks };
		}
		case 'SET_ALREADY': {
			return { ...state, already: action.already };
		}
		case 'ADJUST_ALREADY': {
			const MAX = UniposAPI.MAX_PRAISE_COUNT - 1;
			if (state.already === void 0 || state.already < 0) {
				return { ...state, already: 0 };
			} else if (state.already > MAX) {
				return { ...state, already: MAX };
			} else {
				return state;
			}
		}
		case 'SET_FROM': {
			return { ...state, from: action.from };
		}
		case 'SET_TO': {
			return { ...state, to: action.to };
		}
		case 'SET_POS': {
			return { ...state, pos: action.pos };
		}
		case 'SET_SIZE': {
			return { ...state, size: action.size };
		}
	}
};

export const ConsumerContextProvider = ({ children }: { children: ReactNode }) => {
	const [state, dispatch] = useReducer(consumerReducer, init());
	return (
		<ConsumerDispatchContext.Provider value={dispatch}>
			<ConsumerContext.Provider value={state}>
				{/** useConsumerState や useConsumerDispatch を使えるようにする */}
				{children}
			</ConsumerContext.Provider>
		</ConsumerDispatchContext.Provider>
	);
};

export const useConsumerState = () => {
	const state = useContext(ConsumerContext);
	if (!state) throw new Error('ConsumerContext not found');
	return state;
};
export const useConsumerDispatch = () => {
	const dispatch = useContext(ConsumerDispatchContext);
	if (!dispatch) throw new Error('ConsumerDispatchContext not found');
	return dispatch;
};
