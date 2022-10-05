import CloseIcon from '@mui/icons-material/Close';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import { memo, ReactNode, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { DraggableData, Rnd, RndResizeCallback } from 'react-rnd';
import { useConsumerDispatch, useConsumerState } from './consumer-context';

type TProps = {
	open: boolean;
	onClose: () => void;
	changeMode: () => void;
	children: ReactNode;
};

const DRAG_PARENT = 'au-rnd-root';
const DRAG_HANDLE = 'au-rnd-handle';
export const ConsumerWindow = memo<TProps>(({ open, onClose, changeMode, children }) => {
	const { pos, size } = useConsumerState();
	const dispatch = useConsumerDispatch();

	const handleDragged = useCallback((_: unknown, data: DraggableData) => dispatch({ type: 'SET_POS', pos: { x: data.x, y: data.y } }), [dispatch]);
	const handleReized = useCallback<RndResizeCallback>(
		(_ev, _dir, ref, _del, pos) => {
			dispatch({ type: 'SET_SIZE', size: { width: ref.clientWidth, height: ref.clientHeight } });
			dispatch({ type: 'SET_POS', pos });
		},
		[dispatch]
	);

	// 親子関係を無視した位置に ウィンドウを表示する。
	return !open
		? null
		: createPortal(
				<_Root_ id={DRAG_PARENT}>
					<Rnd
						bounds={`#${DRAG_PARENT}`}
						position={pos}
						size={size}
						default={{
							x: document.body.clientWidth - 514,
							y: 0,
							width: '500',
							height: 'auto',
						}}
						minWidth={300}
						dragHandleClassName={DRAG_HANDLE}
						enableResizing={{ left: true, right: true }}
						onDragStop={handleDragged}
						onResizeStop={handleReized}
						style={{ zIndex: 298, pointerEvents: 'all' }}
					>
						<Paper square>
							<Box>
								<_Header_ className={DRAG_HANDLE}>
									<DragHandleIcon />
								</_Header_>
								<_Buttons_ direction="row">
									<_IconButton_ title="ダイアログ化する" onClick={changeMode}>
										<FullscreenIcon />
									</_IconButton_>
									<_IconButton_ title="閉じる" onClick={onClose}>
										<CloseIcon />
									</_IconButton_>
								</_Buttons_>
							</Box>
							<Box padding="20px 10px 10px">{children}</Box>
						</Paper>
					</Rnd>
				</_Root_>,
				document.body
		  );
});
ConsumerWindow.displayName = 'MovableWindow';

const _Root_ = styled(Box)({
	position: 'fixed',
	inset: '60px 7px 40px', // 上はUniposの、下はFooterの幅(+遊び)
	zIndex: 500,
	pointerEvents: 'none',
});
const _Header_ = styled(Box)(({ theme }) => ({
	backgroundColor: theme.palette.divider,
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	cursor: 'move',
}));
const _Buttons_ = styled(Stack)({
	position: 'absolute',
	top: 0,
	right: 5,
});
const _IconButton_ = styled(IconButton)({
	width: '24px',
	height: '24px',
});
