import EditNotificationsIcon from '@mui/icons-material/EditNotifications';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { memo, useCallback, useState } from 'react';
import { FooterButton } from '../components';
import { AlarmDialog } from './alarm-dialog';

export const Alarm = memo(() => {
	const [isOpen, setOpen] = useState(false);
	const open = useCallback(() => {
		setOpen(true);
	}, []);
	const close = useCallback(() => {
		setOpen(false);
	}, []);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<FooterButton text="アラーム設定" icon={<EditNotificationsIcon />} onClick={open} />
			<AlarmDialog open={isOpen} onClose={close} />
		</LocalizationProvider>
	);
});
Alarm.displayName = 'Alarm';
