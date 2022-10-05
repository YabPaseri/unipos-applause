import Button from '@mui/material/Button';
import { memo } from 'react';

type TProps = {
	text: React.ReactNode;
	icon?: React.ReactNode;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	disabled?: boolean;
};

/**
 * Footer領域に表示するボタン
 */
export const FooterButton = memo<TProps>(({ text, icon, ...others }) => (
	<Button variant="outlined" startIcon={icon} {...others} disableFocusRipple>
		{text}
	</Button>
));
FooterButton.displayName = 'FooterButton';
