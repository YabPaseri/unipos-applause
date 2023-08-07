import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { Fragment, memo, MouseEventHandler, useCallback, useEffect, useRef } from 'react';
import { FooterButton } from '../components';
import { ConsumerContextProvider, useConsumerDispatch, useConsumerState } from './consumer-context';
import { ConsumerView } from './consumer-view';

export const Consumer = memo(() => {
	return (
		<ConsumerContextProvider>
			<ConsumerImpl />
		</ConsumerContextProvider>
	);
});
Consumer.displayName = 'Consumer';

const ConsumerImpl = memo(() => {
	const { open, mode } = useConsumerState();
	const dispatch = useConsumerDispatch();

	const clickTimer = useRef<NodeJS.Timer | null>(null);
	const handleClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
		(e) => {
			if (!open) {
				dispatch({ type: 'CHANGE_OPEN' });
			} else {
				if (e.detail === 1) {
					if (clickTimer.current != null) clearTimeout(clickTimer.current);
					clickTimer.current = setTimeout(() => {
						dispatch({ type: 'CHANGE_OPEN' });
						clickTimer.current = null;
					}, 200);
				} else if (e.detail === 2) {
					if (clickTimer.current != null) {
						clearTimeout(clickTimer.current);
						clickTimer.current = null;
					}
					dispatch({ type: 'SET_POS', pos: void 0 });
				}
			}
		},
		[dispatch, open]
	);
	const close = useCallback(() => dispatch({ type: 'CHANGE_OPEN', force: false }), [dispatch]);
	const changeMode = useCallback(() => dispatch({ type: 'CHANGE_MODE' }), [dispatch]);

	useEffect(
		// unmount時に止める
		() => () => {
			if (clickTimer.current != null) {
				clearTimeout(clickTimer.current);
				clickTimer.current = null;
			}
		},
		[]
	);

	return (
		<Fragment>
			<FooterButton text="一括拍手" icon={<SignLanguageIcon />} onClick={handleClick} />
			<ConsumerView open={open} doClose={close} mode={mode} changeMode={changeMode} />
		</Fragment>
	);
});
ConsumerImpl.displayName = 'ConsumerImpl';
