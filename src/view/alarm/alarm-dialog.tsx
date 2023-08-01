import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup';
import Switch from '@mui/material/Switch';
import { SwitchBaseProps } from '@mui/material/internal/SwitchBase';
import { styled } from '@mui/material/styles';
import { TimePicker, TimeValidationError } from '@mui/x-date-pickers';
import { format as formatDateFns, parse as parseDateFns } from 'date-fns';
import { memo, useCallback, useEffect, useState } from 'react';
import { Preferences } from '../../preferences';
import Util from '../../util';
import { Logger } from '../../logger';

type TProps = {
	open: boolean;
	onClose: () => void;
};

export const AlarmDialog = memo<TProps>(({ open, onClose }) => {
	const [active, setActive] = useState(Preferences.alarm_active);
	const [wday, setWDay] = useState(Preferences.alarm_wday);
	const [time, setTime] = useState(Preferences.alarm_time);
	const [hasError, setHasError] = useState(false);
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		// 2回目以降の初期化
		setActive(Preferences.alarm_active);
		setWDay(Preferences.alarm_wday);
		setTime(Preferences.alarm_time);
		setHasError(false);
		setSaving(false);
	}, [open]);

	const save = useCallback(async () => {
		setSaving(true);
		// 値の保存
		Preferences.alarm_active = active;
		Preferences.alarm_wday = wday;
		Preferences.alarm_time = time;
		await Preferences.save();

		await new Promise((ok) => {
			// TODO: アラームの更新
			//  --> content-scriptの世界からは出来ないので、Preferenceをbackground側で参照してもらって処理
			setTimeout(ok, 500);
		});
		setSaving(false);
		Logger.info('success!!', `active=${Preferences.alarm_active},`, `wday=${Preferences.alarm_wday},`, `time=${Preferences.alarm_time}`);
		onClose();
	}, [active, onClose, time, wday]);

	const handleActiveChange = useCallback<NonNullable<SwitchBaseProps['onChange']>>((_, checked) => {
		setActive(checked);
	}, []);
	const handleWDayChange = useCallback<NonNullable<RadioGroupProps['onChange']>>((_, value) => {
		setWDay(Number(value));
	}, []);
	const handleTimeChange = useCallback((value: Date | null) => {
		if (value == null || Util.isInvalidDate(value)) return;
		// 欲しいのはHHmmだけ
		setTime(formatDateFns(value, 'HHmm'));
	}, []);
	const handleTimeError = useCallback((error: TimeValidationError) => {
		setHasError(error != null);
	}, []);

	const uncontrol = !active || saving;

	return (
		<Dialog open={open} fullWidth maxWidth="sm">
			<DialogContent>
				<FormControlLabel //
					label="アラームを有効にする"
					checked={active}
					control={<Switch onChange={handleActiveChange} />}
					disabled={saving}
				/>
				<_Paper_ variant="outlined">
					<RadioGroup row value={wday} onChange={handleWDayChange}>
						<FormControlLabel value={0} control={<Radio />} label="日" disabled={uncontrol} />
						<FormControlLabel value={1} control={<Radio />} label="月" disabled={uncontrol} />
						<FormControlLabel value={2} control={<Radio />} label="火" disabled={uncontrol} />
						<FormControlLabel value={3} control={<Radio />} label="水" disabled={uncontrol} />
						<FormControlLabel value={4} control={<Radio />} label="木" disabled={uncontrol} />
						<FormControlLabel value={5} control={<Radio />} label="金" disabled={uncontrol} />
						<FormControlLabel value={6} control={<Radio />} label="土" disabled={uncontrol} />
					</RadioGroup>
					<TimePicker //
						disabled={uncontrol}
						// label="通知する時刻"
						value={parseDateFns(time, 'HHmm', new Date())}
						onChange={handleTimeChange}
						onError={handleTimeError}
						views={['hours', 'minutes']}
						ampm={false}
						slotProps={{
							field: Util.any({
								// fullWidth: true,
								variant: 'standard',
							}),
						}}
					/>
				</_Paper_>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={saving}>
					キャンセル
				</Button>
				<Button onClick={save} disabled={saving || hasError}>
					{saving ? <CircularProgress size={24} /> : '保存'}
				</Button>
			</DialogActions>
		</Dialog>
	);
});
AlarmDialog.displayName = 'AlarmDialog';

const _Paper_ = styled(Paper)({
	marginTop: '10px',
	padding: '15px',
	'& > :not(style) + :not(style)': {
		marginTop: '10px',
	},
});
