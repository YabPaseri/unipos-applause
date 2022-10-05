import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, memo, useCallback } from 'react';

type TProps = Omit<StandardTextFieldProps, 'value' | 'onChange' | 'type'> & {
	value: number | undefined;
	onChange?: (value: number | undefined) => void;
};

/**
 * Intの入力欄
 */
export const IntInput = memo<TProps>(({ value, onChange, ...props }) => {
	const handler = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (!onChange) return;
			const v = e.target.value;
			if (!v) {
				onChange(void 0);
			} else {
				const n = parseInt(v);
				if (!Number.isNaN(n)) onChange(n);
			}
		},
		[onChange]
	);
	return <TextField value={value === void 0 ? '' : value} onChange={handler} type="number" {...props} />;
});
IntInput.displayName = 'IntInput';
