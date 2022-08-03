import { ClassName } from '../styles';
import Component from './component';

export class ClapPlus extends Component {
	public static create(disabled?: boolean): HTMLElement {
		const e = this.E.tag('button') //
			.classes(ClassName.CLAP, ClassName.APPLAUSE)
			.child(this.E.tag('span').text('+'))
			.create();
		if (disabled) this.disabled(e, true);
		return e;
	}

	public static is(e: HTMLElement): boolean {
		return e.classList.contains(ClassName.CLAP) && e.classList.contains(ClassName.APPLAUSE);
	}

	public static disabled(e: HTMLElement, force: boolean) {
		const classes = e.classList;
		if (!this.is(e)) return;
		if (force) {
			classes.add(ClassName.DISABLE);
		} else {
			classes.remove(ClassName.DISABLE);
		}
	}
}
