import { Dialog, DialogContent } from '@mui/material';
import Util from '../util';
import { memofy } from './components';
import { useCloseDialog, useOpenedDialog } from './data';
import { Dev2 } from './Dev2';

export const SenderDialog = memofy(() => {
	const is_open = useOpenedDialog();
	const close = useCloseDialog();
	return (
		<Dialog
			open={is_open}
			fullWidth
			maxWidth="md"
			onClose={close}
			TransitionProps={{
				style: { transitionDelay: '100ms' },
				onEnter: Util.hidden.bind(Util, true),
				onExited: Util.hidden.bind(Util, false),
			}}
		>
			<DialogContent>
				<Dev2 />
			</DialogContent>
		</Dialog>
	);
}, 'SenderDialog');
