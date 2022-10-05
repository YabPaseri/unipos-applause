import SyncAltIcon from '@mui/icons-material/SyncAlt';
import Stack from '@mui/material/Stack';
import { ComponentProps, memo, ReactNode, useMemo } from 'react';
import { IntInput } from './int-input';

type IntInputProps = ComponentProps<typeof IntInput>;
type TProps = {
	//v1
	v1: number | undefined;
	onChangeV1?: (value: number | undefined) => void;
	onBlurV1?: IntInputProps['onBlur'];
	labelV1?: ReactNode;
	titleV1?: string;
	inputPropsV1?: IntInputProps['inputProps'];
	InputPropsV1?: IntInputProps['InputProps'];
	// v2
	v2: number | undefined;
	onChangeV2?: (value: number | undefined) => void;
	onBlurV2?: IntInputProps['onBlur'];
	labelV2?: ReactNode;
	titleV2?: string;
	inputPropsV2?: IntInputProps['inputProps'];
	InputPropsV2?: IntInputProps['InputProps'];
};

/**
 * 左右で同じ意味を表す2種類の数値を表示する。\
 * 1d ⇔ 24h みたいな
 */
export const SyncIntInput = memo<TProps>(({ ...props }) => {
	const commons = useMemo<Partial<IntInputProps>>(() => {
		return {
			fullWidth: true,
			required: true,
			size: 'small',
			InputLabelProps: { shrink: true },
		};
	}, []);
	return (
		<Stack spacing="3px" direction="row" alignItems="center">
			<IntInput
				value={props.v1}
				onChange={props.onChangeV1}
				onBlur={props.onBlurV1}
				label={props.labelV1}
				title={props.titleV1}
				inputProps={props.inputPropsV1}
				InputProps={props.InputPropsV1}
				{...commons}
			/>
			<SyncAltIcon />
			<IntInput
				value={props.v2}
				onChange={props.onChangeV2}
				onBlur={props.onBlurV2}
				label={props.labelV2}
				title={props.titleV2}
				inputProps={props.inputPropsV2}
				InputProps={props.InputPropsV2}
				{...commons}
			/>
		</Stack>
	);
});
SyncIntInput.displayName = 'SyncIntInput';
