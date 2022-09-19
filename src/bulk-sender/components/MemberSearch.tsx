import { Autocomplete, Checkbox, FormControlLabel, Stack, TextField } from '@mui/material';
import { useCallback, useState } from 'react';
import UniposAPI from '../../unipos';
import { TMember } from '../../unipos/type';
import { memofy } from './memofy';

type TProps = {
	value: TMember | null;
	me: boolean;
	setValue: (value: TMember | null) => void;
	setMe: (value: boolean) => void;
	label?: React.ReactNode;
};

export const MemberSearch = memofy<TProps>(({ value, setValue, me, setMe, label }) => {
	const [candidates, setCandidates] = useState<TMember[]>([]);
	const [focus, setFocus] = useState(false);
	const [input, setInput] = useState('');
	const [loading, setLoading] = useState(false);

	const handleValueChange = useCallback(
		(_: unknown, val: TMember | null) => {
			setValue(val);
		},
		[setValue]
	);
	const doFocus = useCallback(() => setFocus(true), []);
	const doBlur = useCallback(() => setFocus(false), []);
	const noFilter = useCallback((op: TMember[]) => op, []);
	const eq = useCallback((op: TMember, val: TMember) => op.id === val.id, []);
	const labelfy = useCallback((op: TMember) => `${op.display_name} (@${op.uname})`, []);
	const handleInputChange = useCallback((_: unknown, val: string) => {
		setInput(val);
		if (val.length === 0) {
			setCandidates([]);
			return;
		}
		Promise.resolve()
			.then(() => setLoading(true))
			.then(() => UniposAPI.getMembersByNameWithFuzzySearch(val))
			.then((res) => setCandidates(res.result))
			.then(() => setLoading(false));
	}, []);
	const handleMeChange = useCallback(
		(_: unknown, checked: boolean) => {
			setMe(checked);
			if (checked) {
				setFocus(false);
			}
		},
		[setMe]
	);

	return (
		<Stack direction="row" spacing="5px">
			<Autocomplete
				sx={{ flex: 1 }}
				disabled={me}
				value={value}
				onChange={handleValueChange}
				inputValue={input}
				onInputChange={handleInputChange}
				open={focus && input.length !== 0}
				onOpen={doFocus}
				onClose={doBlur}
				filterOptions={noFilter}
				isOptionEqualToValue={eq}
				getOptionLabel={labelfy}
				options={candidates}
				loading={loading}
				size="small"
				renderInput={(params) => (
					<TextField
						{...params}
						margin="normal"
						label={label}
						InputLabelProps={{ ...params.InputLabelProps, shrink: true }}
					/>
				)}
			/>
			<FormControlLabel
				sx={{ paddingTop: '8px' }}
				value={me}
				label="自分を設定"
				control={<Checkbox size="small" />}
				onChange={handleMeChange}
			/>
		</Stack>
	);
}, 'MemberSearch');
