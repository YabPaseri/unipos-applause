import styled from '@emotion/styled';
import { mdiHandClap } from '@mdi/js';
import Icon from '@mdi/react';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';
import { memofy } from './components/memofy';
import { useOpenDialog } from './data';

export const OpenDialogButton = memofy(() => {
	const open = useOpenDialog();
	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);
	return (
		<CSSTransition in={mounted} classNames="transition" timeout={{ exit: 300 }}>
			<SButton startIcon={<Icon path={mdiHandClap} size="24px" color="white" />} onClick={open}>
				一括拍手
			</SButton>
		</CSSTransition>
	);
}, 'OpenDialogButton');

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
	boxShadow: 'none',
	backgroundColor: '#00a1e5',
	transitionDuration: '300ms',
	transitionTimingFunction: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
	transitionProperty: 'opacity, top, bottom',
	'&:hover': {
		boxShadow: 'none',
		backgroundColor: '#00a1e5',
	},
	'&.transition': {
		'&-enter': { opacity: 0 },
		'&-enter-active': { opacity: 1 },
		'&-enter-done': { opacity: 1 },
		'&-exit': { opacity: 1 },
		'&-exit-active': { opacity: 0 },
		'&-exit-done': { opacity: 0 },
	},
});
