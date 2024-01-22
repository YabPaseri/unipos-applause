import { UIs } from '$common/UIs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';
import { Component, Fragment } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { Alarm } from './Alarm';
import { Footer } from './Footer';
import { GlobalStyle } from './GlobalStyle';
import { Support } from './Support';

export class View extends Component<unknown> {
	static #root: Root;
	private static get root(): Root {
		if (this.#root) return this.#root;
		const container = UIs.create('div').appendTo(document.body).done();
		return (this.#root = createRoot(container));
	}

	static #on = false;
	public static on() {
		if (this.#on) return;
		this.root.render(<View />);
		this.#on = true;
	}
	public static off() {
		if (!this.#on) return;
		this.root.unmount();
		this.#on = false;
	}

	override render() {
		return (
			<Fragment>
				<GlobalStyle />
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<Footer>
						<Alarm />
						<Support />
					</Footer>
				</LocalizationProvider>
			</Fragment>
		);
	}
}
