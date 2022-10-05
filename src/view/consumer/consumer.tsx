import SignLanguageIcon from '@mui/icons-material/SignLanguage';
import { memo, useCallback, useState } from 'react';
import { FooterButton } from '../components';
import { ConsumerContextProvider } from './consumer-context';
import { ConsumerView } from './consumer-view';
import { ConsumerMode } from './type';

export const Consumer = memo(() => {
	const [open, setOpen] = useState(false);
	const [mode, setMode] = useState<ConsumerMode>('window');
	const toggleOpen = useCallback(() => setOpen(!open), [open]);
	const toggleMode = useCallback(() => setMode(mode === 'dialog' ? 'window' : 'dialog'), [mode]);

	return (
		<ConsumerContextProvider>
			<FooterButton text="一括拍手" icon={<SignLanguageIcon />} onClick={toggleOpen} />
			<ConsumerView open={open} doClose={toggleOpen} mode={mode} changeMode={toggleMode} />
		</ConsumerContextProvider>
	);
});
Consumer.displayName = 'Consumer';
