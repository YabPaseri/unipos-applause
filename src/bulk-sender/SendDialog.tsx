import { Dialog, DialogContent, Zoom } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import Util from '../util';
import { memofy } from './components';

type TProps = {
	setOpener: (opener: () => void) => void;
};

export const SendDialog = memofy<TProps>(({ setOpener }) => {
	const [open, setOpen] = useState(false);
	const doOpen = useCallback(() => setOpen(true), []);
	const doClose = useCallback(() => setOpen(false), []);
	useEffect(() => setOpener(doOpen), [doOpen, setOpener]);

	return (
		<Dialog
			open={open}
			fullWidth
			maxWidth="md"
			onClose={doClose}
			TransitionComponent={Zoom}
			TransitionProps={{
				style: { transitionDelay: open ? '100ms' : '0' },
				// 開く前、閉じた後 での切り替え
				onEnter: () => Util.hidden(),
				onExit: () => Util.hidden(false),
			}}
		>
			<DialogContent>HELLO WORLD</DialogContent>
		</Dialog>
	);
}, 'SendDialog');
