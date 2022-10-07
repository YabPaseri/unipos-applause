import { Autocomplete, TextField } from '@mui/material';
import React, { useCallback, useRef, useState } from 'react';
import UniposAPI from '../../unipos';
import { TMember } from '../../unipos/type';
import { memofy } from './memofy';

type TProps = {
	value: TMember | null;
	setValue: (value: TMember | null) => void;
	label?: React.ReactNode;
	title?: string;
	disabled?: boolean;
};

export const MemberSearch = memofy<TProps>(({ value, setValue, label, title, disabled }) => {
	const [candidates, setCandidates] = useState<TMember[]>([]);
	const [input, setInput] = useState('');
	const [hasFocus, setHasFocus] = useState(false);
	const [loading, setLoading] = useState(false);

	const timer = useRef<NodeJS.Timeout | null>(null);
	const handleValueChange = useCallback((_: unknown, val: TMember | null) => setValue(val), [setValue]);
	const handleInputChange = useCallback((_: unknown, val: string) => {
		setInput(val);
		if (timer.current) {
			clearTimeout(timer.current);
			timer.current = null;
		}
		if (val.length === 0) {
			setCandidates([]);
			return;
		}
		timer.current = setTimeout(() => {
			Promise.resolve()
				.then(() => setLoading(true))
				.then(() => UniposAPI.getMembersByNameWithFuzzySearch(val))
				.then((res) => setCandidates(res.result))
				.then(() => setLoading(false));
		}, 1000);
	}, []);

	const handleFocus = useCallback(() => setHasFocus(true), []);
	const handleBlur = useCallback(() => setHasFocus(false), []);
	const filter = useCallback((opt: TMember[]) => opt, []); //do not anything
	const equals = useCallback((opt: TMember, val: TMember) => opt.id === val.id, []);
	const labels = useCallback((opt: TMember) => `${opt.display_name}`, []);

	return (
		<Autocomplete
			blurOnSelect
			sx={{ flex: 1 }}
			value={value}
			onChange={handleValueChange}
			onFocus={handleFocus}
			onBlur={handleBlur}
			inputValue={input}
			onInputChange={handleInputChange}
			open={hasFocus && input.length !== 0}
			filterOptions={filter}
			isOptionEqualToValue={equals}
			getOptionLabel={labels}
			options={candidates}
			loading={loading}
			size="small"
			renderInput={(params) => (
				<TextField {...params} label={label} InputLabelProps={{ ...params.InputLabelProps, shrink: true }} />
			)}
			title={title}
			disabled={disabled}
		/>
	);
}, 'MemberSearch');
