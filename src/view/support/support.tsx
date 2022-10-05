import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { memo, useCallback, useEffect, useState } from 'react';
import { Preferences } from '../../preferences';
import UIs from '../../ui';
import { FooterButton } from '../components/';

/**
 * Uniposのサポートダイアログを表示するボタンの代替。
 */
export const Support = memo(() => {
	const [button, setButton] = useState<HTMLButtonElement>();
	const [disabled, setDisabled] = useState(false);
	const handleClick = useCallback(() => {
		button?.click();
	}, [button]);

	useEffect(() => {
		const ms = Preferences.try_interval;
		const i = setInterval(() => {
			const iframe = UIs.find<HTMLIFrameElement>('SUPPORT');
			const button = iframe?.contentDocument?.querySelector('button');
			const parent = iframe?.parentElement;
			if (iframe && parent && button) {
				clearInterval(i);
				UIs.class(iframe, '+', 'HIDDEN'); // 既存のサポートボタンは隠す
				setButton(button); // 代替ボタンclick時に、押したことにするボタンを記憶
				// ダイアログ展開を要素の増減で検知して、ボタンをdisabledにする
				const obs = new MutationObserver(() => {
					if (parent.childElementCount === 1) setDisabled(false);
					else setDisabled(true);
				});
				obs.observe(parent, { childList: true });
				return obs.disconnect;
			}
		}, ms);
	}, []);

	return (
		<FooterButton //
			text="サポート"
			icon={<HelpOutlineIcon />}
			onClick={handleClick}
			disabled={disabled}
		/>
	);
});
Support.displayName = 'Support';
