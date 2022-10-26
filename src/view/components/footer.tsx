import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { memo } from 'react';

type TProps = {
	children?: React.ReactNode;
};

/**
 * 画面下部に表示するフッター。\
 * この拡張機能が表示するコンポーネントの親的存在。
 */
export const Footer = memo<TProps>(({ children }) => {
	return (
		<_Box_>
			<_Stack_ direction="row" justifyContent="flex-end" spacing="5px">
				{children}
			</_Stack_>
		</_Box_>
	);
});
Footer.displayName = 'Footer';

const _Box_ = styled(Box)({
	position: 'fixed',
	bottom: 0,
	height: '30px',
	paddingTop: '3px',
	paddingBottom: '3px',
	width: '100%',
	backgroundColor: '#FFF',
	borderTop: '1px solid #E9EAEA',
	zIndex: '100', // 「未読の投稿」へのジャンプボタンより下
});
const _Stack_ = styled(Stack)({
	height: '100%',
	paddingRight: '10px',
});
