import TextField, { StandardTextFieldProps } from '@mui/material/TextField';
import { ChangeEvent, memo, useCallback } from 'react';

type TProps = Omit<StandardTextFieldProps, 'value' | 'onChange'> & {
	value: string;
	onChange?: (value: string) => void;
};

/**
 * メモ化して、onChangeだけstringで得られるようにしたTextField
 */
export const MemoizedInput = memo<TProps>(({ onChange, ...props }) => {
	const handler = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			if (onChange) onChange(e.target.value);
		},
		[onChange]
	);
	return <TextField onChange={handler} {...props} />;
});
MemoizedInput.displayName = 'MemoizedInput';
