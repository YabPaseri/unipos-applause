import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { memo, ReactNode, useCallback, useState } from 'react';
import UniposAPI from '../../unipos';
import { Member } from '../../unipos/type';

type TProps = {
	value: Member | undefined;
	onChange?: (value: Member | undefined) => void;
	label?: ReactNode;
	title?: string;
	disabled?: boolean;
};

/**
 * Backlogユーザを検索する
 */
export const MemberSearch = memo<TProps>(({ value, onChange, label, ...props }) => {
	const [options, setOptions] = useState<Member[]>([]);

	const [input, setInput] = useState('');
	const [timer, setTimer] = useState<NodeJS.Timeout>();
	const handleInputChange = useCallback(
		(_: unknown, value: string) => {
			setInput(value);
			if (timer) clearTimeout(timer);
			if (value.length === 0) {
				setOptions([]);
				setTimer(void 0);
				return;
			}
			setTimer(
				setTimeout(() => {
					UniposAPI.getMembersByNameWithFuzzySearch(value)
						.then((res) => setOptions(res.result))
						.then(() => setTimer(void 0));
				}, 1000)
			);
		},
		[timer]
	);
	const handleValueChange = useCallback(
		(_: unknown, value: Member | null) => {
			if (onChange) onChange(value || void 0);
		},
		[onChange]
	);
	// uniposに投げるとき、unameがあると無理なので消す...
	const handleOpen = useCallback(() => {
		if (value) {
			setInput(value.display_name);
			handleInputChange(null, value.display_name);
		}
	}, [handleInputChange, value]);

	const handleBlur = useCallback(() => {
		// getMembersByNameWithFuzzySearch API を叩くと、タグが作られる。
		// 検索欄をクリックする度に追加されるのは、邪魔。勝手に消す。
		document.querySelectorAll('div > script[src="https://tag.web.onesdata.com/od.js"]').forEach((ele) => {
			ele.parentElement?.remove();
		});
		document.querySelectorAll('div > script[src="https://b90.yahoo.co.jp/conv.js"]').forEach((ele) => {
			ele.parentElement?.remove();
		});
		document.querySelectorAll('div > script[src="https://s.yimg.jp/images/listing/tool/cv/ytag.js"]').forEach((ele) => {
			ele.parentElement?.remove();
		});
	}, []);

	const filterOptions = useCallback((opt: Member[]) => opt, []);
	const isOptionEqualToValue = useCallback((a: Member, b: Member) => a.id === b.id, []);
	const getOptionLabel = useCallback((opt: Member) => `${opt.display_name} (${opt.uname})`, []);

	return (
		<Autocomplete
			fullWidth
			blurOnSelect
			size="small"
			options={options}
			renderInput={({ InputLabelProps, ...params }) => (
				<TextField {...params} label={label} InputLabelProps={{ ...InputLabelProps, shrink: true }} />
			)}
			loading={!!timer}
			value={value || null}
			inputValue={input}
			onInputChange={handleInputChange}
			onChange={handleValueChange}
			onFocus={handleOpen}
			onBlur={handleBlur}
			filterOptions={filterOptions}
			isOptionEqualToValue={isOptionEqualToValue}
			getOptionLabel={getOptionLabel}
			{...props}
		/>
	);
});
MemberSearch.displayName = 'MemberSearch';
