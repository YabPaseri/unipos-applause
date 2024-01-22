import { Box, Stack, styled } from '@mui/material';
import { ReactNode, memo } from 'react';

type TProps = {
	children?: ReactNode;
};

/**
 * 画面下部のフッター
 */
export const Footer = memo<TProps>(({ children }) => (
	<FooterBody>
		<FooterItemWrapper direction="row" justifyContent="flex-end" spacing="5px">
			{children}
		</FooterItemWrapper>
	</FooterBody>
));
Footer.displayName = 'Footer';

// 以下内部向けコンポーネント
const FooterBody = styled(Box)({
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

const FooterItemWrapper = styled(Stack)({
	height: '100%',
	paddingRight: '10px',
});
