import styled from '@emotion/styled';
import { mdiHandClap } from '@mdi/js';
import Icon from '@mdi/react';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { memofy } from './memofy';

type TProps = {
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const OpenButton = memofy<TProps>(({ onClick }) => {
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return (
		<CSSTransition in={mounted} timeout={200} classNames="transition">
			<SButton startIcon={<Icon path={mdiHandClap} size="24px" color="white" />} onClick={onClick}>
				一括拍手
			</SButton>
		</CSSTransition>
	);
}, 'OpenButton');

const SButton = styled(Button)({
	position: 'fixed',
	bottom: '70px',
	right: '20px',
	width: '121px',
	height: '45.97px',
	borderRadius: '999rem',
	zIndex: '999998',
	color: '#ffffff',
	fontSize: '0.836rem',
	fontWeight: '700',
	transitionDuration: '300ms',
	transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
	transitionProperty: 'opacity, top, bottom',
	opacity: 0,
	boxShadow: 'none',
	backgroundColor: '#00a1e5',
	'&:hover': {
		boxShadow: 'none',
		backgroundColor: '#00a1e5',
	},
	'&.transition-enter': {
		opacity: 0,
	},
	'&.transition-enter-active': {
		opacity: 1,
	},
	'&.transition-enter-done': {
		opacity: 1,
	},
	'&.transition-exit': {
		opacity: 1,
	},
	'&.transition-exit-active': {
		opacity: 0,
	},
});
