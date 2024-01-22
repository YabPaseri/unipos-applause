import { GlobalStyles } from '@mui/material';
import { FunctionComponent } from 'react';

/**
 * Unipos側の要素にあてる必要のあるスタイル
 * @returns
 */
export const GlobalStyle: FunctionComponent = () => (
	<GlobalStyles
		styles={{
			'.timeline___timeline--timeline_unreadJumpButtonWrap': {
				zIndex: 101,
			},
			'.force-hidden': {
				display: 'none !important',
			},
		}}
	/>
);
