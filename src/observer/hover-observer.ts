import { Applause } from '../components';
import { CLS } from '../styles';
import Util, { DEBUG } from '../util';
import { UAObserver } from './ua-observer';

/**
 * 要素への enter と leave を検知するオブザーバ。\
 * 拍手+へのホバーでも、x1,x3,x5 を出すために使用する。
 */
export class HoverObserver extends UAObserver {
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

	private enterListener = this.enter.bind(this);
	private enter(ev: MouseEvent) {
		if (!(ev.target instanceof HTMLElement)) return;
		this.applauseParentHover(ev.target, true);
	}

	private leaveListener = this.leave.bind(this);
	private leave(ev: MouseEvent) {
		if (!(ev.target instanceof HTMLElement)) return;
		this.applauseParentHover(ev.target, false);
	}

	// 拍手+ にホバーをしている間は、その親の要素にホバーを表すクラスをつける。
	//  => スタイルシートで、x1,x3,x5 が拍手+のホバーでも出るようにしてある
	private applauseParentHover(ele: HTMLElement, enter: boolean) {
		if (!Applause.is(ele)) return;

		const parent = Util.ancestor(ele, (e) => e.classList.contains(CLS.APPLAUSE_PARENT));
		if (!parent) return;

		if (enter) {
			parent.classList.add(CLS.HOVER);
			DEBUG.log('detected applause enter');
		} else {
			parent.classList.remove(CLS.HOVER);
			DEBUG.log('detected applause leave');
		}
	}
}
