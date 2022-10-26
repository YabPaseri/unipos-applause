import { GlobalStyles } from '@mui/material';

export const GlobalStyle = () => {
	return (
		<GlobalStyles
			styles={{
				'.au-hidden': {
					display: 'none !important',
				},
				'.timeline___timeline--timeline_unreadJumpButtonWrap': {
					zIndex: 101,
				},
			}}
		/>
	);
};
