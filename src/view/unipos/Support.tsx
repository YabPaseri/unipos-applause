import { UIs } from '$common/UIs';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { FooterItem } from './components';

/**
 * Uniposのサポートダイアログを表示するボタンの代替。
 */
export const Support: FC = () => {
	const origin = useRef<HTMLButtonElement>();
	const unmountFunc = useRef<() => void>();
	const [disabled, setDisabled] = useState(false);

	useEffect(() => {
		const rootObs = new MutationObserver(() => {
			const iframe = UIs.find<HTMLIFrameElement>('#launcher');
			const parent = iframe?.parentElement;
			const button = iframe?.contentDocument?.querySelector('button');
			if (iframe && parent && button) {
				rootObs.disconnect();
				iframe.classList.add('force-hidden'); // 既存のサポートボタンを隠す
				origin.current = button;
				// 要素の増減でボタンのdisabledを切り替える
				const obs = new MutationObserver(() => {
					setDisabled(parent.childElementCount !== 1);
				});
				obs.observe(parent, { childList: true });
				unmountFunc.current = () => {
					obs.disconnect();
					iframe.classList.remove('force-hidden');
				};
			}
		});
		rootObs.observe(document.body, { childList: true, subtree: true });
		return () => {
			if (unmountFunc.current != null) unmountFunc.current();
		};
	}, []);

	const handleClick = useCallback(() => {
		origin.current?.click();
	}, []);

	return (
		<FooterItem //
			text="サポート"
			icon={<HelpOutlineIcon />}
			onClick={handleClick}
			disabled={disabled}
		/>
	);
};
