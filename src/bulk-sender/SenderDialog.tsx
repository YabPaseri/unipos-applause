import { Dialog, DialogContent, Grid } from '@mui/material';
import Util from '../util';
import { memofy } from './components';
import { Control } from './control';
import { useCloseDialog, useOpenedDialog } from './data';

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
				<Grid container>
					<Grid item xs={6}>
						<Control />
					</Grid>
					<Grid item xs={6}></Grid>
				</Grid>
			</DialogContent>
		</Dialog>
	);
}, 'SenderDialog');
