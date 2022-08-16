import { Applause } from '../components';
import { Options } from '../options';
import { CLS } from '../styles';
import UniposAPI from '../unipos';
import Util, { DEBUG } from '../util';
import { UAObserver } from './ua-observer';

/**
 * 拍手+の click を検知するオブザーバ。\
 * クリック→入力欄表示→拍手の送信 までを行う。
 */
export class ApplauseClickObserver extends UAObserver {
	private booked: boolean;
	constructor() {
		super();
		this.booked = false;
	}

	protected start(): boolean {
		document.body.addEventListener('click', this.clickListener);
		DEBUG.log('click observer started');
		return true;
	}
	protected stop(): void {
		document.body.removeEventListener('click', this.clickListener);
		DEBUG.log('click observer stopped');
	}

	private clickListener = this.click.bind(this);
	private click(ev: MouseEvent) {
		if (this.booked) return;
		if (!(ev.target instanceof HTMLElement) || !Applause.is(ev.target)) return;
		ev.preventDefault();
		ev.stopPropagation();

		const card = Util.ancestor(ev.target, (ele) => {
			const c = ele.classList.contains.bind(ele.classList);
			return c(CLS.CARD_MODAL) || c(CLS.CARD);
		});
		if (!card) return;

		const card_id = (() => {
			if (card.id) return card.id;
			const id = card.querySelector('[id]')?.id;
			// <? class="xxx_base"/> な要素は、
			// idの末尾にも「_clap_base」がついている。
			return id ? id.replace(/_clap_base$/, '') : id;
		})();
		if (!card_id) return;

		// 非同期処理に入るので、予約済みフラグを立てておく
		this.booked = true;
		this.prepare(card_id)
			.then((count) => this.send(card_id, count))
			.then(() => (this.booked = false))
			.catch((e) => {
				this.booked = false;
				Promise.reject(e);
			});
	}

	private async prepare(card_id: string): Promise<number | undefined> {
		let life = UniposAPI.PRAISE_LIMIT;
		if (!Options.NO_CHECK) {
			const [profile, card] = await Promise.all([UniposAPI.getProfile(), UniposAPI.getCard(card_id)]);
			// 残ポイント2 以下は送れない
			const available = profile.result.member.pocket.available_point;
			if (available < 2) return;

			const uid = profile.result.member.id;
			const praise = card.result.praises.find((p) => p.member.id === uid);
			if (praise) {
				if (praise.count >= UniposAPI.PRAISE_LIMIT) return;
				life -= praise.count;
			}
			if (life < 1) return; // 保険
		}

		const input = (() => {
			let helper: string | undefined;
			// eslint-disable-next-line no-constant-condition
			while (true) {
				const message = [`拍手をいくつ送りますか?（上限：${life}）`, helper].join('\n');
				const s = prompt(message);
				if (s === null) return void 0;

				const num = Util.parseInt(Util.halve(s));
				if (Number.isNaN(num)) {
					helper = '※数値を入力してください。';
					continue;
				} else if (num < 1) {
					helper = '※1以上の数値を入力してください。';
					continue;
				} else if (num > life) {
					helper = '※上限を超えています。';
					continue;
				} else {
					return num;
				}
			}
		})();
		return input;
	}

	private async send(card_id: string, count: number | undefined): Promise<void> {
		if (!count) return;
		const divide = !Options.NO_SPLIT ? Util.divide(count, [5, 3, 1]) : new Map([[count, 1]]);
		for (const d of divide) {
			if (d[1] < 1) continue;
			for (let i = 0; i < d[1]; i++) {
				UniposAPI.praise(card_id, d[0]);
			}
		}
	}
}
