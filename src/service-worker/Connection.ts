import { Alarm } from './Alarm';
import { Message } from './Message';
import { Notification } from './Notification';

/**
 * サービスワーカ上に持たせた機能同士を繋ぐコネクタ  \
 * サービスの作成もここを経由して行う。
 */
export class Connection {
	public readonly alarm: Alarm;
	public readonly notification: Notification;
	public readonly message: Message;

	public static create() {
		return new Connection();
	}
	private constructor() {
		this.alarm = new Alarm(this).setup();
		this.notification = new Notification(this).setup();
		this.message = new Message(this).setup();
	}
}
