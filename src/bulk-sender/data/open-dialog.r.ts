import { useCallback } from 'react';
import { atom, useRecoilValue, useSetRecoilState } from 'recoil';
import { RECOIL_ATOM_KEY } from './recoil-keys';

const state = atom<boolean>({
	key: RECOIL_ATOM_KEY.OPEN_DIALOG,
	default: false,
});

/**
 * ダイアログの開閉状態
 */
export const useOpenedDialog = () => useRecoilValue(state);

/**
 * ダイアログを開く
 */
export const useOpenDialog = () => {
	const setState = useSetRecoilState(state);
	return useCallback(() => setState(true), [setState]);
};

/**
 * ダイアログを閉じる
 */
export const useCloseDialog = () => {
	const setState = useSetRecoilState(state);
	return useCallback(() => setState(false), [setState]);
};
