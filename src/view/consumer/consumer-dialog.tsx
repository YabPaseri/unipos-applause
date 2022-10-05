import CloseIcon from '@mui/icons-material/Close';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { memo, ReactNode } from 'react';

type TProps = {
	open: boolean;
	onClose: () => void;
	changeMode: () => void;
	children: ReactNode;
};

export const ConsumerDialog = memo<TProps>(({ open, onClose, changeMode, children }) => {
	return (
		<Dialog open={open} fullWidth maxWidth="md" onClose={onClose}>
			<_Header_>
				<_IconButton_ title="ウィンドウ化する" onClick={changeMode}>
					<FullscreenExitIcon />
				</_IconButton_>
				<_IconButton_ title="閉じる" onClick={onClose}>
					<CloseIcon />
				</_IconButton_>
			</_Header_>
			<DialogContent>{children}</DialogContent>
		</Dialog>
	);
});
ConsumerDialog.displayName = 'ConsumerDialog';

const _Header_ = styled(Box)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'row',
	justifyContent: 'flex-end',
	alignItems: 'center',
	padding: '0 5px',
	backgroundColor: theme.palette.divider,
}));
const _IconButton_ = styled(IconButton)({
	width: '24px',
	height: '24px',
});
