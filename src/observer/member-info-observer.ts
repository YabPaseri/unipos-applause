import { DEBUG } from '../util';
import { UAObserver } from './ua-observer';

/**
 * PageObserverで「設定」のページを検知したときに起動するオブザーバ。\
 * 現状は何もしない。
 */
export class MemberInfoObserver extends UAObserver {
	public static runnable(): boolean {
		return (
			document.querySelector('div.memberInfo___memberInfo--memberInfo') !== null || // 新
			document.querySelector('div.memberInfo') !== null // 旧
		);
	}

	protected start(): boolean {
		// do nothing
		DEBUG.log('member info observer started');
		return true;
	}
	protected stop(): void {
		// do nothing
		DEBUG.log('member info observer stopped');
	}
}
