import { AlarmListener } from './alarm-listener';
import { BackgroundBase } from './background-base';
import { MessageListener } from './message-listener';
import { NotificationListener } from './notification-listener';

/**
 * サービスワーカー
 * 注：ここは非同期にしてはならない。
 *   service-workerは必要な時に読み込まれる。例えば、content-scriptからメッセージを送った時。
 *   送られたタイミングでservice-workerが読み込まれるが、非同期ではリスナーの準備の前に
 *   メッセージが飛ばされてしまい、間に合わない。
 *   各リスナーが非同期なのは良いが、chrome.xxxx.onXXX.addListener のメソッドは必ず同期で呼ぶこと。
 */
(function main() {
	const listeners: BackgroundBase[] = [
		//
		new MessageListener(),
		new AlarmListener(),
		new NotificationListener(),
	];
	for (const l of listeners) {
		l.setup();
	}
})();
