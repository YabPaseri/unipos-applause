import { memo, useEffect } from 'react';
import UniposAPI from '../../unipos';
import { ConsumerContent } from './consumer-content';
import { useConsumerDispatch } from './consumer-context';
import { ConsumerDialog } from './consumer-dialog';
import { ConsumerWindow } from './consumer-window';
import { ConsumerMode } from './type';

type TProps = {
	open: boolean;
	doClose: () => void;
	mode: ConsumerMode;
	changeMode: () => void;
};

export const ConsumerView = memo<TProps>(({ open, doClose, mode, changeMode }) => {
	const dispatch = useConsumerDispatch();
	useEffect(() => {
		dispatch({ type: 'RESET' });
		if (open) UniposAPI.getProfile().then((res) => dispatch({ type: 'SET_ME', me: res.result.member }));
	}, [open, dispatch]);

	return mode === 'dialog' ? (
		<ConsumerDialog open={open} onClose={doClose} changeMode={changeMode}>
			<ConsumerContent close={doClose} />
		</ConsumerDialog>
	) : (
		<ConsumerWindow open={open} onClose={doClose} changeMode={changeMode}>
			<ConsumerContent close={doClose} />
		</ConsumerWindow>
	);
});
ConsumerView.displayName = 'ConsumerView';
