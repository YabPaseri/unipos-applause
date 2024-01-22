import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import { Dialog } from '@mui/material';
import { FC, Fragment, useCallback, useState } from 'react';
import { FooterItem } from './components';

export const Alarm: FC = () => {
	const [isOpen, setOpen] = useState(false);
	const open = useCallback(() => setOpen(true), []);
	const close = useCallback(() => setOpen(false), []);

	return (
		<Fragment>
			<FooterItem text="アラーム設定" icon={<EditNotificationsIcon />} onClick={open} />
			<Dialog open={isOpen} onClose={close}></Dialog>
		</Fragment>
	);
};
