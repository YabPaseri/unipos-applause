import { Button } from '@mui/material';
import { MouseEventHandler, ReactNode, memo } from 'react';

type TProps = {
	text: ReactNode;
	icon?: ReactNode;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
};

/**
 * 画面下部のフッターに表示するコンポーネント
 */
export const FooterItem = memo<TProps>(({ text, icon, ...props }) => (
	<Button variant="outlined" startIcon={icon} {...props} disableFocusRipple>
		{text}
	</Button>
));
FooterItem.displayName = 'FooterItem';
