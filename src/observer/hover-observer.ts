import { ClapPlus } from '../components';
import { ClassName } from '../styles';
import { DEBUG } from '../util';
import { ApplauseObserver } from './applause-observer';

export class HoverObserver extends ApplauseObserver {
	constructor() {
		super();
		this.enterListener = this.enter.bind(this);
		this.leaveListener = this.leave.bind(this);
	}

	protected start(): boolean {
		document.body.addEventListener('mouseenter', this.enterListener, true);
		document.body.addEventListener('mouseleave', this.leaveListener, true);
		DEBUG.log('hover observer started');
		return true;
	}
	protected stop(): void {
		document.body.removeEventListener('mouseenter', this.enterListener, true);
		document.body.removeEventListener('mouseleave', this.leaveListener, true);
		DEBUG.log('hover observer stopped');
	}

	private enterListener: (ev: MouseEvent) => void;
	private enter(ev: MouseEvent) {
		this.toggle(ev, true);
	}

	private leaveListener: (ev: MouseEvent) => void;
	private leave(ev: MouseEvent) {
		this.toggle(ev, false);
	}

	private toggle(ev: MouseEvent, force: boolean) {
		if (!(ev.target instanceof HTMLElement) || !ClapPlus.is(ev.target)) return;

		const parent = ev.target.parentElement;
		if (!parent || !parent.classList.contains(ClassName.APPLAUSE_CF)) return;

		if (force) {
			parent.classList.add(ClassName.APPLAUSE_HOVER);
		} else {
			parent.classList.remove(ClassName.APPLAUSE_HOVER);
		}
	}
}
